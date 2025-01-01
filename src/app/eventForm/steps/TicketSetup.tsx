'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTicketAlt, FaPlus, FaTrash } from 'react-icons/fa';
import { EventFormData } from '../page';

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
      const numericValue = value.replace(/[^0-9.]/g, '');
      const price = parseFloat(numericValue || '0').toFixed(2);
      updatedTickets[index] = { 
        ...updatedTickets[index], 
        [field]: price 
      };
    } else if (field === 'quantity') {
      const quantity = value.replace(/[^0-9]/g, '');
      updatedTickets[index] = { 
        ...updatedTickets[index], 
        [field]: quantity || '0'
      };
    } else {
      updatedTickets[index] = { 
        ...updatedTickets[index], 
        [field]: value 
      };
    }
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
      if (!ticket.price || parseFloat(ticket.price) <= 0) {
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
      className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
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
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity Available
                  </label>
                  <input
                    type="number"
                    value={ticket.quantity}
                    onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    min="1"
                    placeholder="Enter quantity"
                  />
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