// components/EventLocationSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { type Event } from '@/types/event';

interface EventLocationSectionProps {
  event: Event;
}

export const EventLocationSection = ({ event }: EventLocationSectionProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mt-10 text-center px-4 md:px-10"
    >
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-gray-900 dark:text-gray-100"
      >
        LOCATION
      </motion.h3>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-2 "
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Powered by Google Maps <span className="text-blue-500">🌍</span>
        </p>

        {event?.venue ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {event.venue}
          </p>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Venue details not available
          </p>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-500 italic">
          Note: Enable location services for directions
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6"
      >
        {event?.venue ? (
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(event.venue)}&output=embed`}
            className="w-full h-72 rounded-lg shadow-lg border-0 transition-all duration-300 hover:shadow-xl"
            loading="lazy"
            title="Event Location Map"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-72 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Map not available</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};