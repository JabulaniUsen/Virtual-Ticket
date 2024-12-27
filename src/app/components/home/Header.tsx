"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaTicketAlt } from 'react-icons/fa';
import ToggleMode from '../ui/mode/toggleMode';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '#events' },
    { name: 'Trending', href: '#trending' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'How It Works', href: '#tutorial' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              href="/"
              className="flex items-center space-x-2 text-blue-600 dark:text-blue-400"
            >
              <FaTicketAlt className="w-8 h-8" />
              <span className="text-xl font-bold">V-Ticket</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-200
                    ${isScrolled 
                      ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400' 
                      : 'text-white/90 hover:text-white'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Toggle Mode with better positioning */}
              <div className="flex items-center justify-center px-2">
                <ToggleMode />
              </div>

              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg
                         hover:bg-blue-700 transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>

            {/* Mobile Menu Controls */}
            <div className="flex items-center space-x-4 md:hidden">
              <ToggleMode />
              <button
                className="p-2 rounded-lg text-gray-100 hover:bg-white/10
                         dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden border-t ${
                isScrolled 
                  ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gray-200 dark:border-gray-800' 
                  : 'bg-black/20 backdrop-blur-lg border-white/10'
              }`}
            >
              <div className="px-4 py-2 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded-lg
                      ${isScrolled
                        ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                        : 'text-white hover:bg-white/10'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 text-base font-medium text-white bg-blue-600
                           hover:bg-blue-700 rounded-lg text-center mt-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
};

export default Header;
