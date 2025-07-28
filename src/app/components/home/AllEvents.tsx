'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt, FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import Toast from '../../../components/ui/Toast';
import { BASE_URL } from '../../../../config';
import { formatPrice } from '@/utils/formatPrice';
import { formatEventDate } from '@/utils/formatDateTime';
import { SlidersHorizontal } from 'lucide-react';

interface TicketType {
  name: string;
  price: string;
  quantity: string;
  sold: string;
}

interface Event {
  id: string;
  title: string;
  slug: string;
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
  const [toast, setToast] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/v1/events/all-events`);
        setEvents(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
        setToast({ type: 'error', message: 'Failed to load events. Please try again later.' });
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, []);

  const handleViewDetails = (eventSlug: string) => {
    const link = `${window.location.origin}/${eventSlug}`;
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

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen dark:bg-gradient-to-br bg-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8" id="events">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      
      {/* Header section */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Discover Experiences
          </span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Upcoming Events
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Find your next unforgettable experience from our curated collection of events
        </p>
      </div>

      {/* Filter controls */}
      <div className="lg:max-w-7xl mx-auto mb-8">
        <div className={`sticky top-4 z-20 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 transition-all duration-300 ${
          isFilterOpen ? 'ring-2 ring-blue-500/20' : ''
        }`}>
          <button
            className="flex items-center justify-between w-full md:hidden "
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <div className="flex items-center space-x-3">
              <SlidersHorizontal className="text-blue-600 dark:text-blue-400 text-lg" />
              <span className="font-semibold text-gray-900 dark:text-white">Filters</span>
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {isFilterOpen ? 'Hide' : 'Show'}
            </span>
          </button>

          <div className={`${isFilterOpen ? 'block' : 'hidden md:grid'} grid-cols-1 md:grid-cols-3 gap-4 mt-3`}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-lg" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                className="pl-12 w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white text-gray-900 transition-all duration-200"
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              />
            </div>
            
            <input
              type="text"
              placeholder="Location"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white text-gray-900 transition-all duration-200"
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            />
            
            <input
              type="number"
              placeholder="Max price"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white text-gray-900 transition-all duration-200"
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Events grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden h-96 animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentEvents.map((event) => (
              <div key={event.id} className="flex flex-col justify-between bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800">
                <div className="group">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={event.image || '/placeholder.jpg'}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-xl font-bold leading-tight">{event.title}</h3>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-between">
                    <div className=" space-y-4">
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
                        {event.description}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center text-gray-700 dark:text-gray-400">
                          <FaMapMarkerAlt className="text-blue-500 mr-3 flex-shrink-0 text-lg" />
                          <span className="truncate text-sm font-medium">{event.location}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-700 dark:text-gray-400">
                          <FaCalendarAlt className="text-blue-500 mr-3 flex-shrink-0 text-lg" />
                          <span className="text-sm font-medium">{formatEventDate(event.date)}</span>
                        </div>

                        <div className="flex items-center text-gray-700 dark:text-gray-400">
                          <FaTicketAlt className="text-blue-500 mr-3 flex-shrink-0 text-lg" />
                          <span className="text-sm font-medium">
                            From {formatPrice(Math.min(...event.ticketType.map(ticket => parseFloat(ticket.price))), '₦')}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <button 
                  onClick={() => handleViewDetails(event.slug)}
                  className=" mx-6 mb-6 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded shadow-inner transition-all "
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No results message */}
        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No events found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Try adjusting your search filters to find what you&apos;re looking for.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredEvents.length > eventsPerPage && (
        <div className="max-w-7xl mx-auto mt-12 flex flex-col items-center">
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 font-semibold ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                  : 'bg-white text-blue-600 hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700'
              }`}
            >
              &lt;
            </button>

            {[...Array(totalPages)].map((_, index) => {
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
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 font-semibold ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 font-semibold ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                  : 'bg-white text-blue-600 hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700'
              }`}
            >
              &gt;
            </button>
          </div>
          
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
            Showing {indexOfFirstEvent + 1}-{Math.min(indexOfLastEvent, filteredEvents.length)} of {filteredEvents.length} events
          </div>
        </div>
      )}
    </section>
  );
};

export default AllEvents;