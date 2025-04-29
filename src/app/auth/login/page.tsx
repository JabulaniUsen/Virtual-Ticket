'use client';
// import Image from 'next/image';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa';
import Loader from '../../../components/ui/loader/Loader';
import Toast from '../../../components/ui/Toast'
import Link from 'next/link';
import axios from 'axios';
import { BASE_URL } from '../../../../config';



function Login() {

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>({
    type: 'success',
    message: '',
  });
  

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const email = (document.getElementById('email') as HTMLInputElement).value;
      const password = (document.getElementById('password') as HTMLInputElement).value;

      if (!email.trim()) {
        setToastProps({
          type: 'warning',
          message: 'Please enter your email address'
        });
        setShowToast(true);
        setLoading(false);
        return;
      }

      if (!password.trim()) {
        setToastProps({
          type: 'warning',
          message: 'Please enter your password'
        });
        setShowToast(true);
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setToastProps({
          type: 'warning',
          message: 'Please enter a valid email address'
        });
        setShowToast(true);
        setLoading(false);
        return;
      }

      // Password length validation
      if (password.length < 5) {
        setToastProps({
          type: 'warning',
          message: 'Password must be at least 6 characters long'
        });
        setShowToast(true);
        setLoading(false);
        return;
      }

      

      const response = await axios.post(
        //  'http://localhost:8090/api/users/login',
        `${BASE_URL}api/v1/users/login`,
        { email, password }
      );
      
      localStorage.setItem('userEmail', email);
      
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setToastProps({
          type: 'success',
          message: 'Login successful! Redirecting...',
        });
        setShowToast(true);

        const lastPath = localStorage.getItem('lastVisitedPath') || '/dashboard';
        localStorage.removeItem('lastVisitedPath');

        setTimeout(() => {
          router.push(lastPath);
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      

      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setToastProps({
            type: 'error',
            message: 'Unable to connect to the server. Please check your internet connection.',
          });
        } else {
          // Server response errors
          switch (error.response.status) {
            case 401:
              setToastProps({
                type: 'error',
                message: 'Invalid email or password. Please try again.',
              });
              break;
            case 404:
              setToastProps({
                type: 'error',
                message: 'Account not found. Please check your email or sign up.',
              });
              break;
            case 429:
              setToastProps({
                type: 'error',
                message: 'Too many login attempts. Please try again later.',
              });
              break;
            case 500:
              setToastProps({
                type: 'error',
                message: 'Server error. Please try again later.',
              });
              break;
            default:
              setToastProps({
                type: 'error',
                message: error.response.data.message || 'Login failed. Please check your credentials.',
              });
          }
        }
      } else {
        // Unknown errors
        setToastProps({
          type: 'error',
          message: 'An unexpected error occurred. Please try again.',
        });
      }
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  // const showToastMessage = (
  //   type: 'success' | 'error' | 'warning' | 'info',
  //   message: string
  // ) => {
  //   setToastProps({ type, message });
  //   setShowToast(true);
  // };

  const handleSignupNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        router.push('/auth/signup');
    }, 1500);
};



  function handleFPassword(event: React.MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
        router.push('/auth/forgot-password');
    }, 1500);
  }


  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 p-0 sm:p-4">
      {/* Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Loading and Toast */}
      {loading && <Loader />}
      {showToast && (
        <Toast
          type={toastProps.type}
          message={toastProps.message}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Main Content */}
      <div className="relative w-full max-w-md p-4 sm:p-8 sm:backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-blue-100">Log in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5 mt-6">
          {/* Email Field */}
          <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-blue-100">Email Address</label>
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200" />
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-200/50"
            required
          />
        </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-blue-100">Password</label>
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="••••••••"
            className="w-full pl-10 pr-12 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-100/50"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
          </div>

          {/* Submit Button */}
          <button
        type="submit"
        className="w-full backdrop-blur-md bg-blue-500/30 border border-blue-400/30 text-white text-base font-medium px-5 py-3 rounded-lg 
        shadow-[0_4px_12px_rgba(59,130,246,0.25)] transition-all duration-300 
        hover:bg-blue-500/50 hover:shadow-[0_8px_20px_rgba(59,130,246,0.4)] 
        hover:scale-[1.02] hover:border-blue-400/50 focus:ring-2 focus:ring-blue-400/40"
        style={{
          boxShadow: loading ? "0 8px 20px rgba(59, 130, 246, 0.4)" : "0 4px 12px rgba(59, 130, 246, 0.25)",
          transform: loading ? "scale(1.02)" : "scale(1)",
          borderRadius: '1rem',
        }}
          >
        {loading ? "Logging in..." : "Log in"}
          </button>

          {/* Links */}
          <div className="space-y-4 text-center">
        <Link 
          href="/auth/forgot-password" 
          className="block text-blue-100 hover:text-white transition-colors" 
          onClick={handleFPassword}
        >
          Forgot your password?
        </Link>
        
        <p className="text-blue-100">
          Don&apos;t have an account?{' '}
          <Link 
            href="/auth/signup" 
            onClick={handleSignupNavigation} 
            className="text-white hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
          </div>
        </form>
      </div>
    </div>
    
  );
}

export default Login;
