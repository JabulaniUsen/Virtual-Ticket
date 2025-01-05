'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaTicketAlt, FaRegCalendarCheck, FaChartLine } from 'react-icons/fa';

const Hero = () => {
  const router = useRouter();

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (token) {
      // If user is logged in, smooth scroll to latest events
      const latestEvent = document.getElementById('latestEvents');
      latestEvent?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If user is not logged in, redirect to login page
      router.push('/auth/login');
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 
                      dark:from-gray-900 dark:via-blue-900 dark:to-gray-900 overflow-hidden" >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply 
                      filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply 
                      filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply 
                      filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Event Management,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Simplified
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 dark:text-gray-300 mb-8">
              Create, manage, and sell virtual tickets for your events with ease. 
              Experience the future of event management.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#latestEvents"
                onClick={handleGetStarted}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl
                         transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl
                         w-full sm:w-auto text-center"
              >
                Get Started Free
              </a>
              <Link
                href="#tutorial"
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl
                         backdrop-blur-md transform transition-all duration-200 hover:scale-105
                         w-full sm:w-auto text-center"
              >
                Watch Demo
              </Link>
            </div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {[
              {
                icon: <FaTicketAlt className="w-8 h-8" />,
                title: "Digital Ticketing",
                description: "Secure and seamless ticket distribution"
              },
              {
                icon: <FaRegCalendarCheck className="w-8 h-8" />,
                title: "Event Management",
                description: "Comprehensive tools for virtual events"
              },
              {
                icon: <FaChartLine className="w-8 h-8" />,
                title: "Real-time Analytics",
                description: "Track your event's performance"
              },
              {
                icon: <FaTicketAlt className="w-8 h-8" />,
                title: "Multiple Templates",
                description: "Customizable event layouts"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6
                         transform hover:-translate-y-2 transition-all duration-300
                         hover:bg-white/20"
              >
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-white text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-blue-100 dark:text-gray-300 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
