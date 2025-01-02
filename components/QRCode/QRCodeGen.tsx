'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase'; 
import Spinner from '../ui/spinner';

interface QRCodeGenProps {
  treeName: string;
  treeId?: string;
}

export default function QRCodeGen({ treeName, treeId }: QRCodeGenProps) {
  const [generatedTreeId, setGeneratedTreeId] = useState<string | null>(treeId || null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!treeId) {
      const newTreeId = uuidv4(); // Generate new UUID for a new tree
      setGeneratedTreeId(newTreeId);
    } else {
      setGeneratedTreeId(treeId);
    }
  }, [treeId]);

  useEffect(() => {
    const generateQRCode = async () => {
      const treeRef = ref(db, `trees/${generatedTreeId}`);
      const snapshot = await get(treeRef);

      let link: string;
      if (snapshot.exists()) {
        // Tree exists, generate a link to the update page
        link = `${window.location.origin}/update/${generatedTreeId}`;
      } else {
        // Tree doesn't exist, generate a link to the register page
        link = `${window.location.origin}/register/${generatedTreeId}`;
      }

      console.log('Generated QR Code URL:', link); // <-- Log the URL here

      try {
        const qrUrl = await QRCode.toDataURL(link);
        setQrCodeUrl(qrUrl);
        setError(null);
      } catch (err) {
        setError('Failed to generate QR Code. Please try again.');
      }
    };

    generateQRCode();
  }, [treeName, generatedTreeId]);

  if (error) {
    return <div className="flex flex-col items-center"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center w-40 h-40 relative">
        {qrCodeUrl ? (
          <img src={qrCodeUrl} alt={`QR Code for ${treeName}`} className="absolute" />
        ) : (
          <Spinner />
        )}
      </div>
      {qrCodeUrl && (
        <a
          href={qrCodeUrl}
          download={`${treeName.replace(/\s+/g, '_')}-tree-registration-qr.png`}
          className="mt-2 p-2 bg-white bg-opacity-20 text-white rounded"
        >
          Download QR Code
        </a>
      )}
    </div>
  );
}
