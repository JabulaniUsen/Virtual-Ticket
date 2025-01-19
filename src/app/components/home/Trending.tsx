"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFire, FaTicketAlt, FaClock } from 'react-icons/fa';
import Image from 'next/image';
// import Loader from '@/app/components/loader/Loader';
import { BASE_URL } from '../../../config';
import { useRouter } from 'next/navigation';
import { formatPrice } from '../../../utils/formatPrice';
import Loader from '../../../components/ui/loader/Loader';
     

interface TicketType {
  name: string;
  price: string;
  quantity: string;
  sold: string;
}

interface TrendingEvent {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  ticketType: TicketType[];
  soldQuantityRatio: number;
}

const Trending = () => {
  const [trendingEvents, setTrendingEvents] = useState<TrendingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTrendingEvents = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/v1/events/all-events`);
        setTrendingEvents(response.data.events.slice(0, 6));
      } catch (error) {
        console.error('Error fetching trending events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingEvents();
  }, []);

  const calculateSoldPercentage = (event: TrendingEvent) => {
    const totalSold = event.ticketType.reduce((acc, ticket) => acc + parseInt(ticket.sold), 0);
    const totalQuantity = event.ticketType.reduce((acc, ticket) => acc + parseInt(ticket.quantity), 0);
    return Math.round((totalSold / totalQuantity) * 100);
  };

  const getTicket = async (eventId: string) => {
    try {
      setNavigating(true);
     
      
      router.push(`/events/${eventId}`);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setNavigating(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-900" id='trending'>
      {navigating && <Loader />}  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaFire className="text-3xl text-orange-500 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Trending Events
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Don&apos;t miss out on our hottest virtual events
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingEvents.map((event, index) => (
              <div
                key={event.id}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl 
                         transform hover:-translate-y-2 transition-all duration-300
                         animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute top-2 right-2 z-10 bg-orange-500 text-white px-3 py-1 rounded-full 
                                flex items-center gap-1 text-sm font-semibold">
                    <FaFire />
                    <span>{calculateSoldPercentage(event)}% Sold</span>
                  </div>
                  <div className="relative w-full h-full">
                    <Image
                      src={event.image}
                      alt={event.title}
                      className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                      fill
                      sizes="100vw" 
                      priority 
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Event Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <FaTicketAlt className="text-blue-500" />
                        <span className="text-sm">
                        From {formatPrice(Math.min(...event.ticketType.map(t => parseFloat(t.price))))}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <FaClock className="text-blue-500" />
                      <span className="text-sm">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${calculateSoldPercentage(event)}%` }}
                    />
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={() => getTicket(event.id)}
                    disabled={navigating}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg
                               transform transition-all duration-200 hover:scale-105 active:scale-100
                               disabled:opacity-50 disabled:cursor-not-allowed
                               flex items-center justify-center space-x-2"
                  >
                    {navigating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <span>Get Tickets</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Trending;
