'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import jsPDF from 'jspdf';
import axios from 'axios';
import { BASE_URL, DISCORD_URL, TELEGRAM_URL, WHATSAPP_URL } from '../../../config';
import TicketLoader from '@/components/ui/loader/ticketLoader';
import SocialChannelsCTA from '@/components/SocialChannelsCTA';
import ErrorHandler from '@/components/ErrorHandler';

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
  // Fetch ticket data from API
  const fetchTicketData = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const ticketId = searchParams.get('ticketId');
      if (!ticketId) throw new Error('No ticket information found in URL');
      const { data } = await axios.get(`${BASE_URL}api/v1/tickets/${ticketId}`);
      setTicketData(data.ticket);
      setError(null);
    } catch (err) {
      setError('Failed to fetch ticket details');
      console.log(err);
      setTicketData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Retry handler for ErrorHandler
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchTicketData();
  };


  // SHOW LOADER WHILE FETCHING DATA
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
        <TicketLoader />
      </div>
    );
  }
  // SHOW ERROR HANDLER IF ERROR OCCURS
  if (error) {
    return (
        <ErrorHandler
          error={error}
          onClose={closeReceipt}
          retry={handleRetry}
    />
    );
  }
  if (!ticketData) {
    return (
      <ErrorHandler
      error="No ticket data available"
      onClose={closeReceipt}
      retry={handleRetry}
    />
    );
  }

  const downloadPDF = async () => {
    if (!ticketData) return;
  
    // Fetch the QR code image and convert it to base64
    const qrCodeBase64 = await fetchQRCodeAsBase64(ticketData.qrCode);
  
    const doc = new jsPDF();
  
    // Set a professional background color
    doc.setFillColor(245, 245, 245); // Light gray background
    doc.rect(0, 0, 210, 297, 'F');
  
    // Header Section
    doc.setFillColor(25, 103, 210); // Dark blue header
    doc.rect(0, 0, 210, 50, 'F');
  
    // Add V-Tickets logo and text
    const logoWidth = 20;
    const logoHeight = 20;
    const logoX = 15;
    const logoY = 15;
  
    doc.addImage('/favicon.png', 'PNG', logoX, logoY, logoWidth, logoHeight);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255); // White text
    doc.text('V-Tickets', logoX + logoWidth + 5, logoY + logoHeight / 2 + 4);
  
    // Header Title
    doc.setFontSize(24);
    doc.text('Event Ticket', 105, 30, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Official Receipt', 105, 40, { align: 'center' });
  
    // Decorative Line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, 55, 190, 55);
  
    // Main Content Section
    const startY = 70;
    const leftMargin = 20;
    const lineHeight = 10;
  
    // Ticket holder details in a box
    doc.setFillColor(255, 255, 255); // White background for the box
    doc.roundedRect(leftMargin, startY - 5, 170, 75, 5, 5, 'F'); // Rounded corners
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(25, 103, 210); // Dark blue text
    doc.text('Ticket Details', leftMargin + 10, startY);
  
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0); // Black text
    doc.text(`Name: ${ticketData.fullName}`, leftMargin + 10, startY + lineHeight);
    doc.text(`Ticket Type: ${ticketData.ticketType}`, leftMargin + 10, startY + lineHeight * 2);
    doc.text(`Date: ${new Date(ticketData.purchaseDate).toLocaleString()}`, leftMargin + 10, startY + lineHeight * 3);
    doc.text(`Email: ${ticketData.email}`, leftMargin + 10, startY + lineHeight * 4);
    doc.text(`Phone: ${ticketData.phone}`, leftMargin + 10, startY + lineHeight * 5);
  
    // Price section
    doc.setFillColor(230, 240, 255); // Light blue background
    doc.roundedRect(leftMargin, startY + 80, 170, 20, 5, 5, 'F');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 103, 210); // Dark blue text
    doc.text(`Total Price: ${ticketData.currency} ${ticketData.price}`, leftMargin + 10, startY + 90);
  
    // Additional attendees
    if (ticketData.attendees?.length > 0) {
      const attendeesStartY = startY + 110;
      doc.setFillColor(255, 255, 255); // White background for the box
      doc.roundedRect(leftMargin, attendeesStartY - 5, 170, 10 + (ticketData.attendees.length * lineHeight), 5, 5, 'F');
  
      doc.setFont("helvetica", "bold");
      doc.setTextColor(25, 103, 210); // Dark blue text
      doc.text('Additional Attendees:', leftMargin + 10, attendeesStartY);
  
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0); // Black text
      ticketData.attendees.forEach((attendee, index) => {
        doc.text(
          `${index + 1}. ${attendee.name} (${attendee.email})`,
          leftMargin + 10,
          attendeesStartY + 10 + (index * lineHeight)
        );
      });
    }
  
    // QR Code Section
    const qrSize = 60;
    const qrX = 130;
    const qrY = 180;
  
    doc.setFillColor(255, 255, 255); // White background for the QR code box
    doc.roundedRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 5, 5, 'F');
    doc.addImage(qrCodeBase64, 'PNG', qrX, qrY, qrSize, qrSize);
  
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128); // Gray text
    doc.text('Scan QR Code at event entry', qrX + qrSize / 2, qrY + qrSize + 10, { align: 'center' });
  
    // Footer Section
    const footerY = 270;
    doc.setDrawColor(25, 103, 210); // Dark blue line
    doc.setLineWidth(0.5);
    doc.line(20, footerY, 190, footerY);
  
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128); // Gray text
    doc.text('This is an official ticket. Please present this document at the event.', 105, footerY + 10, { align: 'center' });
    doc.text(`Generated on ${new Date().toLocaleString()}`, 105, footerY + 15, { align: 'center' });
  
    // Save the PDF
    const sanitizedName = ticketData.fullName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`${sanitizedName}_Virtual_Ticket.pdf`);
  };

  const fetchQRCodeAsBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error fetching QR code:', error);
      throw new Error('Failed to fetch QR code');
    }
  };


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
          padding: { xs: '1rem', md: '1.5rem' },
          borderRadius: '16px',
          boxShadow: '0px 8px 20px 3px rgba(139, 137, 137, 0.15)',
          background: 'linear-gradient(135deg, rgba(27, 84, 145, 0.39) 0%, rgba(13, 8, 103, 0.81) 100%)',
          position: 'relative',
          width: { xs: '95%', sm: '90%', md: '70%', lg: '60%' },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          gap: { xs: '16px', md: '24px' },
          overflow: 'hidden',
          border: '2px dashed rgba(221, 221, 221, 0.3)',
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
        {/* Close Button */}
        <IconButton
          onClick={closeReceipt}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: '#fff',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Ticket Details */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          style={{
            flex: 1,
            padding: '2px',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl sm:text-3xl">🎫</span>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem' },
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #6a11cb, #2575fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Event Ticket
            </Typography>
          </div>

          <Typography variant="body1" sx={{ fontSize: { xs: '0.975rem', sm: '1rem' }, mb: 1.5, color: '#fff' }}>
            <strong >Name:</strong> {ticketData.fullName}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: '0.975rem', sm: '1rem' }, mb: 1.5, color: '#fff' }}>
            <strong>Ticket Type:</strong> {ticketData.ticketType}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: '0.975rem', sm: '1rem' }, mb: 1.5, color: '#fff' }}>
            <strong>Purchase Date:</strong> {new Date(ticketData.purchaseDate).toLocaleString()}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: '0.975rem', sm: '1rem' }, mb: 1.5, color: '#fff' }}>
            <strong>Email:</strong> {ticketData.email}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: '0.975rem', sm: '1rem' }, mb: 1.5, color: '#fff' }}>
            <strong>Phone:</strong> {ticketData.phone}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: '0.975rem', sm: '1rem' }, mb: 1.5, color: '#fff' }}>
            <strong>Total Price:</strong> {ticketData.currency} {ticketData.price}
          </Typography>

          {ticketData.attendees?.length > 0 && (
            <div className="mt-4 text-white">
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: { xs: '0.975rem', sm: '1rem' }, mb: 1 }}>
                Additional Attendees:
              </Typography>
              {ticketData.attendees.map((attendee, index) => (
                <Typography key={index} variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, mb: 1 }}>
                  {attendee.name} ({attendee.email})
                </Typography>
              ))}
            </div>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={downloadPDF}
            sx={{
              marginTop: '16px',
              width: { xs: '100%', sm: 'auto' },
              background: 'linear-gradient(45deg, #6a11cb, #2575fc)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2575fc, #6a11cb)',
              },
            }}
          >
            Download PDF
          </Button>
        </motion.div>

        {/* QR Code Section */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="w-full md:w-[40%] mt-4 md:mt-0"
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
          <Typography variant="caption" sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' }}>
            Scan to verify ticket
          </Typography>
        </motion.div>

        <div className="w-full mt-6 sm:hidden block">
           <SocialChannelsCTA
             telegramUrl={TELEGRAM_URL}
             whatsappUrl={WHATSAPP_URL}
             discordUrl={DISCORD_URL}
             variant="ticket"
           />
         </div>
      </Box>
    </motion.div>
  );
};

export default Receipt;