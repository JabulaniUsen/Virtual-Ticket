'use client';

// import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Typography, Button, Grid, Box} from '@mui/material';
import Image from 'next/image';
// import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Loader from '../../../components/ui/loader/Loader';
import Toast from '../../../components/ui/Toast';
// import { IoMenu, IoClose } from "react-icons/io5";
import { FiArrowRight } from 'react-icons/fi';
import {  motion } from "framer-motion";
import { Facebook, Twitter, Instagram } from '@mui/icons-material'; 
import TicketTypeForm from '../../components/TicketTypeForm';
import axios from 'axios';
import Footer from '@/app/components/home/Footer';
import { CheckCircleIcon } from 'lucide-react';
import Header from '@/app/components/home/Header';
import LatestEvent from '@/app/components/home/LatestEvent';
import { formatPrice } from '@/utils/formatPrice';

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  gallery?: string[];
  socialMediaLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  hostName: string;
  ticketType: {
    name: string;
    price: string;
    quantity: string;
    sold: string;
    details?: string;
    attendees?: { name: string; email: string; }[];
  }[];
  userId: string;
  createdAt: string;
  updatedAt: string;
  currency: string;
}

interface Ticket {
  name: string;
  price: string;
  quantity: string;
  sold: string;
  details: string;
  attendees?: { name: string; email: string; }[];
}

