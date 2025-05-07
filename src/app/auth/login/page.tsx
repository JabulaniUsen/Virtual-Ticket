'use client';
import React, { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaRedo } from 'react-icons/fa';
import Loader from '../../../components/ui/loader/Loader';
import Toast from '../../../components/ui/Toast';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import { BASE_URL } from '../../../../config';

type FormData = {
  email: string;
  password: string;
};

type ToastType = 'success' | 'error' | 'warning' | 'info';

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState<{
    type: ToastType;
    message: string;
  }>({
    type: 'success',
    message: '',
  });
  const [resendLoading, setResendLoading] = useState(false);
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize verification notice from URL param
  const needsVerification = searchParams.get('verify') == 'true';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const showToastMessage = useCallback((type: ToastType, message: string) => {
    setToastProps({ type, message });
    setShowToast(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (!formData.email.trim()) {
        showToastMessage('warning', 'Please enter your email');
        setLoading(false);
        return;
      }

      if (!formData.password.trim()) {
        showToastMessage('warning', 'Please enter your password');
        setLoading(false);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        showToastMessage('warning', 'Please enter a valid email');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        showToastMessage('warning', 'Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const { data } = await axios.post(`${BASE_URL}api/v1/users/login`, formData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userEmail', formData.email);

      showToastMessage('success', 'Login successful! Redirecting...');
      
      const lastPath = localStorage.getItem('lastVisitedPath') || '/dashboard';
      localStorage.removeItem('lastVisitedPath');
      
      setTimeout(() => router.push(lastPath), 1500);
    } catch (err) {
      const error = err as AxiosError;
      let message = 'Login failed. Please try again.';
      
      if (error.response) {
        if (error.response.status === 401) {
          message = 'Invalid email or password';
        } else if (error.response.status === 400) {
          message = 'Please verify your email first';
          // setShowVerificationNotice(true);
        } else if (error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
          message = error.response.data.message as string || message;
        }
      } else if (!error.response) {
        message = 'Network error. Please check your connection.';
      }
      
      showToastMessage('error', message);
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!formData.email) {
      showToastMessage('warning', 'Please enter your email first');
      return;
    }

    setResendLoading(true);
    try {
      await axios.post(`${BASE_URL}api/v1/users/resend-otp`, {
        email: formData.email
      });
      showToastMessage('success', 'Verification email sent!');
      setShowVerificationNotice(false);
    } catch {
      showToastMessage('error', 'Failed to resend verification. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const navigateTo = useCallback((path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push(path), 500);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Main card */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">WELCOME BACK</h1>
          <p className="text-blue-100">Log in to your account</p>
        </div>

        {/* Verification notice - shows when:
            1. Coming from signup (?verify=true in URL)
            2. When login fails with 400 error (unverified email) 
        */}
        {(needsVerification || showVerificationNotice) && (
          <div className="mb-4 p-3 bg-blue-500/20 rounded-lg text-blue-100 text-sm">
            <p>Please verify your email to continue.</p>
            <button 
              onClick={resendVerification}
              disabled={resendLoading}
              className="mt-2 flex items-center text-sm text-white hover:underline"
            >
              {resendLoading ? 'Sending...' : 'Resend verification email'}
              {resendLoading && <FaRedo className="ml-2 animate-spin" />}
            </button>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-blue-100">
              Email address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-200/50"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-blue-100">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-100/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
              loading
                ? 'bg-blue-500/50 cursor-wait'
                : 'bg-blue-500/30 hover:bg-blue-500/50 hover:shadow-lg'
            }`}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          {/* Footer links */}
          <div className="text-center space-y-3 pt-2">
            <Link
              href="/auth/forgot-password"
              onClick={navigateTo('/auth/forgot-password')}
              className="block text-blue-100 hover:text-white text-sm"
            >
              Forgot password?
            </Link>
            <p className="text-blue-100 text-sm">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/signup"
                onClick={navigateTo('/auth/signup')}
                className="text-white hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Loading and toast components */}
      {loading && <Loader />}
      {showToast && (
        <Toast
          type={toastProps.type}
          message={toastProps.message}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}