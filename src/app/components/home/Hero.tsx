'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaTicketAlt, FaRegCalendarCheck, FaChartLine, FaQrcode, FaArrowRight } from 'react-icons/fa';
import Loader from '@/components/ui/loader/Loader';

const Hero = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); 
  const pathname = usePathname();

  const handleGetStarted = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true); 
    try {
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.setItem("lastVisitedPath", pathname);
        const latestEvent = document.getElementById('latestEvents');
        latestEvent?.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error handling Get Started:', error);
    } finally {
      setIsLoading(false); 
    }
  };

  const features = [
    {
      icon: <FaTicketAlt className="w-5 h-5" />,
      title: "Seamless Ticketing",
      description: "Sell tickets in minutes, not days"
    },
    {
      icon: <FaRegCalendarCheck className="w-5 h-5" />,
      title: "Effortless Planning",
      description: "Tools that work as hard as you do"
    },
    {
      icon: <FaChartLine className="w-5 h-5" />,
      title: "Data Insights",
      description: "Know your audience better"
    },
    {
      icon: <FaQrcode className="w-5 h-5" />,
      title: "Instant Check-in",
      description: "No more long queues"
    }
  ];

  return (
    <section className="relative min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
      {isLoading && <Loader />}
      
      {/* Diagonal background elements */}
      <div className="absolute inset-0 overflow-hidden -rotate-3 scale-125">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-transparent dark:from-gray-900/80 dark:via-blue-950/80 dark:to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-tl from-blue-100/30 via-purple-100/30 to-transparent dark:from-gray-900/50 dark:via-blue-950/50 dark:to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
        {/* Asymmetric grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
          {/* Text Content - Off-center */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-6 -rotate-2"
            >
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Event tech reinvented
              </span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              <span className="relative inline-block">
                <span className="relative z-10">Where events</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-200/70 dark:bg-blue-900/50 -z-0"></span>
              </span>
              <br />
              <span className="text-blue-600 dark:text-blue-400 italic">meet innovation</span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mb-8 relative pl-6 border-l-2 border-blue-200 dark:border-blue-900">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                We&apos;re transforming how you connect with your audience.
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30"
              >
                Begin your event journey
                <FaArrowRight className="w-4 h-4" />
              </motion.button>
              
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="#tutorial"
                  className="flex items-center gap-2 px-6 py-3.5 bg-transparent text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-all border-2 border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-400"
                >
                  See how it works
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Feature Cards - Diagonal stack */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-5 relative">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  style={{ rotate: index % 2 === 0 ? -1.5 : 1.5 }}
                  className={`bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-800 ${
                    index === 0 ? "mt-10" : index === 3 ? "-mt-10" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
            
            {/* Decorative element */}
            <div className="absolute -z-10 top-1/2 left-1/2 w-64 h-64 rounded-full bg-blue-100/30 dark:bg-blue-900/20 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          </motion.div>
        </div>
      </div>

      {/* Abstract floating shapes */}
      <motion.div 
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: "linear",
        }}
        className="hidden lg:block absolute top-1/3 -left-20 w-40 h-40 rounded-full border-4 border-blue-200/50 dark:border-blue-900/30"
      />
      
      <motion.div 
        animate={{
          y: [0, -30, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="hidden lg:block absolute bottom-1/4 right-20 w-24 h-24 rounded-lg bg-blue-100/50 dark:bg-blue-900/30 blur-xl opacity-80"
      />
    </section>
  );
};

export default Hero;