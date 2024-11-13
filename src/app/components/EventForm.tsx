import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type EventFormProps = {
  open: boolean;
  onClose: () => void;
};

const EventForm: React.FC<EventFormProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [ticketTypes, setTicketTypes] = useState([{ name: 'Basic', price: '' }]);

  const handleAddTicketType = () => {
    setTicketTypes([...ticketTypes, { name: '', price: '' }]);
  };

  const handleTicketTypeChange = (index: number, field: 'name' | 'price', value: string) => {
    const updatedTickets = [...ticketTypes];
    updatedTickets[index][field] = value;
    setTicketTypes(updatedTickets);
  };

  const handleSubmit = () => {
    console.log({ title, description, date, location, price, ticketTypes });
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-60  ${
        open ? '' : 'hidden'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg p-6 rounded-lg shadow-xl overflow-hidden max-h-[85vh] relative">
        
        <div className="flex justify-between p-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Add New Event</h2>
          {/* ======================== && •CLOSE ICON• && =================== */}
          <IconButton onClick={onClose} aria-label="close" className="absolute top-[-0.5rem] right-2 dark:text-white hover:text-red-500 dark:hover:text-red-600" >
            <CloseIcon />
          </IconButton>
        </div>
        

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 overflow-y-auto max-h-[70vh] pb-6 px-2">
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

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Base Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-2 border dark:border-none rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Ticket Types</h3>
            {ticketTypes.map((ticket, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Type"
                  value={ticket.name}
                  onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                  className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={ticket.price}
                  onChange={(e) => handleTicketTypeChange(index, 'price', e.target.value)}
                  className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
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