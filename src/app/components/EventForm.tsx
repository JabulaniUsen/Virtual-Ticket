import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BiX } from 'react-icons/bi'
import Image from 'next/image';
import axios from 'axios';

type EventFormProps = {
  open: boolean;
  onClose: () => void;
};

type TicketType = {
  name: string;
  price: string;
};

const EventForm: React.FC<EventFormProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([{ name: 'Basic', price: '' }]);

  const handleAddTicketType = () => {
    setTicketTypes([...ticketTypes, { name: '', price: '' }]);
  };

  const handleTicketTypeChange = (index: number, field: 'name' | 'price', value: string) => {
    const updatedTickets = [...ticketTypes];
    updatedTickets[index][field] = value;
    setTicketTypes(updatedTickets);
  };

  const handleRemoveTicketType = (index: number) => {
    const updatedTickets = ticketTypes.filter((_, i) => i !== index);
    setTicketTypes(updatedTickets);
  };

    // ======================== HANDLE FILE UPLOAD ========================
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.type.startsWith('image/')) {
          setImageFile(file);
          setImagePreview(URL.createObjectURL(file));
        } else {
          toast.error('File format not supported. Please upload an image.');
        }
      }
    };

      // ======================== HANDLE PRICE FORMAT ========================
    const formatPrice = (value: string) => {
      const onlyNums = value.replace(/[^\d]/g, '');

      if (!onlyNums) return '';
      return onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedPrice = formatPrice(e.target.value);
      setPrice(formattedPrice);
    };

    // ======================== HANDLE TICKET PRICE FORMAT ========================
    const formatTicketPrice = (value: string) => {
      const onlyNums = value.replace(/[^\d]/g, '');
      return onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleTicketPriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const formattedPrice = formatTicketPrice(e.target.value);
      handleTicketTypeChange(index, 'price', formattedPrice);
    };


    // ======================== HANDLE FORM SUBMISSION ========================
    const handleSubmit = async () => {
      if (
        !title || !description || !date || !location || !price || !imageFile || ticketTypes.some(ticket => !ticket.name || !ticket.price)
      ) {
        toast.error('Please fill all required fields');
      } else {
        const eventData = {
          title,
          description,
          date,
          location,
          price,
          image: imageFile ? URL.createObjectURL(imageFile) : null,
          ticketTypes,
        };

        // API INTEGREATION ===
        try {
          const response = await axios.post('https://your-api-endpoint.com/events', eventData);
          if (response.status === 201 || response.status === 200) {
            toast.success('Event added successfully!');

            const events = JSON.parse(localStorage.getItem('events') || '[]');
            localStorage.setItem('events', JSON.stringify([...events, eventData]));

            onClose(); 
          } else {
            throw new Error('Failed to add event');
          }
        } catch (error) {
          console.error('Error saving event:', error);
          toast.error('Failed to save event. Please try again.');
        }
    
        // SAVING TO LOCAL-STORAGE
        // const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
        // localStorage.setItem('events', JSON.stringify([...storedEvents, eventData]));
        // toast.success('Event saved successfully!');
        // onClose();
      }
    };
    

  // const handleSubmit = () => {
  //   console.log({ title, description, date, location, price, ticketTypes });
  //   onClose();
  // };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-60  ${
        open ? '' : 'hidden'
      }`}
    >
      <ToastContainer />
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg sm:w-full sm:h-full p-6 rounded-lg shadow-xl overflow-hidden relative">
        <div className="flex justify-between p-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Add New Event</h2>
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
            {ticketTypes.map((ticket, index) => (
              <div key={index} className="flex items-center justify-between mb-2 ml-2">
                <div className='flex gap-2'>
                  <input
                    type="text"
                    placeholder="Type"
                    value={ticket.name}
                    onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                    className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ml-[-0.5rem]"
                    required
                  />
                  <input
                      type="text" 
                      placeholder="Price"
                      value={ticket.price}
                      onChange={(e) => handleTicketPriceChange(e, index)} 
                      className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                  />
                </div>

                <div
                  onClick={() => handleRemoveTicketType(index)}
                  aria-label="remove ticket type"
                  className="p-1 text-gray-500 hover:text-red-700 cursor-pointer"
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
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition "
            >
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
