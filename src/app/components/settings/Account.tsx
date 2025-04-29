import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SuccessModal from './modal/successModal';
import Loader from '../../../components/ui/loader/Loaders';
import Toast from '../../../components/ui/Toast';
import { formatPrice } from '@/utils/formatPrice';
import { BASE_URL } from '../../../../config';


type AccountData = {
  account_name: string;
  account_bank: string;
  account_number: string;
  currency: string;
};

type Transaction = {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
};

type Event = {
  id: string; 
  title: string;
  slug: string; 
  description: string; 
  image: string; 
  date: string; 
  location: string; 
  time: string; 
  venue: string; 
  hostName: string; 
  ticketType: TicketType[]; 
  gallery: string | null;
  socialMediaLinks: string | null; 
  userId: string; 
  createdAt: string; 
  updatedAt: string; 
};

type TicketType = {
  name: string; 
  sold: string; 
  price: string; 
  quantity: string; // Total available tickets as a string
  details: string;
  attendees?: { name: string; email: string; }[];
};

const Account = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [hasExistingAccount, setHasExistingAccount] = useState(false);
  const [accountData, setAccountData] = useState<AccountData>({
    account_name: '',
    account_bank: '',
    account_number: '',
    currency: 'NGN',
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState<{
    type: 'success' | 'error';
    message: string;
  }>({
    type: 'success',
    message: '',
  });

  const toast = useCallback((type: 'success' | 'error', message: string) => {
    setToastProps({ type, message });
    setShowToast(true);
  }, []);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast('error', 'Please login to view your account details');
          router.push('/auth/login');
          return;
        }

        const response = await axios.get(
          `${BASE_URL}api/v1/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.user.account_number) {
          setAccountData({
            account_name: response.data.user.account_name,
            account_bank: response.data.user.account_bank,
            account_number: response.data.user.account_number,
            currency: response.data.user.currency || 'NGN',
          });
          setHasExistingAccount(true);
        }
      } catch (error) {
        console.log(error);
        toast('error', 'Failed to fetch account details');
      }
    };

    const fetchTransactionHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast('error', 'Please login to view your transaction history');
          router.push('/auth/login');
          return;
        }

        const response = await axios.get(
          `${BASE_URL}api/v1/events/my-events`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const events = response.data.events;
        const transactions: Transaction[] = events.flatMap((event: Event) =>
          event.ticketType
            .map((ticket) => ({
              id: `${event.id}-${ticket.name}`,
              amount: parseFloat(ticket.price) * parseFloat(ticket.sold),
              type: 'credit',
              description: `Ticket sale - ${event.title}`,
              date: event.date,
            }))
            .filter(transaction => transaction.amount > 0)
        );

        setTransactions(transactions);
      } catch (error) {
        console.log(error);
        toast('error', 'Failed to fetch transaction history');
      }
    };

    fetchAccountDetails();
    fetchTransactionHistory();
  }, [router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast('error', 'Please login to update your account details');
        return;
      }

      await axios.patch(
        `${BASE_URL}api/v1/users/profile`,
        accountData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setShowModal(true);
      setHasExistingAccount(true);
      setShowForm(false);
    } catch (error) {
        console.log(error);
      toast('error', 'Failed to update account details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full sm:max-w-4xl p-2 sm:p-6 space-y-8 animate-fadeIn">
      {loading && <Loader />}
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Payment Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your payment information and view transaction history
          </p>
        </div>
        
        <div className="relative w-64">
          <select
            value={accountData.currency}
            onChange={(e) => setAccountData(prev => ({ ...prev, currency: e.target.value }))}
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 shadow-sm"
          >
            <option value="NGN">NGN - Naira</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
          </select>
        </div>
      </div>

      {hasExistingAccount && !showForm && (
        <div className="relative group max-w-md ">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <div 
            className="relative p-6 rounded-2xl shadow-xl overflow-hidden"
            style={{
              background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://img.freepik.com/free-vector/gradient-blue-abstract-technology-background_23-2149213765.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">{accountData.account_bank}</h3>
                <p className="text-gray-200">****{accountData.account_number.slice(-4)}</p>
                <p className="text-sm text-gray-300">{accountData.account_name}</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="text-white hover:text-blue-200 transition-colors bg-blue-500/30 px-3 py-1 rounded-lg"
              >
                Edit
              </button>
            </div>
            <div className="absolute bottom-4 right-4 opacity-50">
              <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="20" r="18" stroke="white" strokeWidth="2" strokeOpacity="0.5"/>
                <circle cx="40" cy="20" r="18" stroke="white" strokeWidth="2" strokeOpacity="0.5"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {(!hasExistingAccount || showForm) && (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg animate-slideUp">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Bank Name</label>
              <input
                type="text"
                value={accountData.account_bank}
                onChange={(e) => setAccountData(prev => ({ ...prev, account_bank: e.target.value }))}
                className="w-full p-2 border rounded-lg bg-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Account Number</label>
              <input
                type="text"
                value={accountData.account_number}
                onChange={(e) => setAccountData(prev => ({ ...prev, account_number: e.target.value }))}
                className="w-full p-2 border rounded-lg bg-transparent"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Account Name</label>
              <input
                type="text"
                value={accountData.account_name}
                onChange={(e) => setAccountData(prev => ({ ...prev, account_name: e.target.value }))}
                className="w-full p-2 border rounded-lg bg-transparent"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 ">
            {showForm && (
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors dark:text-gray-200 dark:hover:text-blue-400"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200"
            >
              {hasExistingAccount ? 'Update Account' : 'Add Account'}
            </button>
          </div>
        </form>
      )}

      {/* Transaction History Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {transactions.map((transaction, index) => (
                  <tr key={`${transaction.id}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(transaction.date).toLocaleDateString('en-GB')}</td>
                    <td className="px-6 py-4">{transaction.description}</td>
                    <td className={`px-6 py-4 ${transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatPrice(transaction.amount, accountData.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <SuccessModal
          title="Account Updated"
          message="Your payment information has been successfully updated."
          onClose={() => setShowModal(false)}
        />
      )}

      {showToast && (
        <Toast
          type={toastProps.type}
          message={toastProps.message}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default Account;