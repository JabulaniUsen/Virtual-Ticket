import React from 'react';
import { FaTelegram, FaWhatsapp, FaDiscord } from 'react-icons/fa';
import { motion } from 'framer-motion';

type Props = {
  telegramUrl?: string;
  whatsappUrl?: string;
  discordUrl?: string;
  variant?: 'success' | 'ticket';
};

const SocialChannelsCTA = ({ telegramUrl, whatsappUrl, discordUrl, variant = 'success' }: Props) => {
  const isSuccess = variant === 'success';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        ${isSuccess ? 'bg-white/10' : 'bg-blue-50 dark:bg-gray-800'} 
        backdrop-blur-md rounded-lg p-5 max-w-2xl mx-auto
      `}
    >
      <h3 className={`
        text-lg font-semibold mb-3
        ${isSuccess ? 'text-white' : 'text-gray-900 dark:text-white'}
      `}>
        Join Our Community! 🌟
      </h3>
      
      <p className={`
        text-sm mb-4
        ${isSuccess ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'}
      `}>
        Stay updated with event details and connect with other attendees
      </p>

      <div className="flex flex-wrap gap-3">
        {telegramUrl && (
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all
              ${isSuccess 
                ? 'bg-blue-500/20 hover:bg-blue-500/30 text-white' 
                : 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-900/70'
              }
            `}
          >
            <FaTelegram className="text-xl" />
            <span>Join Telegram</span>
          </a>
        )}

        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all
              ${isSuccess 
                ? 'bg-green-500/20 hover:bg-green-500/30 text-white' 
                : 'bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:hover:bg-green-900/70'
              }
            `}
          >
            <FaWhatsapp className="text-xl" />
            <span>Join WhatsApp</span>
          </a>
        )}

        {discordUrl && (
          <a
            href={discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all
              ${isSuccess 
                ? 'bg-indigo-500/20 hover:bg-indigo-500/30 text-white' 
                : 'bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/70'
              }
            `}
          >
            <FaDiscord className="text-xl" />
            <span>Join Discord</span>
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default SocialChannelsCTA;