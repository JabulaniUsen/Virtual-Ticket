"use client";
import React, { useState } from "react";
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
import { BASE_URL } from "../../../../config";
import Link from "next/link";

const AgreeTerms = React.lazy(() => import("../../components/home/agreeTerms"));

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
    setTimeout(() => setShowToast(false), 3000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const firstName = formData.get("firstName")?.toString().trim() || "";
      const lastName = formData.get("lastName")?.toString().trim() || "";
      const email = formData.get("email")?.toString().trim() || "";
      const phone = formData.get("phone")?.toString().trim() || "";
      const password = formData.get("password")?.toString().trim() || "";

      if (!firstName || !lastName || !email || !phone || !password) {
        toast("warning", "All fields are required.");
        return;
      }

      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        toast("warning", "Invalid email address.");
        return;
      }

      const signupData = {
        fullName: `${firstName} ${lastName}`,
        email,
        phone,
        password,
        country: "Nigeria", // Backend will detect actual location
        currency: "NG", // Backend will detect actual currency
      };

      const response = await axios.post(
        `${BASE_URL}api/v1/users/register`,
        signupData
      );

      if (response.status === 201 || response.status === 200) {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("user", JSON.stringify({
          ...response.data.user,
          emailVerified: false,
        }));

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        toast("success", "Signup successful! Please check your email for verification.");

        setTimeout(() => {
          router.push("/auth/verify-email");
        }, 1500);
      }
    } catch (error: unknown) {
      let errorMessage = "Signup failed. Please try again.";
    
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          errorMessage = error.response.data.message || errorMessage;
        } else if (error.response?.status === 409) {
          errorMessage = "Email already exists. Please use a different email.";
        } else if (error.response?.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error instanceof Error && error.message === "Network Error") {
        errorMessage = "Network error! Please check your internet connection.";
      }
    
      toast("error", errorMessage);
    }finally {
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
        <React.Suspense fallback={<div className="text-white">Loading terms...</div>}>
          <AgreeTerms onClose={() => setShowTermsPopup(false)} />
        </React.Suspense>
      )}

      {/* Main Content */}
      <div className="relative w-full max-w-md p-4 sm:p-8 sm:backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 animate-fadeIn">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">Join V-Tickets</h1>
            <p className="text-blue-100">Start managing and booking events</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-blue-100">
                  First Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Femi"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-200/50"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-blue-100">
                  Last Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Bode"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-200/50"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-blue-100">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-200/50"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-blue-100">
                Phone Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+234 701 121 1312"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-200/50"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-blue-100">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
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
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
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
              ${
                agreeTerms
                  ? "bg-blue-500/30 border-blue-400/30 hover:bg-blue-500/50 hover:shadow-[0_8px_20px_rgba(59,130,246,0.4)] hover:scale-[1.02] hover:border-blue-400/50"
                  : "bg-gray-500/30 border-gray-400/30 cursor-not-allowed"
              }`}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-blue-100">
            Already have an account?{" "}
            <Link
              href="/auth/login?verify==false"
              className="text-white hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;