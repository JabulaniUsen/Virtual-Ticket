// COMPONENTS/VIRTUAL-EVENT/VIRTUAL-EVENT-CARD.TSX
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaGoogle, 
  FaVideo, 
  FaLink, 
  FaLock, 
  FaCalendarAlt,
  FaClock,
  FaUserAlt,
  FaQrcode,
  FaCopy,
  FaExclamationTriangle
} from 'react-icons/fa';
import { RiEarthLine } from 'react-icons/ri';
import { Button } from '@mui/material';
import Image from 'next/image';
import { format } from 'date-fns';
import { type EventFormData } from '@/types/event';
import { validateVirtualEvent, generateVirtualLink } from '@/utils/virtual-events';
// import { generateVirtualLink, validateVirtualEvent } from '@/utils/virtual-events';

interface VirtualEventCardProps {
  event: EventFormData;
}

export const VirtualEventCard = ({ event }: VirtualEventCardProps) => {
  const getPlatformIcon = () => {
    switch(event.virtualEventDetails?.platform) {
      case 'google-meet': return <FaGoogle className="text-red-500 text-2xl" />;
      case 'zoom': return <FaVideo className="text-blue-500 text-2xl" />;
      case 'whereby': return <RiEarthLine className="text-purple-500 text-2xl" />;
      default: return <FaLink className="text-green-500 text-2xl" />;
    }
  };

  const getPlatformName = () => {
    switch(event.virtualEventDetails?.platform) {
      case 'google-meet': return 'GOOGLE MEET';
      case 'zoom': return 'ZOOM MEETING';
      case 'whereby': return 'WHEREBY';
      default: return 'VIRTUAL EVENT';
    }
  };

  const getMeetingLink = (): string | null => {
    if (!validateVirtualEvent(event)) return null;
    
    try {
      return generateVirtualLink({
        eventId: event.id || 'default-id',
        platform: event.virtualEventDetails?.platform || 'custom',
        meetingId: event.virtualEventDetails?.meetingId,
        meetingUrl: event.virtualEventDetails?.meetingUrl
      });
    } catch (error) {
      console.error('Failed to generate virtual link:', error);
      return null;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TOAST WOULD BE TRIGGERED HERE IN A REAL IMPLEMENTATION
  };

  if (!event.isVirtual) return null;

  const meetingLink = getMeetingLink();
  const formattedDate = format(new Date(event.date), 'MMMM do, yyyy');
  const requiresPassword = event.virtualEventDetails?.requiresPassword;
  const isValidEvent = validateVirtualEvent(event);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl overflow-hidden border border-blue-100 dark:border-gray-700"
    >
      {/* HEADER SECTION */}
      <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getPlatformIcon()}
            <h3 className="text-xl font-bold">{getPlatformName()}</h3>
          </div>
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
            VIRTUAL EVENT
          </span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="p-6">
        {/* EVENT DETAILS */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <FaCalendarAlt className="text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">DATE</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FaClock className="text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">TIME</p>
              <p className="font-medium">{event.time}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FaUserAlt className="text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">HOST</p>
              <p className="font-medium">{event.hostName}</p>
            </div>
          </div>
        </div>

        {/* VIRTUAL ACCESS SECTION */}
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 mb-6 shadow-sm border border-gray-200 dark:border-gray-600">
          <h4 className="font-bold text-lg mb-3 flex items-center">
            <RiEarthLine className="mr-2 text-blue-500" />
            VIRTUAL ACCESS
          </h4>

          {!isValidEvent ? (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
              <div className="flex items-start space-x-2">
                <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">
                    INCOMPLETE VIRTUAL SETUP
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    This event is missing required virtual event details
                  </p>
                </div>
              </div>
            </div>
          ) : meetingLink ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <div className="truncate">
                  <p className="text-sm text-gray-500 dark:text-gray-400">JOINING LINK</p>
                  <a 
                    href={meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline truncate block"
                  >
                    {meetingLink}
                  </a>
                </div>
                <button 
                  onClick={() => copyToClipboard(meetingLink)}
                  className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <FaCopy />
                </button>
              </div>

              {requiresPassword && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <div className="flex items-start space-x-2">
                    <FaLock className="text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                        PASSWORD REQUIRED
                      </p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        {event.virtualEventDetails?.virtualPassword}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {event.virtualEventDetails?.platform === 'zoom' && event.virtualEventDetails?.meetingId && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">MEETING ID</p>
                    <p className="font-mono font-medium">{event.virtualEventDetails.meetingId}</p>
                  </div>
                  {event.virtualEventDetails.passcode && (
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">PASSCODE</p>
                      <p className="font-mono font-medium">{event.virtualEventDetails.passcode}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <p>VIRTUAL ACCESS DETAILS WILL BE AVAILABLE SOON</p>
            </div>
          )}
        </div>

        {/* QR CODE SECTION */}
        {meetingLink && (
          <div className="text-center">
            <div className="inline-block p-2 bg-white rounded-lg border border-gray-200 dark:border-gray-700">
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(meetingLink)}&format=png&qzone=2&color=6366F1`}
                alt="VIRTUAL EVENT QR CODE"
                width={150}
                height={150}
                className="rounded-lg"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
              <FaQrcode className="mr-2" /> SCAN TO JOIN
            </p>
          </div>
        )}

        {/* JOIN BUTTON */}
        {meetingLink && (
          <div className="mt-6">
            <Button
              fullWidth
              variant="contained"
              href={meetingLink}
              target="_blank"
              sx={{
                py: 1.5,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                ':hover': { 
                  background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              JOIN VIRTUAL EVENT
            </Button>
          </div>
        )}
      </div>

      {/* DECORATIVE ELEMENTS */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/10 rounded-full -ml-16 -mb-16"></div>
    </motion.div>
  );
};