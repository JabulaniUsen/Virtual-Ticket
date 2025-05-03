'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaUser, FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import Toast from '@/components/ui/Toast';
import Loader from '@/components/ui/loader/Loader';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '../../../../config';

interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  hostName: string;
}
function LatestEvent() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ type, message });
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchLatestEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}api/v1/events/sorted-by-latest`, {
          signal: controller.signal
        });
        if (response.data.events?.length > 0) {
          setEvents(response.data.events.slice(0, 3));
        } else {
          showToast('No events available at the moment.', 'info');
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching latest events:', error);
          showToast('Failed to load events. Please try again later.', 'error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLatestEvents();

    return () => {
      controller.abort();
    };
  }, [showToast]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % events.length);
  }, [events.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + events.length) % events.length);
  }, [events.length]);

  const handleViewDetails = async (eventSlug: string) => {
    setNavigating(true);
    await router.push(`/${eventSlug}`);
    setNavigating(false);
  };


  if (loading) {
    return <Loader />;
  }

  if (!events.length) {
    return null;
  }

  const currentEvent = events[currentIndex];

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-blue-900 dark:to-gray-900" id='latestEvents'>
      {navigating && <Loader />}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Latest Featured Event
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between z-10">
          <button
            onClick={handlePrevious}
            className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transform transition-all hover:scale-110"
            aria-label="Previous event"
          >
            <FaChevronLeft className="text-blue-600 text-xl" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transform transition-all hover:scale-110"
            aria-label="Next event"
          >
            <FaChevronRight className="text-blue-600 text-xl" />
          </button>
        </div>

        {/* Main Content• &&======= */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Image Section */}
          <div className="relative group h-[400px] md:h-[400px]">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative h-full rounded-2xl overflow-hidden">
              <Image
                src={currentEvent.image}
                alt={currentEvent.title}
                fill
                className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <motion.h3
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
            >
              {currentEvent.title}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-600 dark:text-gray-300 text-lg font-light"
            >
              {currentEvent.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <FaCalendar className="text-blue-500 text-xl" />
                <span>{new Date(currentEvent.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <FaClock className="text-blue-500 text-xl" />
                <span>{currentEvent.time}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <FaMapMarkerAlt className="text-blue-500 text-xl" />
                <span>{currentEvent.location}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <FaUser className="text-blue-500 text-xl" />
                <span>{currentEvent.hostName}</span>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              onClick={() => handleViewDetails(currentEvent.slug)}
              className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300 ease-out"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative flex items-center">
                View Event Details
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default LatestEvent;