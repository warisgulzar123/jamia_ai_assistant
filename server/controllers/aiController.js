const KnowledgeBase = require('../models/KnowledgeBase');
const {
  generateEmbedding,
  fastCosineSimilarity,
  generateGroundedResponse,
} = require('../services/embeddingService');

// In-memory cache for lean documents with precomputed Float32Array vectors & norms
let cachedKnowledgeRecords = null;
let lastCacheUpdate = 0;
const CACHE_LIFETIME_MS = 10 * 60 * 1000; // 10 minutes TTL

// In-memory LRU query cache for ultra-fast instant repeated searches
const queryResponseCache = new Map();
const QUERY_CACHE_MAX = 300;
const QUERY_CACHE_TTL = 10 * 60 * 1000; // 10 minutes TTL

/**
 * Invalidate in-memory knowledge cache when admin adds/edits/seeds records
 */
const invalidateKnowledgeCache = () => {
  cachedKnowledgeRecords = null;
  lastCacheUpdate = 0;
  queryResponseCache.clear();
};

/**
 * Fetch lean knowledge base records and pre-convert vectors to Float32Array
 * Uses .select('question answer vector category').lean()
 */
const getLeanKnowledgeRecords = async () => {
  const now = Date.now();
  if (cachedKnowledgeRecords && now - lastCacheUpdate < CACHE_LIFETIME_MS) {
    return cachedKnowledgeRecords;
  }

  // 3. Lean DB Fetching: Only fetch essential fields
  const leanDocs = await KnowledgeBase.find({})
    .select('question answer vector category')
    .lean();

  if (!leanDocs || leanDocs.length === 0) {
    cachedKnowledgeRecords = [];
    return cachedKnowledgeRecords;
  }

  // 1. Optimize Vector Math: Pre-convert to Float32Array and precompute Euclidean norms
  cachedKnowledgeRecords = leanDocs.map((doc) => {
    let vectorF32 = null;
    let docNorm = 0;

    if (doc.vector && Array.isArray(doc.vector) && doc.vector.length > 0) {
      vectorF32 = new Float32Array(doc.vector);
      let normSq = 0;
      for (let i = 0; i < vectorF32.length; i++) {
        normSq += vectorF32[i] * vectorF32[i];
      }
      docNorm = Math.sqrt(normSq);
    }

    return {
      _id: doc._id,
      category: doc.category,
      question: doc.question,
      answer: doc.answer,
      vectorF32,
      docNorm,
    };
  });

  lastCacheUpdate = now;
  return cachedKnowledgeRecords;
};

/**
 * Fallback summary generator: extracts first 1-2 key sentences with a bullet point
 */
const createConciseSummary = (text) => {
  if (!text) return '';
  const sentences = text
    .split(/(?<=[.?!۔\n])/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length > 0) {
    const keySentences = sentences.slice(0, 2).join(' ');
    return keySentences.startsWith('•') || keySentences.startsWith('-')
      ? keySentences
      : `• ${keySentences}`;
  }

  return `• ${text.slice(0, 180)}...`;
};

/**
 * Robustly parse JSON from Gemini output, ensuring distinct detailed and summary fields
 */
const parseGroundedOutput = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    return {
      detailed: '',
      summary: '',
    };
  }

  let text = rawText.trim();
  // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }

  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object') {
      const detailed = (parsed.detailed || parsed.answer || text).trim();
      let summary = (parsed.summary || parsed.khulasa || '').trim();

      // Ensure summary is distinct and valid
      if (!summary || summary === detailed) {
        summary = createConciseSummary(detailed);
      }

      return { detailed, summary };
    }
  } catch (err) {
    // Attempt regex extraction if JSON is wrapped with conversational text
    const match = text.match(/\{[\s\S]*"detailed"[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        if (parsed.detailed) {
          const detailed = parsed.detailed.trim();
          let summary = (parsed.summary || '').trim();
          if (!summary || summary === detailed) {
            summary = createConciseSummary(detailed);
          }
          return { detailed, summary };
        }
      } catch (e) {
        // Fallback below
      }
    }
  }

  // Non-JSON fallback: Use raw text as detailed, extract concise summary
  const detailed = text;
  const summary = createConciseSummary(detailed);
  return { detailed, summary };
};

/**
 * Ultra-Fast Vector Semantic Search Controller
 * Total processing latency: Sub-2 seconds
 */
