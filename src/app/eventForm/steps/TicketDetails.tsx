'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdDescription } from 'react-icons/md';
import { EventFormData } from '../page';

interface TicketDetailsProps {
  formData: EventFormData;
  updateFormData: (data: Partial<EventFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  setToast: (toast: { type: 'success' | 'error'; message: string; } | null) => void;
}

const TicketDetails = ({ formData, updateFormData, onNext, onBack, setToast }: TicketDetailsProps) => {
  const [expandedTicket, setExpandedTicket] = useState<number | null>(null);

  const handleDetailsChange = (ticketIndex: number, details: string) => {
    const updatedTickets = [...formData.ticketType];
    updatedTickets[ticketIndex] = {
      ...updatedTickets[ticketIndex],
      details: details.slice(0, 500) // Limit details to 500 characters
    };
    updateFormData({ ticketType: updatedTickets });
  };

  const handleAddAttendee = (ticketIndex: number) => {
    const updatedTickets = [...formData.ticketType];
    const ticket = updatedTickets[ticketIndex];
    const currentAttendees = ticket.attendees || [];
    
    const maxAttendees = parseInt(ticket.quantity);
    if (currentAttendees.length >= maxAttendees) {
      setToast({ 
        type: 'error', 
        message: `Cannot add more attendees than the ticket quantity (${maxAttendees})`
      });
      return;
    }

    updatedTickets[ticketIndex] = {
      ...ticket,
      attendees: [
        ...currentAttendees,
        { name: '', email: '' }
      ]
    };
    updateFormData({ ticketType: updatedTickets });
  };

  const handleRemoveAttendee = (ticketIndex: number, attendeeIndex: number) => {
    const updatedTickets = [...formData.ticketType];
    const ticket = updatedTickets[ticketIndex];
    const filteredAttendees = ticket.attendees?.filter((_, i) => i !== attendeeIndex) || [];
    
    updatedTickets[ticketIndex] = {
      ...ticket,
      attendees: filteredAttendees
    };
    updateFormData({ ticketType: updatedTickets });
  };

  const handleAttendeeChange = (
    ticketIndex: number,
    attendeeIndex: number,
    field: 'name' | 'email',
    value: string
  ) => {
    const updatedTickets = [...formData.ticketType];
    const ticket = updatedTickets[ticketIndex];
    const updatedAttendees = [...(ticket.attendees || [])];
    
    updatedAttendees[attendeeIndex] = {
      ...updatedAttendees[attendeeIndex],
      [field]: value.trim()
    };

    updatedTickets[ticketIndex] = {
      ...ticket,
      attendees: updatedAttendees
    };
    updateFormData({ ticketType: updatedTickets });
  };

  const validateDetails = () => {
    for (const ticket of formData.ticketType) {
      if (ticket.attendees?.some(a => {
        if (!a.name || !a.email) return false;
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(a.email);
      })) {
        setToast({ 
          type: 'error', 
          message: 'Please enter valid email addresses for all attendees' 
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
      className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <MdDescription className="mr-3 text-blue-600" />
        Ticket Details
      </h2>

      <div className="space-y-6">
        {formData.ticketType.map((ticket, ticketIndex) => (
          <motion.div
            key={ticketIndex}
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedTicket(expandedTicket === ticketIndex ? null : ticketIndex)}
              className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700"
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {ticket.name || `Ticket Type ${ticketIndex + 1}`}
              </span>
              {expandedTicket === ticketIndex ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            <AnimatePresence>
              {expandedTicket === ticketIndex && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 space-y-6">
                    {/* Ticket Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ticket Description
                      </label>
                      <textarea
                        value={ticket.details || ''}
                        onChange={(e) => handleDetailsChange(ticketIndex, e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Describe what's included with this ticket..."
                      />
                    </div>

                    {/* Pre-registered Attendees */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-800 dark:text-white">
                          Pre-registered Attendees (Optional)
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleAddAttendee(ticketIndex)}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700
                                   dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <FaUserPlus />
                          <span>Add Attendee</span>
                        </button>
                      </div>

                      <AnimatePresence mode="popLayout">
                        {ticket.attendees?.map((attendee, attendeeIndex) => (
                          <motion.div
                            key={attendeeIndex}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center space-x-4 mb-4"
                          >
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input
                                type="text"
                                value={attendee.name}
                                onChange={(e) => handleAttendeeChange(
                                  ticketIndex,
                                  attendeeIndex,
                                  'name',
                                  e.target.value
                                )}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="Attendee Name"
                              />
                              <input
                                type="email"
                                value={attendee.email}
                                onChange={(e) => handleAttendeeChange(
                                  ticketIndex,
                                  attendeeIndex,
                                  'email',
                                  e.target.value
                                )}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="Attendee Email"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttendee(ticketIndex, attendeeIndex)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400
                                       dark:hover:text-red-300"
                            >
                              <FaTrash />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                     rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600
                     transition-colors duration-200"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => {
              if (validateDetails()) {
                onNext();
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white
                     rounded-lg hover:from-blue-700 hover:to-purple-700
                     transform hover:scale-105 transition-all duration-200
                     shadow-lg hover:shadow-xl"
          >
            Continue to Final Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TicketDetails; 