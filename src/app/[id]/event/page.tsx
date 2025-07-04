'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { BASE_URL } from '../../../../config';
import { type Event, type Ticket } from '@/types/event';
import Loader from '../../../components/ui/loader/Loader';
import Toast from '../../../components/ui/Toast';
import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';

const EventHeroSection = React.lazy(() => import('./components/EventHeroSection').then(module => ({ default: module.EventHeroSection })));
const EventHostSection = React.lazy(() => import('./components/EventHostSection').then(module => ({ default: module.EventHostSection })));
const EventLocationSection = React.lazy(() => import('./components/EventLocation').then(module => ({ default: module.EventLocationSection })));
const EventTicketsSection = React.lazy(() => import('./components/TicketCard').then(module => ({ default: module.EventTicketsSection })));
const ShareEventSection = React.lazy(() => import('./components/ShareEventSec').then(module => ({ default: module.ShareEventSection })));
const EventGallerySection = React.lazy(() => import('./components/EventGallerySection'));
const TicketTypeForm = React.lazy(() => import('../../components/TicketTypeForm'));
const LatestEvent = React.lazy(() => import('@/app/components/home/LatestEvent'));

type ToastType = {
  type: 'error' | 'success';
  message: string;
} | null;

const EventDetail = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastType>(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  
  // Refs and routing
  const ticketsSectionRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const eventSlug = params?.id;

  // Memoized handlers
  const handleGetTicket = useCallback((ticket: Ticket) => {
    setSelectedTicket(ticket.details ? ticket : null);
    setShowTicketForm(true);
  }, []);

  const closeTicketForm = useCallback(() => {
    setShowTicketForm(false);
    setSelectedTicket(null);
  }, []);

  const scrollToTickets = useCallback(() => {
    ticketsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const showToast = useCallback((toast: ToastType) => {
    setToast(toast);
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // CREATE AN ABORT CONTROLLER FOR CLEANUP
    const controller = new AbortController();
    let isMounted = true;

    const fetchEvent = async () => {
        if (!eventSlug) return;

        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}api/v1/events/slug/${eventSlug}`, {
                signal: controller.signal // PASS THE ABORT SIGNAL
            });
            
            // ONLY UPDATE STATE IF COMPONENT IS STILL MOUNTED
            if (isMounted) {
                setEvent(response.data.event);
            }
        } catch (err) {
            // CHECK IF THE ERROR IS FROM ABORTING
            if (isMounted && !axios.isCancel(err)) {
                console.error('Failed to fetch event:', err);
                showToast({ type: 'error', message: 'Failed to load event details.' });
            }
        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
    };

    fetchEvent();

    // CLEANUP FUNCTION - THIS WILL RUN WHEN COMPONENT UNMOUNTS
    return () => {
        isMounted = false;
        controller.abort(); // THIS WILL CANCEL ANY ONGOING REQUESTS
    };
  }, [eventSlug, showToast]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="event-page-container text-gray-900 dark:text-gray-100 bg-gray-300/40 dark:bg-gray-900">
      {/* Global components */}
      <Header />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="event-page-main bg-gray-100 dark:bg-gray-900">
        {event && (
          <React.Suspense fallback={<Loader />}>
            {/* Event sections with lazy loading */}
            <EventHeroSection event={event} scrollToTickets={scrollToTickets} />
            <EventHostSection event={event} />
            <EventLocationSection event={event} />
            
            <div ref={ticketsSectionRef}>
              <EventTicketsSection 
                event={event} 
                eventSlug={eventSlug as string} 
                handleGetTicket={handleGetTicket} 
              />
            </div>
            
            <ShareEventSection eventSlug={eventSlug as string} setToast={showToast} />
            <EventGallerySection event={event} />
          </React.Suspense>
        )}

        <React.Suspense fallback={<div>Loading related events...</div>}>
          <LatestEvent />
        </React.Suspense>

        {/* Modal with lazy loading */}
        {showTicketForm && (
          <React.Suspense fallback={<Loader />}>
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
              setToast={showToast}
            />
          </React.Suspense>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default React.memo(EventDetail);