"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EventList from '../components/EventList';
import Earnings from '../components/Earning';
import EventForm from '../components/EventForm';
import { BiBulb, BiMenuAltLeft, BiX } from 'react-icons/bi';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark');
  };

  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      
      {/* Header with Dark Mode Toggle */}
      <header className="fixed top-0 right-0 p-4 z-20 ">
        <button 
          onClick={toggleDarkMode} 
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
        >
          <BiBulb size={24} />
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 p-4 transition-transform duration-300 transform md:transform-none md:relative ${
          isSidebarOpen ? 'translate-x-0 w-[80%]' : '-translate-x-full md:w-[20%] sm:w-[50%]'
        } bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-600`}
      >
        {/* Logo and Menu Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xl font-semibold">
            Ticketly
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="text-gray-500 dark:text-gray-300 md:hidden"
          >
            {isSidebarOpen ? <BiX size={24} /> : <BiMenuAltLeft size={24} />}
          </button>
        </div>

        {/* Tabs */}
        <nav className="flex flex-col space-y-4">
          <button
            className={`relative group flex items-center space-x-2 py-2 px-4 transition-all duration-300 rounded-lg ${
              activeTab === 0 
                ? 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300' 
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setActiveTab(0)}
          >
            <span>Events</span>
          </button>
          <button
            className={`relative group flex items-center space-x-2 py-2 px-4 transition-all duration-300 rounded-lg ${
              activeTab === 1 
                ? 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300' 
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setActiveTab(1)}
          >
            <span>Earnings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-grow p-6 transition-all duration-300 ${isSidebarOpen && 'opacity-50 md:opacity-100'}`}>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white z-10"
        >
          <BiMenuAltLeft size={24} />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 0 && <EventList />}
            {activeTab === 1 && <Earnings />}
          </motion.div>
        </AnimatePresence>

        {/* Add Event Button */}
        <button 
          onClick={handleOpenForm} 
          className="fixed bottom-6 right-6 px-6 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300"
        >
          + Add Event
        </button>

        {/* Add Event Form Modal */}
        {openForm && (
          <AnimatePresence>
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-2xl w-full max-w-lg mx-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <EventForm onClose={handleCloseForm} open={openForm} />
                
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
