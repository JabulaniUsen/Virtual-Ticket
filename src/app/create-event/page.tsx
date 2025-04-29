'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import BasicInfo from './steps/BasicInfo';
import TicketSetup from './steps/TicketSetup';
import TicketDetails from './steps/TicketDetails';
import FinalDetails from './steps/FinalDetails';
import Toast from '@/components/ui/Toast';
import ToggleMode from '@/components/ui/mode/toggleMode';
import { saveFormProgress, getFormProgress } from '@/utils/localStorage';
import { BiArrowBack } from 'react-icons/bi';
import {useRouter} from 'next/navigation';
import AccountSetupPopup from '@/app/components/AccountSetupPopup';
import axios from 'axios';
import { BASE_URL } from '../../../config';


import { EventFormData } from '@/types/event';

export default function CreateEventPage() {

  const [showAccountSetup, setShowAccountSetup] = useState(false);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string; } | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    location: '',
    hostName: '',
    image: null,
    gallery: [],
    isVirtual: false,
    virtualEventDetails: undefined, // NEW FEATURE
    ticketType: [{
      name: '',
      price: '0.00',
      quantity: '0',
      sold: '0',
      details: '',
      attendees: []
    }],
    socialMediaLinks: {
      twitter: '',
      facebook: '',
      instagram: ''
    }
  });

  const updateFormData = (data: Partial<EventFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const steps = [
    { number: 1, title: 'Basic Information' },
    { number: 2, title: 'Ticket Setup' },
    { number: 3, title: 'Ticket Details' },
    { number: 4, title: 'Final Details' }
  ];

  // Load saved progress on mount
  useEffect(() => {
    const savedData = getFormProgress();
    if (savedData) {
      const savedImageMeta = localStorage.getItem('eventFormImageMeta');
      if (savedImageMeta) {
        try {
          setToast({ 
            type: 'info', 
            message: 'Please re-upload your event image for security reasons' 
          });
        } catch (error) {
          console.error('Error parsing saved image metadata:', error);
        }
      }

      setFormData(prevData => ({
        ...prevData,
        ...savedData,
      }));
    }
  }, []);

  // Save progress on updates
  useEffect(() => {
    const dataToSave = {
      ...formData,
      image: null,
      gallery: []
    };
    saveFormProgress(dataToSave);
  }, [formData]);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setToast({ type: 'error', message: 'Please login to create an event' });
          router.push('/auth/login');
          return;
        }

        const response = await axios.get(
          `${BASE_URL}api/v1/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (!response.data.user.account_number) {
          setShowAccountSetup(true);
        }
      } catch (error) {
        console.log(error);
        setToast({ type: 'error', message: 'Failed to fetch account details' });
      }
    };
    fetchAccountDetails();
  }, [router]);

  const validateStep = (currentStep: number): boolean => {
    
  switch (currentStep) {
    case 1:
      if (!formData.title.trim()) {
        setToast({ type: 'error', message: 'Please enter an event title' });
        return false;
      }
      if (!formData.description.trim()) {
        setToast({ type: 'error', message: 'Please enter an event description' });
        return false;
      }
      if (!formData.image) {
        setToast({ type: 'error', message: 'Please upload an event image' });
        return false;
      }
      if (!formData.date || !formData.time) {
        setToast({ type: 'error', message: 'Please set event date and time' });
        return false;
      }
      if (formData.isVirtual) {
        if (!formData.virtualEventDetails?.platform) {
          setToast({ type: 'error', message: 'Please select a virtual event platform' });
          return false;
        }
        if (formData.virtualEventDetails.platform === 'whereby' && !formData.virtualEventDetails.meetingUrl) {
          setToast({ type: 'error', message: 'Please enter a meeting URL' });
          return false;
        }
        if (formData.virtualEventDetails.platform === 'zoom' && !formData.virtualEventDetails.meetingId) {
          setToast({ type: 'error', message: 'Please enter a Zoom meeting ID' });
          return false;
        }
      } else {
        if (!formData.venue || !formData.location) {
          setToast({ type: 'error', message: 'Please enter event venue and location' });
          return false;
        }
      }
      return true;


      case 2:
        if (formData.ticketType.length === 0) {
          setToast({ type: 'error', message: 'Please add at least one ticket type' });
          return false;
        }
        for (const ticket of formData.ticketType) {
          if (!ticket.name || !ticket.price || !ticket.quantity) {
            setToast({ type: 'error', message: 'Please fill in all ticket details' });
            return false;
          }
        }
        return true;

      case 3:
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 text-transparent bg-clip-text hover:scale-105 transform transition-all">
                V-Ticket
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition duration-200"
                whileHover={{ scale: 1.05 }}
              >
                <BiArrowBack className="text-xl" />
                <span>Back to Dashboard</span>
              </motion.button>
              <ToggleMode />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8 sm:mb-12 animate-fadeIn">
            <div className="flex flex-wrap justify-between items-center gap-4">
              {steps.map((s) => (
                <div key={s.number} className="flex flex-col items-center flex-1 min-w-[120px]">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110
                      ${step >= s.number 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 text-white shadow-lg' 
                        : 'bg-white dark:bg-gray-700 text-gray-500 border-2 border-gray-200 dark:border-gray-600'}`}
                  >
                    {s.number}
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300 text-center">
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative mt-6">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-600 rounded-full -translate-y-1/2" />
              <div 
                className="absolute top-1/2 left-0 h-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 -translate-y-1/2 transition-all duration-500"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 sm:p-8 animate-slideUp">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full"
              >
                {step === 1 && (
                  <BasicInfo 
                    formData={formData} 
                    updateFormData={updateFormData}
                    onNext={handleNext}
                    setToast={setToast}
                  />
                )}
                {step === 2 && (
                  <TicketSetup
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={handleNext}
                    onBack={handleBack}
                    setToast={setToast}
                  />
                )}
                {step === 3 && (
                  <TicketDetails
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={handleNext}
                    onBack={handleBack}
                    setToast={setToast}
                  />
                )}
                {step === 4 && (
                  <FinalDetails
                    formData={formData}
                    updateFormData={updateFormData}
                    onBack={handleBack}
                    setToast={setToast}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {showAccountSetup && <AccountSetupPopup onClose={() => setShowAccountSetup(false)} />}
    </div>
  );
}
