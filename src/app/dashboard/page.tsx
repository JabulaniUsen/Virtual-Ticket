"use client";

import { useState, useEffect} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EventList from '../components/EventList';
import Earnings from '../components/Earning';
import EventForm from '../components/EventForm';
import Setting from '../components/Setting';
import ToggleMode from "../components/ui/mode/toggleMode";
import { BiMenuAltLeft, BiX, BiCalendar } from 'react-icons/bi';
import { FiSettings, FiLogOut } from 'react-icons/fi';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const router = useRouter();
  const [notyf, setNotyf] = useState<Notyf | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userNotyf = new Notyf({ duration: 3000 });
      setNotyf(userNotyf); 

      const user = localStorage.getItem("user");

      if (!user) {
        userNotyf.error("You need to log in to access the dashboard.");
        router.push("/auth/login");
      } else {
        try {
          const parsedUser = JSON.parse(user);
          const welcomeShown = localStorage.getItem("welcomeShown");

          if (parsedUser.fullName && welcomeShown !== "true") {
            userNotyf.success(`Welcome back, ${parsedUser.fullName}!`);
            localStorage.setItem("welcomeShown", "true");
          }
        } catch (error) {
          localStorage.removeItem("user");
          localStorage.removeItem("welcomeShown");
          userNotyf.error("Your session is invalid. Please log in again.");
          router.push("/auth/login");
          console.log(error)
        }
      }
    }
  }, [router]);

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    if (typeof window !== 'undefined') {
      updateWidth();
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }
  }, []);


  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('welcomeShown');
    notyf?.success("Logged out successfully!");
    router.push('/auth/login');
  };
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkAuthentication = () => {
        const user = localStorage.getItem("user");
        if (!user) {
          notyf?.error("You need to log in to access the dashboard.");
          router.push("/auth/login");
        }
      };

      checkAuthentication();
    }
  }, [router, notyf]);
  
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">

      <header className="fixed top-0 right-0 p-4 z-20">
      <ToggleMode />
        {/* <button 
          onClick={toggleDarkMode} 
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
        >
          <BiBulb size={24} />
        </button> */}
      </header>

      {/* ========================= && •SIDEBAR• && =================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 p-4 transform bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-600
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:hover:w-64'}
          ${isSidebarOpen ? 'w-64 ' : 'w-16'}
          transition-transform sm:duration-300 sm:ease-linear lg:duration-[400ms] lg:ease-in-out`}

        onMouseEnter={() => !isSidebarOpen && setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}

      >
        <div className="flex items-center justify-between mb-6">
          <span className={`text-xl font-semibold truncate ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
            {isSidebarOpen ? ("Ticketly") : (
              <span className='ml-2'> T </span> )}
          </span>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="text-gray-500 dark:text-gray-300 md:hidden"
          >
            {isSidebarOpen ? <BiX size={24} /> : <BiMenuAltLeft size={24} />}
          </button>
        </div>

        {/* ========================= && •TABS• && =================== */}
        <nav className="flex flex-col space-y-2 center">
          <button
            className={`relative group flex items-center space-x-2 py-2 px-4 transition-all duration-300 rounded-lg ${
              activeTab === 0 
                ? 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300' 
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setActiveTab(0)}
          >
            {isSidebarOpen ? (
              <span className="flex items-center space-x-2">
                <BiCalendar size={24} className="inline text-blue-500" />
                <span>Events</span>
              </span>
            ) : (
              <span className="flex items-center justify-center ml-[-.7rem]">
              <BiCalendar size={24} className="text-blue-500" /></span>
            )}
          </button>
          
          <button
            className={`relative group flex items-center space-x-2 py-2 px-4 transition-all duration-300 rounded-lg ${
              activeTab === 1 
                ? 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300' 
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setActiveTab(1)}
          >
            {isSidebarOpen ? (
              <span className="flex items-center space-x-2">
                 <span className="inline text-blue-500 text-[20px]" >₦ </span>
                <span>Earnings</span>
              </span>
            ) : (
              <span className="flex items-center justify-center ml-[-.57rem]">
              <span className="inline text-blue-500 text-[20px]" >₦ </span></span>
            )}
          </button>

          <button
            className={`relative group flex items-center space-x-2 py-2 px-4 transition-all duration-300 rounded-lg ${
              activeTab === 2 
                ? 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300' 
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setActiveTab(2)}
          >
            {isSidebarOpen ? (
              <span className="flex items-center space-x-2">
                <FiSettings size={22} className="inline text-blue-500" />
                <span>Settings</span>
              </span>
            ) : (
              <span className="flex items-center justify-center ml-[-.7rem]">
              <FiSettings size={22} className="text-blue-500" /></span>
            )}
          </button>

          <button
            className="relative group flex items-center space-x-2 py-2 px-4 transition-all duration-300 rounded-lg "
          >
            {isSidebarOpen ? (
              <span className="flex items-center space-x-2">
                <FiLogOut size={22} className="inline text-red-500" />
                <a href='/auth/login'>Logout</a>
              </span>
            ) : (
              <span className="flex items-center justify-center ml-[-.7rem]"
              onClick={handleLogout}>
                <FiLogOut size={22} className="text-red-500" />
              </span>
            )}
          </button>

        </nav>
      </aside>

      {/* ========================= && •MAIN CONTENT• && =================== */}
      <main
        className={`flex-grow p-6 transition-all duration-300 ${isSidebarOpen ? 'opacity-50 md:opacity-100' : ''}`}
        style={{ marginLeft: isSidebarOpen ? windowWidth && windowWidth >= 768 ? '13rem' : '0rem' : windowWidth && windowWidth <= 767 ? '0rem' : '0rem'}}
      >

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed top-4 left-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white z-10"
        >
          {isSidebarOpen ? <BiX size={24} /> : <BiMenuAltLeft size={24} />}
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
            {activeTab === 2 && <Setting />}
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