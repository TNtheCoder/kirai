'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const [isScanning, setIsScanning] = useState(false); // Track scanning status
  const router = useRouter();

  useEffect(() => {
    // Initialize the scanner only if we are starting the scan (isScanning is true)
    if (isScanning) {
      let scanner: Html5QrcodeScanner | null = null;

      // Create the QR scanner instance
      scanner = new Html5QrcodeScanner(
        'reader', // ID of the element where the scanner will be rendered
        {
          fps: 10, // Frames per second for QR code scanning
          qrbox: { width: 250, height: 250 }, // Size of QR code scanning box
        },
        false // Disabling verbose logging
      );

      // Success callback: when a QR code is successfully detected
      const handleSuccess = async (decodedText: string) => {
        console.log('QR Code detected:', decodedText);
        
        // Ensure we're only getting the tree ID and not a full URL
        let treeId = decodedText.trim();
        
        // Check if treeId is a full URL, and extract the actual treeId if needed
        const regex = /register\/([^\/]+)/;
        const match = treeId.match(regex);
        if (match) {
          treeId = match[1]; // Extract only the tree ID from the full URL
        }

        // Check if tree exists in the database
        const treeRef = ref(db, `trees/${treeId}`);
        try {
          const snapshot = await get(treeRef);

          if (snapshot.exists()) {
            // If tree exists, redirect to the update page
            console.log('Tree found in database, redirecting to update page...');
            router.push(`/update/${treeId}`); // Use the correct relative path
          } else {
            // If tree doesn't exist, redirect to the register page
            console.log('Tree not found in database, redirecting to register page...');
            router.push(`/register/${treeId}`); // Use the correct relative path
          }
        } catch (error) {
          console.error('Error checking tree data:', error);
        }

        // Stop scanning after successful scan
        if (scanner) {
          scanner.clear();
        }
        setIsScanning(false); // Stop scanning after detection
      };

      // Error callback: if an error occurs during scanning
      const handleError = (errorMessage: string) => {
        console.error('Scanning error:', errorMessage);
      };

      // Start the QR code scanning process
      scanner.render(handleSuccess, handleError);
    }

    // Cleanup on component unmount or when scanning stops
    return () => {
      if (isScanning) {
        setIsScanning(false);
      }
    };
  }, [isScanning, router]); // Effect runs only when isScanning or router changes

  return (
    <div className="flex flex-col items-center mt-36 min-h-screen bg-black p-4 text-white">
      <h1 className="text-3xl font-bold mb-4 text-white font-roboto_mono">Scan QR Code to Register Tree</h1>
      {/* The scanner will be rendered in this div */}
      <div id="reader" className="w-full max-w-md border-2"></div>

      {/* If not scanning, show a button to start the scanner */}
      {!isScanning && (
        <Button
          onClick={() => setIsScanning(true)} // Trigger scanning on button click
          className="mt-4 p-3 text-white rounded "
        >
          Start Scanning
        </Button>
      )}
    </div>
  );
}
