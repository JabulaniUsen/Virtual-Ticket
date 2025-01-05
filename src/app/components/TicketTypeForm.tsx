'use client';

import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import '../globals.css';
import {
  Button,
  TextField,
  // Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  // FormControl,
  // InputLabel,
  // Select,
  // MenuItem,
} from '@mui/material';
import Receipt from './Receipt';
import axios from 'axios';

type TicketTypeFormProps = {
  closeForm: () => void;
  tickets: {
    id: string;
    name: string;
    price: string;
    quantity: string;
    sold: string;
    details: string;
  }[];
  eventSlug: string;
  setToast: (toast: { type: 'success' | 'error'; message: string } | null) => void;
};

const TicketTypeForm = ({ closeForm, tickets, eventSlug, setToast }: TicketTypeFormProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<{
    // details: React.JSX.Element;
    id: string;
    name: string;
    price: string;
    quantity: string;
    sold: string;
    details: string;
  } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  // const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id') || '';
  const [ticketId, setTicketId] = useState<string>('');
  const [additionalTicketHolders, setAdditionalTicketHolders] = useState<Array<{
    name: string;
    email: string;
    phone: string;
  }>>([]);

  const handleNext = async () => {
    if (activeStep === 0) {
      if (!selectedTicket) {
        setToast({ type: 'error', message: 'Please select a ticket' });
        return;
      }
      setTotalPrice(quantity * Number(selectedTicket.price.replace(/[^\d.-]/g, '')));
      setActiveStep(1);
    } else if (activeStep === 1) {
      if (!fullName || !phoneNumber || !email) {
        setToast({ type: 'error', message: 'All fields are required.' });
        return;
      }

      try {
        setIsLoading(true);
        const ticketResponse = await axios.post(
          `https://v-ticket-backend.onrender.com/api/v1/tickets/create-ticket/${eventSlug}`,
          {
            ticketType: selectedTicket?.name,
            currency: 'NGN',
            email: email,
            phone: phoneNumber,
            fullName: fullName
          }
        );

        if (ticketResponse.data?.ticket?.id) {
          // Store the ticket ID from the response
          setTicketId(ticketResponse.data.ticket.id);
          setToast({
            type: 'success',
            message: ticketResponse.data.message || 'Ticket created successfully'
          });
          setActiveStep(2);
        } else {
          throw new Error('No ticket ID received');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setToast({
            type: 'error',
            message: error.response?.data?.message || 'Failed to create ticket'
          });
          console.error('Ticket Creation Error:', {
            status: error.response?.status,
            data: error.response?.data
          });
        } else {
          setToast({
            type: 'error',
            message: 'An unexpected error occurred'
          });
          console.error('Unexpected error:', error);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleTicketSelection = (ticket: typeof tickets[0]) => {
    setSelectedTicket({
      id: ticket.id,
      name: ticket.name,
      price: ticket.price,
      quantity: ticket.quantity,
      sold: ticket.sold,
      details: ticket.details
    });
    setQuantity(1);
    setTotalPrice(Number(ticket.price.replace(/[^\d.-]/g, '')));
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    setTotalPrice(newQuantity * Number(selectedTicket?.price.replace(/[^\d.-]/g, '') || '0'));
    
   
    setAdditionalTicketHolders(prev => {
      if (newQuantity <= 1) return [];
      if (newQuantity - 1 > prev.length) {
        return [...prev, ...Array(newQuantity - 1 - prev.length).fill({ name: '', email: '', phone: '' })];
      }
      return prev.slice(0, newQuantity - 1);
    });
  };

  const handleAdditionalTicketHolderChange = (index: number, field: string, value: string) => {
    setAdditionalTicketHolders(prev => {
      const updated = [...prev];
      if (!updated[index]) {
        updated[index] = { name: '', email: '', phone: '' };
      }
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handlePurchase = async () => {
    try {
      setIsLoading(true);

      if (!ticketId) {
        setToast({ type: 'error', message: 'No ticket ID found' });
        return;
      }

      const response = await axios.post(
        'https://v-ticket-backend.onrender.com/api/v1/payment/create-payment-link',
        {
          ticketId: ticketId
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Payment Response:', response.data);

      if (response.data && response.data.link) {
        window.open(response.data.link, '_blank');
        setToast({
          type: 'success',
          message: 'Payment link generated successfully. Please complete your payment.'
        });
        setTimeout(() => {
          closeForm();
        }, 2000);
      } else {
        throw new Error('Payment link not found in response');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Payment link generation failed';
        setToast({ 
          type: 'error', 
          message: errorMessage 
        });
        console.error('Payment API Error:', {
          status: error.response?.status,
          data: error.response?.data
        });
      } else {
        setToast({ 
          type: 'error', 
          message: 'An unexpected error occurred' 
        });
        console.error('Unexpected error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const closeReceipt = () => {
    setIsPurchased(false);
    closeForm();
  };

  const steps = ['Select Ticket', 'Order Information', 'Payment'];

  const renderTicketSelectionStep = () => (
    <div className="mb-4 space-y-8 overflow-y-scroll max-h-[60vh] pr-4 scrollbar-thin scrollbar-thumb-gray-300">
      <div className="grid md:grid-cols-4 gap-6">
        {/* Ticket Selection Cards */}
        <div className="md:col-span-2 space-y-4">
          <Typography variant="subtitle1" className="font-medium text-gray-700 dark:text-gray-200 mb-3">
            Available Tickets
          </Typography>
          
          {tickets.map((ticket) => (
            <div
              key={ticket.name}
              onClick={() => {
                const isSoldOut = parseInt(ticket.quantity) <= parseInt(ticket.sold);
                if (!isSoldOut) handleTicketSelection(ticket);
              }}
              className={`p-4 border rounded-xl transition-all duration-200 cursor-pointer
                ${selectedTicket?.name === ticket.name 
                  ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                }
                ${parseInt(ticket.quantity) <= parseInt(ticket.sold) ? 'opacity-60 cursor-not-allowed' : ''}
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
                    ₦{Number(ticket.price).toLocaleString()}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                    {parseInt(ticket.quantity) - parseInt(ticket.sold)} remaining
                  </Typography>
                </div>
              </div>
              
              {parseInt(ticket.quantity) <= parseInt(ticket.sold) && (
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
                    ₦{Number(selectedTicket.price).toLocaleString()}
                  </Typography>
                </div>
                <div className="flex justify-between items-center">
                  <Typography className="font-medium text-gray-900 dark:text-white">
                    Total Amount
                  </Typography>
                  <Typography className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    ₦{totalPrice.toLocaleString()}
                  </Typography>
                </div>
              </div>

             
              {/* {typeof selectedTicket.details === 'string' && selectedTicket.details && (
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Typography variant="subtitle2" className="text-gray-600 dark:text-gray-300 mb-3">
                    Ticket Features
                  </Typography>
                  <ul className="space-y-2">
                    {selectedTicket.details.split(',').map((feature: string, index: number) => (
                      <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="mb-4 space-y-6">
      <div className="p-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-blue-100 dark:border-gray-700 shadow-lg">
        <Typography variant="h5" className="font-bold text-gray-900 dark:text-white mb-6">
          Payment Summary
        </Typography>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
            <Typography className="text-gray-600 dark:text-gray-300">
              Ticket Type
            </Typography>
            <Typography className="font-semibold text-gray-900 dark:text-white">
              {selectedTicket?.name}
            </Typography>
          </div>

          <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
            <Typography className="text-gray-600 dark:text-gray-300">
              Quantity
            </Typography>
            <Typography className="font-semibold text-gray-900 dark:text-white">
              {quantity}
            </Typography>
          </div>

          <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
            <Typography className="text-gray-600 dark:text-gray-300">
              Price per ticket
            </Typography>
            <Typography className="font-semibold text-gray-900 dark:text-white">
              ₦{Number(selectedTicket?.price).toLocaleString()}
            </Typography>
          </div>

          <div className="mt-6 pt-6 border-t border-blue-100 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <Typography variant="h6" className="text-gray-900 dark:text-white">
                Total Amount
              </Typography>
              <Typography variant="h5" className="text-green-600 dark:text-green-400 font-bold">
                ₦{totalPrice.toLocaleString()}
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
          py: 3,
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
          <span className="text-lg font-medium">Complete Purchase</span>
        )}
      </Button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 dark:text-white">
      <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
        <div className="p-6 sm:p-8">
          <button
            onClick={closeForm}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {isPurchased ? (
            <Receipt
              name={fullName}
              ticketType={selectedTicket?.name || ''}
              email={email}
              quantity={quantity}
              totalPrice={totalPrice}
              closeReceipt={closeReceipt} 
              eventId={eventId}
            />
          ) : (
            <div className="space-y-6">
              <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
                Purchase Ticket
              </Typography>

              <Stepper 
                activeStep={activeStep} 
                alternativeLabel
                className="mb-8 dark:text-white"
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel className="text-gray-900 dark:text-white">{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {activeStep === 0 && renderTicketSelectionStep()}

                {activeStep === 1 && (
                  <div className="space-y-6 overflow-y-scroll max-h-[60vh] pr-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 dark:text-white">
                    {/* Primary Ticket Holder */}
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-100 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center space-x-2 mb-4">
                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <Typography variant="subtitle1" className="text-blue-600 dark:text-blue-400 font-semibold">
                          Primary Ticket Holder
                        </Typography>
                      </div>
                      
                      <div className="space-y-4">
                        <TextField
                          label="Full Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          fullWidth
                          required
                          size="small"
                          className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'rgba(156, 163, 175, 0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(59, 130, 246, 0.5)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'rgb(59, 130, 246)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: 'rgb(107, 114, 128)',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: 'rgb(59, 130, 246)',
                            },
                          }}
                        />
                        <TextField
                          label="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          fullWidth
                          required
                          size="small"
                          type="email"
                          className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'rgba(156, 163, 175, 0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(59, 130, 246, 0.5)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'rgb(59, 130, 246)',
                              },
                            },
                          }}
                        />
                        <TextField
                          label="Phone Number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          fullWidth
                          required
                          size="small"
                          className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'rgba(156, 163, 175, 0.3)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(59, 130, 246, 0.5)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'rgb(59, 130, 246)',
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Additional Ticket Holders */}
                    {quantity > 1 && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <Typography variant="subtitle1" className="text-gray-700 dark:text-gray-300 font-semibold">
                            Additional Ticket Holders
                          </Typography>
                        </div>
                        
                        {Array.from({ length: quantity - 1 }, (_, index) => (
                          <div 
                            key={index}
                            className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 
                                       rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4
                                       transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <Typography variant="subtitle2" className="text-gray-600 dark:text-gray-400">
                                Ticket Holder #{index + 2}
                              </Typography>
                              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                                Additional
                              </span>
                            </div>
                            
                            <div className="space-y-4">
                              <TextField
                                label="Full Name"
                                value={additionalTicketHolders[index]?.name || ''}
                                onChange={(e) => handleAdditionalTicketHolderChange(index, 'name', e.target.value)}
                                fullWidth
                                required
                                size="small"
                                className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm"
                              />
                              <TextField
                                label="Email Address"
                                value={additionalTicketHolders[index]?.email || ''}
                                onChange={(e) => handleAdditionalTicketHolderChange(index, 'email', e.target.value)}
                                fullWidth
                                required
                                size="small"
                                type="email"
                                className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm"
                              />
                              <TextField
                                label="Phone Number"
                                value={additionalTicketHolders[index]?.phone || ''}
                                onChange={(e) => handleAdditionalTicketHolderChange(index, 'phone', e.target.value)}
                                fullWidth
                                required
                                size="small"
                                className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeStep === 2 && renderPaymentStep()}

                <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    sx={{
                      borderColor: 'rgb(59, 130, 246)',
                      color: 'rgb(59, 130, 246)',
                      '&:hover': {
                        borderColor: 'rgb(29, 78, 216)',
                        bgcolor: 'rgba(59, 130, 246, 0.1)',
                      },
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={activeStep === 2}
                    sx={{
                      bgcolor: 'rgb(59, 130, 246)',
                      '&:hover': {
                        bgcolor: 'rgb(29, 78, 216)',
                      },
                    }}
                  >
                    {activeStep === 2 ? 'Proceed to Payment' : 'Next'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketTypeForm;
