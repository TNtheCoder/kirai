'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import QRCodeGen from '@/components/QRCode/QRCodeGen';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode';

export default function BulkQRCodeGenerator() {
  const [qrCount, setQrCount] = useState<number | null>(1); // Allow qrCount to be a number or null for invalid state
  const [qrCodes, setQrCodes] = useState<string[]>([]); // Store generated tree names/IDs
  const [errorMessage, setErrorMessage] = useState<string>(''); // Store error message

  const handleGenerateQRs = () => {
    if (qrCount === null || qrCount <= 0) {
      setErrorMessage('Please input a valid amount.');
      return;
    }

    const generatedCodes: string[] = [];
    for (let i = 0; i < qrCount; i++) {
      const uniqueId = `tree-${Math.random().toString(36).substr(2, 9)}`;
      generatedCodes.push(uniqueId);
    }
    setQrCodes(generatedCodes);
    setErrorMessage(''); // Clear the error message when QR codes are generated
  };

  const generatePDF = async () => {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]); // Set the page size (600x800)
  
    // Define the grid layout for the QR codes (rows and columns)
    const qrCodeSize = 100; // Define the size of each QR code
    const margin = 10; // Margin between QR codes
    let xPos = margin;
    let yPos = page.getHeight() - margin - qrCodeSize;
  
    for (let i = 0; i < qrCodes.length; i++) {
      // Get the QR code image as a data URL (for illustration)
      const qrCodeDataUrl = await generateQRCodeDataURL(qrCodes[i]);
  
      // Embed the QR code as an image into the PDF
      const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);
      page.drawImage(qrImage, {
        x: xPos,
        y: yPos,
        width: qrCodeSize,
        height: qrCodeSize,
      });
  
      // Update x and y positions for the next QR code
      xPos += qrCodeSize + margin;
      if (xPos + qrCodeSize > page.getWidth()) {
        xPos = margin;
        yPos -= qrCodeSize + margin;
      }
    }
  
    // Save the PDF to a Blob and trigger download
    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(pdfBlob, 'qr-codes-collage.pdf');
  };

  // Generate QR code data URL (image) for embedding into PDF
  const generateQRCodeDataURL = async (treeName: string): Promise<string> => {
    try {
      // Use QRCode.toDataURL to generate the QR code image as a data URL
      const qrCodeDataUrl = await QRCode.toDataURL(treeName, { width: 100, margin: 1 });
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code data URL', error);
      return '';  // Return an empty string if there's an error
    }
  };

  return (
    <div className="bg-black">
      <div className="flex flex-col items-center text-center min-h-screen mt-36 p-4">
        <h1 className="font-roboto_mono text-white text-3xl font-bold mb-6">Generate Multiple QR Codes</h1>

        <div className="mb-4 flex flex-col items-center">
          <label className="block text-lg text-white mb-2">Number of QR Codes</label>
          <Input
            type="number"
            min="1"
            value={qrCount ?? ''} // If qrCount is null, show empty value
            onChange={(e) => {
              const value = e.target.value;
              const numericValue = value === '' ? null : Number(value);
              setQrCount(numericValue); // Set as null if input is empty
              setErrorMessage(''); // Clear error message when user modifies the input
            }}
            className="w-40 border text-white border-gray-300 rounded justify-center items-center text-xs font-roboto_mono"
            placeholder="Input number"
            onBlur={() => {
              if (qrCount === null) setQrCount(1); // Default to 1 if no input
            }}
          />
        </div>

        {errorMessage && <p className="text-red-500 font-roboto">{errorMessage}</p>} {/* Show the error message if there's an issue */}

        <Button onClick={handleGenerateQRs} className="text-white rounded w-40 justify-center">
          Generate QR Code(s)
        </Button>

        <div className="mt-10">
          {qrCodes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {qrCodes.map((code, index) => (
                <div key={index}>
                  <QRCodeGen treeName={code} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conditional rendering of the blue button */}
        {qrCodes.length > 1 && (
          <Button onClick={generatePDF} className="mt-6 p-3 text-white rounded bg-slate-500">
            Download QR Codes as PDF
          </Button>
        )}
      </div>
    </div>
  );
}
