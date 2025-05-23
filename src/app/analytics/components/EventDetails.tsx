import React from 'react';
import { format } from 'date-fns';
import { Event } from '@/types/analytics';
import { FiMapPin, FiTag, FiClock, FiInfo } from 'react-icons/fi';

interface EventDetailsProps {
  event: Event;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  const formattedDate = event?.date 
    ? format(new Date(event.date), 'EEEE, MMMM do yyyy')
    : 'Date not set';

  const formattedTime = event?.date
    ? format(new Date(event.date), 'h:mm a')
    : 'Time not set';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {event.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              {event.description || 'No description provided'}
            </p>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-lg flex items-center">
            <FiInfo className="mr-2" />
            <span className="font-medium">Event Details</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <FiMapPin className="text-gray-500 dark:text-gray-400 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                <p className="text-gray-900 dark:text-white">
                  {event.location || 'Location not specified'}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <FiClock className="text-gray-500 dark:text-gray-400 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</h3>
                <p className="text-gray-900 dark:text-white">
                  {formattedDate} at {formattedTime}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <FiTag className="text-gray-500 dark:text-gray-400 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ticket Types</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {event.ticketType?.length ? (
                    event.ticketType.map((ticket, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      >
                        {ticket.name} - ${ticket.price.toLocaleString()}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-900 dark:text-white">No ticket types</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};