'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone } from 'react-icons/fa';
import Loader from '../../components/ui/loader/Loader';
import Toast from '../../components/ui/Toast';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
// import bcrypt from 'bcryptjs';

function Signup() {
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

  const toast = (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string
  ) => {
    setToastProps({ type, message });
    setShowToast(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const firstName = (document.getElementById('firstName') as HTMLInputElement).value.trim();
    const lastName = (document.getElementById('lastName') as HTMLInputElement).value.trim();
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const phone = (document.getElementById('phone') as HTMLInputElement).value.trim();
    const password = (document.getElementById('password') as HTMLInputElement).value.trim();
  
    if (!firstName || !lastName || !email || !phone || !password) {
      toast('warning', "All fields are required.");
      return;
    }
  
    if (password.length < 6) {
      toast('warning', "Password must be at least 6 characters.");
      return;
    }
  
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      toast('warning', "Invalid email address.");
      return;
    }
  
    if (!/^\+?[1-9]\d{1,14}$/.test(phone)) {
      toast('warning', "Invalid phone number format.");
      return;
    }
  
    const fullName = `${firstName} ${lastName}`;
    const data = { fullName, email, phone, password };
  
    try {
      setLoading(true);
  
      const response = await axios.post(
        'https://v-ticket-backend.onrender.com/api/v1/users/register',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      const result = response.data;
  
      if (response.status === 201 || response.status === 200) {
        toast('success', 'Signup successful! Redirecting...');
        localStorage.setItem('user', JSON.stringify(result.user)); // Unified key
  
        setTimeout(() => {
          setLoading(false);
          router.push('/auth/login');
        }, 2000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Extract meaningful error details from Axios response
        const errorMessage = error.response?.data?.message;
  
        if (error.response?.status === 400) {
          if (errorMessage === 'Email already exists') {
            toast('error', 'The email you entered is already registered. Please log in.');
          } else if (errorMessage === 'Phone number already exists') {
            toast('error', 'The phone number you entered is already in use. Try logging in.');
          } else {
            toast('error', errorMessage || 'Invalid request. Please review your details.');
          }
        } else if (error.response?.status === 500) {
          toast('error', 'A server error occurred. Please try again later.');
        } else {
          toast('error', errorMessage || 'An unexpected error occurred.');
        }
      } else {
        toast('error', 'Network error! Please check your internet connection and try again.');
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 text-gray-500 bg-white justify-center">

      {loading && <Loader />}
      {showToast && (
        <Toast
          type={toastProps.type}
          message={toastProps.message}
          onClose={() => setShowToast(false)}
        />
      )}
      {/* ================ && •LEFT SECTION• && ================== */}
      <div className="flex flex-col justify-center items-center md:w-1/2 px-10">
        <h1 className="text-3xl sm:text-2xl md:text-xl lg:text-3xl font-bold mb-6">
          Sign up for an Account
        </h1>
        <p className="text-gray-600 mb-6">Welcome! Select your preferred signup method:</p>

        <div className="flex gap-4 mb-6">
          <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded shadow">
            <Image
              src="https://img.icons8.com/color/48/000000/google-logo.png"
              alt="Google"
              className="w-5 h-5 mr-2"
              width={20}
              height={20}
            />
            Google
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded shadow">
            <Image
              src="https://img.icons8.com/color/48/000000/facebook-new.png"
              alt="Facebook"
              className="w-5 h-5 mr-2"
              width={20}
              height={20}
            />
            Facebook
          </button>
        </div>

        <p className="text-gray-600 mb-3">or continue with email</p>

        {/* =============== && •SIGNUP FORM• && =============== */}
        <form className="w-full max-w-sm" onSubmit={handleSignup}>

          <label htmlFor="firstName" className="block text-sm font-semibold mb-1">
            Full Name
          </label>
          <div className="mb-3 flex items-center space-x-3">
            <div className="relative w-full">
              <FaUser className="absolute left-3 top-[.8rem] text-gray-400 text-md" />
              <input
                type="text"
                id="firstName"
                placeholder="First Name"
                className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="relative w-full">
              <FaUser className="absolute left-3 top-[.8rem] text-gray-400 text-md" />
              <input
                type="text"
                id="lastName"
                placeholder="Last Name"
                className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          {/* =============== && •EMAIL• && =============== */}
          <div className="mb-3">
            <label htmlFor="email" className="block text-sm font-semibold mb-1">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-[.8rem] text-gray-400 text-md" />
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          {/* =============== && •PHONE NO• && =============== */}
          <div className="mb-3">
            <label htmlFor="phone" className="block text-sm font-semibold mb-1">
              Phone No
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-[.8rem] text-gray-400 text-md" />
              <input
                type="tel"
                id="phone"
                placeholder="Enter your PhoneNo +2347011211312"
                className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="block text-sm font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-[.8rem] text-gray-400 text-md" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Create a password"
                className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-gray-400 text-md focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </div>

      {/* =============== && •RIGHT SIDE• && =============== */}
      <div
        className="hidden md:flex md:w-1/2 bg-blue-500 text-white flex-col justify-center items-center"
        style={{
          backgroundImage: `url("/bg-back.avif")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="flex items-center justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Ticketly Logo"
            width={180}
            height={180}
            className="rounded-full"
          />
          <h1 className="text-4xl font-bold ml-[-3rem]">Ticketly</h1>
        </div>

        <Image
          src="/anim2.png"
          alt="Animation_desc"
          width={300}
          height={300}
          className="mt-[-5.5rem]"
        />

        <div className="text-center px-10 bg-opacity-50">
          <h2 className="text-2xl font-semibold mb-4">Host & Plan Events with Ease!</h2>
          <p className="text-sm">
            Empowering you to create and manage events effortlessly. With Ticketly, you
            can seamlessly plan events, sell tickets, and connect with your audience.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
