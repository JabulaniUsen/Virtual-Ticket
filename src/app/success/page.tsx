'use client'

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Receipt from "../components/Receipt"
import axios from "axios";
import { BASE_URL, TELEGRAM_URL, WHATSAPP_URL } from "../../../config";
import Loader from "@/components/ui/loader/Loader";
import SocialChannelsCTA from "@/components/SocialChannelsCTA";

const SuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showReceipt, setShowReceipt] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {

    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      const ticketId = searchParams.get('ticketId');
      const status = searchParams.get('status');
    
      // Handle explicit failure cases
      if (status === 'failed' || status === 'cancelled') {
        router.push(`/payment-failed?ticketId=${ticketId}`);
        return;
      }
    
      // Handle pending payments
      if (status === 'pending') {
        router.push(`/payment-pending?ticketId=${ticketId}`);
        return;
      }
    
      try {
        if (reference) {
          const response = await axios.post(`${BASE_URL}api/v1/payment/verify`, { 
            reference
          });
    
          // Handle success (200/201) or already verified (400)
          if (response.status === 200 || response.status === 201 || response.status === 400) {
            setIsVerifying(false);
            router.push(`/success?reference=${reference}${ticketId ? `&ticketId=${ticketId}` : ''}`);
            return;
          }
          throw new Error('Payment not verified');
        } 
        else if (ticketId) {
          setIsVerifying(false);
          router.push(`/success?ticketId=${ticketId}`);
          return;
        }
        
        throw new Error('Missing reference or ticketId');
      } catch (error: unknown) {
        console.error('Payment error:', error);
        setIsVerifying(false);
        
        // Type-safe error handling
        if (axios.isAxiosError(error)) {
          // Handle Axios errors
          if (error.response?.status === 400) {
            router.push(`/success?reference=${reference}${ticketId ? `&ticketId=${ticketId}` : ''}`);
          } else {
            router.push(`/payment-failed${ticketId ? `?ticketId=${ticketId}` : ''}`);
          }
        } else if (error instanceof Error) {
          // Handle native Errors
          router.push(`/payment-failed${ticketId ? `?ticketId=${ticketId}` : ''}`);
        } else {
          // Handle unknown error types
          router.push(`/payment-failed${ticketId ? `?ticketId=${ticketId}` : ''}`);
        }
      }
    };

    verifyPayment();
}, [searchParams, router]);

  const handleViewReceipt = () => {
    setShowReceipt(true);
  };

  const closeReceipt = () => {
    setShowReceipt(false);
  };  

  const handleDashboardRedirect = () => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/auth/signup?redirect=/dashboard");
    }
  };

  const handleHomeRedirect = () => {
    router.push("/");
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your ticket...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-700 via-purple-700 to-purple-900 px-2 sm:px-4 py-10 overflow-hidden">
      {/* Floating Blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-4000" />
      </div>

      {/* Success Animation and Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
        className="bg-white p-8 rounded-full shadow-2xl z-10 border-4 border-green-200"
      >
        <motion.svg
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="sm:w-24 sm:h-24 w-[4.5rem] h-[4.5rem] text-green-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </motion.svg>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-white text-4xl sm:text-6xl font-extrabold mt-6 sm:mt-10 text-center z-10 drop-shadow-lg"
        style={{ letterSpacing: '0.03em' }}
      >
        Payment Successful! <span className="inline-block animate-bounce">🎉</span>
      </motion.h1>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-white/90 text-base sm:text-xl mt-6 text-center max-w-2xl px-6 z-10 font-medium"
        style={{ textShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
      >
        Your ticket purchase was successful! A confirmation email with your QR code has been sent to your email address. Please remember to save it – you&apos;ll need it to gain entry to the event.
      </motion.p>

      {/* Important Notice */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8 bg-white/20 backdrop-blur-lg rounded-xl p-6 max-w-2xl mx-4 z-10 border border-yellow-300/30 shadow-lg"
      >
        <div className="flex items-center space-x-2 mb-2">
          <svg
            className="w-6 h-6 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="text-yellow-300 font-bold text-lg">Important Notice</span>
        </div>
        <p className="text-white/90 text-base">
          Please download or safely store your ticket and QR code. This is your official entry pass and will be required for verification at the event venue. For security reasons, do not share your QR code with anyone.
        </p>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-2xl px-4 z-10"
      >
        <button
          onClick={handleViewReceipt}
          className="backdrop-blur-md bg-gradient-to-r from-indigo-500/60 to-blue-500/40 border border-indigo-400/30 text-white text-lg font-semibold px-6 py-3 rounded-xl 
          shadow-[0_4px_16px_rgba(99,102,241,0.25)] transition-all duration-300 
          hover:bg-indigo-500/80 hover:shadow-[0_8px_24px_rgba(99,102,241,0.35)] 
          hover:scale-[1.03] hover:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/40 w-full 
          sm:col-span-2 lg:col-span-1"
        >
          View Virtual Ticket
        </button>
        <button
          onClick={handleDashboardRedirect}
          className="backdrop-blur-md bg-gradient-to-r from-yellow-400/60 to-yellow-500/40 border border-yellow-400/30 text-white text-lg font-semibold px-6 py-3 rounded-xl 
          shadow-[0_4px_16px_rgba(255,200,0,0.18)] transition-all duration-300 
          hover:bg-yellow-500/80 hover:shadow-[0_8px_24px_rgba(255,200,0,0.28)] 
          hover:scale-[1.03] hover:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/40 w-full"
        >
          Create Your Own Event
        </button>
        <button
          onClick={handleHomeRedirect}
          className="backdrop-blur-md bg-gradient-to-r from-white/20 to-white/10 border border-white/30 text-white text-lg font-semibold px-6 py-3 rounded-xl 
          shadow-[0_4px_16px_rgba(255,255,255,0.13)] transition-all duration-300 
          hover:bg-white/30 hover:shadow-[0_8px_24px_rgba(255,255,255,0.18)] 
          hover:scale-[1.03] hover:border-white/50 focus:ring-2 focus:ring-white/40 w-full"
        >
          Go Home
        </button>
      </motion.div>

      {/* Social Channels CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="w-full max-w-2xl mt-12 px-4 z-10"
      >
        <SocialChannelsCTA
          telegramUrl={TELEGRAM_URL}
          whatsappUrl={WHATSAPP_URL}
          variant="success"
        />
      </motion.div>

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <Receipt closeReceipt={closeReceipt} />
        </div>
      )}
    </div>
  );
};

const SuccessPage = () => {
  return (
    <Suspense fallback={<div><Loader/></div>}>
      <SuccessContent />
    </Suspense>
  );
};

export default SuccessPage;
