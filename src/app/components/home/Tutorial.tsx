'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { motion, useInView } from 'framer-motion';

const Tutorial = () => {
  const videoRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isInView && videoRef.current) {
      // Add autoplay parameter to URL when in view
      const currentSrc = videoRef.current.src;
      videoRef.current.src = currentSrc + "&autoplay=1&mute=1";
      setIsPlaying(true);
    }
  }, [isInView]);

  const togglePlay = () => {
    if (videoRef.current) {
      const iframe = videoRef.current;
      const message = isPlaying ? '{"event":"command","func":"pauseVideo","args":""}' 
                               : '{"event":"command","func":"playVideo","args":""}';
      iframe.contentWindow?.postMessage(message, '*');
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 dark:from-gray-900 dark:via-blue-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id='tutorial'>
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Getting Started with V-Ticket
          </h2>
          <p className="text-lg text-blue-100 dark:text-gray-300 max-w-2xl mx-auto">
            Watch our comprehensive tutorial to learn how to create and manage your virtual events effectively
          </p>
        </motion.div>

        {/* Video Container */}
        <div ref={containerRef} className="relative max-w-4xl mx-auto">
          {/* Decorative Elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-400 opacity-20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-400 opacity-20 rounded-full blur-2xl animate-pulse delay-1000" />
          
          {/* Video Wrapper */}
          <motion.div
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Video Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                          pointer-events-none z-10" />
            
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="absolute bottom-6 right-6 z-20 bg-white/20 backdrop-blur-md 
                       hover:bg-white/30 text-white rounded-full p-4 
                       transform transition-all duration-300 hover:scale-110
                       shadow-lg hover:shadow-xl"
            >
              {isPlaying ? <FaPause className="w-5 h-5" /> : <FaPlay className="w-5 h-5" />}
            </button>

            {/* YouTube Video */}
            <div className="relative pb-[50%] h-0">
              <iframe
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full rounded-2xl"
                src="https://www.youtube.com/embed/HK5GJfm4G10?si=odukjni1Fp4EaQ9k&enablejsapi=1"
                title="How to use V-Ticket"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>

          {/* ============== •FEATURE POINTS• ============ */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              {
                title: "Quick Event Setup",
                description: "Create and customize your real-life events in just a few clicks. Edit event details anytime to keep everything up-to-date."
              },
              {
                title: "Smart Ticket Management",
                description: "Generate secure digital tickets with unique QR codes. Automatically send receipts via email or allow users to save them as PDFs for event entry."
              },
              {
                title: "Real-Time Analytics & Insights",
                description: "Monitor ticket sales, track earnings, and analyze event performance in real-time through your dashboard."
              }
            ].map((point, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6
                         transform hover:-translate-y-2 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  {point.title}
                </h3>
                <p className="text-blue-100 dark:text-gray-300">
                  {point.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Tutorial; 