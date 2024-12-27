'use client';

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import ToggleMode from '../../components/ui/mode/toggleMode';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../../components/ui/Toast';
import { BiImageAdd, BiSave, BiArrowBack } from 'react-icons/bi';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaTrash } from 'react-icons/fa';

type TicketType = {
  name: string;
  sold: string;
  price: string;
  quantity: string;
};

type Event = {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  ticketType: TicketType[];
  userId: string;
  createdAt: string;
  updatedAt: string;
};

function Update() {
  const [event, setEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Event | null>(null);
  const { eventId } = useParams();
  // const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState<{
    type: 'success' | 'error';
    message: string;
  }>({
    type: 'success',
    message: '',
  });
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const toast = (type: 'success' | 'error', message: string) => {
    setToastProps({ type, message });
    setShowToast(true);
  };

  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(
            `https://v-ticket-backend.onrender.com/api/v1/events/${eventId}`
          );
          setEvent(response.data.event);
          setFormData(response.data.event);
        } catch (error) {
          const axiosError = error as AxiosError;
          console.error('Error fetching event:', {
            message: axiosError.message,
            stack: axiosError.stack,
            response: axiosError.response?.data || 'No response data',
          });
        }
      };

      fetchEvent();
    }
  }, [eventId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
    index?: number
  ) => {
    if (!formData) return;
  
    if (index !== undefined && field === 'ticketType') {
      const updatedTicketTypes = [...(formData.ticketType || [])];
      updatedTicketTypes[index] = {
        ...updatedTicketTypes[index],
        [e.target.name]: e.target.value,
      };
      setFormData({ ...formData, ticketType: updatedTicketTypes });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };
  

  const handleAddTicketType = () => {
    if (!formData) return;
    const newTicket = { name: '', sold: '', price: '', quantity: '' };
    setFormData({ ...formData, ticketType: [...formData.ticketType, newTicket] });
  };

  const handleDeleteTicketType = (index: number) => {
    if (!formData) return;
    const updatedTickets = formData.ticketType.filter((_, i) => i !== index);
    setFormData({ ...formData, ticketType: updatedTickets });
  };
  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast('error', 'Please upload a valid image file');
        return;
      }
      
      // Clean up previous preview
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData) {
      toast('error', 'No event data to update.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast('error', 'Authentication token is missing. Please log in.');
        return;
      }

      // Create FormData object
      const updateFormData = new FormData();
      updateFormData.append('title', formData.title);
      updateFormData.append('description', formData.description);
      updateFormData.append('date', new Date(formData.date).toISOString());
      updateFormData.append('location', formData.location);
      updateFormData.append('ticketType', JSON.stringify(formData.ticketType));

      // Add new image if selected
      if (imageFile) {
        updateFormData.append('file', imageFile);
      }
  
      const response = await axios.patch(
        `https://v-ticket-backend.onrender.com/api/v1/events/${eventId}`,
        updateFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      toast('success', 'Event updated successfully!');
      console.log('Update response:', response.data);
      
      // Redirect to dashboard after successful update
      router.push('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error updating event:', {
          message: error.message,
          response: error.response?.data
        });
  
        if (error.response?.status === 401) {
          toast('error', 'Unauthorized. Redirecting to login...');
          router.push('/auth/login');
          return;
        }
  
        const errorMessage =
          error.response?.data && typeof error.response.data === 'object'
            ? (error.response.data as Record<string, string>).message || 'An error occurred'
            : 'Failed to update the event. Please try again.';
        toast('error', errorMessage);
      } else {
        console.error('Unexpected error:', error);
        toast('error', 'An unexpected error occurred. Please try again.');
      }
    }
  };
  
  

  // Clean up image preview on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-8 px-4 sm:px-6 lg:px-8">
      <AnimatePresence>
        {showToast && (
          <Toast
            type={toastProps.type}
            message={toastProps.message}
            onClose={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="max-w-5xl mx-auto space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <motion.button
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            whileHover={{ scale: 1.05 }}
          >
            <BiArrowBack className="text-xl" />
            <span>Back to Dashboard</span>
          </motion.button>
          <ToggleMode />
        </div>

        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative group h-[200px] md:h-[300px] w-full rounded-2xl overflow-hidden bg-gradient-to-r from-purple-100 to-blue-100 dark:from-gray-700 dark:to-gray-600">
            {(imagePreview || event?.image) && (
              <Image
                src={imagePreview || event?.image || '/default-image.jpg'}
                alt="Event preview"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
            )}
            <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <BiImageAdd className="text-5xl text-white mb-2" />
              <span className="text-white text-lg font-medium">Change Event Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-white via-purple-50 to-blue-50 dark:from-gray-800 dark:via-gray-800/50 dark:to-gray-900 rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-purple-100 dark:border-purple-900/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 text-center mb-12"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Update Event
          </motion.h1>

          {event ? (
           <form onSubmit={handleSubmit} className="space-y-10">
           {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                className="space-y-6"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.label className="block" whileHover={{ scale: 1.01 }}>
                  <span className="text-purple-700 dark:text-purple-300 font-medium mb-2 block">
                    Event Title
                  </span>
                  <input
                    type="text"
                    value={formData?.title || ''}
                    onChange={(e) => handleInputChange(e, 'title')}
                    className="p-4 mt-1 block w-full rounded-xl border-2 border-purple-100 dark:border-purple-900/50 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-900 dark:bg-gray-800 dark:text-white transition-all duration-200"
                  />
                </motion.label>
          
                <motion.label className="block" whileHover={{ scale: 1.01 }}>
                  <span className="text-purple-700 dark:text-purple-300 font-medium mb-2 block">
                    Description
                  </span>
                  <textarea
                    value={formData?.description || ''}
                    onChange={(e) => handleInputChange(e, 'description')}
                    rows={4}
                    className="p-4 mt-1 block w-full rounded-xl border-2 border-purple-100 dark:border-purple-900/50 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-900 dark:bg-gray-800 dark:text-white transition-all duration-200"
                  />
                </motion.label>
              </motion.div>
          
              <motion.div
                className="space-y-6"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.label className="block" whileHover={{ scale: 1.01 }}>
                  <span className="text-purple-700 dark:text-purple-300 font-medium mb-2 block flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-500" /> Date
                  </span>
                  <input
                    type="date"
                    value={formData?.date || ''}
                    onChange={(e) => handleInputChange(e, 'date')}
                    className="p-4 mt-1 block w-full rounded-xl border-2 border-purple-100 dark:border-purple-900/50 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-900 dark:bg-gray-800 dark:text-white transition-all duration-200"
                  />
                </motion.label>
          
                <motion.label className="block" whileHover={{ scale: 1.01 }}>
                  <span className="text-purple-700 dark:text-purple-300 font-medium mb-2 block flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" /> Location
                  </span>
                  <input
                    type="text"
                    value={formData?.location || ''}
                    onChange={(e) => handleInputChange(e, 'location')}
                    className="p-4 mt-1 block w-full rounded-xl border-2 border-purple-100 dark:border-purple-900/50 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-900 dark:bg-gray-800 dark:text-white transition-all duration-200"
                  />
                </motion.label>
              </motion.div>
            </div>
         
           {/* Ticket Types Section */}
           <motion.div
             className="space-y-6"
             initial={{ y: 50, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.5 }}
           >
             <div className="flex justify-between items-center">
               <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 flex items-center">
                 <FaTicketAlt className="mr-2 text-blue-500" />
                 Ticket Types
               </h2>
               <motion.button
                 type="button"
                 onClick={handleAddTicketType}
                 className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-200"
                 whileHover={{
                   scale: 1.05,
                   boxShadow: '0 20px 25px -5px rgba(147, 51, 234, 0.2)',
                 }}
                 whileTap={{ scale: 0.98 }}
               >
                 <span>Add Ticket Type</span>
               </motion.button>
             </div>
         
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {formData?.ticketType?.map((ticket, index) => (
                 <motion.div
                   key={index}
                   className="relative p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border-2 border-purple-100 dark:border-purple-900/50"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   whileHover={{
                     y: -4,
                     boxShadow: '0 20px 25px -5px rgba(147, 51, 234, 0.1)',
                   }}
                   transition={{ duration: 0.2 }}
                 >
                   <motion.button
                     type="button"
                     onClick={() => handleDeleteTicketType(index)}
                     className="absolute top-3 right-3 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                     whileHover={{ scale: 1.2 }}
                     whileTap={{ scale: 0.9 }}
                   >
                     <FaTrash />
                   </motion.button>
         
                   <div className="space-y-4">
                     <input
                       type="text"
                       name="name"
                       placeholder="Ticket Name"
                       value={ticket.name}
                       onChange={(e) => handleInputChange(e, 'ticketType', index)}
                       className="p-4 block w-full rounded-xl border-2 border-purple-100 dark:border-purple-900/50 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-900 dark:bg-gray-800 dark:text-white transition-all duration-200"
                     />
         
                     <div className="grid grid-cols-2 gap-4">
                       <input
                         type="number"
                         name="price"
                         placeholder="Price"
                         value={ticket.price}
                         onChange={(e) => handleInputChange(e, 'ticketType', index)}
                         className="p-4 block w-full rounded-xl border-2 border-purple-100 dark:border-purple-900/50 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-900 dark:bg-gray-800 dark:text-white transition-all duration-200"
                       />
                       <input
                         type="number"
                         name="quantity"
                         placeholder="Quantity"
                         value={ticket.quantity}
                         onChange={(e) => handleInputChange(e, 'ticketType', index)}
                         className="p-4 block w-full rounded-xl border-2 border-purple-100 dark:border-purple-900/50 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-900 dark:bg-gray-800 dark:text-white transition-all duration-200"
                       />
                     </div>
                   </div>
                 </motion.div>
               ))}
             </div>
           </motion.div>
         
           {/* Submit Button */}
           <motion.button
             type="submit"
             className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-200 font-medium"
             whileHover={{
               scale: 1.02,
               boxShadow: '0 20px 25px -5px rgba(147, 51, 234, 0.2)',
             }}
             whileTap={{ scale: 0.98 }}
           >
             <span className="flex items-center justify-center space-x-2">
               <BiSave className="text-xl" />
               <span>Update Event</span>
             </span>
           </motion.button>
         </form>
         
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center h-64 space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div className="flex space-x-3">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                    animate={{
                      scale: [1, 1.2, 1],
                      y: [0, -12, 0]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.div>
              
              <motion.div
                className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Loading event details...
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Update;
