'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Receipt from "../components/Receipt"

const SuccessPage = () => { 
  const router = useRouter();
  const [showReceipt, setShowReceipt] = useState(false);

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

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 px-4 py-8">
      {/* Floating Blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Success Animation and Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
        className="bg-white p-8 rounded-full shadow-2xl z-10"
      >
        <motion.svg
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-20 h-20 text-green-500"
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
        className="text-white text-4xl md:text-5xl font-bold mt-8 text-center z-10"
      >
        Payment Successful! 🎉
      </motion.h1>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-white text-lg mt-6 text-center max-w-2xl px-4 z-10"
      >
        Your ticket purchase was successful! Click &quot;View Virtual Ticket&quot; below 
        to access your digital ticket with QR code. Remember to save it - you&apos;ll need 
        it for entry to the event.
      </motion.p>

      {/* Important Notice */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-6 bg-white/10 backdrop-blur-md rounded-lg p-5 max-w-2xl mx-4 z-10"
      >
        <div className="flex items-center space-x-2 mb-2">
          <svg
        className="w-5 h-5 text-yellow-400"
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
          <span className="text-yellow-400 font-bold">Important Notice</span>
        </div>
        <p className="text-white text-sm">
          Please download or safely store your ticket and QR code. This is your official entry pass 
          and will be required for verification at the event venue. For security reasons, 
          do not share your QR code with anyone.
        </p>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-2xl px-4 z-10"
      >
        <button
          onClick={handleViewReceipt}
          className="backdrop-blur-md bg-indigo-500/30 border border-indigo-400/30 text-white text-base font-medium px-5 py-2.5 rounded-lg 
          shadow-[0_4px_12px_rgba(99,102,241,0.25)] transition-all duration-300 
          hover:bg-indigo-500/50 hover:shadow-[0_8px_20px_rgba(99,102,241,0.4)] 
          hover:scale-[1.02] hover:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/40 w-full 
          sm:col-span-2 lg:col-span-1"
        >
          View Virtual Ticket
        </button>
        <button
          onClick={handleDashboardRedirect}
          className="backdrop-blur-md bg-yellow-500/30 border border-yellow-400/30 text-white text-base font-medium px-5 py-2.5 rounded-lg 
          shadow-[0_4px_12px_rgba(255,200,0,0.25)] transition-all duration-300 
          hover:bg-yellow-500/50 hover:shadow-[0_8px_20px_rgba(255,200,0,0.4)] 
          hover:scale-[1.02] hover:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/40 w-full"
        >
          Create Your Own Event
        </button>
        <button
          onClick={handleHomeRedirect}
          className="backdrop-blur-md bg-white/10 border border-white/30 text-white text-base font-medium px-5 py-2.5 rounded-lg 
          shadow-[0_4px_12px_rgba(255,255,255,0.2)] transition-all duration-300 
          hover:bg-white/20 hover:shadow-[0_8px_20px_rgba(255,255,255,0.3)] 
          hover:scale-[1.02] hover:border-white/50 focus:ring-2 focus:ring-white/40 w-full"
        >
          Go Home
        </button>
        
      </motion.div>

      {showReceipt && 
        <Receipt closeReceipt={closeReceipt}
       />}

    </div>
  );
};

export default SuccessPage;
