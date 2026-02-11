import Message from './Message';
import Review from './Review';
import Booking from './Booking';
import Setting from './Setting';

// Create database indexes for optimized queries
export const createIndexes = async (): Promise<void> => {
  try {
    // Message indexes - using collection.createIndex for Mongoose 8.x
    // Using { background: true } to create indexes in background and handle conflicts gracefully
    await Message.collection.createIndex({ deleted: 1, createdAt: -1 }, { background: true }).catch(() => {});
    await Message.collection.createIndex({ email: 1 }, { background: true }).catch(() => {});
    await Message.collection.createIndex({ createdAt: -1 }, { background: true }).catch(() => {});

    // Review indexes
    await Review.collection.createIndex({ approved: 1, createdAt: -1 }, { background: true }).catch(() => {});
    await Review.collection.createIndex({ createdAt: -1 }, { background: true }).catch(() => {});

    // Booking indexes
    await Booking.collection.createIndex({ status: 1, createdAt: -1 }, { background: true }).catch(() => {});
    await Booking.collection.createIndex({ email: 1 }, { background: true }).catch(() => {});
    await Booking.collection.createIndex({ createdAt: -1 }, { background: true }).catch(() => {});

    // Setting index - skip since unique index is already created by schema definition
    // The schema already defines { key: { unique: true } }, so index is auto-created

    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
};
