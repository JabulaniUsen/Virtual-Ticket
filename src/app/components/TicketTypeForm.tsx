'use client'

import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';

type TicketTypeFormProps = {
  closeForm: () => void;
  ticket: { name: string; price: string };
  setToast: (toast: { type: 'success' | 'error'; message: string } | null) => void;
};

const TicketTypeForm = ({ closeForm, ticket, setToast }: TicketTypeFormProps) => {
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(Number(ticket.price.replace(/[^\d.-]/g, ''))); // Clean price
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value);
    setQuantity(newQuantity);
    setTotalPrice(newQuantity * Number(ticket.price.replace(/[^\d.-]/g, '')));
  };

  const handlePurchase = () => {
    const ticketInfo = {
      ticketType: ticket.name,
      quantity,
      totalPrice,
      name,
      email,
    };

    console.log('Ticket Purchased:', ticketInfo);
    setToast({ type: 'success', message: `You have successfully purchased ${quantity} ${ticket.name} tickets.` });
    closeForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Purchase Your {ticket.name} Ticket
          </Typography>
          <Button onClick={closeForm} sx={{ color: 'red', fontSize: '1.2rem' }}>×</Button>
        </Box>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 1 }}
            />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Total Price: ₦{totalPrice.toLocaleString()}
            </Typography>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <Button
              onClick={closeForm}
              sx={{
                py: 2,
                px: 4,
                backgroundColor: 'gray',
                color: 'white',
                borderRadius: '20px',
                ':hover': { backgroundColor: 'darkgray' },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              sx={{
                py: 2,
                px: 4,
                backgroundColor: 'blue',
                color: 'white',
                borderRadius: '20px',
                ':hover': { backgroundColor: 'darkblue' },
              }}
            >
              Purchase
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketTypeForm;
