'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import { CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { formatPrice } from '../../utils/formatPrice';
import Toast from '../../components/ui/Toast';
import { FaTicketAlt } from "react-icons/fa";

interface Event {
  id: string;
  title: string;
  description: string;
  time: string;
  image: string;
  date: string;
  location: string;
  ticketType: TicketType[];
}

interface TicketType {
  name: string;
  sold: string;
  price: string;
  quantity: string;
}

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
  isScanned: boolean;
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

const ValidateContent = () => {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('ticketId');
  const signature = searchParams.get('signature');
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string; } | null>(null);
  const eventId = ticketData?.eventId;
  const [event, setEvent] = useState<Event | undefined>();

  const handleValidate = async () => {
    if (!ticketData || !signature || isScanned) return;
   

    try {
      const response = await axios.get(
        `${BASE_URL}api/v1/tickets/validate-ticket?ticketId=${ticketId}&signature=${signature}`
      );

      setTicketData({ ...ticketData, isScanned: true });
      console.log('Ticket validated:', response.data);
      setToast({ type: 'success', message: 'Ticket validated successfully!' });
    } catch (err) {
      console.error('Error validating ticket:', err);
      setToast({ type: 'error', message: 'Failed to validate ticket' });
    }
  };


  useEffect(() => {
    const fetchTicketData = async () => {
      try {
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
  }, [ticketId]);

  useEffect(() => {
    const fetchTicketEvent = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}api/v1/events/${eventId}`
        );

        console.log('Event details:', response.data);
        const eventData = response.data.event;
        setEvent(eventData);
      } catch (err) {
        console.error('Error fetching event details:', err);
      }
    }

    fetchTicketEvent();
  }, [eventId]);

  if (loading) return <div className="flex justify-center items-center min-h-screen"><CircularProgress /></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  if (!ticketData) return <div className="flex justify-center items-center min-h-screen">No ticket data found</div>;

  
  const isScanned = ticketData.isScanned;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col p-2 sm:p-6 space-y-4 sm:space-y-10">
  {toast && <Toast {...toast} onClose={() => setToast(null)} />}

  {/* Header Section */}
  <header className="flex justify-between items-center py-4">
    <div className="flex items-center gap-4">
      <FaTicketAlt className="w-8 h-8 text-blue-500" />
      <h1 className="text-xl font-extrabold tracking-wide">V-Tickets</h1>
    </div>
  </header>

  {/* Main Content */}
  <main className="flex flex-col items-center space-y-5 sm:space-y-10">
    {/* Title Section */}
    <section className="text-center space-y-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-3xl font-bold tracking-tight text-gray-200"
      >
        Ticket Validation Portal
      </motion.h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`inline-block sm:text-lg font-medium rounded-lg shadow-lg ${
          isScanned ? 'bg-green-600' : 'bg-purple-600'
        }`}
        style={{
          borderRadius: '1rem',
          padding: '0.5rem',
          fontSize: '.9rem'
        }}
      >
        {isScanned === true ? '✓ Validated' : '⏳ Pending Validation'}
      </motion.div>
    </section>

    {event && (
      <div
        className="relative w-full max-w-6xl h-64 md:h-80 bg-cover bg-center rounded-lg overflow-hidden"
        style={{ backgroundImage: `url(${event.image})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">{event.title}</h1>
          <p className="text-lg sm:text-xl text-gray-300 mt-2">{new Date(event.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}, {event.time}</p>
        </div>
      </div>
    )}


    {/* Ticket and Attendee Details */}
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto px-4 py-8">
      {/* Ticket Information */}
      <div className="p-0">
        <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">Ticket Information</h3>
        <div className="space-y-4">
          {event && <InfoField label="Event" value={event.title} className="text-lg" />}
          <InfoField label="Ticket Type" value={ticketData.ticketType} className="text-lg" />
          <InfoField
            label="Purchase Date"
            value={new Date(ticketData.purchaseDate).toLocaleString()}
            className="text-lg"
          />
          <InfoField
            label="Price"
            value={formatPrice(ticketData.price, ticketData.currency)}
            className="text-lg font-semibold text-green-400"
          />
        </div>
      </div>

      {/* Attendee Information */}
      <div className="p-0">
        <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">Attendee Details</h3>
        <div className="space-y-4">
          <InfoField label="Name" value={ticketData.fullName} className="text-lg" />
          <InfoField label="Email" value={ticketData.email} className="text-lg" />
          <InfoField label="Phone" value={ticketData.phone} className="text-lg" />
        </div>
      </div>
    </section>


    {/* Additional Attendees */}
      {ticketData.attendees?.length > 0 && (
        <section className="w-full max-w-6xl mx-auto px-4 py-8">
          <h3 className="text-2xl font-semibold mb-6">Additional Attendees</h3>
          <div className="space-y-4">
            {ticketData.attendees.map((attendee, index) => (
              <div
                key={index}
                className="flex flex-wrap text-lg border-b border-gray-600 pb-4"
              >
                <p className="font-medium">
                  {attendee.name} - <span className="text-gray-300">{attendee.email}</span>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}


  <motion.button
      onClick={handleValidate}
      disabled={isScanned}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className={`w-full max-w-md py-4 mb-4 text-lg font-bold rounded-lg shadow-xl transform transition-all duration-300 ${
        isScanned
          ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 text-white hover:scale-105 hover:shadow-2xl'
      }`}
      style={{ 
        borderRadius: '1rem',

      }}
    >
    {isScanned ? 'Ticket Already Validated' : 'Validate Ticket Now'}
  </motion.button>


  </main>

 
</div>


  );
};

const ValidatePage = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><CircularProgress /></div>}>
      <ValidateContent />
    </Suspense>
  );
};

export default ValidatePage;
