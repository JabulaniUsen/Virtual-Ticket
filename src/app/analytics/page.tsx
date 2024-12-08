'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { BiHomeAlt, BiShareAlt } from 'react-icons/bi';
import ToggleMode from '../components/mode/toggleMode';
import { format } from 'date-fns';

interface Attendee {
  id: string;
  name: string;
  ticketType: string;
  scanned: boolean;
}

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  price: number;
  attendees: Attendee[];
  ticketTypes: string[];
  ticketsSold: number;
  revenue: number;
  peakEntryTime: string | null;
}

const eventsData: Event[] = [
  {
    id: 1,
    title: 'Tech Conference',
    date: '2024-12-01',
    location: 'New York',
    price: 50,
    attendees: [
      { id: 'a1', name: 'Alice', ticketType: 'VIP', scanned: false },
      { id: 'a2', name: 'Bob', ticketType: 'General', scanned: true },
      { id: 'a3', name: 'Charlie', ticketType: 'Student', scanned: false },
    ],
    ticketTypes: ['VIP', 'General', 'Student'],
    ticketsSold: 300, 
    revenue: 1500000, 
    peakEntryTime: "6:00 PM", 
  },
  {
    id: 2,
    title: 'Music Fest',
    date: '2024-12-15',
    location: 'Los Angeles',
    price: 80,
    attendees: [
      { id: 'm1', name: 'Megan', ticketType: 'VIP', scanned: true },
      { id: 'm2', name: 'David', ticketType: 'Student', scanned: false },
    ],
    ticketTypes: ['VIP', 'General', 'Student'],
    ticketsSold: 500, 
    revenue: 2500000, 
    peakEntryTime: "6:00 PM", 
  },
];

const EventAnalytics = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [event, setEvent] = useState<Event | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ticketTypeFilter, setTicketTypeFilter] = useState<string>('');
  const [scannedFilter, setScannedFilter] = useState<string>('');
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    const selectedEvent = eventsData.find((e) => e.id === parseInt(id || ''));
    setEvent(selectedEvent);
    if (selectedEvent) {
      setFilteredAttendees(selectedEvent.attendees);
    }
  }, [id]);

  useEffect(() => {
    if (event) {
      const filtered = event.attendees.filter((attendee) => {
        const matchesSearch = attendee.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTicketType = ticketTypeFilter ? attendee.ticketType === ticketTypeFilter : true;
        const matchesScanned =
          scannedFilter ? (scannedFilter === 'scanned' ? attendee.scanned : !attendee.scanned) : true;
        return matchesSearch && matchesTicketType && matchesScanned;
      });
      setFilteredAttendees(filtered);
    }
  }, [searchQuery, ticketTypeFilter, scannedFilter, event]);

  const formattedDate = event ? format(new Date(event.date), 'MMM dd, yyyy') : '';

  const handleShare = () => {
    const eventUrl = `${window.location.origin}/tickets/?id=${id}`;
    if (navigator.share) {
      navigator.share({
        title: event?.title || '',
        url: eventUrl,
      }).catch((error) => console.log('Error sharing event:', error));
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(eventUrl).then(() => {
          alert('Event link copied to clipboard!');
        }).catch((error) => {
          console.error('Error copying to clipboard', error);
          alert('Failed to copy event link');
        });
      } else {
        alert('Unable to share or copy the link. Try copying manually!');
      }
    }
  };

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="animate-pulse text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen">
      {/* ============== && •Header• && ================ */}
      <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow-md">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{event.title} <span className='hidden sm:inline'>- Analytics</span></h1>
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
      <div className="container mx-auto px-4 py-8 space-y-8">
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
              💵 Price: <span className="font-medium">₦{event.price}</span>
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              🎫 Ticket Types: <span className="font-medium">{event.ticketTypes.join(', ')}</span>
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
              <span className="font-semibold">Total:</span> {event.attendees.length}
            </p>
            <p className="text-green-600 dark:text-green-400">
              <span className="font-semibold">Scanned:</span> {event.attendees.filter((a) => a.scanned).length}
            </p>
            <p className="text-red-600 dark:text-red-400">
              <span className="font-semibold">Not Scanned:</span> {event.attendees.filter((a) => !a.scanned).length}
            </p>
          </div>
        </div>

        {/* ============== && •Analytics Overview• && ================ */}
        <div className=" p-6 rounded-lg shadow-lg border border-yellow-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">📊 Analytics Overview</h3>
            <div className="text-yellow-500 text-2xl">📈</div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Tickets Sold:</span> {event.ticketsSold}
            </p>
            <p className="text-blue-600 dark:text-blue-400">
              <span className="font-semibold">Revenue Generated:</span> ₦{event.revenue}
            </p>
            <p className="text-purple-600 dark:text-purple-400">
              <span className="font-semibold">Peak Entry Time:</span> {event.peakEntryTime || "N/A"}
            </p>
          </div>
        </div>

        {/* ============== && •QR Code• && ================ */}
        <div className="relative bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-lg border border-yellow-500">
          <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-yellow-500"></div>
          <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-yellow-500"></div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-yellow-500"></div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-yellow-500"></div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">Scan QR Code</h3>
          <div className="flex justify-center">
            <QRCodeCanvas
              value={`${window.location.origin}/tickets/?id=${id}`}
              className="w-40 h-40 border-4 border-yellow-500 rounded-lg"
            />
          </div>
          <p className="mt-4 text-center text-gray-600 dark:text-gray-300">Scan to view the ticket!</p>
        </div>
      </div>

      {/* ============== && •Filters• && ================ */}
      <div className="flex flex-wrap gap-4 p-6 rounded-lg shadow-lg bg-white dark:bg-black border border-gray-300 dark:border-gray-600">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search attendees..."
          className="flex-grow p-2 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 placeholder-gray-400"
        />
        <select
          value={ticketTypeFilter}
          onChange={(e) => setTicketTypeFilter(e.target.value)}
          className="p-2 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600"
        >
          <option value="" className="text-gray-500 dark:text-gray-400">All Ticket Types</option>
          {event.ticketTypes.map((type) => (
            <option key={type} className="text-gray-800 dark:text-gray-200">{type}</option>
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


      </div>
    </div>

    
  );
};
const EventAnalyticsPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <EventAnalytics />
  </Suspense>
);
export default EventAnalyticsPage;
