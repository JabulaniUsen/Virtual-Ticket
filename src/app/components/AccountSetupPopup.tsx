'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SuccessModal from './settings/modal/successModal';
import Loader from '../../components/ui/loader/Loader';
import Toast from '../../components/ui/Toast';
import { BASE_URL } from '../../../config';

type AccountData = {
  account_name: string;
  account_bank: string;
  account_number: string;
  currency: string;
};

const AccountSetupPopup = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [accountData, setAccountData] = useState<AccountData>({
    account_name: '',
    account_bank: '',
    account_number: '',
    currency: 'NGN',
  });

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
        }
      } catch (error) {
        console.log(error);
        toast('error', 'Failed to fetch account details');
      }
    };

    fetchAccountDetails();
  }, [router, toast]);

  const handleAccountSubmit = async (e: React.FormEvent) => {
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
      setTimeout(() => {
        setShowModal(false);
        onClose();
        // router.push('/dashboard');
      }, 2000); // Redirect to dashboard after 2 seconds
    } catch (error) {
      console.log(error);
      toast('error', 'Failed to update account details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Set Up Your Account</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Setting up your account details is crucial for receiving payments. Please provide accurate banking information to ensure smooth transactions.
        </p>
        <form onSubmit={handleAccountSubmit} className="space-y-6">
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
          
          <div className="flex justify-end space-x-4">
            {/* <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors dark:text-gray-200 dark:hover:text-blue-400"
            >
              Cancel
            </button> */}
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200"
            >
              Add Account
            </button>
          </div>
        </form>

        {loading && <Loader />}

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
    </div>
  );
};

export default AccountSetupPopup;