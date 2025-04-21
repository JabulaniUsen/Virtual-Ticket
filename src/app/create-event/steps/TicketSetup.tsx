'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTicketAlt, FaPlus, FaTrash } from 'react-icons/fa';
import { type EventFormData } from '@/types/event';
import React from 'react';

interface TicketSetupProps {
  formData: EventFormData;
  updateFormData: (data: Partial<EventFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  setToast: (toast: { type: 'success' | 'error'; message: string; } | null) => void;
}

const TicketSetup = ({ formData, updateFormData, onNext, onBack, setToast }: TicketSetupProps) => {
  const handleAddTicket = () => {
    const newTicket = {
      name: '',
      price: '',
      quantity: '',
      sold: '0',
      details: '',
      attendees: []
    };
    updateFormData({
      ticketType: [...formData.ticketType, newTicket]
    });
  };

  const handleRemoveTicket = (index: number) => {
    const updatedTickets = formData.ticketType.filter((_, i) => i !== index);
    updateFormData({ ticketType: updatedTickets });
  };

  const handleTicketChange = (index: number, field: keyof typeof formData.ticketType[0], value: string) => {
    const updatedTickets = [...formData.ticketType];
    if (field === 'price') {
      // Only allow numbers
      const numericValue = value.replace(/[^0-9]/g, '');
      updatedTickets[index] = { 
        ...updatedTickets[index], 
        [field]: numericValue 
      };
    } else if (field === 'quantity') {
      const numericValue = value.replace(/[^0-9]/g, '');
      updatedTickets[index] = { 
        ...updatedTickets[index], 
        [field]: numericValue 
      };
    } else {
      updatedTickets[index] = { 
        ...updatedTickets[index], 
        [field]: value 
      };
    }
    updateFormData({ ticketType: updatedTickets });
  };

  const handleFreeTicketChange = (index: number, isFree: boolean) => {
    const updatedTickets = [...formData.ticketType];
    updatedTickets[index] = { 
      ...updatedTickets[index], 
      price: isFree ? '0.00' : ''
    };
    updateFormData({ ticketType: updatedTickets });
  };

  const validateTickets = () => {
    if (formData.ticketType.length === 0) {
      setToast({ type: 'error', message: 'Please add at least one ticket type' });
      return false;
    }

    for (const ticket of formData.ticketType) {
      if (!ticket.name.trim()) {
        setToast({ type: 'error', message: 'Please enter a name for all ticket types' });
        return false;
      }
      if (!ticket.price || parseFloat(ticket.price) < 0) {
        setToast({ type: 'error', message: 'Please enter a valid price for all ticket types' });
        return false;
      }
      if (!ticket.quantity || parseInt(ticket.quantity) <= 0) {
        setToast({ type: 'error', message: 'Please enter a valid quantity for all ticket types' });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateTickets()) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className=" "
    >
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
        <FaTicketAlt className="mr-3 text-blue-600" />
        Ticket Setup
      </h2>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {formData.ticketType.map((ticket, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="relative bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ticket Name
                  </label>
                  <input
                    type="text"
                    value={ticket.name}
                    onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="e.g., VIP, Regular, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (₦)
                  </label>
                  <input
                    type="text"
                    value={ticket.price}
                    onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                    disabled={ticket.price === '0.00'}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity Available
                  </label>
                  <input
                    type="text"
                    value={ticket.quantity}
                    onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter quantity"
                  />
                </div>

                <div className="flex items-end">
                  <label className="relative inline-flex items-center cursor-pointer group mb-2">
                  <input
                    type="checkbox"
                    checked={ticket.price === '0.00'}
                    onChange={(e) => handleFreeTicketChange(index, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-300 rounded-full peer 
                    dark:bg-gray-700 peer-checked:after:translate-x-full 
                    peer-checked:after:border-white after:content-[''] 
                    after:absolute after:top-[2px] after:left-[2px] 
                    after:bg-white after:border-gray-300 after:border 
                    after:rounded-full after:h-5 after:w-5 after:transition-all
                    dark:border-gray-600 peer-checked:bg-blue-600
                    peer-hover:after:scale-95 after:duration-300
                    group-hover:ring-4 group-hover:ring-blue-100 dark:group-hover:ring-blue-800 ">
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300
                    group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    Free Ticket
                  </span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => handleRemoveTicket(index)}
                className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-700
                         dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
              >
                <FaTrash />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddTicket}
          className="w-full py-4 border-2 border-dashed border-blue-500 dark:border-blue-400
                   rounded-xl text-blue-600 dark:text-blue-400 font-medium
                   hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200
                   flex items-center justify-center space-x-2"
        >
          <FaPlus />
          <span>Add Ticket Type</span>
        </motion.button>

        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                     rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600
                     transition-colors duration-200"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white
                     rounded-lg hover:from-blue-700 hover:to-purple-700
                     transform hover:scale-105 transition-all duration-200
                     shadow-lg hover:shadow-xl"
          >
            Continue to Ticket Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TicketSetup;