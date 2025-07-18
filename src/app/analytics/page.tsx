'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '../../../config';
import { Event, Ticket, TicketStats, ChartData } from '@/types/analytics';
import Loader from '@/components/ui/loader/Loader';
import Toast from '@/components/ui/Toast';
import { AnalyticsHeader } from './components/AnalyticsHeader';
import { EventDetails } from './components/EventDetails';
import { StatsCard } from './components/StatsCard';
import { QRCodeCard } from './components/QRCodeCard';
import { Filters } from './components/Filters';
import { AttendeesTable } from './components/AttendeesTable';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { EmailMarketing } from './components/EmailMarketing';
import { FiDownload, FiRefreshCw } from 'react-icons/fi';
// import { Line } from 'react-chartjs-2';

const EventAnalyticsContent = () => {
  const [toast, setToast] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');
  const [event, setEvent] = useState<Event | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [ticketStats, setTicketStats] = useState<TicketStats>({
    totalSold: 0,
    revenue: 0,
    soldByType: {}
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketTypeFilter, setTicketTypeFilter] = useState('');
  const [scannedFilter, setScannedFilter] = useState('');
  const [emailTitle, setEmailTitle] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [activeTab, setActiveTab] = useState('attendees');
  const [paymentFilter, setPaymentFilter] = useState('');

  const fetchEvent = useCallback(async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}api/v1/events/${eventId}`);
      setEvent(response.data.event);
      console.log('Fetched event details:', response.data.event);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to load event details.' });
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const fetchTickets = useCallback(async (silent = false) => {
    if (!eventId) return;
    const token = localStorage.getItem('token');

    try {
      if (!silent) setLoading(true);
      setRefreshing(true);
      
      const response = await axios.get<{ tickets: Ticket[] }>(
        `${BASE_URL}api/v1/tickets/events/${eventId}/tickets`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Fetched tickets:', response.data.tickets);
      const validTickets = response.data.tickets.filter(t => t.validationStatus === "valid");
      const totalValidAttendees = validTickets.reduce(
        (sum, ticket) => sum + 1 + ticket.attendees.length, 0
      );

      setTickets(response.data.tickets);
      setFilteredTickets(validTickets);

      setTicketStats({
        totalSold: totalValidAttendees,
        revenue: validTickets
          .filter(ticket => ticket.paid) // Only include paid tickets
          .reduce((sum, ticket) => sum + ticket.price, 0),
        soldByType: validTickets.reduce((acc, ticket) => ({
          ...acc,
          [ticket.ticketType]: (acc[ticket.ticketType] || 0) + 1 + ticket.attendees.length
        }), {} as Record<string, number>)
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setToast({ type: 'error', message: 'Session Expired, Signing out...' });
          setTimeout(() => router.push('/auth/login'), 1500);
        } else {
          setToast({ type: 'error', message: error.response?.data?.message || 'Failed to load ticket details.' });
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [eventId, router]);

  const handleRefresh = useCallback(() => {
    fetchTickets(true);
  }, [fetchTickets]);

  const handleExport = useCallback(async () => {
    if (!filteredTickets.length) {
      setToast({ type: 'error', message: 'No data to export' });
      return;
    }

    try {
      setExporting(true);
      const headers = ['Name', 'Email', 'Ticket Type', 'Purchase Date', 'Scanned', 'Sub-Attendees'];
      const csvContent = [
        headers.join(','),
        ...filteredTickets.map(ticket => [
          `"${ticket.fullName}"`,
          `"${ticket.email}"`,
          `"${ticket.ticketType}"`,
          `"${new Date(ticket.purchaseDate).toLocaleDateString()}"`,
          `"${ticket.isScanned ? 'Yes' : 'No'}"`,
          `"${ticket.attendees.map(a => `${a.name} (${a.email})`).join('; ')}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${event?.title || 'event'}_attendees_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setToast({ type: 'success', message: 'Export completed successfully!' });
    } catch (error) {
      console.error('Export error:', error);
      setToast({ type: 'error', message: 'Failed to export data' });
    } finally {
      setExporting(false);
    }
  }, [filteredTickets, event]);

  const handleSendEmail = useCallback(async () => {
    if (!emailTitle.trim() || !emailContent.trim()) {
      setToast({ type: 'error', message: 'Email title and content cannot be empty!' });
      return;
    }

    const recipients = Array.from(new Set(
      filteredTickets
        .flatMap(ticket => [ticket.email, ...ticket.attendees.map(a => a.email)])
        .filter(Boolean)
    )) as string[];

    if (!recipients.length) {
      setToast({ type: 'error', message: 'No valid email recipients found.' });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: emailTitle, 
          content: emailContent, 
          recipients 
        }),
      });
      
      if (!response.ok) throw new Error();
      setToast({ type: 'success', message: `Emails sent successfully to ${recipients.length} recipients!` });
      setEmailTitle('');
      setEmailContent('');
    } catch {
      setToast({ type: 'error', message: 'Upgrade to premium version before being able to send emails to attendees..' });
    } finally {
      setLoading(false);
    }
  }, [emailTitle, emailContent, filteredTickets]);

  const handleShare = useCallback(() => {
    if (!event) return;
    
    const eventUrl = `${window.location.origin}/${event.slug}`;
    
    if (navigator.share) {
      navigator.share({ 
        title: event.title, 
        text: `Check out this event: ${event.title}`,
        url: eventUrl 
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(eventUrl)
        .then(() => setToast({ type: 'success', message: 'Event link copied to clipboard!' }))
        .catch(() => setToast({ type: 'error', message: 'Failed to copy link' }));
    } else {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = eventUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setToast({ type: 'success', message: 'Event link copied to clipboard!' });
      } catch (err) {
        console.error('Copy to clipboard failed:', err);
        setToast({ type: 'error', message: 'Failed to copy link' });
      }
      document.body.removeChild(textArea);
    }
  }, [event]);

  useEffect(() => {
    const filtered = tickets.filter(ticket => {
      const matchesValidation = ticket.validationStatus === 'valid';
      const matchesSearch = searchQuery
        ? ticket.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.attendees.some(a => 
            a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.email.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : true;
      const matchesType = ticketTypeFilter
        ? ticket.ticketType === ticketTypeFilter
        : true;
      const matchesScanned = scannedFilter
        ? scannedFilter === 'scanned' ? ticket.isScanned : !ticket.isScanned
        : true;
      const matchesPaymentStatus = !paymentFilter || 
        (paymentFilter === 'paid' ? ticket.paid : !ticket.paid);

      return matchesValidation && matchesSearch && matchesType && matchesScanned && matchesPaymentStatus;
    });

    setFilteredTickets(filtered);
  }, [tickets, searchQuery, ticketTypeFilter, scannedFilter, paymentFilter]);

  useEffect(() => {
    fetchEvent();
    fetchTickets();
  }, [fetchEvent, fetchTickets]);

  const chartData = useMemo<ChartData>(() => ({
    labels: Object.keys(ticketStats.soldByType),
    datasets: [
      {
        label: 'Attendees',
        data: Object.values(ticketStats.soldByType),
        backgroundColor: ['#f59e0b'], 
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Revenue (N)',
        data: Object.keys(ticketStats.soldByType).map(type => 
          tickets
            .filter(t => t.validationStatus === "valid" && t.ticketType === type)
            .reduce((sum, ticket) => sum + ticket.price, 0)
        ),
        backgroundColor: ['#10b981'], 
        borderRadius: 6,
        borderSkipped: false,
      }
    ]
  }), [ticketStats, tickets]);

  const statsCards = useMemo(() => [
    {
      title: "🎟 Ticket Statistics",
      icon: "📊",
      borderColor: "border-yellow-500",
      stats: [
        { 
          label: "Total Tickets", 
          value: filteredTickets.length, 
          color: "text-gray-700 dark:text-gray-300" 
        },
        { 
          label: "Paid", 
          value: filteredTickets.filter(t => t.paid).length, 
          color: "text-green-600 dark:text-green-400" 
        },
        { 
          label: "Unpaid", 
          value: filteredTickets.filter(t => !t.paid).length, 
          color: "text-red-600 dark:text-red-400" 
        },
        { 
          label: "Scanned", 
          value: filteredTickets.filter(t => t.isScanned && t.paid).length,
          color: "text-blue-600 dark:text-blue-400" 
        },
        { 
          label: "Not Scanned", 
          value: filteredTickets.filter(t => !t.isScanned && t.paid).length,
          color: "text-orange-600 dark:text-orange-400" 
        }
      ]
    },
    {
      title: "📊 Analytics Overview",
      icon: "📈",
      borderColor: "border-blue-500",
      stats: [
        { 
          label: "Attendees", 
          value: filteredTickets
            .filter(t => t.paid)
            .reduce((sum, ticket) => sum + 1 + (ticket.attendees?.length || 0), 0),
          color: "text-gray-700 dark:text-gray-300" 
        },
        { 
          label: "Revenue", 
          value: `₦${ticketStats.revenue.toLocaleString()}`, 
          color: "text-blue-600 dark:text-blue-400" 
        },
        { 
          label: "Payment Rate", 
          value: filteredTickets.length 
            ? `${(filteredTickets.filter(t => t.paid).length / filteredTickets.length * 100).toFixed(1)}%` 
            : 'N/A', 
          color: "text-purple-600 dark:text-purple-400" 
        }
      ]
    },
    {
      title: "👥 Attendee Insights",
      icon: "👤",
      borderColor: "border-purple-500",
      stats: [
        { 
          label: "Avg. Attendees/Ticket", 
          value: filteredTickets.length 
            ? (ticketStats.totalSold / filteredTickets.length).toFixed(1) 
            : '0', 
          color: "text-gray-700 dark:text-gray-300" 
        },
        { 
          label: "VIP Tickets", 
          value: filteredTickets.filter(t => t.ticketType.toLowerCase().includes('vip')).length, 
          color: "text-yellow-600 dark:text-yellow-400" 
        },
        { 
          label: "Last 7 Days", 
          value: filteredTickets.filter(t => 
            new Date(t.purchaseDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length, 
          color: "text-green-600 dark:text-green-400" 
        }
      ]
    }
  ], [filteredTickets, ticketStats]);

  if (loading) return <Loader />;
  if (!event) return <div className="flex items-center justify-center h-screen">Event not found</div>;
    
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black min-h-screen transition-colors duration-300">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      
      <AnalyticsHeader 
        title={event.title}
        onShare={handleShare}
        eventDate={event.date}
        totalPaidAttendees={ticketStats.totalSold}
        totalRevenue={ticketStats.revenue}
        currency="NGN"
      />

      <div className="container mx-auto lg:px-4 px-2 py-8 space-y-8 max-w-7xl">
        <EventDetails event={event} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((card, index) => {
            return (
              <StatsCard 
                key={index}
                title={card.title}
                icon={card.icon}
                borderColor={card.borderColor}>
                <div className="space-y-2">
                  {card.stats.map((stat, statIndex) => {
                    return (
                      <p key={statIndex} className={`${stat.color} flex justify-between`}>
                      <span className="font-medium">{stat.label}:</span>
                      <span className="font-semibold">{stat.value}</span>
                      </p>
                    );
                  })}
                </div>
              </StatsCard>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      aria-label="Refresh data"
                    >
                      <FiRefreshCw className={`text-gray-700 dark:text-gray-300 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                    <button 
                      onClick={handleExport}
                      disabled={exporting}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      aria-label="Export data"
                    >
                      <FiDownload className="text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                </div>
                <div className="h-80">
                  <AnalyticsDashboard chartData={chartData} />
                </div>
              </div>
            </div>
          </div>
          
          <QRCodeCard eventSlug={event.slug} />
        </div>

        {/* <div className="bg-white dark:bg-gray-800 p-4 rounded-lg h-80 shadow-lg  ">
          <h3 className="font-bold text-lg mb-4">Revenue Over Time</h3>
          <Line data={{
            labels: Object.keys(
              tickets.reduce((acc, ticket) => {
                const date = new Date(ticket.purchaseDate).toLocaleDateString();
                acc[date] = true;
                return acc;
              }, {} as Record<string, boolean>)
            ),
            datasets: [{
              label: 'Revenue',
              data: Object.keys(
                tickets.reduce((acc, ticket) => {
                  const date = new Date(ticket.purchaseDate).toLocaleDateString();
                  acc[date] = true;
                  return acc;
                }, {} as Record<string, boolean>)
              ).map(date =>
                tickets
                  .filter(ticket => new Date(ticket.purchaseDate).toLocaleDateString() === date)
                  .reduce((sum, ticket) => sum + ticket.price, 0)
              ),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)'
            }]
          }} />
        </div> */}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl mt-5">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('attendees')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'attendees' ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Attendees
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'email' ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Email Marketing
              </button>
            </nav>
          </div>
          
          <div className="lg:p-6">
            {activeTab === 'attendees' ? (
              <>
                <Filters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  ticketTypeFilter={ticketTypeFilter}
                  setTicketTypeFilter={setTicketTypeFilter}
                  scannedFilter={scannedFilter}
                  setScannedFilter={setScannedFilter}
                  paymentFilter={paymentFilter}
                  setPaymentFilter={setPaymentFilter}
                  ticketTypes={event.ticketType}
                  onReset={() => {
                    setSearchQuery('');
                    setTicketTypeFilter('');
                    setScannedFilter('');
                  }}
                />
                <div className="mt-6">
                  <AttendeesTable tickets={filteredTickets} />
                </div>
              </>
            ) : (
              <EmailMarketing
                emailTitle={emailTitle}
                setEmailTitle={setEmailTitle}
                emailContent={emailContent}
                setEmailContent={setEmailContent}
                onSendEmail={handleSendEmail}
              />
            )}
          </div>
        </div>

        <div className="relative border-2 border-yellow-400 rounded-2xl p-8 bg-gradient-to-br from-yellow-50 via-amber-100 to-amber-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-700 shadow-xl overflow-hidden mt-10">
          {/* Glow and badge */}
          <div className="absolute -top-8 -right-8">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-base font-bold bg-yellow-500 text-white shadow-lg animate-pulse">
              <svg className="w-5 h-5 mr-1 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
              Early Access
            </span>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="mb-4 md:mb-0 max-w-lg">
              <h3 className="font-extrabold text-2xl text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                <svg className="w-7 h-7 text-yellow-500 animate-bounce" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 01.894.553l2.382 4.823 5.326.773a1 1 0 01.554 1.706l-3.853 3.757.91 5.308a1 1 0 01-1.451 1.054L10 16.347l-4.77 2.507a1 1 0 01-1.451-1.054l.91-5.308L.836 9.855a1 1 0 01.554-1.706l5.326-.773L9.118 2.553A1 1 0 0110 2z" /></svg>
                Unlock Premium Analytics
              </h3>
              <p className="text-gray-700 dark:text-gray-200 mt-2 text-lg font-medium">
                <span className="bg-yellow-200 dark:bg-yellow-900 px-2 py-0.5 rounded text-yellow-800 dark:text-yellow-200 font-semibold">
                  Limited-time offer!
                </span>
                <br />
                <span className="text-base font-normal">
                  Supercharge your events with advanced tools:
                </span>
              </p>
              <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-200 text-base">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Send unlimited emails & announcements to attendees
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Deep attendee demographics & insights
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Priority support & instant ticket exports
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  VIP badge for your events (boosts trust)
                </li>
              </ul>
              <div className="mt-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-yellow-500 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeOpacity="0.3" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4" /></svg>
                <span className="text-yellow-700 dark:text-yellow-300 font-semibold">
                  Only a few spots left this month!
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <button
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:to-yellow-600 text-white text-lg font-bold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 animate-pulse"
                onClick={() => window.location.href = '/pricing'}
              >
                Upgrade Now &rarr;
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                30-day money-back guarantee · Cancel anytime
              </span>
              <span className="inline-flex items-center text-green-600 dark:text-green-400 text-xs font-medium">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Trusted by 2,000+ organizers
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <EventAnalyticsContent />
    </Suspense>
  );
}