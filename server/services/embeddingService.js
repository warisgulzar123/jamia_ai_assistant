const { GoogleGenAI } = require('@google/genai');

/**
 * Cached active models to prevent retry latency on subsequent requests
 */
let activeEmbeddingModel = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';
let activeGenerationModel = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

/**
 * Singleton GoogleGenAI client instance
 */
let aiClientInstance = null;

const getGenAIClient = () => {
  if (!aiClientInstance) {
    const apiKey = process.env.GEMINI_OPEN_API || process.env.gemini_open_api;
    if (!apiKey) {
      throw new Error('GEMINI_OPEN_API is not configured in environment variables.');
    }
    aiClientInstance = new GoogleGenAI({ apiKey });
  }
  return aiClientInstance;
};

/**
 * Generate 768-dimensional vector embedding
 * Fast direct execution using cached working model
 */
const generateEmbedding = async (text) => {
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new Error('Valid text string is required for embedding generation.');
  }

  const ai = getGenAIClient();
  const trimmed = text.trim();

  // 1. Try active model directly
  try {
    const res = await ai.models.embedContent({
      model: activeEmbeddingModel,
      contents: trimmed,
      config: {
        outputDimensionality: 768,
      },
    });

    if (res.embeddings && res.embeddings[0] && Array.isArray(res.embeddings[0].values)) {
      return res.embeddings[0].values;
    }
    if (res.embedding && Array.isArray(res.embedding.values)) {
      return res.embedding.values;
    }
  } catch (err) {
    console.warn(`[Embedding] Primary model ${activeEmbeddingModel} failed (${err.message.slice(0, 70)}). Switching model...`);
  }

  // 2. Fallback to alternative embedding models if primary model is unavailable
  const fallbackModels = ['gemini-embedding-001', 'text-embedding-004', 'gemini-embedding-2'];

  for (const model of fallbackModels) {
    if (model === activeEmbeddingModel) continue;
    try {
      const res = await ai.models.embedContent({
        model,
        contents: trimmed,
        config: {
          outputDimensionality: 768,
        },
      });

      if (res.embeddings && res.embeddings[0] && Array.isArray(res.embeddings[0].values)) {
        activeEmbeddingModel = model; // Cache working model for future calls!
        return res.embeddings[0].values;
      }
      if (res.embedding && Array.isArray(res.embedding.values)) {
        activeEmbeddingModel = model;
        return res.embedding.values;
      }
    } catch (e) {
      continue;
    }
  }

  throw new Error('Failed to generate embedding with all candidate models.');
};

/**
 * Optimized Cosine Similarity using Float32Array dot product
 * @param {Float32Array} queryVec
 * @param {Float32Array} docVec
 * @param {number} queryNorm Pre-calculated query vector norm
 * @param {number} docNorm Pre-calculated document vector norm
 */
const fastCosineSimilarity = (queryVec, docVec, queryNorm, docNorm) => {
  if (!queryVec || !docVec || queryNorm === 0 || docNorm === 0) return 0;
  
  const len = Math.min(queryVec.length, docVec.length);
  let dotProduct = 0;

  for (let i = 0; i < len; i++) {
    dotProduct += queryVec[i] * docVec[i];
  }

  return dotProduct / (queryNorm * docNorm);
};

/**
 * Helper to safely extract response text from GoogleGenAI SDK response
 */
const extractResponseText = (response) => {
  if (!response) return '';
  if (typeof response.text === 'string') return response.text.trim();
  if (typeof response.text === 'function') return response.text().trim();
  if (response.candidates && response.candidates[0]?.content?.parts?.[0]?.text) {
    return response.candidates[0].content.parts[0].text.trim();
  }
  return '';
};

/**
 * Streamlined Gemini Flash generation with configurable maxOutputTokens & temperature
 */
const generateGroundedResponse = async ({
  contents,
  systemInstruction,
  maxOutputTokens = 800,
  temperature = 0.2,
}) => {
  const ai = getGenAIClient();

  const generationConfig = {
    temperature,
    maxOutputTokens,
    systemInstruction,
  };

  // 1. Try active model directly without delay
  try {
    const response = await ai.models.generateContent({
      model: activeGenerationModel,
      contents,
      config: generationConfig,
    });

    const polishedText = extractResponseText(response);
    if (polishedText) {
      return {
        text: polishedText,
        modelUsed: activeGenerationModel,
      };
    }
  } catch (err) {
    console.warn(`[LLM Generation] Model ${activeGenerationModel} failed (${err.message.slice(0, 70)}). Falling back...`);
  }

  // 2. Direct fallback to responsive flash models if initial model gave 404/503/429
  const candidateModels = [
    'gemini-3.1-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.5-flash',
    'gemini-3.8-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
  ];

  for (const model of candidateModels) {
    if (model === activeGenerationModel) continue;
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: generationConfig,
      });

      const polishedText = extractResponseText(response);
      if (polishedText) {
        activeGenerationModel = model; // Cache for subsequent zero-delay calls
        return {
          text: polishedText,
          modelUsed: model,
        };
      }
    } catch (e) {
      continue;
    }
  }

  throw new Error('All candidate Gemini Flash models failed to generate response.');
};

module.exports = {
  generateEmbedding,
  fastCosineSimilarity,
  generateGroundedResponse,
};
