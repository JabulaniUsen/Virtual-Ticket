'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios, { AxiosError } from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendEmailWithMailgun = async (email: string, token: string) => {
    const mailgunDomain = 'mg.ticketly.com'; 
    const mailgunApiKey = 'a5aba95cf0158f0d29fdc5f42ed10650-f55d7446-74d70c4c'; 
    const mailgunAPI = `https://api.mailgun.net/v3/${mailgunDomain}/messages`;

    const emailData = new URLSearchParams();
    emailData.append('from', 'noreply@ticketly.com');
    emailData.append('to', email);
    emailData.append('subject', 'Password Reset Request');
    emailData.append(
      'html',
      `<p>Hi,</p>
       <p>You requested a password reset. Use the following token to reset your password:</p>
       <h3>${token}</h3>
       <p>Alternatively, click the button below:</p>
       <a href="https://your-domain.com/reset-password?token=${token}" 
          style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
       </a>
       <p>If you didn’t request this, please ignore this email.</p>`
    );

    await axios.post(mailgunAPI, emailData, {
      auth: {
        username: 'api',
        password: mailgunApiKey,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccess(false);

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.patch(
        'https://v-ticket-backend.onrender.com/api/v1/users/password-recovery',
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { token } = response.data;

      if (response.data.message && response.data.message.includes('success')) {
        await sendEmailWithMailgun(email, token);
        toast.success('A reset link has been sent to your email!');
        setSuccess(true);
      } else {
        setErrorMessage('Unexpected response. Please try again.');
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error('Error response:', axiosError.response);
      console.error('Error stack:', error);

      if (!axiosError.response) {
        toast.error('Network error! Please check your internet connection.');
      } else {
        const { status, data } = axiosError.response;

        switch (status) {
          case 404:
            setErrorMessage(
              data?.message === 'Email not found'
                ? 'Email not found. Please check and try again.'
                : 'Resource not found.'
            );
            break;
          case 400:
            setErrorMessage(
              data?.message || 'Bad Request. Please verify the entered data.'
            );
            break;
          case 500:
            setErrorMessage('Server error! Please try again later.');
            break;
          default:
            setErrorMessage(
              data?.message || `Unexpected error (${status}). Please try again later.`
            );
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white px-4 py-8"
      style={{
        backgroundImage: `url("/bg-back.avif")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <ToastContainer />

      <div
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-6"
        style={{ boxShadow: '3px -2px 3px 4px rgba(1,1,1,.2)' }}
      >
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Ticketly Logo"
            width={120}
            height={120}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-semibold text-gray-900">Forgot Password</h1>
          {!success && (
            <p className="text-gray-500 mt-2">
              Enter your email to reset your password.
            </p>
          )}
        </div>

        {success ? (
          <div className="mt-4 text-green-600 flex flex-col items-center">
            <Image
              src="/envelope-icon.png"
              alt="Email Sent"
              width={80}
              height={80}
              className="mb-2"
            />
            <p>A reset link has been sent to your email.</p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="text-red-600 text-center mb-4">
                <p>{errorMessage}</p>
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800"
                placeholder="Enter your email"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-md text-white ${
                  loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-blue-400`}
              >
                {loading ? 'Processing...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
