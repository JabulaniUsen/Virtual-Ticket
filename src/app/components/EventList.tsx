'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Toast } from './Toast';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '@/components/ui/loader/Loader';

interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  price: string;
  ticketType: { price: string; name: string; quantity: string; sold: string; }[];
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
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
          `https://v-ticket-backend.onrender.com/api/v1/events/my-events`, {
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

  
  const copyLink = (eventId: string) => {
    const link = `${window.location.origin}/events/${eventId}`;
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
        `https://v-ticket-backend.onrender.com/api/v1/events/${eventID}`,
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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4 lg:ml-[3rem] md:ml-[3rem] sm:ml-[0rem]">
      {(loading || isNavigating) && <Loader />}
      
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName="Event"
      />

      {showToast && (
        <Toast
          type={toastProps.type}
          message={toastProps.message}
          onClose={() => setShowToast(false)}
        />
      )}

      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            className="relative bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-900"
          >
            <Image
              src={event.image}
              alt={event.title}
              width={300}
              height={150}
              className="w-full h-32 object-cover"
              unoptimized
            />

            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{event.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                <span>Date: {new Date(event.date).toLocaleString()}</span>
                <br />
                <span>Location: {event.location}</span>
                <br />
                <span>
                  Price: 
                  {event.ticketType && event.ticketType.length > 0 ? (
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ₦{Math.min(...event.ticketType.map(ticket => parseFloat(ticket.price))).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-red-600"> ₦ 0.00</span>
                  )}
                </span>


              </p>
            </div>

            <div className="absolute top-2 right-2 group">
            <Link href={`/analytics?id=${event.id}`} passHref>
              <div className="relative group">
                <span className="text-blue-500 text-xl cursor-pointer opacity-75 group-hover:opacity-100 transition-opacity ">
                  
                  <button className='flex word-2 px-4 py-2 text-sm bg-gray-800 font-medium text-white  dark:border-red-400 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-900 transition-colors'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path d="M3 13h4v4H3zm6-7h4v11H9zm6-3h4v14h-4z" fill="none" stroke="#fff" strokeWidth="2"/>
                  </svg>

                    View 
                  </button>
                 
                </span>
              
              </div>
            </Link>
          </div>

            <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700">
              <button
                onClick={() => copyLink(event.id)}
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-colors"
              >
                Copy Link
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                onClick={() => handleNavigation(`update/${event.id}`)}
              >
                Edit
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-transparent border border-red-600 dark:border-red-400 rounded-lg hover:bg-red-600 hover:text-white dark:hover:bg-red-400 dark:text-white transition-colors"
                onClick={() => handleDeleteClick(event.id)}
              >
                Delete
              </button>


            </div>

            {/* <EventForm
              open={formOpen}
              onClose={() => {
                setFormOpen(false);
                setEditingEvent(null);
              }}
              eventId={editingEvent?.id}
              initialData={editingEvent || undefined}
              onEventSubmit={handleEventSubmit}
            /> */}
          </div>
        ))
      )}
    </div>
  );
};

export default EventList;
