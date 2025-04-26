import React from 'react';
import { motion } from 'framer-motion';
import { type EventFormData } from '@/types/event';
import { FaTicketAlt, FaLock } from 'react-icons/fa';
import { Button } from '@mui/material';

interface VirtualEventTicketsProps {
  event: EventFormData;
  setShowTicketForm: (show: boolean) => void;
  setSelectedTicket: (ticket: {
    id: string;
    name: string;
    price: string;
    quantity: string;
    sold: string;
    details: string;
  }) => void;
}

export default function VirtualEventTickets({ 
  event, 
  setShowTicketForm,
  setSelectedTicket
}: VirtualEventTicketsProps) {
  const handleGetTicket = (ticket: {
    name: string;
    price: string;
    quantity: string;
    sold: string;
    details: string;
  }) => {
    setSelectedTicket({
      id: event.id || '',
      name: ticket.name,
      price: ticket.price,
      quantity: ticket.quantity,
      sold: ticket.sold,
      details: ticket.details || ''
    });
    setShowTicketForm(true);
  };
  // Toast state
  const [toast, setToast] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  return (
    <>
      {toast && (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
          <div
            className={`px-4 py-2 rounded shadow-lg text-white font-semibold ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {toast.message}
            <button
              className="ml-3 text-white font-bold"
              onClick={() => setToast(null)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FaTicketAlt className="mr-3" />
            VIRTUAL ACCESS PASSES
          </h2>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-6 justify-center">
            {event.ticketType.map((ticket, index) => {
              const remaining = parseInt(ticket.quantity) ;
              const soldOut = remaining <= 0;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  className={`
                    flex flex-col justify-between w-full sm:w-72 md:w-80
                    p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700
                    hover:border-purple-300 dark:hover:border-purple-500 transition-colors
                    bg-white dark:bg-gray-900
                    ${soldOut ? 'opacity-60 grayscale pointer-events-none' : ''}
                  `}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {ticket.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                          {ticket.details || 'Virtual event access'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {event.currency || '₦'}
                          {Number(ticket.price).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {remaining} remaining
                        </p>
                      </div>
                    </div>
                    {remaining > 0 && remaining <= 3 && (
                      <div className="mb-2">
                        <span className="inline-flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                          <span className="mr-1">🔥</span>
                          Only {remaining} left!
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      handleGetTicket(ticket);
                      setToast(null);
                    }}
                    disabled={soldOut}
                    sx={{
                      py: 1.5,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg,rgb(37, 76, 215),rgb(46, 220, 171))',
                      ':hover': {
                        background: 'linear-gradient(135deg, #7c3aed,rgb(39, 204, 219))',
                      },
                      ':disabled': {
                        background: '#9CA3AF',
                        color: '#fff',
                      },
                      transition: 'all 0.3s ease',
                      mt: 2,
                      fontWeight: 600,
                    }}
                  >
                    {soldOut ? 'SOLD OUT' : 'GET PASS'}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 flex items-start mt-8">
            <FaLock className="text-gray-500 dark:text-gray-400 mt-1 mr-3 flex-shrink-0" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Secure checkout process. Your virtual access details will be emailed immediately after purchase.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}