'use client';

import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Receipt from './Receipt'; 
import axios from 'axios';

type TicketTypeFormProps = {
  closeForm: () => void;
  tickets: { name: string; price: string }[];
  setToast: (toast: { type: 'success' | 'error'; message: string } | null) => void;
};

const TicketTypeForm = ({ closeForm, tickets = [], setToast }: TicketTypeFormProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<{ name: string; price: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id') || '';

  const handleNext = () => {
    if (activeStep === 0) {
      if (!selectedTicket) {
        setToast({ type: 'error', message: 'Please select a ticket' });
        return;
      }
  
      setTotalPrice(quantity * Number(selectedTicket.price.replace(/[^\d.-]/g, '')));
    }
  
    if (activeStep === 1) {
      if (!fullName || !phoneNumber || !email) {
        setToast({ type: 'error', message: 'All fields are required.' });
        return;
      }
    }
  
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleTicketSelection = (ticket: { name: string; price: string }) => {
    setSelectedTicket(ticket);
    setQuantity(1);
    setTotalPrice(Number(ticket.price.replace(/[^\d.-]/g, '')));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Math.max(1, Number(e.target.value)); 
    setQuantity(newQuantity);
    setTotalPrice(newQuantity * Number(selectedTicket?.price.replace(/[^\d.-]/g, '') || '0'));
    setAdditionalEmails(Array(newQuantity).fill(''));
  };

  const handleAdditionalEmailChange = (index: number, value: string) => {
    const updatedEmails = [...additionalEmails];
    updatedEmails[index] = value;
    setAdditionalEmails(updatedEmails);
  };

  const handlePurchase = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setToast({ type: 'error', message: 'Please login to continue' });
        return;
      }

      const paymentPayload = {
        ticketId: selectedTicket?.name || '',
        quantity,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phoneNumber,
        additionalEmails: additionalEmails.filter(email => email.trim()),
        amount: totalPrice,
      };

      console.log('Sending payment request:', {
        url: 'https://v-ticket-backend.onrender.com/api/v1/payment/create-payment-link',
        payload: paymentPayload,
        token: token.substring(0, 20) + '...' // Log partial token for debugging
      });

      const response = await axios.post(
        'https://v-ticket-backend.onrender.com/api/v1/payment/create-payment-link',
        paymentPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      console.log('Payment API Response:', response.data);

      if (response.data?.paymentLink) {
        window.location.href = response.data.paymentLink;
      } else {
        setToast({ type: 'error', message: 'Failed to generate payment link' });
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Payment API Error Details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            data: error.config?.data
          }
        });

        const errorMessage = error.response?.data?.message 
          || error.message 
          || 'Payment processing failed';

        setToast({ 
          type: 'error', 
          message: `Error: ${errorMessage}. Status: ${error.response?.status || 'unknown'}` 
        });
      } else {
        console.error('Unexpected error:', error);
        setToast({ 
          type: 'error', 
          message: 'An unexpected error occurred. Please try again.' 
        });
      }
    }
  };
  
  const closeReceipt = () => {
    setIsPurchased(false);
    closeForm();
  };

  const steps = ['Select Ticket', 'Order Information', 'Payment'];

  const renderPaymentStep = () => (
    <div className="mb-4">
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Payment Summary
      </Typography>
      <div className="space-y-4 mt-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Typography variant="body1" className="mb-2">
            Ticket: {selectedTicket?.name}
          </Typography>
          <Typography variant="body1" className="mb-2">
            Quantity: {quantity}
          </Typography>
          <Typography variant="body1" className="mb-2">
            Price per ticket: ₦{Number(selectedTicket?.price).toLocaleString()}
          </Typography>
          <Typography variant="h6" className="mt-4 text-green-600">
            Total Amount: ₦{totalPrice.toLocaleString()}
          </Typography>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Typography variant="body1" className="mb-2">
            Name: {fullName}
          </Typography>
          <Typography variant="body1" className="mb-2">
            Email: {email}
          </Typography>
          <Typography variant="body1">
            Phone: {phoneNumber}
          </Typography>
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={handlePurchase}
          fullWidth
          sx={{ mt: 2 }}
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 bg-white">
      <div className="rounded-lg shadow-lg p-6 bg-white text-gray-800 w-[600px]">
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
          <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Purchase Ticket
          </Typography>
          <Button onClick={closeForm} sx={{ color: 'red', fontSize: '1.2rem' }}>×</Button>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={(e) => e.preventDefault()}>
          {activeStep === 0 && (
            <div className="mb-4">
              <FormControl fullWidth margin="normal">
                <InputLabel id="ticket-select-label">Select Ticket</InputLabel>
                <Select
                  labelId="ticket-select-label"
                  value={selectedTicket?.name || ''}
                  label="Select Ticket"
                  onChange={(e) => {
                    const ticket = tickets.find((t) => t.name === e.target.value);
                    if (ticket) handleTicketSelection(ticket);
                  }}
                  required
                >
                  {(tickets || []).map((ticket) => (
                    <MenuItem key={ticket.name} value={ticket.name}>
                      {ticket.name} - ₦{ticket.price}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedTicket && (
                <TextField
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  fullWidth
                  margin="normal"
                  inputProps={{ min: 1 }}
                />
              )}
              {selectedTicket && (
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Total Price: ₦{totalPrice.toLocaleString()}
                </Typography>
              )}
            </div>
          )}

          {activeStep === 1 && (
            <div className="mb-4 max-h-96 overflow-y-auto">
              <TextField
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              {quantity > 1 && (
                <div>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Additional Email Addresses (for each additional ticket):
                  </Typography>
                  {Array.from({ length: quantity - 1 }, (_, index) => (
                    <TextField
                      key={index}
                      label={`Additional Email ${index + 2}`}
                      value={additionalEmails[index]}
                      onChange={(e) => handleAdditionalEmailChange(index, e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeStep === 2 && renderPaymentStep()}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={activeStep === 2 && (!fullName || !email || !phoneNumber || !selectedTicket)}
            >
              {activeStep === 2 ? 'Proceed to Payment' : 'Next'}
            </Button>
          </Box>
        </form>
        </>
        )}


      </div>
    </div>
  );
};

export default TicketTypeForm;
