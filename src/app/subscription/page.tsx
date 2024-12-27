'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PlanCard from '../components/PlanCard';
import Toast from '../components/ui/Toast';
import ToggleMode from '../components/ui/mode/toggleMode';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[]; // Added 'features' property
}


const SubscriptionPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('https://blah.com/v1/plans');
        setPlans(response.data);
      } catch (err: unknown) {
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : 'Failed to fetch plans.';
        setError(errorMessage);

        // Show error toast
        setToast({ type: 'error', message: errorMessage });
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 dark:bg-gray-900">
        <header className='fixed top-0 right-0 p-4 z-20'>
            <ToggleMode />
        </header>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Choose Your Plan</h1>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        {loading ? (
        <p className="mt-4 text-gray-600">Loading plans...</p>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {plans.map((plan: Plan) => (
            <PlanCard key={plan.id} plan={plan} />
            ))}
        </div>
        )}
        {toast && (
        <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
        />
        )}
    </div>
  );
};

export default SubscriptionPage;
