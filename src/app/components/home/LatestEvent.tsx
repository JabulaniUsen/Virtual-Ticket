'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaUser, FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useLatestEvents } from '@/hooks/useEvents';
import { useRouter } from 'next/navigation';
import { formatEventTime, formatEventDate } from '@/utils/formatDateTime';
import Toast from '@/components/ui/Toast';
import Loader from '@/components/ui/loader/Loader';

const LatestEvent = () => {
  const { data: events, isLoading } = useLatestEvents();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [navigating, setNavigating] = useState(false);
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);
  const router = useRouter();

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % (events?.length || 1));
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev - 1 + (events?.length || 1)) % (events?.length || 1));
  };

  const handleViewDetails = async (eventSlug: string) => {
    try {
      setNavigating(true);
      await router.push(`/${eventSlug}`);
    } finally {
      setNavigating(false);
    }
  };

  if (isLoading) return <Loader />;
  if (!events || events.length === 0) return null;

  const currentEvent = events[currentIndex];

  return (
    <section className="relative py-20 overflow-hidden bg-white dark:bg-gray-950" id='latestEvents'>
      {navigating && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Abstract background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-50/30 to-transparent dark:from-blue-950/20 dark:to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-t from-purple-50/20 to-transparent dark:from-purple-950/10 dark:to-transparent"></div>
        
        {/* Floating shapes */}
        <motion.div 
          animate={{
            rotate: [0, 360],
            x: [0, 20, 0],
            y: [0, -15, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border-2 border-blue-200/50 dark:border-blue-900/30"
        />
        
        <motion.div 
          animate={{
            rotate: [0, -360],
            y: [0, 20, 0]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-lg bg-purple-100/30 dark:bg-purple-900/20"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asymmetric header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6"
        >
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-900/30 rounded-full">
              Featured Events
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              <span className="relative inline-block">
                <span className="relative z-10">Curated Experiences</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-200/60 dark:bg-blue-900/40 -z-0"></span>
              </span>
            </h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrevious}
              className="p-3 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm transition-colors"
              aria-label="Previous event"
            >
              <FaChevronLeft className="text-blue-600 dark:text-blue-400" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm transition-colors"
              aria-label="Next event"
            >
              <FaChevronRight className="text-blue-600 dark:text-blue-400" />
            </button>
          </div>
        </motion.div>

        {/* Diagonal layout */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Decorative element */}
          <div className="absolute -z-10 top-1/2 left-1/2 w-[120%] h-[120%] bg-blue-50/20 dark:bg-blue-900/10 rounded-[50%] -translate-x-1/2 -translate-y-1/2 rotate-12"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
            {/* Content - rotated slightly */}
            <motion.div 
              className="relative z-10 -rotate-1"
              whileHover={{ rotate: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="space-y-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                    Featured
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatEventDate(currentEvent.date)}
                  </span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {currentEvent.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {currentEvent.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                    <FaClock className="text-blue-500" />
                    <span>{formatEventTime(currentEvent.time)}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <span>{currentEvent.location}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                    <FaUser className="text-blue-500" />
                    <span>{currentEvent.hostName}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => currentEvent.slug && handleViewDetails(currentEvent.slug)}
                  className="group relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300 mt-4"
                >
                  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                  <span className="relative flex items-center">
                    Explore Event
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </motion.div>
            
            {/* Image - offset and with perspective */}
            <motion.div 
              className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl"
              initial={{ rotate: 5, scale: 0.95 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ rotate: -1, scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 dark:to-black/50 z-10"></div>
              <Image
                src={typeof currentEvent.image === 'string' ? currentEvent.image : '/placeholder.jpg'}
                alt={currentEvent.title}
                fill
                className="object-cover transform transition-transform duration-700 hover:scale-105"
                priority
              />
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                    <FaCalendar />
                    <span className="font-medium">{formatEventDate(currentEvent.date)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestEvent;