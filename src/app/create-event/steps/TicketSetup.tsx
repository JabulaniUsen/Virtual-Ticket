'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTicketAlt, FaPlus, FaTrash, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Event, Ticket, ToastProps } from '@/types/event';
import { formatPrice } from '@/utils/formatPrice';

interface TicketSetupProps {
  formData: Event;
  updateFormData: (data: Partial<Event>) => void;
  onNext: () => void;
  onBack: () => void;
  setToast: (toast: ToastProps | null) => void;
}

export default function TicketSetup({ 
  formData, 
  updateFormData, 
  onNext, 
  onBack, 
  setToast 
}: TicketSetupProps) {
  const handleAddTicket = () => {
    updateFormData({
      ticketType: [
        ...formData.ticketType,
        {
          name: '',
          price: '0.00',
          quantity: '0',
          sold: '0',
          details: '',
          attendees: []
        }
      ]
    });
  };

  const handleRemoveTicket = (index: number) => {
    const updatedTickets = formData.ticketType.filter((_, i) => i !== index);
    updateFormData({ ticketType: updatedTickets });
  };

  const handleTicketChange = (index: number, field: keyof Ticket, value: string) => {
    const updatedTickets = [...formData.ticketType];
    
    if (field === 'price' || field === 'quantity') {
      // Only allow numbers and decimal for price
      const numericValue = value.replace(/[^0-9.]/g, '');
      updatedTickets[index] = { ...updatedTickets[index], [field]: numericValue };
    } else {
      updatedTickets[index] = { ...updatedTickets[index], [field]: value };
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
      setToast({ 
        type: 'error', 
        message: 'Please add at least one ticket type',
        onClose: () => setToast(null)
      });
      return false;
    }

    for (const ticket of formData.ticketType) {
      if (!ticket.name.trim()) {
        setToast({ 
          type: 'error', 
          message: 'Please enter a name for all ticket types',
          onClose: () => setToast(null)
        });
        return false;
      }
      
      const price = parseFloat(ticket.price);
      if (isNaN(price)) {
        setToast({ 
          type: 'error', 
          message: 'Please enter a valid price for all ticket types',
          onClose: () => setToast(null)
        });
        return false;
      }

      const quantity = parseInt(ticket.quantity);
      if (isNaN(quantity)) {
        setToast({ 
          type: 'error', 
          message: 'Please enter a valid quantity for all ticket types',
          onClose: () => setToast(null)
        });
        return false;
      }
    }
    return true;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <motion.h2 
          className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <FaTicketAlt className="mr-3 text-blue-500 animate-pulse" size={28} />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Your Tickets
          </span>
        </motion.h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Design different ticket options for your event. Make them special!
        </p>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {formData.ticketType.map((ticket, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ y: -3 }}
            >
              <div className="absolute -top-3 -left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                Ticket #{index + 1}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Ticket Name */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-1 rounded mr-2">
                      ✨
                    </span>
                    What&apos;s this ticket called? *
                  </label>
                  <input
                    type="text"
                    value={ticket.name}
                    onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200"
                    placeholder="e.g., VIP Pass, Early Bird"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-1 rounded mr-2">
                      💰
                    </span>
                    How much does it cost? *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400">
                        {formatPrice(0, formData.currency || 'NGN').charAt(0)}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={ticket.price}
                      onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200"
                      placeholder="0.00"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {formData.currency || 'NGN'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-1 rounded mr-2">
                      🎟️
                    </span>
                    How many available? *
                  </label>
                  <input
                    type="text"
                    value={ticket.quantity}
                    onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200"
                    placeholder="100"
                    required
                  />
                </div>
              </div>

              {/* Free Ticket Toggle */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={ticket.price === '0.00'}
                      onChange={(e) => handleFreeTicketChange(index, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer 
                      peer-checked:after:translate-x-6 peer-checked:bg-green-500
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                      after:bg-white after:border-gray-300 after:rounded-full after:h-5 after:w-5 
                      after:transition-all after:duration-300 peer-hover:shadow-lg
                      peer-checked:after:border-white flex items-center justify-between px-1">
                      <span className="text-xs text-white font-bold">FREE</span>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Free Ticket
                    </span>
                  </label>
                </div>

                <button
                  onClick={() => handleRemoveTicket(index)}
                  className="flex items-center text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 group"
                >
                  <FaTrash className="mr-1 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Remove</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Ticket Button */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddTicket}
          className="w-full py-5 border-2 border-dashed border-blue-400 dark:border-blue-500
                  rounded-2xl text-blue-600 dark:text-blue-400 font-medium text-lg
                  hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-300
                  flex flex-col items-center justify-center space-y-2 group"
        >
          <div className="w-10 h-7 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <FaPlus className="text-blue-500 dark:text-blue-400" />
          </div>
          <span>Add Another Ticket Option</span>
        </motion.button>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBack}
            className="px-8 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300
                    rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600
                    transition-all duration-200 flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 5px 20px rgba(124, 58, 237, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => validateTickets() && onNext()}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white
                    rounded-xl hover:from-blue-700 hover:to-purple-700
                    transition-all duration-300 shadow-lg hover:shadow-xl
                    flex items-center justify-center"
          >
            Continue to Ticket Details
            <FaArrowRight className="ml-2" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}