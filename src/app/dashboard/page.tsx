"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EventList from '../components/EventList';
import Earnings from '../components/Earning';
import EventForm from '../components/EventForm';
import { BiBulb } from 'react-icons/bi';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openForm, setOpenForm] = useState(false);

  const toggleDarkMode = () => {
    const bodyClass = document.body.classList;
    bodyClass.toggle('dark');
  };

  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);

  return (
    <div className="min-h-screen flex flex-row bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 p-4 border-r border-gray-300 dark:border-gray-600">
        <header className="flex justify-between items-center mb-4">
          <div className="">
            {/* <img src={logo} alt="Logo" className="h-10" /> */}
            Ticketly
          </div>
          <button onClick={toggleDarkMode} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white transition-colors">
            <BiBulb/> 
          </button>
        </header>
        {/* Tabs */}
        <nav className="flex flex-col items-start space-y-2">
          <button
            className={`py-2 px-4 transition-colors ${activeTab === 0 ? 'border-l-4 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab(0)}
          >
            Events
          </button>
          <button
            className={`py-2 px-4 transition-colors ${activeTab === 1 ? 'border-l-4 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab(1)}
          >
            Earnings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4">
        <motion.div
          key={activeTab} 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          transition={{ duration: 0.3 }}
        >
          {activeTab === 0 && <EventList />}
          {activeTab === 1 && <Earnings />}
        </motion.div>

        {/* Add Event Button */}
        <button onClick={handleOpenForm} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Add Event
        </button>

        {/* Add Event Form Modal */}
        {openForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-lg dark:bg-gray-800">
              <EventForm onClose={handleCloseForm} open={openForm} />
              <button onClick={handleCloseForm} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;