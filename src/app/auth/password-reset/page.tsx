'use client'
import React, { useState } from 'react';
import Image from 'next/image';

function PasswordReset() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');


    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      setMessage('Your password has been successfully reset! You can now log in.');
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-gray-800 px-4 py-8"
    style={{
        backgroundImage: `url("/bg-back.avif")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-6"
        style={{
            boxShadow: '3px -2px 3px 4px rgba(1,1,1,.2)'
        }}
      >
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Ticketly Logo"
            width={120}
            height={120}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-semibold text-gray-900">Reset Your Password</h1>
          <p className="text-gray-500 mt-2">Enter your new password below.</p>
        </div>

        {message && (
          <div className="text-green-600 text-center mb-4">
            <p>{message}</p>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-center mb-4">
            <p>{error}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-2 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-2 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Confirm your password"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md text-white ${loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-400`}
            >
              {loading ? 'Processing...' : 'Reset Password'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Remembered your password?{' '}
            <a href="/auth/login" className="text-blue-500 hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;
