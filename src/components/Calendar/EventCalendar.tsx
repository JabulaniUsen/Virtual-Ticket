"use client";

import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaExternalLinkAlt } from 'react-icons/fa';
import { Calendar } from 'react-calendar';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
}

const EventCalendar = () => {
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://v-ticket-backend.onrender.com/api/v1/events/all-events');
        setEvents(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Function to check if a date has events
  const hasEvents = (date: Date) => {
    return events.some(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Function to get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleDayClick = (value: Date) => {
    const dateEvents = getEventsForDate(value);
    if (dateEvents.length > 0) {
      setSelectedEvents(dateEvents);
      setShowModal(true);
    }
  };

  const EventModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Events on {selectedEvents[0]?.date ? new Date(selectedEvents[0].date).toLocaleDateString() : ''}
          </h3>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          {selectedEvents.map((event) => (
            <div 
              key={event.id}
              className="border-b dark:border-gray-700 pb-4 last:border-0"
            >
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {event.title}
              </h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>🕒 {new Date(event.date).toLocaleDateString()} at {event.time}</p>
                <p>📍 {event.venue}</p>
                <p className="line-clamp-2">{event.description}</p>
              </div>
              <button
                onClick={() => {
                  router.push(`/events/${event.id}`);
                  setShowModal(false);
                }}
                className="mt-3 flex items-center text-blue-600 hover:text-blue-700 
                         dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                View Details 
                <FaExternalLinkAlt className="ml-2 text-sm" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed right-4 top-24 z-50">
      {/* Calendar Icon Button */}
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg 
                   transform transition-transform duration-200 hover:scale-110
                   flex items-center justify-center"
        aria-label="Toggle Calendar"
      >
        <FaCalendarAlt className="text-2xl" />
      </button>

      {/* Calendar Popup */}
      {showCalendar && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 animate-fade-in">
          <Calendar
            className="rounded-lg border-none shadow-sm"
            tileClassName={({ date }) => 
              hasEvents(date) ? 
              'has-events bg-blue-100 dark:bg-blue-900 rounded-full font-bold' : ''
            }
            tileContent={({ date }) => {
              const dateEvents = getEventsForDate(date);
              return dateEvents.length > 0 ? (
                <div className="relative">
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white 
                                 rounded-full w-4 h-4 text-xs flex items-center justify-center">
                    {dateEvents.length}
                  </span>
                </div>
              ) : null;
            }}
            onClickDay={handleDayClick}
          />
          
          {loading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 
                          flex items-center justify-center rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      )}

      {/* Event Details Modal */}
      {showModal && <EventModal />}
    </div>
  );
};

export default EventCalendar; 