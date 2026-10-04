const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    if (!uri) {
      console.log('No MONGODB_URI provided. Starting in-memory MongoDB server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      console.log(`In-memory MongoDB running at: ${uri}`);
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed initial data if needed
    try {
      const seedData = require('../../seed');
      await seedData();
    } catch (seedErr) {
      console.warn('Auto-seed notice:', seedErr.message);
    }
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    // If external URI failed, try fallback
    try {
      console.log('Attempting fallback to in-memory MongoDB...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected (fallback in-memory): ${conn.connection.host}`);
      const seedData = require('../../seed');
      await seedData();
    } catch (fallbackErr) {
      console.error(`Fallback failed: ${fallbackErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
