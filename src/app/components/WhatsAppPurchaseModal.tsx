'use client';
import React, { useState } from 'react';
import { FaWhatsapp, FaTimes, FaUser, FaEnvelope, FaShoppingCart } from 'react-icons/fa';
import { type Ticket } from '@/types/event';

interface WhatsAppPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWebsitePurchase: () => void;
  ticket: Ticket;
  eventTitle: string;
}

const WhatsAppPurchaseModal: React.FC<WhatsAppPurchaseModalProps> = ({
  isOpen,
  onClose,
  onWebsitePurchase,
  ticket,
  eventTitle
}) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleWhatsAppPurchase = () => {
    if (!userName.trim() || !userEmail.trim()) {
      alert('Please fill in your name and email');
      return;
    }

    const message = `🎫 *TICKET PURCHASE REQUEST*

📅 *Event:* ${eventTitle}
🎟️ *Ticket Type:* ${ticket.name}
💰 *Price:* ₦${parseInt(ticket.price).toLocaleString()}
🔢 *Quantity:* ${quantity}

👤 *Customer Details:*
• Name: ${userName}
• Email: ${userEmail}

Please confirm availability and provide payment instructions. Thank you! 🙏`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/2349078222769?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleWebsitePurchase = () => {
    onWebsitePurchase();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full mx-2 sm:mx-4 overflow-hidden max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <FaWhatsapp className="text-xl sm:text-2xl" />
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Purchase Options</h2>
                <p className="text-green-100 text-xs sm:text-sm">Choose how you&apos;d like to buy your ticket</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <FaTimes className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>

        {/* Ticket Info */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">{ticket.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Event: {eventTitle}</p>
            <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
              ₦{parseInt(ticket.price).toLocaleString()}
            </p>
          </div>
        </div>

        {/* WhatsApp Purchase Form */}
        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
              <FaWhatsapp className="text-green-500 mr-2 text-sm sm:text-base" />
              Buy on WhatsApp
            </h3>
            
            <div className="space-y-3 sm:space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                  <FaUser className="inline mr-1 text-xs sm:text-sm" />
                  Your Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                  <FaEnvelope className="inline mr-1 text-xs sm:text-sm" />
                  Your Email
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                  <FaShoppingCart className="inline mr-1 text-xs sm:text-sm" />
                  Quantity
                </label>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm sm:text-base"
                  >
                    -
                  </button>
                  <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white min-w-[2rem] sm:min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm sm:text-base"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleWhatsAppPurchase}
              className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <FaWhatsapp className="text-lg sm:text-xl" />
              <span>Buy on WhatsApp</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-4 sm:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-3 sm:px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">OR</span>
            </div>
          </div>

          {/* Website Purchase Option */}
          <div>
            <button
              onClick={handleWebsitePurchase}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
            >
              Buy on Website
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            WhatsApp purchases are handled directly with our support team
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPurchaseModal;
