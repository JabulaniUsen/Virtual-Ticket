// components/EventHeroSection.tsx
import React from 'react';
import Image from 'next/image';
import { type Event } from '@/types/event';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';  
import { formatEventTime, formatEventDate } from '@/utils/formatDateTime';

interface EventHeroSectionProps {
  event: Event;
  scrollToTickets: () => void;
}

export const EventHeroSection = ({ event, scrollToTickets }: EventHeroSectionProps) => {
  return (
    <div className="relative px-4 py-8 md:px-8 md:py-12 lg:px-16 lg:py-16">
      {/* Simplified Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-950">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-6xl mx-auto items-center">
        {/* Content Section */}
        <div className="lg:w-auto space-y-6">
          {event ? (
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                  {event.title}
                </h1>
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-start space-x-2 text-blue-600 dark:text-blue-400">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <p className="text-sm sm:text-base lg:text-lg font-medium break-words">{event.venue}, {event.location}</p>
                </div>

                {/* Date and Time */}
                <div className="flex items-start space-x-2 text-purple-600 dark:text-purple-400">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                    <p className="text-sm sm:text-base lg:text-lg font-medium">
                      {formatEventDate(event.date)}
                    </p>
                    <span className="hidden sm:inline text-gray-400 dark:text-gray-500">|</span>
                    <p className="text-sm sm:text-base lg:text-lg font-medium">{formatEventTime(event.time)}</p>
                    {new Date(event.date) > new Date() && (
                      <span className="ml-2 relative flex h-3 w-3 flex-shrink-0">
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-100 relative inline-block">
                  DESCRIPTION
                  <span className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 w-[75%] rounded-full"></span>
                </h5>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-sm sm:text-base">
                  {event.description}
                </p>
                <a
                  href="#location"
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 inline-block"
                >
                  View Map
                </a>
              </div>

              {/* Social Media Links */}
              <div className="flex items-center gap-3">
                {event?.socialMediaLinks?.instagram && (
                  <a
                    href={event.socialMediaLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full hover:scale-105 transition-transform"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {event?.socialMediaLinks?.twitter && (
                  <a
                    href={event.socialMediaLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full hover:scale-105 transition-transform"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {event?.socialMediaLinks?.facebook && (
                  <a
                    href={event.socialMediaLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full hover:scale-105 transition-transform"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
              </div>

              {/* CTA Button */}
              <button
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded transition-colors"
                onClick={scrollToTickets}
              >
                Get Your Tickets!
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          )}
        </div>

        {/* Image Section */}
        <div className="flex-1 w-full lg:w-auto">
          <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] rounded-xl shadow-xl overflow-hidden">
            {event && event.image ? (
              <Image
                src={typeof event.image === 'string' ? event.image : URL.createObjectURL(event.image)}
                alt={event.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 flex items-center justify-center">
                <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};