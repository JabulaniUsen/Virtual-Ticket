// components/EventHeroSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@mui/material';
import { type Event } from '@/types/event';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';  

interface EventHeroSectionProps {
  event: Event;

  scrollToTickets: () => void;
}

const formatEventTime = (time: string): string => {
  if (!time) return '';
  const [hoursStr, minutesStr] = time.split(':');
  const hours = Number(hoursStr);
  // If minutesStr is undefined or not a number, default to 0
  const minutes = minutesStr !== undefined && !isNaN(Number(minutesStr)) ? Number(minutesStr) : 0;
  if (isNaN(hours)) return '';
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export const EventHeroSection = ({ event, scrollToTickets }: EventHeroSectionProps) => {
  return (
    <div className="relative min-h-[90vh] px-6 py-12 md:px-16 md:py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-950">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative flex flex-col md:flex-row gap-12 max-w-7xl mx-auto">
        <motion.div
          className="flex-1 relative z-10"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          {event ? (
            <div className="space-y-5">
              <div className="inline-block">
                <h1 className="text-3xl sm:text-5xl bg-clip-text text-transparent bg-black dark:bg-white leading-tight">
                  {event.title}
                </h1>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <p className="text-xl sm:text-lg font-medium">{event.venue}, {event.location}</p>
                </div>

                <div className="flex items-center space-x-3 text-purple-600 dark:text-purple-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div className="flex items-center space-x-2">
                    <p className="text-md sm:text-lg font-medium">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <span className="text-gray-400 dark:text-gray-500">|</span>
                    <p className="text-lg font-medium">{formatEventTime(event.time)}</p>
                    {new Date(event.date) > new Date() && (
                      <span className="ml-2 relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 relative inline-block">
                  DESCRIPTION
                  <span className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 w-[75%] rounded-full"></span>
                </h5>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{event.description}</p>
                <a
                  href="#location"
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 mt-4 inline-block"
                >
                  View Map
                </a>
              </div>

              <div className="flex items-center gap-4 mt-6">
                {event?.socialMediaLinks?.instagram && (
                  <a
                    href={event.socialMediaLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg hover:scale-110 transition-transform"
                    style={{borderRadius: '50%'}}
                  >
                    <Instagram />
                  </a>
                )}
                {event?.socialMediaLinks?.twitter && (
                  <a
                    href={event.socialMediaLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg hover:scale-110 transition-transform"
                    style={{borderRadius: '50%'}}
                  >
                    <Twitter />
                  </a>
                )}
                {event?.socialMediaLinks?.facebook && (
                  <a
                    href={event.socialMediaLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg hover:scale-110 transition-transform"
                    style={{borderRadius: '50%'}}                       
                  >
                    <Facebook />
                  </a>
                )}
              </div>

              <Button
                variant="contained"
                sx={{
                  mt: 4,
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  ':hover': { 
                    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)'
                  },
                  transition: 'all 0.3s ease'      
                }}
                onClick={scrollToTickets}
              >
                Get Your Tickets
              </Button>
            </div>
          ) : (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-blue-200 dark:bg-blue-800 rounded w-3/4"></div>
              <div className="h-6 bg-blue-200 dark:bg-blue-800 rounded w-1/4"></div>
              <div className="h-6 bg-blue-200 dark:bg-blue-800 rounded w-1/3"></div>
              <div className="h-24 bg-blue-200 dark:bg-blue-800 rounded w-full"></div>
            </div>
          )}
        </motion.div>

        <motion.div
          className="flex-1 mt-8 md:mt-0"
          initial={{ opacity: 0, x: 30 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1 }}
        >
          <div className="relative w-full h-[400px] rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
            {event && event.image ? (
              <Image
                src={typeof event.image === 'string' ? event.image : URL.createObjectURL(event.image)}
                alt={event.title}
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
                priority
              />
            ) : (
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 flex items-center justify-center">
                <svg className="w-16 h-16 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};