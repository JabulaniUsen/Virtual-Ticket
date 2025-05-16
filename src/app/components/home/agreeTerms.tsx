import React, { useMemo } from 'react';
import { FaTimes, FaCheckCircle, FaHandshake, FaLock, FaUserShield } from 'react-icons/fa';

interface AgreeTermsProps {
  onClose: () => void;
}

const AgreeTerms: React.FC<AgreeTermsProps> = ({ onClose }) => {
  // Memoize sections for performance
  const sections = useMemo(() => [
    {
      title: "Your Protection",
      icon: <FaUserShield className="text-blue-500" />,
      content: "We prioritize your security and data privacy above all else.",
      highlight: true
    },
    {
      title: "No Hidden Fees",
      icon: <FaHandshake className="text-green-500" />,
      content: "You keep 100% of your ticket revenue - we never take commissions.",
      highlight: true
    },
    {
      title: "1. Acceptance",
      content: "By using V-Tickets, you agree to our Terms of Service."
    },
    {
      title: "2. Account Security",
      icon: <FaLock className="text-blue-400" />,
      content: "You're responsible for maintaining your account security."
    },
    {
      title: "3. Event Guidelines",
      content: "All events must comply with our content policies and local laws."
    },
    {
      title: "4. Ticket Sales",
      content: "Organizers receive full ticket revenue minus payment processor fees."
    },
    {
      title: "5. Final Sales",
      content: "All ticket purchases are final unless required by law."
    }
  ], []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Header with psychological triggers */}
        <div className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 border-b border-gray-200 dark:border-gray-700 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                <span>Terms & Protection</span>
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close terms"
            >
              <FaTimes className="text-gray-500 dark:text-gray-400 text-xl" />
            </button>
          </div>
        </div>

        {/* Content with visual hierarchy */}
        <div className="p-6 space-y-6">
          {/* Social proof badge */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800 flex items-start gap-3">
            <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
              <FaHandshake className="text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-200">Trusted by thousands of organizers</h3>
              <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                Join our community of event professionals
              </p>
            </div>
          </div>

          {/* Terms sections */}
          <div className="space-y-5">
            {sections.map((section, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg transition-all ${section.highlight ? 'bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
              >
                <div className="flex items-start gap-3">
                  {section.icon && (
                    <div className={`mt-0.5 ${section.highlight ? 'text-blue-500' : 'text-gray-400'}`}>
                      {section.icon}
                    </div>
                  )}
                  <div>
                    <h3 className={`font-medium ${section.highlight ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'}`}>
                      {section.title}
                    </h3>
                    <p className={`mt-1 text-sm ${section.highlight ? 'text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}`}>
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Conversion-focused CTA */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-5 border border-green-100 dark:border-gray-700 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Ready to get started?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  You&apos;re just one click away from creating amazing events
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 whitespace-nowrap"
              >
                I Understand - Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreeTerms;