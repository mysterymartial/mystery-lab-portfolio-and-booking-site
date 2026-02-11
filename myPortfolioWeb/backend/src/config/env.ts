// This file MUST be imported first to load environment variables
// before any other modules try to access process.env
import dotenv from 'dotenv';
import path from 'path';

// Load .env file - try multiple locations
// 1. Try explicit path relative to this file (for compiled code)
const envPath1 = path.resolve(__dirname, '../../.env');
// 2. Try current working directory (for ts-node)
const envPath2 = path.resolve(process.cwd(), '.env');

let result = dotenv.config({ path: envPath1 });

if (result.error) {
  // Fallback to current working directory
  result = dotenv.config({ path: envPath2 });
}

if (result.error) {
  // Last resort: use default behavior (searches from process.cwd() up)
  result = dotenv.config();
}

// Debug output in development
if (process.env.NODE_ENV === 'development') {
  const hasFirebase = !!(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL);
  if (hasFirebase) {
    console.log('📋 Environment variables loaded (Firebase credentials found)');
  } else {
    console.warn('⚠️ Environment variables loaded but Firebase credentials are missing');
    console.warn(`   Checked paths: ${envPath1}, ${envPath2}`);
  }
}
