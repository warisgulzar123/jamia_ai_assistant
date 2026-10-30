const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true,
    },
    keywords: {
      type: [String],
      required: [true, 'At least one keyword is required'],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0;
        },
        message: 'Keywords array cannot be empty',
      },
      index: true,
    },
    vector: {
      type: [Number],
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Compound text index to support full-text search fallback directly at database level
knowledgeBaseSchema.index(
  {
    question: 'text',
    answer: 'text',
    keywords: 'text',
    category: 'text',
  },
  {
    weights: {
      question: 10,
      keywords: 8,
      category: 5,
      answer: 2,
    },
    name: 'KnowledgeBaseTextIndex',
  }
);

const KnowledgeBase = mongoose.model('KnowledgeBase', knowledgeBaseSchema);

module.exports = KnowledgeBase;
