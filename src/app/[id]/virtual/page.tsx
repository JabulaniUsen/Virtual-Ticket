// APP/[ID]/VIRTUAL/PAGE.TSX
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { BASE_URL } from '../../../../config';
import { type EventFormData } from '@/types/event';
import Loader from '@/components/ui/loader/Loader';
import Toast from '@/components/ui/Toast';
import Header from '@/app/components/home/Header';
import Footer from '@/app/components/home/Footer';
import VirtualEventCountdown from './components/VirtualEventCountdown';
import VirtualEventPlatform from './components/VirtualEventPlatform';
import VirtualEventHero from './components/VirtualEventHero';
import VirtualEventDetails from './components/VirtualEventDetails';
import VirtualEventShare from './components/VirtualEventShare';
import VirtualEventTickets from './components/VirtualEventTickets';
import TicketTypeForm from '@/app/components/TicketTypeForm';
import { EventHostSection } from '../event/components/EventHostSection';
import { EventGallerySection } from '../event/components/EventGallerySection';
import VirtualEventHost from './components/VirtualEventHost';
import LatestEvent from '@/app/components/home/LatestEvent';


export default function VirtualEventPage() {
  const [event, setEvent] = useState<EventFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<{
    id: string;
    name: string;
    price: string;
    quantity: string;
    sold: string;
    details: string;
  } | null>(null);
  const params = useParams();
  const eventSlug = params?.id;
  const router = useRouter();

  

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventSlug) return;

      try {
        setLoading(true);
        // USE THE SAME ENDPOINT STRUCTURE AS EventDetail.tsx
        const response = await axios.get(`${BASE_URL}api/v1/events/slug/${eventSlug}`);
        
        if (!response.data.event.isVirtual) {
          // REDIRECT TO REGULAR EVENT PAGE IF NOT VIRTUAL
          router.push(`/${eventSlug}`);
          return;
        }

        setEvent(response.data.event);
      } catch (error) {
        console.error('Error fetching event:', error);
        setToast({ 
          type: 'error', 
          message: (axios.isAxiosError(error) && error.response?.data?.message) || 'Failed to load virtual event' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventSlug, router]);


  if (loading) return <Loader />;

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <p className="text-gray-700 dark:text-gray-300">Event not found</p>
    </div>
  );

  return (
    <div className="virtual-event-page bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-950">
      {/* TOAST NOTIFICATION */}
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* HEADER */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:space-y-8 space-y-4">
        {/* VIRTUAL EVENT HERO SECTION */}
        <VirtualEventHero event={event} />

          {/* VIRTUAL EVENT HOST */}
          <EventHostSection event={event} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            {/* VIRTUAL EVENT DETAILS */}
            <VirtualEventDetails event={event} />
            {/* VIRTUAL EVENT COUNTDOWN */}
            <VirtualEventCountdown event={event} />
          </div>
  
            <div className="space-y-8">
              <VirtualEventHost event={event} />         
              {/* VIRTUAL EVENT SHARE */}
              <VirtualEventShare event={event} />  
            </div>
        </div>

        {/* VIRTUAL EVENT PLATFORM */}
        <VirtualEventPlatform event={event} />

        {/* VIRTUAL EVENT TICKETS */}
        <VirtualEventTickets event={event}
            setShowTicketForm={setShowTicketForm}
            setSelectedTicket={setSelectedTicket} />

        {/* GALLERY  */}
        <EventGallerySection event={event} />

        <LatestEvent />
             
      </main>

      {/* =================== && •TICKET FORM MODAL• && =================== */}
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