'use client';

import React, { useEffect, useState } from 'react';
import {  useSearchParams } from 'next/navigation';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { Typography, Button, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { formatPrice } from '../../utils/formatPrice';

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

interface InfoFieldProps {
  label: string;
  value: string | number;
  className?: string;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, className = '' }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500">{label}</span>
    <span className={`${className}`}>{value}</span>
  </div>
);

const ValidatePage = () => {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('ticketId');
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // const ticketId = '57014e68-ed01-41dc-84e2-a2bb32b0f84e';

    const fetchTicketData = async () => {
      try {
        // if (!ticketId) {
        //   throw new Error('No ticket information found');
        // }

        
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
  });

  const handleValidate = async () => {
    if (!ticketData) return;

    try {
      const response = await axios.get(
        `${BASE_URL}api/v1/tickets/validate-ticket`,
        { 
          params: {
            ticketId: ticketData.id,
            scanned: true
          }
         }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-4 md:p-8">
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto"
      >
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
        {/* Header Section */}
        <div className="border-b border-gray-700 pb-6 mb-6">
        <Typography 
          variant="h4" 
          className="text-center font-bold text-white"
          sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}
        >
          Ticket Validation Portal
        </Typography>
        <div className="mt-2 text-center">
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm ${
          ticketData.scanned ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
          } shadow-lg`}>
          {ticketData.scanned ? '✓ Validated' : '⏳ Pending Validation'}
          </span>
        </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ticket Details */}
        <div className="space-y-4 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold text-blue-400">Ticket Information</h2>
          <div className="space-y-4">
          <InfoField label="Ticket Type" value={ticketData.ticketType} className="text-white" />
          <InfoField label="Purchase Date" value={new Date(ticketData.purchaseDate).toLocaleString()} className="text-white" />
          <InfoField 
            label="Price" 
            value={formatPrice(ticketData.price, ticketData.currency)} 
            className="font-semibold text-green-400"
          />
          </div>
        </div>

        {/* Attendee Details */}
        <div className="space-y-4 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold text-blue-400">Attendee Details</h2>
          <div className="space-y-4">
          <InfoField label="Name" value={ticketData.fullName} className="text-white" />
          <InfoField label="Email" value={ticketData.email} className="text-white" />
          <InfoField label="Phone" value={ticketData.phone} className="text-white" />
          </div>
        </div>
        </div>

        {/* Additional Attendees Section */}
        {ticketData.attendees?.length > 0 && (
        <div className="mt-8 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold text-blue-400 mb-4">Additional Attendees</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ticketData.attendees.map((attendee, index) => (
            <div 
            key={index}
            className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
            >
            <p className="font-medium text-white">{attendee.name}</p>
            <p className="text-sm text-gray-300">{attendee.email}</p>
            </div>
          ))}
          </div>
        </div>
        )}

        {/* Action Button */}
        <div className="mt-8">
        <Button
          variant="contained"
          onClick={handleValidate}
          disabled={ticketData.scanned}
          fullWidth
          sx={{
          py: 2,
          bgcolor: ticketData.scanned ? 'rgba(75, 85, 99, 0.8)' : 'rgb(59, 130, 246)',
          '&:hover': {
            bgcolor: ticketData.scanned ? 'rgba(75, 85, 99, 1)' : 'rgb(29, 78, 216)',
          },
          textTransform: 'none',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          }}
        >
          {ticketData.scanned ? 'Ticket Already Validated' : 'Validate Ticket Now'}
        </Button>
        </div>

      </div>
      </motion.div>
    </div>
  );
};

export default ValidatePage;