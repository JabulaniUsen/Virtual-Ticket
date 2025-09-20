'use client';
import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaLinkedin} from 'react-icons/fa';
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md';
import XIcon from '@mui/icons-material/X';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-blue-900 to-blue-950 dark:from-gray-900 dark:to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
          {/* Company Info */}
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              V-Ticket
            </h3>
            <p className="text-gray-300 dark:text-gray-400">
              Revolutionizing live event ticketing with seamless in-person experiences and secure transactions. 
            </p>
            <div className="flex space-x-4">
              {[
                { icon: XIcon, url: "https://twitter.com/yourprofile" },
                { icon: FaFacebook, url: "https://web.facebook.com/profile.php?id=61571514631927" },
                { icon: FaInstagram, url: "https://www.instagram.com/vtickets.io" },
                // { icon: FaLinkedin, url: "https://linkedin.com/in/yourprofile" }
              ].map(({ icon: Icon, url }, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform hover:scale-110 transition-transform duration-200 
                            text-gray-300 hover:text-blue-400 dark:hover:text-blue-300"
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>

          </div>

          {/* Quick Links */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Terms & Condition', path: 'term&condition' },
                { name: 'Contact', path: '/contact' },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.path}
                    className="text-gray-300 hover:text-blue-400 dark:hover:text-blue-300 
                            transition-colors duration-200 flex items-center group"
                  >
                    <span className="transform group-hover:translate-x-2 transition-transform duration-200">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Contact Info */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              {[
                { Icon: MdLocationOn, text: "Uyo, Nigeria" },
                { Icon: MdPhone, text: "+234 906 352 5949" },
                { Icon: MdEmail, text: "support@vtickets.site" }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3 text-gray-300">
                  <item.Icon className="h-5 w-5 text-blue-400" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <h4 className="text-lg font-semibold">Newsletter</h4>
            <p className="text-gray-300 dark:text-gray-400">
              Stay updated with our latest events and offers.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-blue-800/50 dark:bg-gray-800 
                         border border-blue-700 dark:border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-blue-400 
                         placeholder-gray-400 text-white"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 
                         transition-colors duration-200 font-semibold
                         transform hover:translate-y-[-2px] active:translate-y-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-800 dark:border-gray-800 my-8" />

        {/* Bottom Section */}
        <div className="flex justify-center items-center">
          <p className="text-gray-300 dark:text-gray-400 text-center font-medium tracking-wide">
            © {currentYear} V-Ticket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 