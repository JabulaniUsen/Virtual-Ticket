'use client';

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


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Attendee {
  id: string;
  name: string;
  ticketType: string;
  scanned: boolean;
  email: string; 
}

interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  ticketType: TicketType[];
  attendees: Attendee[];
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


const EventAnalytics = () => {  
  const [toast, setToast] = useState<{ type: 'error'| 'success' ; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');
  const [event, setEvent] = useState<Event | undefined>();
  // const [events, setEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ticketTypeFilter, setTicketTypeFilter] = useState<string>('');
  const [scannedFilter, setScannedFilter] = useState<string>('');
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([]);
  const [emailTitle, setEmailTitle] = useState<string>('');
  const [emailContent, setEmailContent] = useState<string>('');
  const [ticketStats, setTicketStats] = useState<TicketStats>({
    totalSold: 0,
    revenue: 0,
    soldByType: {}
  });



  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `https://v-ticket-backend.onrender.com/api/v1/events/${eventId}`
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

{/* ========================= && •SEND EMAIL FUNCTION• && =================== */}
const handleSendEmail = async () => {
  if (!event) {
    setToast({ type: 'error', message: 'Event data is not available!' });
    return;
  }
  if (!emailTitle.trim() || !emailContent.trim()) {
    setToast({ type: 'error', message: 'Email title and content cannot be empty!' });
    return;
  }
  const recipients = event.attendees
    .map((attendee) => attendee.email)
    .filter(Boolean) as string[];
  if (recipients.length === 0) {
    setToast({ type: 'error', message: 'No vaid id email recipients found.' });
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


const fetchEventsData = async (): Promise<Event[]> => {
  // Replace with your API endpoint
  const response = await fetch('/api/events'); 
  const data: Event[] = await response.json();
  return data;
};

useEffect(() => {
  setLoading(true);

  const loadEventData = async () => {
    try {
      const eventsData = await fetchEventsData();
      const selectedEvent = eventsData.find((e) => e.id === eventId);
      
      setTimeout(() => {
        setEvent(selectedEvent);
        if (selectedEvent) {
          setFilteredAttendees(selectedEvent.attendees || []);
        }
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching events data:', error);
      setLoading(false);
    }
  };

  loadEventData();
}, [eventId]);

  useEffect(() => {
    if (event) {
      const filtered = (event.attendees || []).filter((attendee) => {
        const matchesSearch = attendee.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTicketType = ticketTypeFilter ? attendee.ticketType === ticketTypeFilter : true;
        const matchesScanned =
          scannedFilter ? (scannedFilter === 'scanned' ? attendee.scanned : !attendee.scanned) : true;
        return matchesSearch && matchesTicketType && matchesScanned;
      });
      setFilteredAttendees(filtered);
    }
  }, [searchQuery, ticketTypeFilter, scannedFilter, event]);

  const formattedDate = event && event.date 
  ? (() => {
      try {
        return format(new Date(event.date), 'MMM dd, yyyy');
      } catch (error) {
        console.error('Invalid date format:', event.date);
        return 'Invalid date';
        console.log(error);
      }
    })()
  : 'Date unavailable';


  const handleShare = () => {
    const eventUrl = `${window.location.origin}/events/${eventId}`;
    if (navigator.share) {
      navigator.share({
        title: event?.title || '',
        url: eventUrl,
      }).catch((error) => console.log('Error sharing event:', error));
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(eventUrl).then(() => {
         setToast({ type: 'error', message: 'Event link copied to clipboard!'});
        }).catch((error) => {
          console.error('Error copying to clipboard', error);
         setToast({ type: 'error', message: 'Failed to copy event link'});
        });
      } else {
       setToast({ type: 'error', message: 'Unable to share or copy the link. Try copying manually!'});
      }
    }
  };

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
          {event?.attendees ? 
            `${((event.attendees.filter(a => a.scanned).length / event.attendees.length) * 100).toFixed(1)}%` 
            : 'N/A'}
        </p>
      </div>
    </div>
  );

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
          <a href="/dashboard" className="text-blue-500 hover:underline">
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: event?.ticketType.map(ticket => ticket.name) || [],
    datasets: [
      {
        label: 'Tickets Sold',
        data: event?.ticketType.map(ticket => parseInt(ticket.sold) || 0) || [],
        backgroundColor: ['#f59e0b', '#3b82f6', '#8b5cf6'],
      },
      {
        label: 'Revenue (₦)',
        data: event?.ticketType.map(ticket => 
          (parseInt(ticket.sold) || 0) * (parseFloat(ticket.price) || 0)
        ) || [],
        backgroundColor: ['#10b981', '#6366f1', '#ec4899'],
      }
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
          <a href="/dashboard" title="Dashboard">
            <BiHomeAlt className="text-2xl text-yellow-500 hover:text-yellow-400 transition" />
          </a>
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
        {/* ============== && •Attendee Statistics• && ================ */}
        <div className=" p-6 rounded-lg shadow-lg border border-yellow-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">🎟 Attendee Statistics</h3>
            <div className="text-yellow-500 text-2xl">📊</div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Total:</span> {(event?.attendees || []).length}
            </p>
            <p className="text-green-600 dark:text-green-400">
              <span className="font-semibold">Scanned:</span> {(event?.attendees || []).filter((a) => a.scanned).length}
            </p>
            <p className="text-red-600 dark:text-red-400">
              <span className="font-semibold">Not Scanned:</span> {(event?.attendees || []).filter((a) => !a.scanned).length}
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
              value={`${window.location.origin}/events/${eventId}`}
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
            {filteredAttendees.map((attendee, index) => (
              <tr
                key={attendee.id}
                className={`border-b border-gray-300 dark:border-gray-600 ${
                  index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-black'
                }`}
              >
                <td className="p-4 text-gray-800 dark:text-gray-200">{attendee.name}</td>
                <td className="p-4 text-gray-800 dark:text-gray-200">{attendee.ticketType}</td>
                <td className="p-4 text-gray-800 dark:text-gray-200">{formattedDate}</td>
                <td
                  className={`p-4 ${
                    attendee.scanned
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {attendee.scanned ? 'Scanned' : 'Not Scanned'}
                </td>
              </tr>
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


