'use client';

import { useState } from 'react';
import { QrScanner } from '@/components/QrScanner';
import { FiArrowLeft, FiCamera, FiCheck, FiSearch } from 'react-icons/fi';

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = (data: string) => {
    setScanResult(data);
    setShowScanner(false);
    // Process the scanned data
    console.log('Scanned data:', data);
  };

  const handleError = (err: Error | unknown) => {
    // Log the raw error for debugging
    console.error('Scanner Error:', err);

    // Type guard for Error objects
    if (err instanceof Error) {
      // Only close scanner for critical errors
      if (
        err.message.includes('NotAllowedError') || 
        err.message.includes('NotFoundError') || 
        err.message.includes('NotReadableError')
      ) {
        setShowScanner(false);
        // Show user-friendly error message for critical errors
        alert(
          err.message.includes('NotAllowedError') 
            ? 'Please allow camera access to scan QR codes'
            : err.message.includes('NotFoundError')
            ? 'No camera found on your device'
            : 'Cannot access camera. Please try again'
        );
      }
    } else {
      // Handle non-Error objects
      console.warn('Received non-Error type in error handler:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {showScanner ? (
        <QrScanner 
          onScan={handleScan} 
          onError={handleError}
          onClose={() => setShowScanner(false)}
        />
      ) : (
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => window.history.back()}
              className="p-2 mr-2"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">Ticket Scanner</h1>
          </div>
          
          {scanResult ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck size={32} className="text-green-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">Ticket Scanned!</h2>
                <p className="text-gray-600">Scan another ticket or process this one</p>
              </div>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Ticket ID:</h3>
                <div className="p-3 bg-white rounded border border-gray-200 break-all">
                  {scanResult}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setScanResult(null)}
                  className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium"
                >
                  Scan Another
                </button>
                <button
                  onClick={() => {
                    console.log('Processing ticket:', scanResult);
                    alert('Ticket processed!');
                  }}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium"
                >
                  Process Ticket
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCamera size={48} className="text-blue-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">Scan Ticket QR Code</h2>
              <p className="text-gray-600 mb-6">Point your camera at a ticket QR code to scan it</p>
              <button
                onClick={() => setShowScanner(true)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium"
              >
                Open Scanner
              </button>
              <button className="mt-3 text-blue-600 font-medium flex items-center justify-center mx-auto">
                <FiSearch className="mr-2" />
                Enter Code Manually
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}