'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt } from 'react-icons/fa';
import Image from 'next/image';
import Toast from '../ui/Toast';

interface TicketType {
  name: string;
  price: string;
  quantity: string;
  sold: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  ticketType: TicketType[];
}

const AllEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    maxPrice: '',
    searchTerm: '',
    date: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [toast, toasts] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://v-ticket-backend.onrender.com/api/v1/events/all-events');
        setEvents(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
        if (axios.isAxiosError(error)) {
          if (!error.response) {
            toasts({ type: 'error', message: 'Network error. Please check your connection.' });
          } else {
            toasts({ type: 'error', message: 'Something went wrong. Please try again later.' });
          }
        } else {
          toasts({ type: 'error', message: 'An unexpected error occurred.' });
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, []);
  

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleViewDetails = (eventId: string) => {
    const link = `${window.location.origin}/events/${eventId}`;
    window.location.href = link;
  };

  const filteredEvents = events.filter(event => {
    const lowestPrice = Math.min(...event.ticketType.map(ticket => parseFloat(ticket.price)));
    const eventDate = new Date(event.date);
    
    return (
      (!filters.location || event.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.maxPrice || lowestPrice <= parseFloat(filters.maxPrice)) &&
      (!filters.searchTerm || event.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
      (!filters.date || eventDate >= new Date(filters.date))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 py-12 px-4 sm:px-6 lg:px-8 p-3 mt-2" id='events'>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => toasts(null)} />}
      {/* Filter Section */}
      <div className={`
        sticky top-16 z-30 bg-white dark:bg-gray-800 shadow-lg
        transition-all duration-300 ${isScrolled ? 'py-3' : 'py-6'}
      `}>
        {/* Mobile Filter Toggle */}
        <button
          className="md:hidden w-full px-4 py-2 bg-blue-600 text-white rounded-lg mb-4"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Filter Controls */}
        <div className={`
          md:grid md:grid-cols-4 gap-4 px-6 mt-3
          ${isFilterOpen ? 'block' : 'hidden md:grid'}
        `}>
          <input
            type="text"
            placeholder="Search events..."
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
          />
          
          <input
            type="text"
            placeholder="Location..."
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
          />
          
          <input
            type="number"
            placeholder="Max price..."
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
          />
          
          <input
            type="date"
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
        {loading ? (
          <div className="col-span-full flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredEvents.map((event, index) => (
          <div
            key={event.id}
            className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl 
                     transform hover:-translate-y-2 transition-all duration-300
                     opacity-0 animate-fade-in"
            style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                width={500}
                height={500}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white text-xl font-bold">{event.title}</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                {event.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{event.location}</span>
                </div>
                
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <FaCalendarAlt className="mr-2" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <FaTicketAlt className="mr-2" />
                  <span>From ₦{Math.min(...event.ticketType.map(ticket => parseFloat(ticket.price)))}</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg
             transform transition-transform duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={() => handleViewDetails(event.id)}
             >
                View Details
              </button>
            </div>
          </div>
        ))}

        {!loading && filteredEvents.length === 0 && (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">
            No events found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEvents; 