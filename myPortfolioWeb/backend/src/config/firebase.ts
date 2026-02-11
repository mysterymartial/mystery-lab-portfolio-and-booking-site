import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// This function is called lazily to ensure env vars are loaded
const initializeFirebase = () => {
  if (!admin.apps.length) {
    try {
      const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();

      if (!projectId || !privateKey || !clientEmail) {
        console.warn('⚠️ Firebase Admin credentials not fully configured. Admin features may not work.');
        console.warn(`   PROJECT_ID: ${projectId ? '✓' : '✗'}, PRIVATE_KEY: ${privateKey ? '✓' : '✗'}, CLIENT_EMAIL: ${clientEmail ? '✓' : '✗'}`);
        if (process.env.NODE_ENV === 'development') {
          console.warn('   Debug: Check that .env file exists and contains FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL');
        }
    } else {
      // Step 1: Trim whitespace
      privateKey = privateKey.trim();
      
      // Step 2: Remove surrounding quotes if present (dotenv may include them)
      // Handle both single and double quotes
      if (privateKey.length >= 2) {
        const firstChar = privateKey[0];
        const lastChar = privateKey[privateKey.length - 1];
        if ((firstChar === '"' && lastChar === '"') || (firstChar === "'" && lastChar === "'")) {
          privateKey = privateKey.slice(1, -1);
        }
      }
      
      // Step 3: Replace escaped newlines with actual newlines
      // This is CRITICAL: Firebase Admin SDK requires actual \n characters, not the string "\n"
      // Handle both \\n (double escaped) and \n (single escaped from .env)
      privateKey = privateKey.replace(/\\n/g, '\n');

      // Step 4: Verify the private key format (should start with -----BEGIN)
      if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
        throw new Error('Invalid private key format: missing BEGIN marker');
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          privateKey: privateKey,
          clientEmail: clientEmail,
        }),
      });
      console.log('✅ Firebase Admin initialized successfully');
      }
    } catch (error: any) {
      console.error('❌ Firebase Admin initialization error:', error.message || error);
      if (error.code) {
        console.error(`   Error code: ${error.code}`);
      }
      // Don't throw - allow server to start even if Firebase fails (for development)
    }
  }
};

// Call initialization immediately (but env should be loaded by now)
initializeFirebase();

export const verifyFirebaseToken = async (token: string): Promise<admin.auth.DecodedIdToken | null> => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Firebase token verification error:', error);
    return null;
  }
};

export default admin;
