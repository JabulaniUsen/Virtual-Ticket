import Image from 'next/image';
import Link from 'next/link';

const events = [
  { id: 1, title: 'Tech Conference', date: '2024-12-01', location: 'New York', price: 50, imageUrl: 'https://via.placeholder.com/300x150.png?text=Tech+Conference' },
  { id: 2, title: 'Music Fest', date: '2024-12-15', location: 'Los Angeles', price: 80, imageUrl: 'https://img.freepik.com/premium-vector/gradient-halftone-music-festival-horizontal-banners_23-2149079862.jpg?w=740' }
];

const copyLink = (eventId: number) => {
  const link = `${window.location.origin}/events/${eventId}`;
  navigator.clipboard.writeText(link);
  alert(`Event link copied: ${link}`);
};

const EventList = () => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4 lg:ml-[3rem] md:ml-[3rem] sm:ml-[0rem] ">
      {events.map((event) => (
        <div key={event.id} className="relative bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-900">
          <Image 
            src={event.imageUrl} 
            alt={event.title} 
            width={300} 
            height={150} 
            className="w-full h-32 object-cover" 
            unoptimized 
          />
          
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{event.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              <span>Date: {event.date}</span><br />
              <span>Location: {event.location}</span><br />
              <span>Price: <span className="font-semibold text-green-600 dark:text-green-400">₦{event.price}</span></span>
            </p>
          </div>


          <div className="absolute top-2 right-2 group">
            <Link href={`/analytics?id=${event.id}`} passHref>
              <div className="relative group">
                <span className="text-blue-500 text-xl cursor-pointer opacity-75 group-hover:opacity-100 transition-opacity ">
                  
                  <button className='flex word-2 px-4 py-2 text-sm bg-gray-800 font-medium text-white  dark:border-red-400 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-900 transition-colors'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path d="M3 13h4v4H3zm6-7h4v11H9zm6-3h4v14h-4z" fill="none" stroke="#fff" strokeWidth="2"/>
                  </svg>

                    View 
                  </button>
                 
                </span>
              
              </div>
            </Link>
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
            <button className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-transparent border border-red-600 dark:border-red-400 rounded-lg hover:bg-red-600 hover:text-white dark:hover:bg-red-400 dark:text-white transition-colors">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
