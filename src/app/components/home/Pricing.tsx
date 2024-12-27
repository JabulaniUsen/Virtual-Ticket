'use client';
import React, { useState } from 'react';
import { FaCheck, FaCrown, FaRegUser, FaRocket, FaAward } from 'react-icons/fa';
import { MdEventAvailable, MdOutlineDashboard, MdLocationOn, MdCampaign } from 'react-icons/md';
import { RiAtLine, RiCustomerService2Line } from 'react-icons/ri';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(true);

  const plans = [
    {
      name: "Basic",
      icon: <FaRegUser className="w-6 h-6" />,
      price: "Free",
      features: [
        { text: "Create up to 3 events", icon: <MdEventAvailable /> },
        { text: "Basic event template", icon: <MdOutlineDashboard /> },
        { text: "Standard ticket management", icon: <FaCheck /> },
        { text: "Basic analytics", icon: <FaCheck /> },
        { text: "Email support", icon: <RiCustomerService2Line /> },
        { text: "Mobile ticket scanning", icon: <FaCheck /> },
      ],
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "Premium",
      icon: <FaCrown className="w-6 h-6" />,
      price: isYearly ? "₦36,000" : "₦3,500",
      period: isYearly ? "/year" : "/month",
      features: [
        { text: "Unlimited events", icon: <MdEventAvailable /> },
        { text: "Multiple event templates", icon: <MdOutlineDashboard /> },
        { text: "Advanced location tracking", icon: <MdLocationOn /> },
        { text: "Priority event advertising", icon: <MdCampaign /> },
        { text: "AI event assistant", icon: <RiAtLine /> },
        { text: "Custom branding", icon: <FaAward /> },
        { text: "Advanced analytics", icon: <FaRocket /> },
        { text: "24/7 Priority support", icon: <RiCustomerService2Line /> },
        { text: "Customizable ticket designs", icon: <FaCheck /> },
        { text: "Multi-user access", icon: <FaCheck /> }
      ],
      buttonText: "Upgrade Now",
      popular: true
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id='pricing'>
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Select the perfect plan for your event management needs
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!isYearly ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative w-20 h-10 bg-blue-600 rounded-full flex items-center transition-colors duration-300 p-1"
                >
                <div
                    className={`w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300
                                ${isYearly ? 'translate-x-10' : 'translate-x-0'}`}
                />
            </button>

            <span className={`text-sm ${isYearly ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
              Yearly (Save 15%)
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl overflow-hidden
                         transform hover:-translate-y-2 transition-all duration-300
                         animate-fade-in-up bg-white dark:bg-gray-800 shadow-xl
                         ${plan.popular ? 'border-2 border-blue-500' : 'border border-gray-200 dark:border-gray-700'}
                      `}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {plan.popular && (
                <div className="absolute top-6 right-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl ${plan.popular ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-500 dark:text-gray-400 mb-1">
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li 
                      key={i}
                      className="flex items-center gap-3 text-gray-600 dark:text-gray-300"
                    >
                      <span className="text-blue-500 dark:text-blue-400">
                        {feature.icon}
                      </span>
                      {feature.text}
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200
                             transform hover:scale-105 active:scale-100
                             ${plan.popular 
                               ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                               : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                             }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing; 