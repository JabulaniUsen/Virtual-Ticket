// components/EventTicketsSection.tsx
import React, { forwardRef } from 'react';
import { Box, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircleIcon } from 'lucide-react';
import { formatPrice } from '@/utils/formatPrice';
import { type EventFormData } from '@/types/event';
import { type Ticket } from '@/types/event';

interface EventTicketsSectionProps {
    event: EventFormData;
    eventSlug: string;
    handleGetTicket: (ticket: Ticket) => void;
  }

export const EventTicketsSection = forwardRef<HTMLDivElement, EventTicketsSectionProps>(
    ({ event, eventSlug, handleGetTicket }, ref) => {
      return (
        <Box 
          ref={ref} 
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
                {event?.ticketType.map((ticket, index) => (
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
                                {formatPrice(parseFloat(ticket.price), event?.currency || '₦')}
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
     );
});

EventTicketsSection.displayName = 'EventTicketsSection';