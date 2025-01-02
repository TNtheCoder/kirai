"use cleint"

import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { signInWithCustomToken } from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase';


const ClerkFirebaseProvider = () => {
  const { isLoaded, userId, getToken } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isLoaded || !userId || isAuthenticated) return;

    const authenticateWithFirebase = async () => {
      try {
        const clerkToken = await getToken({ template: 'firebase' }); // Get Clerk token
        if (!clerkToken) throw new Error('No token from Clerk.');
    
        console.log('Clerk token acquired:', clerkToken);
    
        // Send the Clerk token to the backend for Firebase token generation
        const response = await fetch('/api/verifyToken', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: clerkToken }),
        });
    
        if (!response.ok) throw new Error('Failed to verify Clerk token.');
    
        const { firebaseCustomToken } = await response.json();
        console.log('Firebase custom token acquired:', firebaseCustomToken);
    
        // Sign in to Firebase using the custom token
        await signInWithCustomToken(firebaseAuth, firebaseCustomToken);
        console.log('Signed into Firebase successfully');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error authenticating with Firebase:', error);
      }
    };
    
    

    authenticateWithFirebase();

    // Set up a periodic token refresh
    const refreshInterval = setInterval(() => {
      authenticateWithFirebase();
    }, 50 * 60 * 1000); // 50 minutes

    // Cleanup on component unmount
    return () => clearInterval(refreshInterval);
  }, [isLoaded, userId, isAuthenticated, getToken]);

  return null;
};

export default ClerkFirebaseProvider;
