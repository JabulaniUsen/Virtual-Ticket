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
        const searchParams = new URLSearchParams(window.location.search);
        const ticketId = searchParams.get('ticketId');

        if (!ticketId) {
          throw new Error('No ticket information found in URL');
        }

        const response = await axios.get(
          `${BASE_URL}api/v1/tickets/${ticketId}`
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
  }, []);

  const downloadPDF = () => {
    if (!ticketData) return;
  
    const doc = new jsPDF();
  
    // Background color
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 0, 210, 297, 'F');
  
    // Header background
    doc.setFillColor(25, 103, 210);
    doc.rect(0, 0, 210, 40, 'F');
  
    // Add V-Tickets logo and text
    const logoWidth = 20; // Adjust size
    const logoHeight = 20;
    const logoX = 10;
    const logoY = 10;
  
    doc.addImage('/favicon.png', 'PNG', logoX, logoY, logoWidth, logoHeight);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('V-Tickets', logoX + logoWidth + 5, logoY + logoHeight / 2 + 4);
  
    // Header Title
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Event Ticket', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Official Receipt', 105, 30, { align: 'center' });
  
    // Decorative Line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);
  
    // Main Content Section
    const startY = 60;
    const leftMargin = 20;
    const lineHeight = 10;
  
    // Ticket holder details in a box
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(leftMargin, startY - 5, 170, 65, 3, 3, 'F');
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text('Ticket Details', leftMargin + 5, startY);
  
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${ticketData.fullName}`, leftMargin + 5, startY + lineHeight);
    doc.text(`Ticket Type: ${ticketData.ticketType}`, leftMargin + 5, startY + lineHeight * 2);
    doc.text(`Date: ${new Date(ticketData.purchaseDate).toLocaleString()}`, leftMargin + 5, startY + lineHeight * 3);
    doc.text(`Email: ${ticketData.email}`, leftMargin + 5, startY + lineHeight * 4);
    doc.text(`Phone: ${ticketData.phone}`, leftMargin + 5, startY + lineHeight * 5);
  
    // Price section
    doc.setFillColor(230, 240, 255);
    doc.roundedRect(leftMargin, startY + 70, 170, 15, 3, 3, 'F');
    doc.setFont("helvetica", "bold");
    doc.text(`Total Price: ${ticketData.currency} ${ticketData.price}`, leftMargin + 5, startY + 80);
  
    // Additional attendees
    if (ticketData.attendees?.length > 0) {
      const attendeesStartY = startY + 95;
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(leftMargin, attendeesStartY - 5, 170, 10 + (ticketData.attendees.length * lineHeight), 3, 3, 'F');
  
      doc.setFont("helvetica", "bold");
      doc.text('Additional Attendees:', leftMargin + 5, attendeesStartY);
  
      doc.setFont("helvetica", "normal");
      ticketData.attendees.forEach((attendee, index) => {
        doc.text(
          `${index + 1}. ${attendee.name} (${attendee.email})`,
          leftMargin + 5,
          attendeesStartY + 10 + (index * lineHeight)
        );
      });
    }
  
    // QR Code
    const qrSize = 50;
    const qrX = 130;
    const qrY = 160;
  
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 3, 3, 'F');
    doc.addImage(ticketData.qrCode, 'PNG', qrX, qrY, qrSize, qrSize);
  
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('Scan QR Code at event entry', qrX + qrSize / 2, qrY + qrSize + 10, { align: 'center' });
  
    // Footer
    const footerY = 270;
    doc.setDrawColor(25, 103, 210);
    doc.setLineWidth(0.5);
    doc.line(20, footerY, 190, footerY);
  
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text('This is an official ticket. Please present this document at the event.', 105, footerY + 10, { align: 'center' });
    doc.text(`Generated on ${new Date().toLocaleString()}`, 105, footerY + 15, { align: 'center' });
  
    const sanitizedName = ticketData.fullName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`${sanitizedName}_Virtual_Ticket.pdf`);
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
