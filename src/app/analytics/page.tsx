'use client';

import React from 'react';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { BiHomeAlt, BiShareAlt, BiMailSend } from 'react-icons/bi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ToggleMode from '../../components/ui/mode/toggleMode';
import { format } from 'date-fns';
import Loader from '../../components/ui/loader/Loader';
import Toast from '../../components/ui/Toast';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import { BASE_URL } from '../../../config';
import Link from 'next/link';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
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

interface TicketStats {
  totalSold: number;
  revenue: number;
  soldByType: { [key: string]: number };
}

type Ticket = {
  id: string;
  eventId: string;
  email: string;
  phone: string;
  fullName: string;
  ticketType: string;
  price: number;
  purchaseDate: string;
  qrCode: string;
  paid: boolean;
  currency: string;
  flwRef: string;
  attendees: {
    name: string;
    email: string;
  }[];
  validationStatus: string;
  isScanned: boolean;
  createdAt: string;
  updatedAt: string;
};


const EventAnalytics = () => {
  const [toast, setToast] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');
  const [event, setEvent] = useState<Event | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ticketTypeFilter, setTicketTypeFilter] = useState<string>('');
  const [scannedFilter, setScannedFilter] = useState<string>('');
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [emailTitle, setEmailTitle] = useState<string>('');
  const [emailContent, setEmailContent] = useState<string>('');
  // const [tickets] = useState<Ticket[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketStats, setTicketStats] = useState<TicketStats>({
    totalSold: 0,
    revenue: 0,
    soldByType: {}
  });

  const eventSlug = event?.slug;

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}api/v1/events/${eventId}`
        );
        
        const eventData = response.data.event;
        setEvent(eventData);

        calculateTicketStats(eventData);
      } catch (err) {
        console.error('Failed to fetch event:', err);
        setToast({ type: 'error', message: 'Failed to load event details.' });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!eventId) return;
  
      const token = localStorage.getItem('token');
      console.log('Token:', token);
  
      try {
        setLoading(true);
        const response = await axios.get<{ tickets: Ticket[] }>(
          `${BASE_URL}api/v1/tickets/events/${eventId}/tickets`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const tickets = response.data.tickets;
        console.log('Tickets:', tickets);
  

        const validTickets = tickets.filter(ticket => ticket.validationStatus === "valid");
        const totalValidTicket = tickets.filter(
          (ticket) => ticket.validationStatus === "valid"
        );

        const totalValidAttendees = totalValidTicket.reduce(
          (sum, ticket) => sum + 1 + ticket.attendees.length,
          0
        );
  
        setTickets(tickets); 
        setFilteredTickets(validTickets); 

        const stats: TicketStats = {
          totalSold: totalValidAttendees ,
          revenue: validTickets.reduce((sum, ticket) => sum + ticket.price, 0),
          soldByType: validTickets.reduce((acc, ticket) => {
            acc[ticket.ticketType] = (acc[ticket.ticketType] || 0) + 1;
            return acc;
          }, {} as { [key: string]: number }),
        };
  
        setTicketStats(stats);
      } catch (error: unknown) {
        console.error('Failed to fetch tickets:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setToast({ type: 'error', message: 'Session Expired, Signing out...' });
  
          const currentPath = window.location.pathname + window.location.search;
          localStorage.setItem('lastVisitedPage', currentPath);
  
          setTimeout(() => {
            router.push('/auth/login');
          }, 1500);
          return;
        }
        setToast({ type: 'error', message: 'Failed to load ticket details.' });
      } finally {
        setLoading(false);
      }
    };
  
    fetchTickets();
  }, [eventId, router]);
  

  const calculateTicketStats = (eventData: Event) => {
    if (!eventData?.ticketType) return;

    const stats: TicketStats = {
      totalSold: 0,
      revenue: 0,
      soldByType: {}
    };

    eventData.ticketType.forEach(ticket => {
      const sold = parseInt(ticket.sold) || 0;
      const price = parseFloat(ticket.price) || 0;
      
      stats.totalSold += sold;
      stats.revenue += sold * price;
      stats.soldByType[ticket.name] = sold;
    });

    setTicketStats(stats);
  };

  const handleSendEmail = async () => {
    if (!event) {
      setToast({ type: 'error', message: 'Event data is not available!' });
      return;
    }
    if (!emailTitle.trim() || !emailContent.trim()) {
      setToast({ type: 'error', message: 'Email title and content cannot be empty!' });
      return;
    }
    const recipients = filteredTickets
      .map((ticket) => ticket.email)
      .filter(Boolean) as string[];
    if (recipients.length === 0) {
      setToast({ type: 'error', message: 'No valid email recipients found.' });
      return;
    }
    try {
      const chunkSize = 50;
      for (let i = 0; i < recipients.length; i += chunkSize) {
        const chunk = recipients.slice(i, i + chunkSize);
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: emailTitle, content: emailContent, recipients: chunk }),
        });
        if (!response.ok) throw new Error('Failed to send emails');
      }
      setToast({ type: 'success', message: 'Emails sent successfully!' });
    } catch (error: unknown) {
      setToast({ type: 'error', message: 'Failed to send emails. Please try again later.' });
      console.error(error);
    }
  };

  useEffect(() => {
    const filtered = tickets.filter((ticket: Ticket) => {
      const matchesValidationStatus = ticket.validationStatus === 'valid'; 
      
      const matchesSearch = searchQuery
        ? ticket.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
  
      const matchesTicketType = ticketTypeFilter
        ? ticket.ticketType.toLowerCase() === ticketTypeFilter.toLowerCase()
        : true;
  
      const matchesScanned = scannedFilter
        ? scannedFilter === 'scanned'
          ? ticket.isScanned
          : !ticket.isScanned
        : true;
  
      return matchesValidationStatus && matchesSearch && matchesTicketType && matchesScanned;
    });
  
    setFilteredTickets(filtered);
  }, [tickets, searchQuery, ticketTypeFilter, scannedFilter]);
  

  const formattedDate = event?.date 
    ? format(new Date(event.date), 'MMM dd, yyyy')
    : 'Date unavailable';

    const renderAnalyticsOverview = () => (
      <div className="p-6 rounded-lg shadow-lg border border-yellow-500">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">📊 Analytics Overview</h3>
          <div className="text-yellow-500 text-2xl">📈</div>
        </div>
        <div className="space-y-2">
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Tickets Sold:</span> {ticketStats.totalSold}
          </p>
          <p className="text-blue-600 dark:text-blue-400">
            <span className="font-semibold">Revenue Generated:</span> ₦{ticketStats.revenue.toLocaleString()}
          </p>
          <p className="text-purple-600 dark:text-purple-400">
            <span className="font-semibold">Attendance Rate:</span>{' '}
            {filteredTickets.length > 0 
              ? `${(
                  (filteredTickets.filter(ticket => ticket.isScanned).length / filteredTickets.length) * 100
                ).toFixed(1)}%`
              : 'N/A'}
          </p>
        </div>
      </div>
    );
    

  const handleShare = () => {
    const eventUrl = `${window.location.origin}/${eventSlug}`;
    if (navigator.share) {
      navigator.share({
        title: event?.title || '',
        url: eventUrl,
      }).catch((error) => console.log('Error sharing event:', error));
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(eventUrl).then(() => {
         setToast({ type: 'success', message: 'Event link copied to clipboard!'});
        }).catch((error) => {
          console.error('Error copying to clipboard', error);
         setToast({ type: 'error', message: 'Failed to copy event link'});
        });
      } else {
       setToast({ type: 'error', message: 'Unable to share or copy the link. Try copying manually!'});
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>
          <p className="text-gray-500">Event not found.</p>
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            Back to Dashboard
          </Link>

        </div>
      </div>
    );
  }

 
  const chartData = {
    labels: Array.from(
      new Set(
        tickets
          .filter((ticket) => ticket.validationStatus === "valid") 
          .map((ticket) => ticket.ticketType)
      )
    ), 
    datasets: [
      {
        label: 'Tickets Sold',
        data: Array.from(
          new Set(
            tickets
              .filter((ticket) => ticket.validationStatus === "valid") 
              .map((ticket) => ticket.ticketType)
          )
        ).map((type) =>
          tickets
            .filter(
              (ticket) =>
                ticket.validationStatus === "valid" && ticket.ticketType === type
            )
            .reduce((sum, ticket) => sum + 1 + ticket.attendees.length, 0) // Add 1 for ticket holder + attendees
        ),
        backgroundColor: ['#f59e0b', '#3b82f6', '#8b5cf6'],
      },
      {
        label: 'Revenue (₦)',
        data: Array.from(
          new Set(
            tickets
              .filter((ticket) => ticket.validationStatus === "valid") 
              .map((ticket) => ticket.ticketType)
          )
        ).map((type) =>
          tickets
            .filter(
              (ticket) =>
                ticket.validationStatus === "valid" && ticket.ticketType === type
            )
            .reduce((sum, ticket) => sum + ticket.price, 0) // Revenue calculation for valid tickets
        ),
        backgroundColor: ['#10b981', '#6366f1', '#ec4899'],
      },
    ],
  };
  
  

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen">
      {toast && (
        <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
        />
        )}
      {/* ============== && •Header• && ================ */}
      <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow-md">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{event.title} <span className='hidden sm:inline'> - Analytics</span></h1>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" title="Dashboard">
            <BiHomeAlt className="text-2xl text-yellow-500 hover:text-yellow-400 transition" />
          </Link>
          <ToggleMode />
          <button onClick={handleShare} className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-400 text-white">
            <BiShareAlt />
          </button>
        </div>
      </header>

      {/* ============== && •Main Content• && ================ */}
      <div className=" mx-auto px-4 py-8 space-y-8">
      {/* ============== && •Event Details• && ================ */}
      <div className=" p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{event.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ============== && •Left Details• && ================ */}
          <div className="space-y-2">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              📍 <span className="font-medium">{event.location}</span>
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              💵 Price: <span className="font-medium">₦{event.ticketType[0]?.price || '0'}</span>
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              🎫 Ticket Types: 
              <span className="font-medium">
                {Array.isArray(event.ticketType) && event.ticketType.length > 0
                  ? event.ticketType.map(ticket => ticket.name).join(', ')
                  : 'No ticket types available'}
              </span>
            </p>

          </div>

          {/* ============== && •Right Details• && ================ */}
          <div className="flex justify-end items-center">
            <p className="text-yellow-600 dark:text-yellow-400 text-lg font-bold bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg shadow">
              {formattedDate}
            </p>
          </div>
        </div>
      </div>


      {/* ============== && •Statistics & QR• && ================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ============== && •Ticket Statistics• && ================ */}
        <div className=" p-6 rounded-lg shadow-lg border border-yellow-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">🎟 Ticket Statistics</h3>
            <div className="text-yellow-500 text-2xl">📊</div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Total:</span> {filteredTickets.length}
            </p>
            <p className="text-green-600 dark:text-green-400">
              <span className="font-semibold">Scanned:</span> {filteredTickets.filter((a) => a.isScanned === true).length}
            </p>
            <p className="text-red-600 dark:text-red-400">
              <span className="font-semibold">Not Scanned:</span> {filteredTickets.filter((a) => a.isScanned !== true).length}
            </p>
          </div>
        </div>

        {/* ============== && •Analytics Overview• && ================ */}
        {renderAnalyticsOverview()}

        {/* ============== && •QR Code• && ================ */}
        <div className="relative bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-lg border border-yellow-500">
          <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-yellow-500"></div>
          <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-yellow-500"></div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-yellow-500"></div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-yellow-500"></div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">Scan QR Code</h3>
          <div className="flex justify-center">
            <QRCodeCanvas
              value={`${window.location.origin}/${eventSlug}`}
              className="w-40 h-40 border-4 border-yellow-500 rounded-lg"
            />
          </div>
          <p className="mt-4 text-center text-gray-600 dark:text-gray-300">Scan to view the ticket!</p>
        </div>
      </div>

      {/* ============== && •Filters• && ================ */}
      <div className="flex flex-col sm:flex-row gap-4 p-6 rounded-lg shadow-lg bg-white dark:bg-black border border-gray-300 dark:border-gray-600">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search attendees"
          placeholder="Search attendees..."
          className="flex-grow p-2 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 placeholder-gray-400"
        />
        <select
          value={ticketTypeFilter}
          onChange={(e) => setTicketTypeFilter(e.target.value)}
          className="p-2 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600"
        >
          <option value="" className="text-gray-500 dark:text-gray-400">
            All Ticket Types
          </option>
          {event.ticketType.map((type, index) => (
            <option 
              key={index} 
              value={type.name} 
              className="text-gray-800 dark:text-gray-200"
            >
              {type.name}
            </option>
          ))}
        </select>

        <select
          value={scannedFilter}
          onChange={(e) => setScannedFilter(e.target.value)}
          className="p-2 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600"
        >
          <option value="" className="text-gray-500 dark:text-gray-400">All</option>
          <option value="scanned" className="text-gray-800 dark:text-gray-200">Scanned</option>
          <option value="not_scanned" className="text-gray-800 dark:text-gray-200">Not Scanned</option>
        </select>
      </div>

      {/* ============== && •Attendees Table• && ================ */}
      <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-black border border-gray-300 dark:border-gray-600 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <th className="p-4 text-sm font-semibold text-gray-800 dark:text-gray-200">Name</th>
              <th className="p-4 text-sm font-semibold text-gray-800 dark:text-gray-200">Ticket Type</th>
              <th className="p-4 text-sm font-semibold text-gray-800 dark:text-gray-200">Date</th>
              <th className="p-4 text-sm font-semibold text-gray-800 dark:text-gray-200">Scanned</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket, index) => (
              <React.Fragment key={ticket.id}>
                <tr
                  className={`border-b border-gray-300 dark:border-gray-600 ${
                    index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-black'
                  }`}
                >
                  <td className="p-4 text-gray-800 dark:text-gray-200 text-[0.95rem] sm:text-md">
                    {ticket.fullName}
                    {ticket.attendees.length > 0 && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-[0.75rem] sm:text-sm text-yellow-600 dark:text-yellow-400">
                          View Sub-Attendees
                        </summary>
                        <ul className="pl-4 mt-1 list-disc">
                          {ticket.attendees.map((subAttendee, subIndex) => (
                            <li key={subIndex} className="text-gray-800 dark:text-gray-200 text-[0.72rem] sm:text-md">
                              {subAttendee.name} ({subAttendee.email})
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </td>
                  <td className="p-4 text-gray-800 dark:text-gray-200 text-[0.95rem] sm:text-md">{ticket.ticketType}</td>
                  <td className="p-4 text-gray-800 dark:text-gray-200 text-[0.95rem] sm:text-md">
                    {new Date(ticket.purchaseDate).toLocaleDateString()}
                  </td>
                  <td
                    className={`p-4 ${
                      ticket.isScanned
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    } text-[0.95rem] sm:text-md` }
                  >
                    {ticket.isScanned ? 'Scanned' : 'Not Scanned'}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>

        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between space-x-0 md:space-x-4 flex-wrap md:gap-1 gap-4">

        {/* ================== && •ANALYTIC DASHBOARD• && ================== */}
        <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 w-full md:w-[49%]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📊 Analytics Dashboard</h2>
          <Bar data={chartData} />
        </div>

        {/* ========================= && •EMAIL MARKETING• && =================== */}
        <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 w-full md:w-[49%]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📧 Email Marketing</h2>

          <div className="mb-4">
            <label htmlFor="emailTitle" className="block text-gray-700 dark:text-gray-300 font-medium">
              Email Title
            </label>
            <input
              id="emailTitle"
              type="text"
              value={emailTitle}
              onChange={(e) => setEmailTitle(e.target.value)}
              placeholder="Enter email title here..."
              className="w-full p-4 rounded-md bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 mt-2"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="emailContent" className="block text-gray-700 dark:text-gray-300 font-medium">
              Email Content
            </label>
            <textarea
              id="emailContent"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Write your email content here..."
              className="w-full p-4 rounded-md bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 mt-2"
            />
          </div>

          <button
            onClick={handleSendEmail}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded-md"
          >
            <BiMailSend className="inline-block mr-2" /> Send Emails
          </button>
        </div>
      </div>


      </div>
    </div>

    
  );
}; 

export default function Analytics() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
          <EventAnalytics />
      </Suspense>
  );
}




