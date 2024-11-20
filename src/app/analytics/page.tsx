'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { BiBulb, BiSearch, BiHomeAlt, BiShareAlt } from 'react-icons/bi';
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
      { id: 'a3', name: 'Charlie', ticketType: 'Student', scanned: false }
    ],
    ticketTypes: ['VIP', 'General', 'Student']
  },
  {
    id: 2,
    title: 'Music Fest',
    date: '2024-12-15',
    location: 'Los Angeles',
    price: 80,
    attendees: [
      { id: 'm1', name: 'Megan', ticketType: 'VIP', scanned: true },
      { id: 'm2', name: 'David', ticketType: 'Student', scanned: false }
    ],
    ticketTypes: ['VIP', 'General', 'Student']
  }
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
        const matchesScanned = scannedFilter ? (scannedFilter === 'scanned' ? attendee.scanned : !attendee.scanned) : true;
        return matchesSearch && matchesTicketType && matchesScanned;
      });
      setFilteredAttendees(filtered);
    }
  }, [searchQuery, ticketTypeFilter, scannedFilter, event]);

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark');
  };

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
    <div className="p-4 md:p-2 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <header className="flex justify-between p-4 top-0 w-full mb-[2.5rem]">
        <a 
          href="/dashboard" 
          className="fixed flex items-center p-3 rounded-lg text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-gray-700"
          style={{ boxShadow: "0 2px 3px 4px rgba(0,0,0,0.3)" }}
        >
          <BiHomeAlt className="lg:text-xl text-blue-500 mr-2 " /> 
          <span className="lg:font-medium">Dashboard</span> 
        </a>

        <button 
          onClick={toggleDarkMode} 
          className="fixed right-[1rem] p-4 z-20 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:scale-105 transition-transform"
          title="Toggle Dark Mode"
        >
          <BiBulb size={24} />
        </button>


        <button
          onClick={handleShare}
          className="fixed right-[5rem] p-4 z-20 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:scale-105 transition-transform"
          title="Share Event"
        >
          <BiShareAlt size={24} />
        </button>

      </header>

      <div className="mt-[2.45rem] container mx-auto px-4 md:px-6 space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">{event.title} - Analytics</h1>

        <div className="bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-8 md:p-10 space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-300 dark:border-gray-600 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-700 dark:text-white mb-2">Event Overview</h1>
              <p className="text-md text-gray-500 dark:text-gray-300">Manage your event at a glance.</p>
            </div>
            <p className="text-md mt-4 md:mt-0 px-4 py-1 bg-blue-500 text-white rounded-full shadow-md">
              {formattedDate}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white dark:bg-gray-700 rounded-xl p-5 text-gray-800 dark:text-gray-100 shadow-lg">
              <h3 className="text-lg font-medium">Event Details</h3>
              <p className="mt-2 text-md"><strong>Location:</strong> {event.location}</p>
              <p className="text-md"><strong>Price:</strong> ₦{event.price}</p>
              <p className="text-md"><strong>Ticket Types:</strong> {event.ticketTypes.join(', ')}</p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-5 text-gray-800 dark:text-gray-100 shadow-lg">
              <h3 className="text-lg font-medium">Attendee Statistics</h3>
              <p className="mt-2 text-md"><strong>Total:</strong> {event.attendees.length}</p>
              <p className="text-md"><strong>Scanned:</strong> {event.attendees.filter(att => att.scanned).length}</p>
              <p className="text-md"><strong>Unscanned:</strong> {event.attendees.filter(att => !att.scanned).length}</p>
            </div>

            <div className="bg-white rounded-xl shadow-2xl p-2 flex items-center justify-center">
              <QRCodeCanvas
                value={`${window.location.origin}/events/${event.id}/check-in`}
                width={200} 
                className="rounded-md"
              />
            </div>
          </div>
        </div>

        {/* ================================================ && TABLE SECTION && =============================================== */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 overflow-x-auto">
          <div className="flex items-center space-x-4 mb-4 flex-col lg:flex-row w-[100%]">
            <div className="flex items-center  mb-2 sm:mb-0 lg:w-[50%] w-[100%]">
            <BiSearch size={24} className="text-gray-700 dark:text-gray-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Attendees"
              className="w-[100%] p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>
            <div className="flex lg:w-[50%] w-[100%] sm:w-auto space-y-2 sm:space-y-0 gap-2 sm:space-x-4">
              <select
                value={ticketTypeFilter}
                onChange={(e) => setTicketTypeFilter(e.target.value)}
                className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Ticket Types</option>
                {event.ticketTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={scannedFilter}
                onChange={(e) => setScannedFilter(e.target.value)}
                className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All</option>
                <option value="scanned">Scanned</option>
                <option value="not_scanned">Not Scanned</option>
              </select>
            </div>
          </div>

          <table className="min-w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-4 font-medium text-gray-700 dark:text-gray-300">Name</th>
                <th className="p-4 font-medium text-gray-700 dark:text-gray-300">Ticket Type</th>
                <th className="p-4 font-medium text-gray-700 dark:text-gray-300">Date</th>
                <th className="p-4 font-medium text-gray-700 dark:text-gray-300">Scanned</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.map((attendee) => (
                <tr key={attendee.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 text-gray-900 dark:text-gray-300">{attendee.name}</td>
                  <td className="p-4 text-gray-900 dark:text-gray-300">{attendee.ticketType}</td>
                  <td className="p-4 text-gray-900 dark:text-gray-300">{formattedDate}</td>
                  <td className={`p-4 ${attendee.scanned ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'}`}>
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

const AnalyticsPage = () => {
  return (
    <Suspense fallback={<div>Loading ...</div>}>
      <EventAnalytics />
    </Suspense>
  );
};

export default AnalyticsPage;
