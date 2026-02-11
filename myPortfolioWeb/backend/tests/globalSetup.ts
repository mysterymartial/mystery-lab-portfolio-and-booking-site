import { MongoMemoryServer } from 'mongodb-memory-server';

// Set environment variable to disable MongoDB binary download progress logs
process.env.MONGOMS_DISABLE_POSTINSTALL = 'true';

module.exports = async () => {
  console.log('🚀 Starting MongoDB Memory Server (this may take a few minutes on first run)...');
  
  try {
    // Create MongoDB Memory Server instance once for all tests
    const mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'jest-test-db',
      },
      binary: {
        version: '7.0.24',
      },
    });
    
    const mongoUri = mongoServer.getUri();
    
    // Store instance and URI globally so tests can access them
    (global as any).__MONGOINSTANCE__ = mongoServer;
    process.env.MONGO_URI = mongoUri;
    
    console.log('✅ MongoDB Memory Server started successfully');
    console.log(`📡 MongoDB URI: ${mongoUri}`);
  } catch (error: any) {
    console.error('❌ Failed to start MongoDB Memory Server:', error?.message || error);
    throw error;
  }
};
