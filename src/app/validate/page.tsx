'use client';

import React, { useEffect, useState } from 'react';
// import {  useSearchParams } from 'next/navigation';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

interface Attendee {
  name: string;
  email: string;
}

interface TicketData {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  eventId: string;
  ticketType: string;
  price: number;
  purchaseDate: string;
  qrCode: string;
  currency: string;
  attendees: Attendee[];
  scanned: boolean;
}

const ValidatePage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const ticketId = searchParams.get('ticketId');
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        // if (!ticketId) {
        //   throw new Error('No ticket information found');
        // }

        const response = await axios.get(
          `${BASE_URL}/api/v1/tickets/57014e68-ed01-41dc-84e2-a2bb32b0f84e`
        );

        setTicketData(response.data.ticket);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch ticket details');
        setLoading(false);
        console.error('Error fetching ticket:', err);
      }
    };

    fetchTicketData();
  });

  const handleValidate = async () => {
    if (!ticketData) return;

    try {
      const response = await axios.patch(
        `${BASE_URL}/api/v1/tickets/${ticketData.id}/validate`,
        { scanned: true }
      );

      setTicketData({ ...ticketData, scanned: true });
      console.log("Response: ", response);
      alert('Ticket validated successfully!');
    } catch (err) {
      console.error('Error validating ticket:', err);
      alert('Failed to validate ticket');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><CircularProgress /></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  if (!ticketData) return <div className="flex justify-center items-center min-h-screen">No ticket data found</div>;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 px-4 py-8"
    >
      <Box
        sx={{
          padding: '1rem',
          borderRadius: '16px',
          boxShadow: '0px 8px 20px 3px rgba(139, 137, 137, 0.15)',
          background: 'linear-gradient(135deg, rgba(27, 84, 145, 0.39) 0%, rgba(13, 8, 103, 0.81) 100%)',
          width: { xs: '95%', sm: '95%', md: '60%' },
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          overflow: 'hidden',
          border: '2px dashed #ddd',
        }}
      >
        <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} className="font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent text-center">
          Validate Ticket
        </Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.975rem', sm: '1rem' } }}><strong>Name:</strong> {ticketData.fullName}</Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.975rem', sm: '1rem' } }}><strong>Ticket Type:</strong> {ticketData.ticketType}</Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.975rem', sm: '1rem' } }}><strong>Purchase Date:</strong> {new Date(ticketData.purchaseDate).toLocaleString()}</Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.975rem', sm: '1rem' } }}><strong>Email:</strong> {ticketData.email}</Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.975rem', sm: '1rem' } }}><strong>Phone:</strong> {ticketData.phone}</Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.975rem', sm: '1rem' } }}><strong>Total Price:</strong> {ticketData.currency} {ticketData.price}</Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.975rem', sm: '1rem' } }}><strong>Status:</strong> {ticketData.scanned ? 'Scanned' : 'Not Scanned'}</Typography>

        {ticketData.attendees?.length > 0 && (
          <div className="mt-4">
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: { xs: '0.975rem', sm: '1rem' } }}>
              Additional Attendees:
            </Typography>
            {ticketData.attendees.map((attendee, index) => (
              <Typography key={index} variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {attendee.name} ({attendee.email})
              </Typography>
            ))}
          </div>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleValidate}
          disabled={ticketData.scanned}
          sx={{ marginTop: '16px', width: '100%' }}
        >
          {ticketData.scanned ? 'Already Scanned' : 'Validate Ticket'}
        </Button>
      </Box>
    </motion.div>
  );
};

export default ValidatePage;