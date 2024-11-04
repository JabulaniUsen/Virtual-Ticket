import React from 'react';

const events = [
  { id: 1, title: 'Tech Conference', date: '2024-12-01', location: 'New York', price: 50, imageUrl: 'https://via.placeholder.com/300x150.png?text=Tech+Conference' },
  { id: 2, title: 'Music Fest', date: '2024-12-15', location: 'Los Angeles', price: 80, imageUrl: 'https://via.placeholder.com/300x150.png?text=Music+Fest' }
];

const copyLink = (eventId: number) => {
  const link = `${window.location.origin}/events/${eventId}`;
  navigator.clipboard.writeText(link);
  alert(`Event link copied: ${link}`);
};

const EventList = () => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4">
      {events.map((event) => (
        <div key={event.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
          <img src={event.imageUrl} alt={event.title} className="w-full h-32 object-cover" />
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{event.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              <span>Date: {event.date}</span><br />
              <span>Location: {event.location}</span><br />
              <span>Price: <span className="font-semibold text-green-600 dark:text-green-400">${event.price}</span></span>
            </p>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700">
            <button
              onClick={() => copyLink(event.id)}
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-colors"
            >
              Copy Link
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
              Edit
            </button>
            <button className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-transparent border border-red-600 dark:border-red-400 rounded-lg hover:bg-red-600 hover:text-white dark:hover:bg-red-400 transition-colors">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
