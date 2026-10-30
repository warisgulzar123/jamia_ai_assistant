const mongoose = require('mongoose');
const KnowledgeBase = require('../models/KnowledgeBase');
const initialKnowledgeData = require('../data/initialKnowledgeData');
const { generateEmbedding } = require('../services/embeddingService');
const { invalidateKnowledgeCache } = require('./aiController');

/**
 * Helper to normalize keywords array
 */
const normalizeKeywords = (keywords) => {
  if (Array.isArray(keywords)) {
    return keywords.map((k) => String(k).trim()).filter(Boolean);
  }
  if (typeof keywords === 'string') {
    return keywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
  }
  return [];
};

/**
 * GET /api/admin/data
 * Retrieve all knowledge records with optional search and category filters
 */
const getAllKnowledge = async (req, res) => {
  try {
    const { category, search, page, limit } = req.query;
    const filter = {};

    if (category) {
      filter.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { question: searchRegex },
        { answer: searchRegex },
        { category: searchRegex },
        { keywords: { $in: [searchRegex] } },
      ];
    }

    let query = KnowledgeBase.find(filter).sort({ createdAt: -1 });

    if (page && limit) {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const skip = (pageNum - 1) * limitNum;
      query = query.skip(skip).limit(limitNum);
    }

    const [data, totalCount] = await Promise.all([
      query.exec(),
      KnowledgeBase.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: data.length,
      totalCount,
      data,
    });
  } catch (error) {
    console.error(`[Admin Controller Error] getAllKnowledge: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch knowledge base records',
      details: error.message,
    });
  }
};

/**
 * POST /api/admin/data
 * Create a new KnowledgeBase entry with real-time vector embedding
 */
const addKnowledge = async (req, res) => {
  try {
    const { category, question, answer, keywords } = req.body;

    // Validation
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, error: 'Category is required.' });
    }
    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, error: 'Question is required.' });
    }
    if (!answer || !answer.trim()) {
      return res.status(400).json({ success: false, error: 'Answer is required.' });
    }

    const processedKeywords = normalizeKeywords(keywords);
    if (processedKeywords.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one valid keyword is required (as an array or comma-separated string).',
      });
    }

    // Generate 768-d vector embedding
    let vector = [];
    try {
      const textToEmbed = `${question.trim()} ${answer.trim()} ${processedKeywords.join(' ')}`;
      vector = await generateEmbedding(textToEmbed);
    } catch (embedError) {
      console.warn(`[Admin] Embedding generation warning: ${embedError.message}`);
    }

    const newRecord = await KnowledgeBase.create({
      category: category.trim(),
      question: question.trim(),
      answer: answer.trim(),
      keywords: processedKeywords,
      vector,
    });

    invalidateKnowledgeCache();

    return res.status(201).json({
      success: true,
      message: 'Knowledge record created successfully with vector embeddings.',
      data: newRecord,
    });
  } catch (error) {
    console.error(`[Admin Controller Error] addKnowledge: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to create knowledge record',
      details: error.message,
    });
  }
};

/**
 * PUT /api/admin/data/:id
 * Update an existing KnowledgeBase entry by ID (and recalculate vector if content changed)
 */
const updateKnowledge = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Knowledge record ID format.',
      });
    }

    const existingRecord = await KnowledgeBase.findById(id);
    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        error: `Knowledge record with ID ${id} not found.`,
      });
    }

    const { category, question, answer, keywords } = req.body;
    const updateData = {};

    if (category !== undefined) updateData.category = category.trim();
    if (question !== undefined) updateData.question = question.trim();
    if (answer !== undefined) updateData.answer = answer.trim();
    if (keywords !== undefined) {
      const processedKeywords = normalizeKeywords(keywords);
      if (processedKeywords.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Keywords array cannot be empty.',
        });
      }
      updateData.keywords = processedKeywords;
    }

    // If text fields changed, regenerate vector embedding
    if (updateData.question || updateData.answer || updateData.keywords) {
      try {
        const q = updateData.question || existingRecord.question;
        const a = updateData.answer || existingRecord.answer;
        const kw = updateData.keywords || existingRecord.keywords;
        updateData.vector = await generateEmbedding(`${q} ${a} ${kw.join(' ')}`);
      } catch (embedError) {
        console.warn(`[Admin] Vector re-generation warning: ${embedError.message}`);
      }
    }

    const updatedRecord = await KnowledgeBase.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    invalidateKnowledgeCache();

    return res.status(200).json({
      success: true,
      message: 'Knowledge record updated successfully.',
      data: updatedRecord,
    });
  } catch (error) {
    console.error(`[Admin Controller Error] updateKnowledge: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to update knowledge record',
      details: error.message,
    });
  }
};

/**
 * DELETE /api/admin/data/:id
 * Delete an existing KnowledgeBase entry by ID
 */
const deleteKnowledge = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Knowledge record ID format.',
      });
    }

    const deletedRecord = await KnowledgeBase.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({
        success: false,
        error: `Knowledge record with ID ${id} not found.`,
      });
    }

    invalidateKnowledgeCache();

    return res.status(200).json({
      success: true,
      message: 'Knowledge record deleted successfully.',
      deletedId: id,
    });
  } catch (error) {
    console.error(`[Admin Controller Error] deleteKnowledge: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete knowledge record',
      details: error.message,
    });
  }
};

/**
 * POST /api/admin/seed
 * Wipes existing collection data, generates 768-d vector embeddings, and seeds all 50 full records into MongoDB Atlas
 */
const seedData = async (req, res) => {
  try {
    console.log('[Admin Seed] Starting vector generation for 50 records...');

    const itemsWithVectors = [];
    const BATCH_SIZE = 5;

    for (let i = 0; i < initialKnowledgeData.length; i += BATCH_SIZE) {
      const batch = initialKnowledgeData.slice(i, i + BATCH_SIZE);
      const batchWithVectors = await Promise.all(
        batch.map(async (item) => {
          const combinedString = `${item.question} ${item.answer} ${item.keywords.join(' ')}`;
          const vector = await generateEmbedding(combinedString);
          return {
            ...item,
            vector,
          };
        })
      );
      itemsWithVectors.push(...batchWithVectors);
    }

    const deleteResult = await KnowledgeBase.deleteMany({});
    console.log(`[Admin Seed] Cleared ${deleteResult.deletedCount} existing records.`);

    const seededRecords = await KnowledgeBase.insertMany(itemsWithVectors);

    invalidateKnowledgeCache();

    return res.status(201).json({
      success: true,
      message: 'Knowledge base wiped and seeded successfully with 50 vector-embedded Jamiatul Madina records.',
      clearedCount: deleteResult.deletedCount,
      count: seededRecords.length,
      sampleVectorLength: seededRecords[0].vector?.length || 768,
      data: seededRecords,
    });
  } catch (error) {
    console.error(`[Admin Controller Error] seedData: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to seed knowledge base data with vector embeddings',
      details: error.message,
    });
  }
};

module.exports = {
  getAllKnowledge,
  addKnowledge,
  updateKnowledge,
  deleteKnowledge,
  seedData,
};
