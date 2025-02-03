'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Toast } from './Toast';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '@/components/ui/loader/Loader';
import { formatPrice } from '@/utils/formatPrice';
import { BASE_URL } from '../../config';


interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  price: string;
  ticketType: { price: string; name: string; quantity: string; sold: string; }[];
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  message?: string;
  confirmText?: string;
  confirmButtonClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Delete {itemName}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Are you sure you want to delete this {itemName.toLowerCase()}? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const router = useRouter();
  const [toastProps, setToastProps] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>({
    type: 'success',
    message: '',
  });


  const toast = (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string
  ) => {
    setToastProps({ type, message });
    setShowToast(true);
  };

  const handleAxiosError = useCallback((error: unknown, defaultMessage: string) => {
    let errorMessage = defaultMessage;
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    toast('error', errorMessage);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
      if (!token) {
        toast('error', 'Authentication token is missing. Please log in.');
        return;
      }

        const response = await axios.get(
          `${BASE_URL}api/v1/events/my-events`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const eventData = response.data?.events;
        if(response.status === 401){
          toast('error', 'Unauthorized. Please log in again.');
          router.push('/auth/login');
        }
  
        if (Array.isArray(eventData)) {
          const sanitizedData = eventData.map((event) => {
            let price = event.price;
          
            if (typeof price === 'string') {
              const numericPrice = parseFloat(price);
              price = isNaN(numericPrice) || numericPrice < 0 ? '0' : numericPrice.toString(); 
            }
          
            return {
              ...event,
              price,
            };
          });
          
          setEvents(sanitizedData);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        handleAxiosError(error, 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, [handleAxiosError, router]);

 
  const copyLink = (eventSlug: string) => {
    const link = `${window.location.origin}/${eventSlug}`;
    navigator.clipboard.writeText(link);
    toast('success', `Event link copied: ${link}`);
  };
  // const token = localStorage.getItem('token');
  // console.log(token);

  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    setLoading(true);
    await deleteEvent(eventToDelete);
    setDeleteModalOpen(false);
    setEventToDelete(null);
    setLoading(false);
  };

  const handleNavigation = (path: string) => {
    setIsNavigating(true);
    router.push(path);
  };

  const deleteEvent = async (eventID: string) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast('error', 'Your session has expired. Please log in again.');
      router.push('/auth/login');
      return;
    }
  
    try {
      const response = await axios.delete(
        `${BASE_URL}api/v1/events/${eventID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventID));
        toast('success', 'Event deleted successfully.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast('error', 'Unauthorized. Please log in again.');
          router.push('/auth/login');
        } else {
          toast('error', error.response?.data?.message || 'An error occurred while deleting the event.');
        }
      } else {
        toast('error', 'An unexpected error occurred. Please try again.');
      }
    }
  };
  



  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-2 sm:p-4 ml-0 sm:ml-[2rem]">
      {(loading || isNavigating) && <Loader />}
      
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName="Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        confirmButtonClass="bg-red-500 hover:bg-red-600"
      />

      {showToast && (
        <Toast
          type={toastProps.type}
          message={toastProps.message}
          onClose={() => setShowToast(false)}
        />
      )}

      {loading ? (
        <div className="col-span-full flex justify-center items-center min-h-[200px]">
          <div className="text-center p-8 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400 animate-pulse" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 4v1M4 12h2m10-10h2m-6 14v1"/>
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Loading events...</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Please wait while we fetch your events.</p>
          </div>
        </div>
            ) : events.length === 0 ? (
        <div className="col-span-full flex justify-center items-center min-h-[200px]">
          <div className="text-center p-8 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6m-3 9h3m-6 0h.01M9 12h.01M9 15h.01"/>
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">No events found</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Get started by creating your first event.</p>
          </div>
        </div>
      ) : (
        events.map((event) => (
          <div
        key={event.id}
        className="relative bg-white dark:bg-gray-800 shadow-[0px_3px_5px_3px_rgba(0,0,0,0.2)] rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-900 flex flex-col"
          >
        <div className="h-[140px] sm:h-[160px] w-full">
          <Image
            src={event.image}
            alt={event.title}
            width={300}
            height={150}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>

        <div className="p-3 sm:p-6 flex-grow">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 line-clamp-2">{event.title}</h3>
          <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 space-y-1 sm:space-y-2">
            <p>
          <span className="font-medium">Date: </span>
          {new Date(event.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}, {event.time}
            </p>
            <p>
          <span className="font-medium">Location: </span>
          {event.location}
            </p>
            <p className="flex items-center gap-2">
          <span className="font-medium">Price: </span>
          {event.ticketType && event.ticketType.length > 0 ? (
            <span className="font-semibold text-green-600 dark:text-green-400">
              {formatPrice(Math.min(...event.ticketType.map(ticket => parseFloat(ticket.price))), '₦')}
            </span>
          ) : (
            <span className="text-red-600">FREE</span>
          )}
            </p>
          </div>
        </div>

        <div className="absolute top-2 right-2">
          <Link href={`/analytics?id=${event.id}`} passHref>
            <button className="flex items-center gap-1 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gray-800 font-medium text-white rounded-lg hover:bg-gray-900 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
            <path d="M3 13h4v4H3zm6-7h4v11H9zm6-3h4v14h-4z" fill="none" stroke="#fff" strokeWidth="2"/>
          </svg>
          View
            </button>
          </Link>
        </div>

        <div className="flex justify-between items-center p-2 sm:p-4 bg-gray-100 dark:bg-gray-700 mt-auto">
          <button
            onClick={() => copyLink(event.slug)}
            className="flex items-center px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-colors"
          >
            Copy
          </button>
          <button
            className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            onClick={() => handleNavigation(`update/${event.id}`)}
          >
            Edit
          </button>
          <button
            className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 bg-transparent border border-red-600 dark:border-red-400 rounded-lg hover:bg-red-600 hover:text-white dark:hover:bg-red-400 dark:hover:text-gray-900 transition-colors"
            onClick={() => handleDeleteClick(event.id)}
          >
            Delete
          </button>
        </div>
          </div>
        ))
      )}
        </div>
  );
};

export default EventList;
