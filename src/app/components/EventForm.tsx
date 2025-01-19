/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 
import { BiX } from 'react-icons/bi';
import Image from 'next/image';
import axios from 'axios';
import router from 'next/router';
import { BASE_URL } from '../../config';


type TicketType = {
  name: string;
  price: string;
  quantity: string;
  sold: string;
};

type EventData = {
  id: string;
  title: string;
  description: string;
  image?: File;
  date: string;
  location: string;
  ticketType: TicketType[];
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type EventFormProps = {
  open: boolean;
  onClose: () => void;
  onEventSubmit?: (eventData: EventData) => void;
};

const EventForm: React.FC<EventFormProps> = ({ open, onClose, onEventSubmit }) => {
  const notyf = new Notyf({ duration: 3000 });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  // const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ticketType, setTicketTypes] = useState<TicketType[]>([{ name: '', sold: '', price: '', quantity: '' }]);
  const [isLoading, setIsLoading] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; 

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);


  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        notyf.error('Please upload a valid image file (JPEG, PNG, etc.)');
        e.target.value = '';
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        notyf.error('File size too large. Please upload an image under 5MB.');
        e.target.value = '';
        return;
      }

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    },
    [imagePreview, notyf]
  );


  const handleTicketChange = (index: number, field: 'name' | 'sold' | 'price' | 'quantity', value: string) => {
    const updatedTickets = [...ticketType];
    
    if (field === 'price') {
      const cleanValue = value.replace(/,/g, '');
      const price = parseFloat(cleanValue).toFixed(2);
      updatedTickets[index][field] = parseFloat(price).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else if (field === 'sold' || field === 'quantity') {
      const numericValue = value === '' ? '0' : value.replace(/[^0-9]/g, '');
      updatedTickets[index][field] = numericValue;
    } else {
      updatedTickets[index][field] = value;
    }
    
    setTicketTypes(updatedTickets);
  };

  const handleAddTicketType = () => {
    setTicketTypes([...ticketType, { name: '', sold: '', price: '', quantity: '' }]);
  };

  const handleRemoveTicketType = (index: number) => {
    const updatedTickets = ticketType.filter((_, i) => i !== index);
    setTicketTypes(updatedTickets);
  };

  const validateForm = useCallback((): boolean => {
    if (!title.trim()) {
      notyf.error('Please enter an event title');
      return false;
    }

    if (!description.trim()) {
      notyf.error('Please enter an event description');
      return false;
    }

    if (!date) {
      notyf.error('Please select an event date');
      return false;
    }

    if (new Date(date) < new Date()) {
      notyf.error('Event date must be in the future');
      return false;
    }

    if (!location.trim()) {
      notyf.error('Please enter an event location');
      return false;
    }

    if (!ticketType.some(ticket => 
      ticket.name.trim() && ticket.price && ticket.quantity && Number(ticket.quantity) > 0
    )) {
      notyf.error('Please fill in all ticket type fields with valid values');
      return false;
    }

    return true;
  }, [title, description, date, location, ticketType, notyf]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    

    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('date', new Date(date).toISOString());
    formData.append('location', location.trim());


    const cleanedTicketTypes = ticketType.map(ticket => ({
      name: ticket.name.trim(),
      price: ticket.price.replace(/,/g, ''), 
      quantity: ticket.quantity,
      sold: ticket.sold || '0'
    }));

    formData.append('ticketType', JSON.stringify(cleanedTicketTypes));

    if (imageFile) {
      formData.append('file', imageFile); 
    }

    const token = localStorage.getItem('token');
    if (!token) {
      notyf.error('Authentication required. Please log in.');
      router.push('/auth/login');
      return;
    }

    try {
      setIsLoading(true);

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.post(
        `${BASE_URL}api/v1/events/create-event`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        if (onEventSubmit) {
          onEventSubmit(response.data);
        }
        notyf.success('Event created successfully!');
        resetForm();
        onClose();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API Error:', {
          status: error.response?.status,
          message: error.response?.data?.message,
          data: error.response?.data
        });

        if (error.response?.status === 500) {
          notyf.error('Server error. Please check your form data and try again.');
        } else if(error.response?.status === 413) {
          notyf.error('Image file is too large. Please use a smaller image.');
        } else {
          notyf.error(error.response?.data?.message || 'Failed to create event');
        }
      } else {
        console.error('Unexpected error:', error);
        notyf.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
    setTicketTypes([{ name: '', sold: '', price: '', quantity: '' }]);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
  }, [imagePreview]);



  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-60  ${
        open ? '' : 'hidden'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg sm:w-full sm:h-full p-6 rounded-lg shadow-xl overflow-hidden relative">
        <div className="flex justify-between p-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Add New Event
            </h2>
            <IconButton
              onClick={onClose}
              aria-label="close"
              className="absolute top-[-0.5rem] right-2 dark:text-white hover:text-red-500 dark:hover:text-red-600"
            >
              <CloseIcon />
            </IconButton>
          </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 overflow-y-auto max-h-[70vh] sm:max-h-[80vh] pb-6 px-2">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Event Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border dark:border-none rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-2 border dark:border-none rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* ======================== IMAGE UPLOAD ======================== */}
          <div>
              <label htmlFor="image-upload" className="block text-gray-700 dark:text-gray-300 mb-1">
                Event Image
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                aria-label="Upload event image"
              />
              
              {imagePreview && (
                <div className="mt-4 relative">
                  <Image 
                    src={imagePreview} 
                    alt="Event Preview" 
                    width={200} 
                    height={200} 
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (imagePreview) {
                        URL.revokeObjectURL(imagePreview);
                      }
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    <BiX size={20} />
                  </button>
                </div>
              )}
            </div>      

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border dark:border-none rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border dark:border-none rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* ======================== PRICE INPUT ======================== */}
          {/* <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Base Price</label>
            <input
              type="text"
              value={price}
              onChange={handlePriceChange}
              className="w-full p-2 border dark:border-none rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>  */}

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Ticket Types</h3>

            {/* ======================= TICKET TYPE =================== */}
            {ticketType.map((ticket, index) => (
              <div key={index} className="flex items-center justify-between mb-4 w-full">
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Type"
                    value={ticket.name}
                    onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                    className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Price"
                    value={ticket.price}
                    onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                    className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={ticket.quantity}
                    onChange={(e) => handleTicketChange(index, 'quantity', parseInt(e.target.value).toString())}
                    className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    // required
                  />
                  <input
                    type="number"
                    placeholder="sold"
                    value={ticket.sold}
                    onChange={(e) => handleTicketChange(index, 'sold', e.target.value)}
                    className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    min="0"
                  />
                </div>

                <div
                  onClick={() => handleRemoveTicketType(index)}
                  aria-label="remove ticket type"
                  className="p-1 text-gray-500 hover:text-red-700 cursor-pointer mt-2 sm:mt-0"
                >
                  <BiX size={20} />
                </div>
              </div>
            ))}


            <button
              type="button"
              onClick={handleAddTicketType}
              className="w-full p-2 mt-2 text-blue-600 bg-blue-100 rounded-md dark:bg-gray-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-gray-600 transition"
            >
              Add Ticket Type
            </button>
          </div>

          <div className="flex justify-between gap-2 mt-6 mb-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-400 rounded-md dark:bg-red-500 dark:text-white hover:bg-red-500 dark:hover:bg-red-700 transition "
            >
              Cancel
            </button>
            {/* <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-4 py-2 ${isLoading ? 'bg-gray-400' : 'bg-blue-600'} text-white rounded-md transition duration-300 hover:bg-blue-700 disabled:bg-gray-400`}
            >
              {isLoading ? 'Saving...' : eventId ? 'Update Event' : 'Save Event'}
            </button> */}


            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-4 py-2 ${
                isLoading ? 'bg-gray-400' : 'bg-blue-600'
              } text-white rounded-md transition duration-300 hover:bg-blue-700 disabled:bg-gray-400`}
            >
              {isLoading ? 'Saving...' : 'Save Event'}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
