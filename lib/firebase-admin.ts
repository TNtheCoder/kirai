import * as admin from 'firebase-admin';

// Parse the Firebase service account JSON from environment variables
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}');

// Make sure the service account details are valid
if (!serviceAccount.private_key || !serviceAccount.client_email || !serviceAccount.project_id) {
  throw new Error('Invalid Firebase service account details in environment variables');
}

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
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
