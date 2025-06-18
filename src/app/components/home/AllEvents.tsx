'use client';
import React, { useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt, FaFilter, FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAllEvents } from '@/hooks/useEvents';
import { formatPrice } from '@/utils/formatPrice';
import { formatEventDate } from '@/utils/formatDateTime';
import Toast from '@/components/ui/Toast';
import { Event } from '@/types/event';

const AllEvents = () => {
  const { data: events, isLoading } = useAllEvents();
  const [filters, setFilters] = useState({
    location: '',
    maxPrice: '',
    searchTerm: '',
    date: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [toast, setToast] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFading, setIsFading] = useState(false);
  const eventsPerPage = 6;

  const handleViewDetails = (eventSlug: string): void => {
    window.location.href = `${window.location.origin}/${eventSlug}`;
  };

  const filteredEvents = (events || []).filter((event: Event) => {
    const lowestPrice = Math.min(...event.ticketType.map((ticket) => parseFloat(ticket.price)));
    const eventDate = new Date(event.date);
    
    return (
      (!filters.location || event.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.maxPrice || lowestPrice <= parseFloat(filters.maxPrice)) &&
      (!filters.searchTerm || event.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
      (!filters.date || eventDate >= new Date(filters.date))
    );
  });

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handlePageChange = (pageNumber: number): void => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentPage(pageNumber);
      document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
      setIsFading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8" id='events'>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-blue-50/20 to-transparent dark:from-blue-950/10"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-t from-purple-50/20 to-transparent dark:from-purple-950/10"></div>
      </div>

      <div className="max-w-7xl mx-auto mb-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6"
        >
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Discover Experiences
          </span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
        >
          <span className="relative inline-block">
            <span className="relative z-10">Upcoming Events</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-200/60 dark:bg-blue-900/40 -z-0"></span>
          </span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Find your next unforgettable experience from our curated collection of events
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`sticky top-4 z-20 mb-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 transition-all duration-300 ${
          isFilterOpen ? 'p-6' : 'p-4'
        }`}
      >
        <button
          className="flex items-center justify-between w-full md:hidden"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <div className="flex items-center space-x-2">
            <FaFilter className="text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-gray-900 dark:text-white">Filters</span>
          </div>
          <span className="text-gray-500 dark:text-gray-400">
            {isFilterOpen ? 'Hide' : 'Show'}
          </span>
        </button>

        <div className={`${isFilterOpen ? 'block' : 'hidden md:grid'} grid-cols-1 md:grid-cols-4 gap-4`}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
          </div>
          
          <input
            type="text"
            placeholder="Location..."
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
          />
          
          <input
            type="number"
            placeholder="Max price..."
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
          />
          
          <input
            type="date"
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
          />
        </div>
      </motion.div>

      <div className={`max-w-7xl mx-auto ${isFading ? 'opacity-50' : 'opacity-100'} transition-opacity duration-300`}>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index: number) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden h-96 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentEvents.map((event: Event, index: number) => {
              const isOdd = index % 2 !== 0;
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative group ${isOdd ? 'md:transform md:-translate-y-8' : ''}`}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                  
                  <div className="relative h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300">
                    <div className="relative h-60 overflow-hidden">
                      <Image
                        src={typeof event.image === 'string' ? event.image : '/placeholder.jpg'}
                        alt={event.title}
                        fill
                        className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-xl font-bold">{event.title}</h3>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center text-gray-700 dark:text-gray-400">
                          <FaMapMarkerAlt className="text-blue-500 mr-2 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-700 dark:text-gray-400">
                          <FaCalendarAlt className="text-blue-500 mr-2 flex-shrink-0" />
                          <span>{formatEventDate(event.date)}</span>
                        </div>

                        <div className="flex items-center text-gray-700 dark:text-gray-400">
                          <FaTicketAlt className="text-blue-500 mr-2 flex-shrink-0" />
                          <span>
                            From {formatPrice(Math.min(...event.ticketType.map(ticket => parseFloat(ticket.price))), '₦')}
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={() => event.slug && handleViewDetails(event.slug)}
                        disabled={!event.slug}
                        className={`w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg ${!event.slug ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!isLoading && filteredEvents.length === 0 && (
          <div className="col-span-full text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No events found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search filters to find what you&apos;re looking for.
              </p>
            </div>
          </div>
        )}
      </div>

      {filteredEvents.length > eventsPerPage && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-col items-center"
        >
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-blue-600 hover:bg-blue-100 shadow-md hover:shadow-lg'
              }`}
            >
              &lt;
            </button>

            {[...Array(totalPages)].map((_, index: number) => {
              const pageNumber = index + 1;
              const isCurrent = pageNumber === currentPage;
              const isNearCurrent = Math.abs(pageNumber - currentPage) <= 1;
              const isFirstOrLast = pageNumber === 1 || pageNumber === totalPages;

              if (!isNearCurrent && !isFirstOrLast) {
                if (pageNumber === 2 || pageNumber === totalPages - 1) {
                  return <span key={index} className="text-gray-500 px-2">...</span>;
                }
                return null;
              }

              return (
                <button
                  key={index}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white font-bold shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-blue-600 hover:bg-blue-100 shadow-md hover:shadow-lg'
              }`}
            >
              &gt;
            </button>
          </div>
          
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Showing {indexOfFirstEvent + 1}-{Math.min(indexOfLastEvent, filteredEvents.length)} of {filteredEvents.length} events
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AllEvents;