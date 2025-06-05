'use client';

import { useState, useRef, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { FiRotateCw, FiCheck, FiX, FiUser, FiMaximize } from 'react-icons/fi';
import Layout from './Layout/Layout';

interface QrScannerProps {
  onScan: (data: string) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

export const QrScanner = ({ onScan, onError, onClose }: QrScannerProps) => {
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [scanned, setScanned] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const scannerRef = useRef<HTMLDivElement>(null);

  // Check for camera permission on mount
    useEffect(() => {
    const checkPermission = async () => {
        try {
        // First, check if camera is available
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        
        if (videoDevices.length === 0) {
            setHasPermission(false);
            setScanError('No camera found. Please ensure your device has a camera.');
            return;
        }

        // Try with minimal constraints first
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
            facingMode: facingMode,
            width: { ideal: 640 }, // Start with a lower resolution
            height: { ideal: 480 }
            }
        });

        // Verify stream is active
        if (stream.getTracks().some(track => track.readyState === 'live')) {
            setHasPermission(true);
        }

        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
        } catch (err) {
        console.error('Camera permission error:', err);
        setHasPermission(false);
        
        if (err instanceof Error) {
            if (err.name === 'NotAllowedError') {
            setScanError('Camera access denied. Please allow camera access to scan QR codes.');
            } else if (err.name === 'NotFoundError') {
            setScanError('No camera found. Please ensure your device has a camera.');
            } else if (err.name === 'OverconstrainedError') {
            setScanError('Camera constraints cannot be satisfied. Please try adjusting camera settings.');
            } else {
            setScanError('Cannot access camera. Please try again.');
            }
            
            if (onError) {
            onError(err);
            }
        }
        }
    };

    checkPermission();
    }, [onError, facingMode]);

    useEffect(() => {
    const initializeScanner = async () => {
        if (!hasPermission || !scannerRef.current) return;
        
        try {
        // Force camera initialization
        await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { exact: facingMode } }
        });
        
        // Add explicit error handling
        const handleError = (error: unknown) => {
            if (error instanceof Error) {
            setScanError(error.message);
            if (onError) onError(error);
            }
        };
        
        return () => {
            // Cleanup on unmount
            setScanned(false);
            setScanError(null);
        };
        } catch (error) {
        handleError(error);
        }
    };

    initializeScanner();
    }, [hasPermission, facingMode, onError]);

  const handleScan = (result: string | null) => {
    if (result && !scanned) {
      setScanError(null);
      setScanned(true);
      onScan(result);
      setTimeout(() => setScanned(false), 2000);
    }
  };

  const handleError = (error: unknown) => {
    // Guard against null/undefined
    if (!error) {
      console.debug('Received empty error');
      return;
    }

    // Handle Error objects
    if (error instanceof Error && error.message) {
      try {
        // Handle known error types
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('notallowederror')) {
          setScanError('Camera access denied. Please allow camera access to scan QR codes.');
        } else if (errorMessage.includes('notfounderror')) {
          setScanError('No camera found. Please ensure your device has a camera.');
        } else if (errorMessage.includes('notreadableerror')) {
          setScanError('Cannot access camera. Please try again.');
        } else {
          // Handle QR scanning errors differently
          console.debug('QR Scanner Error:', error);
        }

        // Forward error to parent component if callback exists
        if (onError) {
          onError(error);
        }
      } catch (e) {
        console.debug('Error processing error message:', e);
      }
    } else {
      // Handle non-Error objects or errors without messages
      console.debug('Non-standard error received:', error);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  return (
    <Layout>
        <div className="fixed inset-0 bg-black flex flex-col z-50">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-black bg-opacity-50 text-white">
            <button 
            onClick={onClose}
            className="p-2 rounded-full bg-black bg-opacity-50"
            >
            <FiX size={24} />
            </button>
            <h1 className="text-xl font-bold">Scan QR Code</h1>
            <div className="w-8"></div> {/* Spacer for balance */}
        </div>

        {/* Scanner View */}
        <div 
            ref={scannerRef}
            className="flex-1 relative flex items-center justify-center"
        >
            {hasPermission ? (
            <QrReader
                constraints={{
                    facingMode,
                    aspectRatio: 1,
                    frameRate: 30
                }}
                onResult={(result, error) => {
                    if (result) {
                    handleScan(result.getText());
                    }
                    if (error && error instanceof Error) {
                    handleError(error);
                    }
                }}
                videoContainerStyle={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1 // Ensure proper layering
                }}
                videoStyle={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
                scanDelay={500}
                />
            ) : (
            <div className="flex items-center justify-center h-full text-white">
                <p>Please allow camera access to scan QR codes</p>
            </div>
            )}

            {/* Error Message */}
            {scanError && (
            <div className="absolute top-1/4 left-4 right-4 bg-red-500 text-white p-4 rounded-lg text-center shadow-lg">
                <p>{scanError}</p>
                <button 
                onClick={() => setScanError(null)}
                className="mt-2 px-4 py-2 bg-white text-red-500 rounded-lg text-sm font-medium"
                >
                Dismiss
                </button>
            </div>
            )}
            
            {/* Scanner overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-64 h-64">
                {/* Corner borders */}
                <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
                <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
                <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
                <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
                
                {/* Animated scanning line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-green-400 animate-scan-line"></div>
            </div>
            </div>
            
            {/* Semi-transparent overlay outside scan area */}
            <div className="absolute inset-0 bg-black bg-opacity-50">
            <div className="absolute inset-0 m-auto w-64 h-64 bg-transparent"></div>
            </div>
        </div>

        {/* Footer Controls */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 bg-black bg-opacity-50 flex flex-col items-center">
            {/* Scan status */}
            {scanned ? (
            <div className="mb-4 px-6 py-3 bg-green-500 text-white rounded-full flex items-center animate-pulse">
                <FiCheck className="mr-2" />
                Scanned Successfully!
            </div>
            ) : (
            <p className="mb-4 text-white text-center">
                Align QR code within frame to scan
            </p>
            )}
            
            {/* Control buttons */}
            <div className="flex justify-center items-center gap-6">
            {/* Torch toggle */}
            <button
                onClick={() => setTorchOn(!torchOn)}
                className={`p-4 rounded-full ${torchOn ? 'bg-yellow-500 text-black' : 'bg-white bg-opacity-20 text-white'}`}
            >
                <FiMaximize size={24} />
            </button>
            
            {/* Camera toggle */}
            <button
                onClick={toggleCamera}
                className="p-4 rounded-full bg-white bg-opacity-20 text-white"
            >
                <FiRotateCw size={24} />
            </button>
            
            {/* Manual input (optional) */}
            <button
                onClick={() => {}}
                className="p-4 rounded-full bg-white bg-opacity-20 text-white"
            >
                <FiUser size={24} />
            </button>
            </div>
        </div>

        {/* Custom animations */}
        <style jsx>{`
            @keyframes scan-line {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
            }
            .animate-scan-line {
            animation: scan-line 2s ease-in-out infinite;
            }
        `}</style>
        </div>
    </Layout>
  );
};