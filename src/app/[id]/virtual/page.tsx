'use client';

// CORE IMPORTS
import { lazy, Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { BASE_URL } from '../../../../config';
import { type Event } from '@/types/event';

// ALWAYS-LOADED COMPONENTS (NO LAZY LOAD)
import Loader from '@/components/ui/loader/Loader';
import Toast from '@/components/ui/Toast';
import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';
import TicketTypeForm from '@/app/components/TicketTypeForm';
import LatestEvent from '@/app/components/home/LatestEvent';

// LAZY LOADED COMPONENTS (USING DEFAULT EXPORTS)
const VirtualEventCountdown = lazy(() => import('./components/VirtualEventCountdown'));
const VirtualEventHero = lazy(() => import('./components/VirtualEventHero'));
const VirtualEventDetails = lazy(() => import('./components/VirtualEventDetails'));
const VirtualEventTickets = lazy(() => import('./components/VirtualEventTickets'));
const VirtualEventShare = lazy(() => import('./components/VirtualEventShare'));
const VirtualEventHost = lazy(() => import('./components/VirtualEventHost'));
const EventHostSection = lazy(() => import('../event/components/EventHostSection').then(m => ({ default: m.EventHostSection })));
const EventGallerySection = lazy(() => import('../event/components/EventGallerySection'));

export default function VirtualEventPage() {
  // STATE MANAGEMENT
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<{
    id: string;
    name: string;
    price: string;
    quantity: string;
    sold: string;
    details?: string;
  } | null>(null);

  // ROUTING
  const params = useParams();
  const eventSlug = params?.id;
  const router = useRouter();

  // DATA FETCHING WITH CLEANUP
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchEvent = async () => {
      if (!eventSlug) return;

      try {
        setLoading(true);
        // USE THE SAME ENDPOINT STRUCTURE AS EventDetail.tsx
        const response = await axios.get(`${BASE_URL}api/v1/events/slug/${eventSlug}`, {
          signal: controller.signal
        });
        
        if (!response.data.event.isVirtual && isMounted) {
          // REDIRECT TO REGULAR EVENT PAGE IF NOT VIRTUAL
          router.push(`/${eventSlug}`);
          return;
        }

        if (isMounted) setEvent(response.data.event);
      } catch (error) {
        if (isMounted && !axios.isCancel(error)) {
          console.error('Error fetching event:', error);
          setToast({ 
            type: 'error', 
            message: (axios.isAxiosError(error) && error.response?.data?.message) || 'Failed to load virtual event' 
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEvent();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [eventSlug, router]);

  // LOADING STATE
  if (loading) return <Loader />;

  // EVENT NOT FOUND STATE
  if (!event) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <p className="text-gray-700 dark:text-gray-300">Event not found</p>
    </div>
  );

  // MAIN RENDER
  return (
    <div className="virtual-event-page bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-950">
      {/* TOAST NOTIFICATION */}
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* HEADER */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:space-y-8 space-y-4">
        {/* VIRTUAL EVENT HERO SECTION */}
        <Suspense fallback={<div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />}>
          <VirtualEventHero event={event} />
        </Suspense>

        {/* VIRTUAL EVENT HOST */}
        <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />}>
          <EventHostSection event={event} />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            {/* VIRTUAL EVENT DETAILS */}
            <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />}>
              <VirtualEventDetails event={event} />
            </Suspense>
            
            {/* VIRTUAL EVENT COUNTDOWN */}
            <Suspense fallback={<div className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />}>
              <VirtualEventCountdown event={event} />
            </Suspense>
          </div>
  
          <div className="space-y-8">
            <Suspense fallback={<div className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />}>
              <VirtualEventHost event={event} />
            </Suspense>
            
            {/* VIRTUAL EVENT SHARE */}
            <Suspense fallback={<div className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />}>
              <VirtualEventShare event={event} />
            </Suspense>
          </div>
        </div>

        {/* VIRTUAL EVENT TICKETS */}
        <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />}>
          <VirtualEventTickets 
            event={event}
            setShowTicketForm={setShowTicketForm}
            setSelectedTicket={setSelectedTicket}
          />
        </Suspense>

        {/* GALLERY SECTION */}
        <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />}>
          <EventGallerySection event={event} />
        </Suspense>

        {/* LATEST EVENTS */}
        <LatestEvent />
      </main>

      {/* TICKET FORM MODAL */}
      {showTicketForm && (
        <TicketTypeForm
          closeForm={() => setShowTicketForm(false)}
          tickets={selectedTicket ? [selectedTicket] : []}
          eventSlug={eventSlug as string}
          setToast={setToast}
        />
      )}

      {/* FOOTER */}
      <Footer />
    </div>
  );
}