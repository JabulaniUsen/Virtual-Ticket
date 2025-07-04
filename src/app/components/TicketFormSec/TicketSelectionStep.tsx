import React from 'react';
import { Typography } from '@mui/material';
import { formatPrice } from '../../../utils/formatPrice';
import { Ticket } from '@/types/event';

// Define the props interface for the component
interface TicketSelectionStepProps {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  handleTicketSelection: (ticket: Ticket) => void;
  quantity: number;
  handleQuantityChange: (newQuantity: number) => void;
  totalPrice: number;
}

const TicketSelectionStep = ({
  tickets,
  selectedTicket,
  handleTicketSelection,
  quantity,
  handleQuantityChange,
  totalPrice,
}: TicketSelectionStepProps) => {
  return (
    <div className="mb-4 space-y-8 overflow-y-scroll max-h-[60vh] pr-4 scrollbar-thin scrollbar-thumb-gray-300">
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Typography variant="subtitle1" className="font-medium text-gray-700 dark:text-gray-200 mb-3">
            Available Tickets
          </Typography>
          
          {tickets.map((ticket) => (
            <div
              key={ticket.name}
              onClick={() => {
                const isSoldOut = parseInt(ticket.quantity) === 0;
                if (!isSoldOut) handleTicketSelection(ticket);
              }}
              className={`p-4 border rounded-xl transition-all duration-200 cursor-pointer
                ${selectedTicket?.name === ticket.name 
                  ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500'
                }
                ${parseInt(ticket.quantity) === 0 ? 'opacity-60 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <Typography className="font-semibold text-gray-900 dark:text-white">
                    {ticket.name}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
                    {ticket.details || 'Standard admission ticket'}
                  </Typography>
                </div>
                <div className="text-right">
                  <Typography className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(Number(ticket.price), '₦')}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                    {parseInt(ticket.quantity)}  remaining
                  </Typography>
                </div>
              </div>
              
              {parseInt(ticket.quantity) === 0 && (
                <span className="mt-2 inline-block px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full">
                  Sold Out
                </span>
              )}
            </div>
          ))}
        </div>

        {selectedTicket && (
          <div className="md:col-span-2">
            <div className="sticky top-4 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
              <div>
                <Typography variant="subtitle2" className="text-gray-600 dark:text-gray-300 mb-2">
                  Selected Ticket
                </Typography>
                <Typography className="font-semibold text-gray-900 dark:text-white">
                  {selectedTicket.name}
                </Typography>
              </div>

              <div>
                <Typography variant="subtitle2" className="text-gray-600 dark:text-gray-300 mb-2">
                  Quantity
                </Typography>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border
                      ${quantity <= 1 
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      }`}
                  >
                    <span className="text-lg">-</span>
                  </button>
                  <span className="text-lg font-medium text-gray-900 dark:text-white w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(Math.min(
                      parseInt(selectedTicket.quantity) - parseInt(selectedTicket.sold),
                      quantity + 1
                    ))}
                    disabled={quantity >= parseInt(selectedTicket.quantity) - parseInt(selectedTicket.sold)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border
                      ${quantity >= parseInt(selectedTicket.quantity) - parseInt(selectedTicket.sold)
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      }`}
                  >
                    <span className="text-lg">+</span>
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <Typography className="text-gray-600 dark:text-gray-300">
                    Price per ticket
                  </Typography>
                  <Typography className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(Number(selectedTicket.price), '₦')}
                  </Typography>
                </div>
                <div className="flex justify-between items-center">
                  <Typography className="font-medium text-gray-900 dark:text-white">
                    Total Amount
                  </Typography>
                  <Typography className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(totalPrice, '₦')}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketSelectionStep;