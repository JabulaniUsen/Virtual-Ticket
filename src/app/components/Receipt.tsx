'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import jsPDF from 'jspdf';
import axios from 'axios';
import { BASE_URL } from '../../config';


type ReceiptProps = {
  closeReceipt: () => void;
};

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
}

const Receipt = ({ closeReceipt }: ReceiptProps) => {
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const ticketId = localStorage.getItem('currentTicketId');
        if (!ticketId) {
          throw new Error('No ticket information found');
        }

        const response = await axios.get(
          `${BASE_URL}api/v1/tickets/${ticketId}`
        );

        console.log(ticketId);

        setTicketData(response.data.ticket);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch ticket details');
        setLoading(false);
        console.error('Error fetching ticket:', err);
      }
    };

    fetchTicketData();
  }, []);

  const downloadPDF = () => {
    if (!ticketData) return;

    const doc = new jsPDF();
    doc.text('Ticket Receipt', 105, 10, { align: 'center' });
    doc.setFontSize(12);
    
    // Main ticket holder details
    doc.text(`Name: ${ticketData.fullName}`, 10, 30);
    doc.text(`Ticket Type: ${ticketData.ticketType}`, 10, 40);
    doc.text(`Date: ${new Date(ticketData.purchaseDate).toLocaleString()}`, 10, 50);
    doc.text(`Email: ${ticketData.email}`, 10, 60);
    doc.text(`Phone: ${ticketData.phone}`, 10, 70);
    doc.text(`Total Price: ${ticketData.currency} ${ticketData.price}`, 10, 80);

    // Additional attendees
    if (ticketData.attendees?.length > 0) {
      doc.text('Additional Attendees:', 10, 100);
      ticketData.attendees.forEach((attendee, index) => {
        doc.text(`${index + 1}. ${attendee.name} (${attendee.email})`, 15, 110 + (index * 10));
      });
    }

    // Add QR Code
    doc.addImage(ticketData.qrCode, 'PNG', 120, 90, 50, 50);
    
    doc.save('Ticket_Receipt.pdf');
  };

  if (loading) return <div>Loading ticket details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!ticketData) return <div>No ticket data found</div>;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
    >
      <Box
      sx={{
        padding: '1rem',
        borderRadius: '16px',
        boxShadow: '0px 8px 20px 3px rgba(139, 137, 137, 0.15)',
        background: 'linear-gradient(135deg, rgba(27, 84, 145, 0.39) 0%, rgba(13, 8, 103, 0.81) 100%)',
        position: 'relative',
        width: { xs: '95%', sm: '95%', md: '60%' },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        gap: '10px',
        overflow: 'hidden',
        border: '2px dashed #ddd',
        maxHeight: { xs: '90vh', md: 'auto' },
        overflowY: 'auto',
        '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(to right, rgba(162, 161, 161, 0.21) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(161, 161, 161, 0.21) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
        pointerEvents: 'none',
        },
      }}
      >
      <IconButton
        onClick={closeReceipt}
        sx={{
        position: 'absolute',
        top: 8,
        right: 8,
        color: 'red',
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Ticket Details */}
      <motion.div
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        className="details-section"
        style={{
        flex: 1,
        padding: '16px',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl sm:text-3xl">🎫</span>
        <Typography 
          variant="h5" 
          sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
          className="font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"
        >
          Event Ticket
        </Typography>
        </div>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.975rem', sm: '1rem' } }}><strong>Name:</strong> {ticketData.fullName}</Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.975rem', sm: '1rem' } }}><strong>Ticket Type:</strong> {ticketData.ticketType}</Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.975rem', sm: '1rem' } }}>
        <strong>Purchase Date:</strong> {new Date(ticketData.purchaseDate).toLocaleString()}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.975rem', sm: '1rem' } }}><strong>Email:</strong> {ticketData.email}</Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.975rem', sm: '1rem' } }}><strong>Phone:</strong> {ticketData.phone}</Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.975rem', sm: '1rem' } }}>
        <strong>Total Price:</strong> {ticketData.currency} {ticketData.price}
        </Typography>

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
        onClick={downloadPDF}
        sx={{ marginTop: '16px', width: { xs: '100%', sm: 'auto' } }}
        >
        Download PDF
        </Button>
      </motion.div>

      {/* QR Code Section */}
      <motion.div
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="flex flex-col items-center justify-center w-full md:w-1/3 mt-4 md:mt-0"
      >
        <div className="relative p-4 bg-white rounded-2xl shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl" />
        <Image 
          src={ticketData.qrCode} 
          alt="Ticket QR Code" 
          width={150}
          height={150}
          className="relative z-10 rounded-lg mx-auto"
          priority
          style={{ filter: 'contrast(1.1)' }}
        />
        </div>
        <Typography variant="caption" className="mt-4 text-gray-500 text-center">
        Scan to verify ticket
        </Typography>
      </motion.div>
      </Box>
    </motion.div>
  );
};

export default Receipt;