const searchJamiatAI = async (req, res) => {
  const requestStartTime = Date.now();
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({
        found: false,
        message: 'Invalid request: "query" string is required in the request body.',
      });
    }

    const trimmedQuery = query.trim();
    const queryCacheKey = trimmedQuery.toLowerCase();

    // 0. Ultra-Fast Query Cache Hit (< 2ms instantaneous response)
    if (queryResponseCache.has(queryCacheKey)) {
      const cached = queryResponseCache.get(queryCacheKey);
      if (Date.now() - cached.timestamp < QUERY_CACHE_TTL) {
        const instantElapsed = Date.now() - requestStartTime;
        return res.status(200).json({
          ...cached.data,
          cached: true,
          executionTimeMs: instantElapsed,
        });
      } else {
        queryResponseCache.delete(queryCacheKey);
      }
    }

    // Concurrent Execution: Run Query Embedding and Lean DB fetch in parallel!
    const [queryVectorRaw, allRecords] = await Promise.all([
      generateEmbedding(trimmedQuery),
      getLeanKnowledgeRecords(),
    ]);

    if (!allRecords || allRecords.length === 0) {
      const emptyMsg = 'یہ معلومات فی الحال جامعۃ المدینہ کے آفیشل ریکارڈ میں موجود نہیں ہیں۔';
      return res.status(200).json({
        found: false,
        message: emptyMsg,
        detailed: emptyMsg,
        summary: emptyMsg,
        answer: emptyMsg,
      });
    }

    // 1. Fast Vector Math using Float32Array
    const queryVec = new Float32Array(queryVectorRaw);
    let queryNormSq = 0;
    for (let i = 0; i < queryVec.length; i++) {
      queryNormSq += queryVec[i] * queryVec[i];
    }
    const queryNorm = Math.sqrt(queryNormSq);

    // Compute Cosine Similarity with all documents
    const scoredDocs = [];

    for (let i = 0; i < allRecords.length; i++) {
      const doc = allRecords[i];
      let similarity = 0;

      if (doc.vectorF32 && doc.docNorm > 0) {
        similarity = fastCosineSimilarity(queryVec, doc.vectorF32, queryNorm, doc.docNorm);
      }

      scoredDocs.push({
        doc,
        similarity,
      });
    }

    // Sort and immediately slice only the top 3 matches
    scoredDocs.sort((a, b) => b.similarity - a.similarity);
    const top3Matches = scoredDocs.slice(0, 3);

    const highestSimilarity = top3Matches.length > 0 ? top3Matches[0].similarity : 0;
    const SIMILARITY_THRESHOLD = 0.50; // Safe semantic threshold

    // Guardrail Check: If highest similarity < 0.50, return official message without calling LLM
    if (highestSimilarity < SIMILARITY_THRESHOLD) {
      const elapsedMs = Date.now() - requestStartTime;
      const guardrailMsg = 'یہ معلومات فی الحال جامعۃ المدینہ کے آفیشل ریکارڈ میں موجود نہیں ہیں۔';
      const guardrailPayload = {
        found: false,
        message: guardrailMsg,
        detailed: guardrailMsg,
        summary: guardrailMsg,
        answer: guardrailMsg,
        similarityScore: parseFloat(highestSimilarity.toFixed(4)),
        guardrailTriggered: true,
        executionTimeMs: elapsedMs,
      };

      // Cache guardrail negative response for 10 minutes
      if (queryResponseCache.size >= QUERY_CACHE_MAX) {
        const oldest = queryResponseCache.keys().next().value;
        queryResponseCache.delete(oldest);
      }
      queryResponseCache.set(queryCacheKey, { timestamp: Date.now(), data: guardrailPayload });

      return res.status(200).json(guardrailPayload);
    }

    // Prepare Grounded Context from top 3 matches
    const contextText = top3Matches
      .map(
        (item, index) =>
          `[Record #${index + 1}] Category: ${item.doc.category}\nQuestion: ${item.doc.question}\nOfficial Answer: ${item.doc.answer}\n`
      )
      .join('\n---\n\n');

    // Strict System Prompt for Gemini Flash requesting JSON format with detailed and summary keys
    const systemPrompt = `You are the Official Jamiatul Madina AI Assistant (جامعۃ المدینہ - دعوتِ اسلامی).
Answer strictly based on the Context records below.
Do NOT fabricate or extrapolate information.
Language rule: Match the exact script of the user query:
- Pure Urdu (اردو) -> Reply in polite Pure Urdu.
- Roman Urdu -> Reply in polite Roman Urdu.
- English -> Reply in concise, polite English.

You MUST respond strictly in valid JSON format with two distinct keys:
{
  "detailed": "A complete, fully detailed and comprehensive context-grounded response answering the question thoroughly.",
  "summary": "A short 1-to-2 sentence concise or bulleted executive summary (خلاصہ) capturing the core answer in the user's language."
}`;

    const userPromptContent = `Context Records:\n${contextText}\n\nUser Question:\n"${trimmedQuery}"\n\nProvide the response strictly in JSON format with "detailed" and "summary" keys:`;

    // 2. Streamlined Gemini SDK Call (maxOutputTokens: 800, temperature: 0.2)
    const { text: rawLLMOutput, modelUsed } = await generateGroundedResponse({
      contents: userPromptContent,
      systemInstruction: systemPrompt,
      maxOutputTokens: 800,
    });

    // Parse distinct detailed and summary fields
    const parsedResponse = parseGroundedOutput(rawLLMOutput);

    const totalElapsedMs = Date.now() - requestStartTime;
    console.log(`[Fast AI Search] Processed in ${totalElapsedMs}ms (Top Score: ${highestSimilarity.toFixed(4)}, Model: ${modelUsed})`);

    const matchedCategories = [...new Set(top3Matches.map((item) => item.doc.category))];

    const resultPayload = {
      found: true,
      detailed: parsedResponse.detailed,
      summary: parsedResponse.summary,
      answer: parsedResponse.detailed, // Backward compatibility
      matchedCategories,
      sourceCount: top3Matches.length,
      similarityScore: parseFloat(highestSimilarity.toFixed(4)),
      executionTimeMs: totalElapsedMs,
    };

    // Store in query response cache
    if (queryResponseCache.size >= QUERY_CACHE_MAX) {
      const oldest = queryResponseCache.keys().next().value;
      queryResponseCache.delete(oldest);
    }
    queryResponseCache.set(queryCacheKey, { timestamp: Date.now(), data: resultPayload });

    return res.status(200).json(resultPayload);
  } catch (error) {
    console.error(`[AI Controller Error] searchJamiatAI: ${error.message}`);
    return res.status(500).json({
      error: 'An error occurred while processing the request with AI Assistant.',
      details: error.message,
    });
  }
};

module.exports = {
  searchJamiatAI,
  invalidateKnowledgeCache,
};
