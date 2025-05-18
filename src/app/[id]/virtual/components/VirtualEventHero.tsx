import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { type EventFormData } from '@/types/event';
import { FaCalendarAlt, FaClock, FaUserAlt, FaVideo } from 'react-icons/fa';
import { format } from 'date-fns';

interface VirtualEventHeroProps {
  event: EventFormData;
}

export default function VirtualEventHero({ event }: VirtualEventHeroProps) {
  const formattedDate = format(new Date(event.date), 'MMMM do, yyyy');

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-8 items-center mb-12">
      {/* TEXT CONTENT */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 order-2 lg:order-1 w-full"
      >
        <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full mb-4 shadow-sm">
          <FaVideo className="mr-2" />
          <span className="font-semibold tracking-wide">VIRTUAL EVENT</span>
        </div>

        <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-blue-400 bg-clip-text text-transparent mb-4 leading-tight">
          {event.title}
        </h1>

        <p className="text-base sm:text-lg text-gray-800 dark:text-gray-200 mb-6 max-w-xl">
          {event.description.substring(0, 200)}...
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/80 rounded-lg shadow-sm">
            <FaCalendarAlt className="text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">DATE</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/80 rounded-lg shadow-sm">
            <FaClock className="text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">TIME</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{event.time}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/80 rounded-lg shadow-sm">
            <FaUserAlt className="text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">HOST</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{event.hostName}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* IMAGE */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 order-1 lg:order-2 relative w-full h-56 xs:h-64 sm:h-72 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl mb-6 lg:mb-0"
      >
        {event.image && (
          <Image
            src={typeof event.image === 'string' ? event.image : URL.createObjectURL(event.image)}
            alt={event.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </motion.div>
    </div>
  );
}