'use client';

// =================== && •IMPORTS• && ===================
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { type EventFormData, type Ticket } from '@/types/event';
import { EventHeroSection } from './components/EventHeroSection';
import { EventHostSection } from './components/EventHostSection';
import { EventLocationSection } from './components/EventLocation';
import { EventTicketsSection } from './components/TicketCard';
import { ShareEventSection } from './components/ShareEventSec';
import { EventGallerySection } from './components/EventGallerySection';
import TicketTypeForm from '../components/TicketTypeForm';
import Loader from '../../components/ui/loader/Loader';
import Toast from '../../components/ui/Toast';
import Header from '@/app/components/home/Header';
import LatestEvent from '@/app/components/home/LatestEvent';
import Footer from '@/app/components/home/Footer';

const EventDetail = () => {
  // =================== && •STATE & HOOKS• && ===================
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const params = useParams();
  const eventSlug = params?.id;
  const ticketsSectionRef = useRef<HTMLDivElement | null>(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null); // DISABLED ESLINT WARNING
  const [event, setEvent] = useState<EventFormData | null>(null);

  // =================== && •HANDLERS• && ===================
  const handleGetTicket = (ticket: Ticket) => {
    if (ticket.details) {
      setSelectedTicket(ticket);
    }
    setShowTicketForm(true);
  };

  const closeTicketForm = () => {
    setShowTicketForm(false);
    setSelectedTicket(null);
  };

  const scrollToTickets = () => {
    if (ticketsSectionRef.current) {
      ticketsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };


  // =================== && •DATA FETCHING• && ===================
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventSlug) return;

      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}api/v1/events/slug/${eventSlug}`);
        setEvent(response.data.event);
      } catch (err) {
        console.error('Failed to fetch event:', err);
        setToast({ type: 'error', message: 'Failed to load event details.' });
        setTimeout(() => setToast(null), 3000); // AUTO-DISMISS AFTER 3 SECONDS
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventSlug]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="event-page-container text-gray-900 dark:text-gray-100 bg-gray-300/40 dark:bg-gray-900">
      {/* =================== && •LOADER & TOAST• && =================== */}
      {loading && <Loader />}
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* =================== && •HEADER SECTION• && =================== */}
      <Header />

      <div className="event-page-main bg-gray-100 dark:bg-gray-900">
        {event && (
          <>
            {/* =================== && •HERO SECTION• && =================== */}
            <EventHeroSection event={event} scrollToTickets={scrollToTickets} />
            
            {/* =================== && •HOST SECTION• && =================== */}
            <EventHostSection event={event} />
            
            {/* =================== && •LOCATION SECTION• && =================== */}
            <EventLocationSection event={event} />
            
            {/* =================== && •TICKETS SECTION• && =================== */}
            <EventTicketsSection 
              event={event} 
              eventSlug={eventSlug as string} 
              handleGetTicket={handleGetTicket} 
              ref={ticketsSectionRef}
            />
            
            {/* =================== && •COPY EVENT LINK SECTION• && =================== */}
            <ShareEventSection eventSlug={eventSlug as string} setToast={setToast} />
            
            {/* =================== && •GALLERY SECTION• && =================== */}
            <EventGallerySection event={event} />
          </>
        )}

        <LatestEvent />

        {/* =================== && •TICKET FORM MODAL• && =================== */}
        {showTicketForm && (
          <TicketTypeForm
            closeForm={closeTicketForm}
            tickets={event?.ticketType.map(ticket => ({
              id: event.id || '',
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
      </div>

      {/* =================== && •FOOTER SECTION• && =================== */}
      <Footer />
    </div>
  );
};

export default EventDetail;