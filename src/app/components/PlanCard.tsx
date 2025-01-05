import React, { useState } from 'react';
import axios from 'axios';
import Toast from '../../components/ui/Toast';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

const PlanCard: React.FC<{ plan: Plan }> = ({ plan }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('User not authenticated. Please log in.');
      }

      await axios.post(
        'https://blah.com/v1/subscribe',
        { planId: plan.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success toast
      setToast({ type: 'success', message: `Successfully subscribed to ${plan.name}!` });
    } catch (err: unknown) {
      let errorMessage = 'An error occurred.';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      }
      setError(errorMessage);

      // Show error toast
      setToast({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plan-card p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700">

        <h3 className="plan-title text-xl font-semibold text-gray-800 dark:text-gray-100">
            {plan.name}
        </h3>

        <p className="plan-price text-gray-600 text-sm mt-2 dark:text-gray-400">
            ${plan.price.toFixed(2)} / month
        </p>


        <ul className="plan-features text-sm text-gray-700 mt-4 space-y-1 dark:text-gray-300">
            {plan.features.map((feature, idx) => (
            <li key={idx} className="feature-item flex items-center">
                <span className="feature-icon text-green-500 mr-2">✓</span>
                <span>{feature}</span>
            </li>
            ))}
        </ul>


        {error && (
            <p className="error-message text-red-500 text-sm mt-2 dark:text-red-400">
            {error}
            </p>
        )}

        {/* Subscribe Button */}
        <button
            onClick={handleSubscribe}
            disabled={loading}
            className={`subscribe-button mt-4 px-4 py-2 w-full rounded-md text-white ${
            loading
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
            }`}
        >
            {loading ? 'Processing...' : `Subscribe to ${plan.name}`}
        </button>
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

export default PlanCard;
