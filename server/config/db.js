const mongoose = require('mongoose');
const dns = require('dns');

// Force DNS IPv4 resolution to prevent IPv6 timeout issues
dns.setDefaultResultOrder('ipv4first');

// Use reliable public DNS servers (Google & Cloudflare) to prevent queryTxt ETIMEOUT on ISP DNS
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('[Database DNS Warning] Could not set custom DNS servers:', dnsErr.message);
}

/**
 * Connect to MongoDB instance using Mongoose.
 * Reads connection string from process.env.MONGODB_URI.
 * Caches active connection across serverless invocations (Vercel).
 */
const connectDB = async () => {
  // Reuse existing connection if ready (serverless optimization)
  if (mongoose.connection && mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }

    // Auto-fix malformed URI if missing mongodb protocol prefix
    if (mongoUri.startsWith('+srv://')) {
      mongoUri = 'mongodb' + mongoUri;
    }

    const conn = await mongoose.connect(mongoUri, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4
    });

    console.log('MongoDB Connected Successfully!');
    console.log(`[Database] Host: ${conn.connection.host}`);
    console.log(`[Database] Active Database: ${conn.connection.name}`);

    // Connection event listeners for stability
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB Connection Error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database Warning] MongoDB disconnected. Attempting reconnection...');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('[Database] MongoDB connection closed due to application termination.');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
module.exports.default = connectDB;
