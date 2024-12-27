'use client';
import React from 'react';
import { FaRegCalendarAlt, FaTicketAlt, FaChartBar } from "react-icons/fa";

const FeaturedEvent = () => {
  const features = [
    {
      icon: <FaRegCalendarAlt className="text-blue-500 dark:text-blue-400 w-10 h-10" />, 
      title: "Virtual Event Planning",
      description:
        "Create and manage virtual events with our comprehensive planning tools and scheduling system.",
    },
    {
      icon: <FaTicketAlt className="text-purple-500 dark:text-purple-400 w-10 h-10" />,
      title: "Digital Ticketing",
      description:
        "Secure digital ticket generation, QR codes, and automated distribution for seamless entry management.",
    },
    {
      icon: <FaChartBar className="text-indigo-500 dark:text-indigo-400 w-10 h-10" />,
      title: "Event Analytics",
      description:
        "Track ticket sales, attendance rates, and engagement metrics with our real-time analytics dashboard.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-blue-900 via-purple-900 to-blue-900 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 pb-2">
            Why Choose V-Ticket?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 dark:text-gray-400 mt-4">
            Revolutionizing Virtual Event Management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl 
                         hover:shadow-2xl dark:shadow-purple-900/30
                         transform hover:-translate-y-1 transition-all duration-300
                         animate-fade-in-up"
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full w-fit
                            group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mt-6 text-gray-900 dark:text-white
                           group-hover:text-purple-600 dark:group-hover:text-purple-400
                           transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvent;