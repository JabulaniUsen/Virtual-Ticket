import React from 'react';
import { Button, Typography } from '@mui/material';
import { formatPrice } from '../../../utils/formatPrice';

interface PaymentStepProps {
  selectedTicket: { name: string; price: string } | null;
  quantity: number;
  totalPrice: number;
  handlePurchase: () => void;
  isLoading: boolean;
}

const PaymentStep = ({ selectedTicket, quantity, totalPrice, handlePurchase, isLoading } : PaymentStepProps) => {
  return (
    <div className="mb-4 space-y-6">
      <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <Typography variant="h6" className="font-semibold text-gray-800 dark:text-white mb-4 text-center">
          Payment Summary
        </Typography>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg shadow-sm transition-shadow duration-200 hover:shadow-md">
            <Typography className="text-gray-600 dark:text-gray-300 text-sm">
              Ticket Type
            </Typography>
            <Typography className="font-medium text-gray-900 dark:text-white text-sm">
              {selectedTicket?.name}
            </Typography>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg shadow-sm transition-shadow duration-200 hover:shadow-md">
            <Typography className="text-gray-600 dark:text-gray-300 text-sm">
              Quantity
            </Typography>
            <Typography className="font-medium text-gray-900 dark:text-white text-sm">
              {quantity}
            </Typography>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg shadow-sm transition-shadow duration-200 hover:shadow-md">
            <Typography className="text-gray-600 dark:text-gray-300 text-sm">
              Price per ticket
            </Typography>
            <Typography className="font-medium text-gray-900 dark:text-white text-sm">
              {formatPrice(Number(selectedTicket?.price))}
            </Typography>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <Typography className="text-gray-900 dark:text-white text-sm">
                Total Amount
              </Typography>
              <Typography className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatPrice(totalPrice)}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="contained"
        onClick={handlePurchase}
        disabled={isLoading}
        fullWidth
        className="transform transition-all"
        sx={{
          py: 2,
          mt: 4,
          bgcolor: 'rgb(59, 130, 246)',
          '&:hover': {
            bgcolor: 'rgb(29, 78, 216)',
            transform: 'translateY(-2px)',
          },
          '&:disabled': {
            bgcolor: 'rgb(156, 163, 175)',
          },
        }}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <span className="animate-spin">⌛</span>
            <span>Processing Payment...</span>
          </div>
        ) : (
          <span className="text-base font-medium">Complete Purchase</span>
        )}
      </Button>
    </div>
  );
};

export default PaymentStep;