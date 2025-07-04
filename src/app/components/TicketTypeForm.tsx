import React, { useEffect, useState } from 'react';
import { Button, Typography, Stepper, Step, StepLabel } from '@mui/material';
import Receipt from './Receipt';
import axios from 'axios';
import TicketSelectionStep from './TicketFormSec/TicketSelectionStep';
import OrderInformationStep from './TicketFormSec/OrderInformationStep';
import PaymentStep from './TicketFormSec/PaymentStep';
import { BASE_URL } from '../../../config';
import { Ticket } from '@/types/event';

type TicketTypeFormProps = {
  closeForm: () => void;
  tickets: {
    id: string;
    name: string;
    price: string;
    quantity: string;
    sold: string;
    details?: string;
  }[];
  eventSlug: string;
  setToast: (toast: { type: 'success' | 'error'; message: string } | null) => void;
};

interface Event { id: string; slug: string; }

const TicketTypeForm = ({ closeForm, tickets, eventSlug, setToast }: TicketTypeFormProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [events, setEvent] = useState<Event | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [additionalTicketHolders, setAdditionalTicketHolders] = useState<Array<{
    name: string;
    email: string;
  }>>([]);

  const eventId = events?.id;

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventSlug) return;

      try {
        const response = await axios.get(
          `${BASE_URL}api/v1/events/slug/${eventSlug}`
        );
        setEvent(response.data.event);
      } catch (err) {
        console.error('Failed to fetch event:', err);
      } 
    };

    fetchEvent();
  }, [eventSlug]);

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

      const allAttendees = [
        { name: fullName, email: email }
      ];

      if (additionalTicketHolders.length > 0) {
        allAttendees.push(...additionalTicketHolders.map(holder => ({
          name: holder.name,
          email: holder.email
        })));
      }

      if (Number(selectedTicket?.price.replace(/[^\d.-]/g, '')) === 0) {
        setActiveStep(2);
        return;
      }

      try {
        setIsLoading(true);
        const ticketResponse = await axios.post(
          `${BASE_URL}api/v1/payment/create-payment-link/${eventId}`,
          {
            ticketType: selectedTicket?.name,
            currency: "NGN",
            quantity: allAttendees.length, 
            email: email,
            phone: phoneNumber,
            fullName: fullName,
            attendees: additionalTicketHolders.length > 0 ? additionalTicketHolders : null,
          }
        );

        if (ticketResponse.data?.link) {
          const paymentInfo = {
            paymentLink: ticketResponse.data.link,
            ticketId: ticketResponse.data.ticketId,
            eventId: eventId
          };
          localStorage.setItem('pendingPayment', JSON.stringify(paymentInfo));
          localStorage.setItem('currentTicketId', ticketResponse.data.ticketId);

          setToast({
            type: 'success',
            message: 'Payment link generated. Click Complete Purchase to proceed with payment.'
          });
          setActiveStep(2);
        } else {
          throw new Error('Payment link not found in response');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if(error.response?.status === 400) {
            setToast({
              type: 'error',
              message: 'This Event has Ended. Please check back for more events'
            });
          } else {
            setToast({
              type: 'error',
              message: error.response?.data?.message || 'Failed to generate payment link'
            });
          }
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

  const handlePurchase = async () => {
    const attendees = additionalTicketHolders.length > 0 ? additionalTicketHolders : null;

    try {
      if (Number(selectedTicket?.price.replace(/[^\d.-]/g, '')) === 0) {
        try {
          const response = await axios.post(
            `${BASE_URL}api/v1/payment/create-payment-link/${eventId}`,
            {
              ticketType: selectedTicket?.name,
              currency: "NGN",
              quantity: quantity,
              email: email,
              phone: phoneNumber,
              fullName: fullName,
              attendees: attendees,
            }
          );

          const { ticketId } = response.data;
          window.location.href = `/success?ticketId=${ticketId}`;
          return;
        } catch (error) {
          console.error('Error creating free ticket:', error);
          setToast({ type: 'error', message: 'Error creating free ticket' });
          return;
        }
      }

      const storedPayment = localStorage.getItem('pendingPayment');
      if (!storedPayment) {
        setToast({ type: 'error', message: 'Payment information not found' });
        return;
      }

      const { paymentLink } = JSON.parse(storedPayment);
      if (paymentLink) {
        const updatedPaymentLink = `${paymentLink}`;
        window.location.href = updatedPaymentLink;
      } else {
        setToast({ type: 'error', message: 'Payment link not found' });
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setToast({ type: 'error', message: 'Error processing payment' });
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
      details: ticket.details || ''
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
        updated[index] = { name: '', email: '', };
      }
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const closeReceipt = () => {
    setIsPurchased(false);
    closeForm();
  };

  const steps = ['Select Ticket', 'Order Information', 'Payment'];

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 dark:text-white">
      <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
        <div className="p-4 sm:p-6">
          <button
            onClick={closeForm}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {isPurchased ? (
            <Receipt closeReceipt={closeReceipt} />
          ) : (
            <div className="space-y-6">
              <Typography 
                variant="h5" 
                className="font-bold mb-6 text-center text-gray-900 dark:text-white"
              >
                Purchase Ticket
              </Typography>

              <Stepper 
                activeStep={activeStep} 
                alternativeLabel
                className="text-gray-900 "
                sx={{
                  '& .MuiStepLabel-root .MuiStepLabel-label': {
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  },
                  '& .MuiStepLabel-root .Mui-active': {
                    color: 'primary.main',
                  },
                  '& .MuiStepLabel-root .Mui-completed': {
                    color: 'success.main',
                  },
                  '& .MuiStepLabel-root .MuiStepIcon-root': {
                    color: 'grey.400',
                  },
                  '& .MuiStepLabel-root .MuiStepIcon-root.Mui-active': {
                    color: 'primary.main',
                  },
                  '& .MuiStepLabel-root .MuiStepIcon-root.Mui-completed': {
                    color: 'success.main',
                  },
                  '& .MuiStepConnector-root': {
                    '& .MuiStepConnector-line': {
                      borderColor: 'grey.300',
                    },
                  },
                  '@media (prefers-color-scheme: dark)': {
                    '& .MuiStepLabel-root .MuiStepLabel-label': {
                      color: 'grey.300',
                    },
                    '& .MuiStepConnector-root .MuiStepConnector-line': {
                      borderColor: 'grey.700',
                    },
                    '& .MuiStepLabel-root .MuiStepIcon-root': {
                      color: 'grey.700',
                    },
                  }
                }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {activeStep === 0 && (
                  <TicketSelectionStep
                    tickets={tickets}
                    selectedTicket={selectedTicket}
                    handleTicketSelection={handleTicketSelection}
                    quantity={quantity}
                    handleQuantityChange={handleQuantityChange}
                    totalPrice={totalPrice}
                  />
                )}

                {activeStep === 1 && (
                  <OrderInformationStep
                    fullName={fullName}
                    setFullName={setFullName}
                    email={email}
                    setEmail={setEmail}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    quantity={quantity}
                    additionalTicketHolders={additionalTicketHolders}
                    handleAdditionalTicketHolderChange={handleAdditionalTicketHolderChange}
                  />
                )}

                {activeStep === 2 && (
                  <PaymentStep
                    selectedTicket={selectedTicket}
                    quantity={quantity}
                    totalPrice={totalPrice}
                    handlePurchase={handlePurchase}
                    isLoading={isLoading}
                  />
                )}

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
                    {activeStep === 2 ? ' ' : 'Next'}
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