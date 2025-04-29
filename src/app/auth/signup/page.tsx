"use client";
import React, { useState } from "react";
// import Image from 'next/image';
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPhone,
} from "react-icons/fa";
import Loader from "../../../components/ui/loader/Loader";
import Toast from "../../../components/ui/Toast";
import axios from "axios";
import { motion } from "framer-motion";
// import bcrypt from 'bcryptjs';
import { BASE_URL } from "../../../../config";
import Link from "next/link";
import AgreeTerms from "../../components/home/agreeTerms";


function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
  }>({
    type: "success",
    message: "",
  });

  const toast = (
    type: "success" | "error" | "warning" | "info",
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
    setLoading(true);

    const firstName = (
      document.getElementById("firstName") as HTMLInputElement
    ).value.trim();
    const lastName = (
      document.getElementById("lastName") as HTMLInputElement
    ).value.trim();
    const email = (
      document.getElementById("email") as HTMLInputElement
    ).value.trim();
    const phone = (
      document.getElementById("phone") as HTMLInputElement
    ).value.trim();
    const password = (
      document.getElementById("password") as HTMLInputElement
    ).value.trim();

    if (!firstName || !lastName || !email || !phone || !password) {
      toast("warning", "All fields are required.");
      setLoading(false);
      return;
    }

    // Check password length
    if (password.length < 8) {
      toast("warning", "Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    // Check password strength
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    const strengthScore = [hasUpperCase, hasLowerCase, hasNumbers].filter(
      Boolean
    ).length;

    if (strengthScore < 2) {
      toast(
        "warning",
        "Password must contain at least 2 of the following: uppercase letters, lowercase letters, numbers"
      );
      setLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      toast("warning", "Invalid email address.");
      setLoading(false);
      return;
    }

    // if (!/^\d{11}$/.test(phone)) {
    //   toast('warning', "Please enter a valid 11-digit phone number");
    //   setLoading(false);
    //   return;
    // }

    const fullName = `${firstName} ${lastName}`;
    // const role = 'admin'
    const data = { fullName, email, phone, password };

    try {
      const response = await axios.post(
        // 'http://localhost:8090/api/users/signup',
        `${BASE_URL}api/v1/users/register`,
        data
      );

      if (response.status === 201 || response.status === 200) {
        // Store user data
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);

        setToastProps({
          type: "success",
          message: "Signup successful! Redirecting...",
        });
        setShowToast(true);

        const lastPath =
          localStorage.getItem("lastVisitedPath") || "/dashboard";

        localStorage.removeItem("lastVisitedPath");
        console.log(lastPath);

        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      }
    } catch (error) {
      console.error("Signup error:", error);
      let errorMessage = "Signup failed. Please try again.";
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          errorMessage = "Email already exists. Please use a different email.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if ((error as Error).message === "Network Error") {
        errorMessage =
          "Network error! Please check your internet connection and try again.";
      }
      setToastProps({
        type: "error",
        message: errorMessage,
      });
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 p-0 sm:p-4">
      {/* Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden hidden sm:block">
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

      {showTermsPopup && (
        <AgreeTerms onClose={() => setShowTermsPopup(false)} />
      )}
      
      {/* Main Content */}
      <div className="relative w-full max-w-md p-4 sm:p-8 sm:backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">Join V-Tickets</h1>
            <p className="text-blue-100">Start managing and booking events</p>
       
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* ===================== && •NAME FIELDS• && ======================== */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-blue-100"
                >
                  First Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200" />
                  <input
                    type="text"
                    id="firstName"
                    placeholder="Femi"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-200/50"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-blue-100"
                >
                  Last Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200" />
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Bode"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-200/50"
                    required
                  />
                </div>
              </div>
            </div>

            {/* ===================== && •EMAIL FIELD• && ======================== */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-blue-100"
              >
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200" />
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-200/50"
                  required
                />
              </div>
            </div>

            {/* ===================== && •PHONE FIELD• && ======================== */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-blue-100"
              >
                Phone Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200" />
                <input
                  type="tel"
                  id="phone"
                  placeholder="+234 701 121 1312"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-200/50"
                  required
                />
              </div>
            </div>

            {/* ===================== && •PASSWORD FIELD• && ======================== */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-blue-100"
              >
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-100/50"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-200 hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>


            <div className="flex items-center space-x-2">
              <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="agreeTerms" className="text-sm text-blue-100">
              I agree to the{" "}
              <button
                type="button"
                onClick={() => setShowTermsPopup(true)}
                className="text-white underline hover:text-blue-300"
              >
                Terms and Conditions
              </button>
              </label>
            </div>

           

            <button
              type="submit"
              disabled={!agreeTerms}
              className={`w-full backdrop-blur-md border text-white text-base font-medium px-5 py-3 rounded-lg 
              transition-all duration-300 
              ${agreeTerms 
                ? 'bg-blue-500/30 border-blue-400/30 hover:bg-blue-500/50 hover:shadow-[0_8px_20px_rgba(59,130,246,0.4)] hover:scale-[1.02] hover:border-blue-400/50' 
                : 'bg-gray-500/30 border-gray-400/30 cursor-not-allowed'}`}
                style={{
                  boxShadow: loading
                    ? "0 8px 20px rgba(59, 130, 246, 0.4)"
                    : "0 4px 12px rgba(59, 130, 246, 0.25)",
                  transform: loading ? "scale(1.02)" : "scale(1)",
                  borderRadius: "1rem",
                }}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            {/* ===================== && •SUBMIT BUTTON• && ======================== */}
            {/* <button
              type="submit"
              className="w-full backdrop-blur-md bg-blue-500/30 border border-blue-400/30 text-white text-base font-medium px-5 py-3 rounded-lg 
          shadow-[0_4px_12px_rgba(59,130,246,0.25)] transition-all duration-300 
          hover:bg-blue-500/50 hover:shadow-[0_8px_20px_rgba(59,130,246,0.4)] 
          hover:scale-[1.02] hover:border-blue-400/50 focus:ring-2 focus:ring-blue-400/40"
              style={{
                boxShadow: loading
                  ? "0 8px 20px rgba(59, 130, 246, 0.4)"
                  : "0 4px 12px rgba(59, 130, 246, 0.25)",
                transform: loading ? "scale(1.02)" : "scale(1)",
                borderRadius: "1rem",
              }}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button> */}
          </form>

          <p className="text-center text-blue-100">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-white hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Signup;
