'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa';
import Loader from '../../../components/ui/loader/Loader';
import Toast from '../../../components/ui/Toast'
import Link from 'next/link';
import axios from 'axios';



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

      const response = await axios.post(
        'https://v-ticket-backend.onrender.com/api/v1/users/login',
        { email, password }
      );

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
      setToastProps({
        type: 'error',
        message: 'Login failed. Please check your credentials.',
      });
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Placeholder for social login functionality
    showToastMessage('info', ` Login with Email Instead...`);
    console.log(provider);
  };

  const showToastMessage = (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string
  ) => {
    setToastProps({ type, message });
    setShowToast(true);
  };

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
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 text-gray-500 justify-center bg-white">
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
        <h1 className="text-3xl font-bold mb-6 ">Log in to your Account</h1>
        <p className="text-gray-600 mb-6">Welcome! Select your preferred Login method:</p>

        {/* ================ && •LOGIN SOCIALS• && ================ */}
        <div className="flex gap-4 mb-6">
          <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded shadow"
          onClick={() => handleSocialLogin('Google')}
          >
            
          <Image
              src="https://img.icons8.com/color/48/000000/google-logo.png"
              alt="Google"
              className="w-5 h-5 mr-2"
              width={20}
              height={20}
            />
            Google
          </button>
          <button
            onClick={() => handleSocialLogin('Facebook')}
            className="flex items-center px-4 py-2 bg-white text-black hover:bg-gray-200 rounded shadow transition-transform transform hover:scale-105"
          >
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

        <p className="text-gray-600 mb-4">or continue with email</p>

        {/* ================ && •LOGIN FORM• && ================== */}
        <form className="w-full max-w-sm" onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-[.8rem] text-gray-400 text-md" />
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-[.8rem] text-gray-400 text-md" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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

          <div className="flex items-center mb-6">
            <input type="checkbox" id="remember" className="mr-2" />
            <label htmlFor="remember" className="text-sm text-gray-600">
              Remember me
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

        </form>

        <p className="mt-4 text-sm text-gray-600">
        <Link href="/auth/forgot-password" className="text-blue-500 hover:underline" onClick={handleFPassword} >
          Forgot your password?
        </Link>
        </p>

        <p className="mt-4 text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" onClick={handleSignupNavigation}  className="text-blue-500 hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      {/* ================ && •RIGHT SECTION• && ================== */}
      <div
        className="hidden md:flex md:w-1/2 bg-blue-500 text-white flex-col justify-center items-center"
        style={{
          backgroundImage: `url("/bg-back.avif")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex items-center justify-center ">
          <Image
            src="/logo.png"
            alt="Ticketly Logo"
            width={65}
            height={65}
            className="rounded-full "
          />
          <h1 className="text-4xl font-bold ml-[-2px] mt-3">icketly</h1>
        </div>

        <Image
          src="/anim2.png"
          alt="Animation"
          width={300}
          height={300}
          className="mt-[0.5rem]"
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

export default Login;
