import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 
import { BiX } from 'react-icons/bi';
import Image from 'next/image';
import axios from 'axios';

type EventFormProps = {
  open: boolean;
  onClose: () => void;
  eventId?: string;
  initialData?: {
    title: string;
    description: string;
    date: string;
    location: string;
    price: string;
    ticketType: { name: string; price: string }[];
  };
  // initialData?: EventData;
  onEventSubmit?: (eventData: unknown) => void;
};

type TicketType = {
  name: string;
  price: string;
  // quantity: string;
};

const EventForm: React.FC<EventFormProps> = ({ open, onClose, eventId, initialData, onEventSubmit }) => {
  const notyf = new Notyf({ duration: 3000 });
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ticketType, setTicketTypes] = useState<TicketType[]>(
    initialData?.ticketType || [{ name: '', price: '' }]
    // initialData?.ticketType || [{ name: '', price: '', quantity: '' }]
  );
  const [isLoading, setIsLoading] = useState(false);

  // ======================== HANDLE FILE UPLOAD ========================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        notyf.error('File format not supported. Please upload an image.');
      }
    }
  };

  // ======================== HANDLE PRICE FORMATTING ========================
  const formatPrice = (value: string) => {
    const onlyNums = value.replace(/[^\d]/g, '');
    return onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPrice = formatPrice(e.target.value);
    setPrice(formattedPrice);
  };
 
  const formatTicketValue = (value: string) => {
    const onlyNums = value.replace(/[^\d]/g, '');
    return onlyNums;
  };

  const handleTicketChange = (index: number, field: 'name' | 'price' , value: string) => {
    const updatedTickets = [...ticketType];
    updatedTickets[index][field] = field === 'price' ? formatPrice(value) : value;
    formatTicketValue(value);
    setTicketTypes(updatedTickets);
  };
  

  const handleAddTicketType = () => {
    setTicketTypes([...ticketType, { name: '', price: ''}]);
    // setTicketTypes([...ticketType, { name: '', price: '', quantity: '' }]);
  };

  const handleRemoveTicketType = (index: number) => {
    const updatedTickets = ticketType.filter((_, i) => i !== index);
    setTicketTypes(updatedTickets);
  };

  // ======================== HANDLE FORM VALIDATION & SUBMISSION ========================
  const handleSubmit = async () => {
    if (!title) {
      notyf.error('Event title is required.');
      return;
    }
  
    if (!description) {
      notyf.error('Event description is required.');
      return;
    }
  
    if (!date) {
      notyf.error('Event date is required.');
      return;
    }
  
    if (new Date(date) < new Date()) {
      notyf.error('Event date must be in the future.');
      return;
    }
  
    if (!location) {
      notyf.error('Event location is required.');
      return;
    }
  
    if (!price || parseFloat(price.replace(/,/g, '')) <= 0) {
      notyf.error('Valid event price is required.');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('location', location);
    formData.append('price', price.replace(/,/g, ''));
    formData.append('ticketType', JSON.stringify(ticketType));
    if (imageFile) formData.append('image', imageFile);

    const token = localStorage.getItem('token'); 
    if (!token) {
      notyf.error('User is not authenticated. Please log in.');
      return;
    }

    const url = eventId
      ? `https://v-ticket-backend.onrender.com/api/v1/events/${eventId}`
      : 'https://v-ticket-backend.onrender.com/api/v1/events/create-event';
    const method = eventId ? 'patch' : 'post';

    setIsLoading(true);

    try {
      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, 
        },
      });

      if (response.status === 201 || response.status === 200) {
        notyf.success(`Event ${eventId ? 'updated' : 'added'} successfully!`);
        onEventSubmit?.({
          id: response.data.id,
          title,
          description,
          date,
          location,
          price,
          ticketType,
        });
        onClose();
      } else {
        notyf.error('Unexpected error: Unable to save the event. Please try again.');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Server error: Unable to save event.';
        notyf.error(errorMessage);
      } else {
        notyf.error('An unknown error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-60  ${
        open ? '' : 'hidden'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg sm:w-full sm:h-full p-6 rounded-lg shadow-xl overflow-hidden relative">
        <div className="flex justify-between p-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {eventId ? 'Update Event' : 'Add New Event'}
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
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Image Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border dark:border-none rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
            />
            {imagePreview && (
              <div className="mt-4">
                <Image
                  src={imagePreview}
                  alt="Event Preview"
                  width={50}
                  height={50}
                  className="rounded-lg object-cover"
                />
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
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Base Price</label>
            <input
              type="text"
              value={price}
              onChange={handlePriceChange}
              className="w-full p-2 border dark:border-none rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

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
                  {/* <input
                    type="number"
                    placeholder="Quantity"
                    value={ticket.quantity}
                    onChange={(e) => handleTicketChange(index, 'quantity', parseInt(e.target.value).toString())}
                    className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    // required
                  /> */}
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
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-4 py-2 ${isLoading ? 'bg-gray-400' : 'bg-blue-600'} text-white rounded-md transition duration-300 hover:bg-blue-700 disabled:bg-gray-400`}
            >
              {isLoading ? 'Saving...' : eventId ? 'Update Event' : 'Save Event'}
            </button>


            {/* <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-4 py-2 ${isLoading ? 'bg-gray-400' : 'bg-blue-600'} text-white rounded-md transition duration-300 hover:bg-blue-700 disabled:bg-gray-400`}
            >
              {isLoading ? 'Saving...' : 'Save Event'}
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
