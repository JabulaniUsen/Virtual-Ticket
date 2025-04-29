'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { BASE_URL } from '@/config';
import Loader from '@/components/ui/loader/Loader';
import VirtualEventPage from './virtual/page';
import EventDetail from './event/page';


export default function EventRouterPage() {
  const [isVirtual, setIsVirtual] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const eventSlug = params?.id;

  useEffect(() => {
    const fetchEventType = async () => {
      if (!eventSlug) return;
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}api/v1/events/slug/${eventSlug}`);
        setIsVirtual(response.data.event.isVirtual);
      } catch (error) {
        setIsVirtual(null);
        console.error('Error fetching event type:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventType();
  }, [eventSlug]);

  if (loading) return <Loader />;
  if (isVirtual === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Event not found</p>
      </div>
    );
  }

  return isVirtual ? <VirtualEventPage /> : <EventDetail />;
}