"use server";

import * as admin from 'firebase-admin';

// Import the service account key
import serviceAccount from '@/lib/firebase-service-account.json';

// Get the project ID from environment variables
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (!projectId) {
  throw new Error('Project ID is not set in environment variables');
}

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    projectId,
  });
}

// Function to verify a Firebase ID token
export const verifyToken = async (clerkToken: string): Promise<string> => {
  try {
    // Decode the Clerk token (optional: verify it with Clerk if needed)
    const decodedClerkToken = JSON.parse(
      Buffer.from(clerkToken.split('.')[1], 'base64').toString()
    );
    const uid = decodedClerkToken.sub; // Clerk user ID (sub claim)

    if (!uid) throw new Error('Invalid Clerk token: missing "sub" claim.');

    // Generate a Firebase custom token using the UID
    const firebaseCustomToken = await admin.auth().createCustomToken(uid);

    console.log('Firebase custom token generated:', firebaseCustomToken);
    return firebaseCustomToken;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error generating Firebase custom token:', error.message);
    }
    throw new Error('Token generation failed');
  }
};


