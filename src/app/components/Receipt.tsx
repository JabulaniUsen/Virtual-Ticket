'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import jsPDF from 'jspdf';
import axios from 'axios';

type ReceiptProps = {
  name: string;
  ticketType: string;
  email: string;
  quantity: number;
  totalPrice: number;
  closeReceipt: () => void;
  eventId: string;
};

interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
}

const Receipt = ({ name, ticketType, email, quantity, totalPrice, closeReceipt, eventId }: ReceiptProps) => {
  const [eventDetails, setEventDetails] = useState<{ title: string; date: string } | null>(null);
  const uniqueQrValue = `${name}-${email}-${eventId}`;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!eventId) throw new Error('Event ID is missing.');
        const response = await axios.get<Event>(
          `https://v-ticket-backend.onrender.com/api/v1/events/${eventId}`
        );
        const { title, date } = response.data;
        setEventDetails({ title, date });
      } catch (error) {
        console.error('Failed to fetch event details:', error);
      }
    };

    fetchEvent();
  }, [eventId]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Ticket Receipt', 105, 10, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Name: ${name}`, 10, 30);
    doc.text(`Event: ${eventDetails?.title || ticketType}`, 10, 40);
    doc.text(`Date & Time: ${eventDetails?.date || 'N/A'}`, 10, 50);
    doc.text(`Email: ${email}`, 10, 60);
    doc.text(`Quantity: ${quantity}`, 10, 70);
    doc.text(`Total Price: ₦${totalPrice.toLocaleString()}`, 10, 80);

    const canvas = document.querySelector('canvas');
    if (canvas) {
      const qrImage = canvas.toDataURL('image/png');
      doc.addImage(qrImage, 'PNG', 120, 90, 50, 50);
    }

    doc.save('Ticket_Receipt.pdf');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
      }}
    >
      <Box
        sx={{
          padding: '1rem',
          borderRadius: '16px',
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
          backgroundColor: 'rgba(233, 221, 132, 0.99)',
          position: 'relative',
          width: '60%',
          display: 'flex',
        //   alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          overflow: 'hidden',
          border: '2px dashed #ddd',
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }}
      >
        {/* Close Button */}
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

        {/* Event Details */}
        <motion.div
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          className="details-section"
          style={{
            flex: 1,
            padding: '16px',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
            🎟️ Ticket Receipt
          </Typography>
          <Typography variant="body1"><strong>Name:</strong> {name}</Typography>
          {/* <Typography variant="body1"><strong>Event:</strong> {eventDetails?.title || ticketType}</Typography> */}
          <Typography variant="body1"><strong>Ticket-Type:</strong> {ticketType}</Typography>
          <Typography variant="body1"><strong>Date & Time:</strong> {eventDetails?.date || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Email:</strong> {email}</Typography>
          <Typography variant="body1"><strong>Quantity:</strong> {quantity}</Typography>
          <Typography variant="body1"><strong>Total Price:</strong> ₦{totalPrice.toLocaleString()}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={downloadPDF}
            sx={{ marginTop: '16px' }}
          >
            Download PDF
          </Button>
        </motion.div>

        {/* QR Code */}
        <motion.div
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          className="qr-section"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            backgroundColor: '#f9f9f9',
            borderRadius: '12px',
          }}
        >
          <QRCodeCanvas value={uniqueQrValue} size={160} />
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default Receipt;
