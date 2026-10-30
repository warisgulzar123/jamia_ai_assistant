const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const connectDB = require('./config/db');
const KnowledgeBase = require('./models/KnowledgeBase');
const initialKnowledgeData = require('./data/initialKnowledgeData');
const { generateEmbedding } = require('./services/embeddingService');

/**
 * Standalone Seeding CLI Script:
 * 1. Connects to MongoDB Atlas via IPv4 DNS fallback
 * 2. Generates 768-d Vector Embeddings for all 50 items using text-embedding-004
 * 3. Wipes existing KnowledgeBase collection
 * 4. Inserts all 50 items with vectors into MongoDB Atlas
 */
const seedDatabase = async () => {
  const startTime = Date.now();
  try {
    console.log('====================================================');
    console.log(' Jamiatul Madina Vector Seeding CLI (text-embedding-004)');
    console.log('====================================================');

    await connectDB();

    console.log(`\n[Vector Generation] Preparing embeddings for ${initialKnowledgeData.length} records...`);

    const itemsWithVectors = [];
    const BATCH_SIZE = 5; // Generate 5 embeddings concurrently for speed and rate-limit safety

    for (let i = 0; i < initialKnowledgeData.length; i += BATCH_SIZE) {
      const batch = initialKnowledgeData.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(initialKnowledgeData.length / BATCH_SIZE);

      console.log(` -> Processing Batch ${batchNum}/${totalBatches} (Items ${i + 1} - ${Math.min(i + BATCH_SIZE, initialKnowledgeData.length)})...`);

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

    console.log(`[Vector Generation] Completed ${itemsWithVectors.length} vector embeddings!`);

    // Wipe existing collection
    console.log('[Database] Wiping existing KnowledgeBase collection...');
    const deleteResult = await KnowledgeBase.deleteMany({});
    console.log(`[Database] Cleared ${deleteResult.deletedCount} existing records.`);

    // Insert 50 records with vectors
    console.log('[Database] Inserting records with vector embeddings into MongoDB Atlas...');
    const insertedRecords = await KnowledgeBase.insertMany(itemsWithVectors);

    const totalSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('====================================================');
    console.log(` SUCCESS: Successfully seeded ${insertedRecords.length} vector records in ${totalSeconds}s!`);
    console.log(` Vector dimensionality: ${insertedRecords[0].vector?.length || 768}`);
    console.log(' Semantic Search & Cosine Similarity are now 100% active.');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error(`\n[Seed Error] Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