const EventDetail = () => {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  // const [setIsLoggedIn] = useState(false);
  const params = useParams();
  const eventSlug = params?.id;
  const ticketsSectionRef = useRef<HTMLDivElement | null>(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [events, setEvent] = useState<Event | null>(null);

  const handleGetTicket = (ticket: Event['ticketType'][0]) => {
    if (ticket.details) {
      setSelectedTicket({
        name: ticket.name,
        price: ticket.price,
        quantity: ticket.quantity,
        sold: ticket.sold,
        details: ticket.details,
        attendees: ticket.attendees
      });
    }
    setShowTicketForm(true);
  };

  useEffect(() => {
    if (selectedTicket) {
      console.log('Selected ticket details:', selectedTicket);
    }
  }, [selectedTicket]);

  useEffect(() => {
    
    const fetchEvent = async () => {
      if (!eventSlug) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `https://v-ticket-backend.onrender.com/api/v1/events/${eventSlug}`
        );
        console.log('Event data:', response.data.event);
        setEvent(response.data.event);
      } catch (err) {
        console.error('Failed to fetch event:', err);
        setToast({ type: 'error', message: 'Failed to load event details.' });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventSlug]);


  const closeTicketForm = () => {
    setShowTicketForm(false);
    setSelectedTicket(null);
  };

  const scrollToTickets = () => {
    if (ticketsSectionRef.current) {
      ticketsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000); 
  }, []);

  const copyLink = () => {
    const link = `${window.location.origin}/events/${eventSlug}`;
    navigator.clipboard.writeText(link);
    setToast({ type: 'success', message: `Event link copied: ${link}` });
  };

  // const openTicketForm = (ticket: Event['ticketType'][0]) => {
  //   setSelectedTicket(ticket);
  //   setShowTicketForm(true);
  // };

  if (loading) {
    return <Loader />;
  }
  return (
    <div
      className="event-page-container text-gray-900 dark:text-gray-100 bg-gray-700/40  dark:bg-gray-900">
      {loading && <Loader />}

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* =================== && •HEADER SECTION• && =================== */}
     
     
      <Header />

      {/* =================== && •MAIN SECTION• && =================== */}
      <div className="event-page-main bg-gray-100 dark:bg-gray-900">


        {/* =================== && •HERO SECTION• && =================== */}
        <div className="relative min-h-[90vh] px-6 py-12 md:px-16 md:py-20 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-950">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
            <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative flex flex-col md:flex-row gap-12 max-w-7xl mx-auto">
            <motion.div
              className="flex-1 relative z-10"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              {events ? (
                <div className="space-y-5">
                  <div className="inline-block">
                    <h1 className="text-4xl md:text-5xl bg-clip-text text-transparent bg-black dark:bg-white leading-tight">
                      {events.title}
                    </h1>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <p className="text-lg font-medium">{events.venue}, {events.location}</p>
                    </div>

                    <div className="flex items-center space-x-3 text-purple-600 dark:text-purple-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <div className="flex items-center space-x-2">
                        <p className="text-lg font-medium">
                          {new Date(events.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <span className="text-gray-400 dark:text-gray-500">|</span>
                        <p className="text-lg font-medium">{events.time}</p>
                        {new Date(events.date) > new Date() && (
                          <span className="ml-2 relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 relative inline-block">
                      DESCRIPTION
                      <span className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 w-[75%] rounded-full"></span>
                    </h5>
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{events.description}</p>
                    <a
                      href="#location"
                      className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 mt-4 inline-block"
                    >
                      View Map
                    </a>
                  </div>



                  <div className="flex items-center gap-4 mt-6">
                  {events?.socialMediaLinks?.instagram && (
                    <a
                      href={events.socialMediaLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg hover:scale-110 transition-transform"
                    >
                      <Instagram />
                    </a>
                  )}
                  {events?.socialMediaLinks?.twitter && (
                    <a
                      href={events.socialMediaLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg hover:scale-110 transition-transform"
                    >
                      <Twitter />
                    </a>
                  )}
                  {events?.socialMediaLinks?.facebook && (
                    <a
                      href={events.socialMediaLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg hover:scale-110 transition-transform"
                    >
                      <Facebook />
                    </a>
                  )}
                </div>

                  <Button
                    variant="contained"
                    sx={{
                      mt: 4,
                      px: 4,
                      py: 1.5,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      ':hover': { 
                        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)'
                      },
                      transition: 'all 0.3s ease'      
                    }}
                    onClick={scrollToTickets}
                  >
                    Get Your Tickets
                  </Button>
                </div>
              ) : (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-blue-200 dark:bg-blue-800 rounded w-3/4"></div>
                  <div className="h-6 bg-blue-200 dark:bg-blue-800 rounded w-1/4"></div>
                  <div className="h-6 bg-blue-200 dark:bg-blue-800 rounded w-1/3"></div>
                  <div className="h-24 bg-blue-200 dark:bg-blue-800 rounded w-full"></div>
                </div>
              )}
            </motion.div>

            <motion.div
              className="flex-1 mt-8 md:mt-0"
              initial={{ opacity: 0, x: 30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ duration: 1 }}
            >
              <div className="relative w-full h-[400px] rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                {events && events.image ? (
                  <Image
                    src={events.image}
                    alt={events.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-2xl"
                    priority
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 flex items-center justify-center">
                    <svg className="w-16 h-16 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>


        {/* Event Host Section */}
        <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-between items-center px-4 md:px-10">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The event is hosted by: 
            <span className="font-semibold"> {events?.hostName}</span>
          </p>
          <div className="flex flex-col">

            <p className="text-gray-900 text-sm dark:text-gray-100 ml-3 p-2">Add To Calender</p>
            {events ? (
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {events.title}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(events.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <FiArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </div>

            ) : (
                <p className="text-gray-600 dark:text-gray-300">Not Available</p>
            )}
          </div>
        </div>

        {/* Location Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-10 text-center px-4 md:px-10"
        >
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 dark:text-gray-100"
          >
            LOCATION
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 "
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Powered by Google Maps <span className="text-blue-500">🌍</span>
            </p>

            {events?.venue ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {events.venue}
              </p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Venue details not available
              </p>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-500 italic">
              Note: Enable location services for directions
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6"
          >
            {events?.venue ? (
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(events.venue)}&output=embed`}
                className="w-full h-72 rounded-lg shadow-lg border-0 transition-all duration-300 hover:shadow-xl"
                loading="lazy"
                title="Event Location Map"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-72 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Map not available</p>
              </div>
            )}
          </motion.div>

        </motion.div>

        {/* =================== && •TICKETS SECTION• && =================== */}
        <Box 
          ref={ticketsSectionRef} 
          className="relative py-12 px-4 sm:py-24 sm:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 relative inline-block">
              Available Tickets
              <div className="absolute left-0 -bottom-4 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>
            </h2>

            <Grid 
              container 
              spacing={2}
              justifyContent="center"
            >
              {events?.ticketType.map((ticket, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Box 
                      className={`
                        relative p-6 sm:p-8 rounded-[1rem] 
                        bg-white dark:bg-gray-800
                        border border-gray-100 dark:border-gray-700
                        transform transition-all duration-300
                        hover:shadow-2xl hover:-translate-y-2
                        dark:hover:shadow-blue-500/20
                        ${parseInt(ticket.quantity) === 0 ? 'opacity-75 grayscale' : ''}
                      `}
                    >
                      {/* Ticket Header */}
                      <div className="relative z-10">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {ticket.name}
                            </h3>
                            <p className="text-2xl sm:text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                              {formatPrice(parseFloat(ticket.price), events?.currency || '₦')}
                            </p>
                          </div>
                          
                          {/* QR Code */}
                          <div className="relative group">
                            <Image
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                              `${window.location.origin}/events/${eventSlug}#tickets`
                            )}&format=png&qzone=2&color=6366F1`}
                            alt={`QR Code for ${ticket.name}`}
                            width={60}
                            height={60}
                            className="rounded-lg shadow-md transition-all duration-300 
                              group-hover:scale-150 group-hover:shadow-xl 
                              bg-white p-1"
                            priority
                            />
                            <div className="absolute -bottom-6 right-0 text-xs bg-gray-800 text-white 
                            px-2 py-1 rounded opacity-0 group-hover:opacity-100 
                            transition-opacity duration-300 whitespace-nowrap">
                            <span className="block">Scan to view ticket</span>
                            <span className="block text-[10px] text-gray-300">{ticket.name}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Indicators */}
                        {parseInt(ticket.quantity) === 0 && (
                          <div className="absolute -rotate-12 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="border-4 border-red-500 text-red-500 px-4 py-1 text-lg font-bold rounded-lg">
                              SOLD OUT
                            </div>
                          </div>
                        )}
                        
                          
                        {parseInt(ticket.quantity) > 0 && parseInt(ticket.quantity) <= 3 && (
                          <div className="absolute -left-8 -top-8 z-20">
                            <div className="animate-pulse"></div>
                            <span className="inline-flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg whitespace-nowrap transform -rotate-10">
                            <span className="mr-1">🔥</span>
                            Only {ticket.quantity} left!
                            </span>
                          </div>
                        )}

                        {/* Ticket Details */}
                        <div className="mt-6 space-y-2 sm:space-y-3">
                          {ticket.details ? (
                            ticket.details.split('\n').map((detail, idx) => (
                              <div key={idx} className="flex items-start space-x-2 sm:space-x-3">
                                <CheckCircleIcon className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300">{detail}</span>
                              </div>
                            ))
                          ) : (
                            <div className="space-y-2 sm:space-y-3">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <CheckCircleIcon className="text-green-500 w-5 h-5 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300">Standard Event Entry</span>
                              </div>
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <CheckCircleIcon className="text-green-500 w-5 h-5 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300">Access to Main Area</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Purchase Button */}
                        <Button
                          fullWidth
                          disabled={parseInt(ticket.quantity) === 0}
                          onClick={() => handleGetTicket(ticket)}
                          sx={{
                            mt: 4,
                            py: 2,
                            borderRadius: '1rem',
                            color: 'white',
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            ':hover': {
                              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)',
                              color: 'white'
                            },
                            transition: 'all 0.3s ease',
                            ':disabled': {
                              background: '#9CA3AF',
                              opacity: 0.7
                            }
                          }}
                        >
                          {parseInt(ticket.quantity) === 0 ? 'Sold Out' : 'Get Ticket'}
                        </Button>
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-gray-100 dark:bg-gray-700 rounded-r-full"></div>
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-gray-100 dark:bg-gray-700 rounded-l-full"></div>
                      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 right-8 border-t-2 border-dashed border-gray-200 dark:border-gray-600"></div>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </div>
        </Box>

      {/* =================== && •TICKET TYPE FORM MODAL• && =================== */}
      {showTicketForm && (
        <TicketTypeForm
          closeForm={closeTicketForm}
          tickets={events?.ticketType.map(ticket => ({
            id: ticket.name,
            name: ticket.name,
            price: ticket.price,
            quantity: ticket.quantity,
            sold: ticket.sold,
            details: ticket.details || ''
          })) || []}
          eventSlug={eventSlug as string}
          setToast={setToast}
        />
      )}


        {/* =================== && •COPY EVENT LINK SECTION• && =================== */}
        <Box className="relative p-8 text-center">
        
          <motion.h5
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xl font-bold mb-4"
          >
            Share the Excitement!
          </motion.h5>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-gray-600 dark:text-gray-300 mb-6"
          >
            Let others know about this amazing event. Click below to copy the event link and spread the word!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <Button
              onClick={copyLink}
              startIcon={<ContentCopyIcon />}
              variant="outlined"
              size="large"
              className="px-6 py-2 font-semibold rounded-full border border-gray-400 hover:border-gray-600 transition-all"
            >
              Copy Event Link
            </Button>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.2 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute top-5 left-5 w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700"
          ></motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.2 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-600"
          ></motion.div>
        </Box>

        {/* =================== && •GALLERY SECTION• && =================== */}
        {events?.gallery && events.gallery.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 5, mb: 8, px: 4 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
              Gallery
            </Typography>
            <div className="flex justify-center gap-4 flex-wrap">
              {events.gallery.map((img, index) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  key={index} 
                  sx={{ 
                    position: 'relative', 
                    overflow: 'hidden', 
                    borderRadius: 2, 
                  }}
                  
                >
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Image 
                      src={img} 
                      alt={`Gallery ${index + 1}`} 
                      width={350} 
                      height={300}
                      className ="h-[50vh] " 
                      style={{ 
                        borderRadius: '8px', 
                        objectFit: 'cover', 
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      }} 
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.5)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </motion.div>
                </Grid>
              ))}
            </div>
          </Box>
        )}

        <LatestEvent />
      </div>


      


      {/* =================== && •FOOTER SECTION• && =================== */}
      <Footer />

    </div>
  );
};

export default EventDetail;