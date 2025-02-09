"use client";

import Loader from "@/components/ui/loader/Loader";
import axios, { AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiArrowBack, BiImageAdd, BiSave } from "react-icons/bi";
import {
  FaCalendarAlt,
  FaMapMarkerAlt, FaTicketAlt,
  FaTrash, FaInstagram, FaTwitter,
  FaUserPlus, FaFacebookF,
} from "react-icons/fa";
import ToggleMode from "../../../components/ui/mode/toggleMode";
import Toast from "../../../components/ui/Toast";
import { BASE_URL } from "../../../config";

type Event = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  gallery?: string[];
  socialMediaLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  hostName: string;
  ticketType: {
    name: string;
    price: string;
    quantity: string;
    sold: string;
    details?: string;
    attendees?: { name: string; email: string }[];
  }[];
  userId: string;
  createdAt: string;
  updatedAt: string;
};

function Update() {
  const [event, setEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Event | null>(null);
  const { eventId } = useParams();
  // const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState<{
    type: "success" | "error";
    message: string;
  }>({
    type: "success",
    message: "",
  });
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toast = (type: "success" | "error", message: string) => {
    setToastProps({ type, message });
    setShowToast(true);
  };
// made some adjustments
  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}api/v1/events/${eventId}`
          );
          setEvent(response.data.event);
          setFormData(response.data.event);
        } catch (error) {
          const axiosError = error as AxiosError;
          console.error("Error fetching event:", {
            message: axiosError.message,
            stack: axiosError.stack,
            response: axiosError.response?.data || "No response data",
          });
        }
      };

      fetchEvent();
    }
  }, [eventId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
    index?: number
  ) => {
    if (!formData) return;

    if (index !== undefined && field === "ticketType") {
      const updatedTicketTypes = [...(formData.ticketType || [])];
      updatedTicketTypes[index] = {
        ...updatedTicketTypes[index],
        [e.target.name]: e.target.value,
      };
      setFormData({ ...formData, ticketType: updatedTicketTypes });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleAddTicketType = () => {
    if (!formData) return;
    const newTicket = { name: "", sold: "", price: "", quantity: "" };
    setFormData({
      ...formData,
      ticketType: [...formData.ticketType, newTicket],
    });
  };

  const handleDeleteTicketType = (index: number) => {
    if (!formData) return;
    const updatedTickets = formData.ticketType.filter((_, i) => i !== index);
    setFormData({ ...formData, ticketType: updatedTickets });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast("error", "Please upload a valid image file");
        return;
      }

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAttendeeChange = (
    ticketIndex: number,
    attendeeIndex: number,
    field: "name" | "email",
    value: string
  ) => {
    if (!formData) return;

    const updatedTickets = [...formData.ticketType];
    const ticket = updatedTickets[ticketIndex];

    if (!ticket.attendees) {
      ticket.attendees = [];
    }

    if (!ticket.attendees[attendeeIndex]) {
      ticket.attendees[attendeeIndex] = { name: "", email: "" };
    }

    ticket.attendees[attendeeIndex] = {
      ...ticket.attendees[attendeeIndex],
      [field]: value,
    };

    setFormData({
      ...formData,
      ticketType: updatedTickets,
    });
  };

  const handleAddAttendee = (ticketIndex: number) => {
    if (!formData) return;

    const updatedTickets = [...formData.ticketType];
    const ticket = updatedTickets[ticketIndex];

    if (!ticket.attendees) {
      ticket.attendees = [];
    }

    ticket.attendees.push({ name: "", email: "" });

    setFormData({
      ...formData,
      ticketType: updatedTickets,
    });
  };

  const handleRemoveAttendee = (ticketIndex: number, attendeeIndex: number) => {
    if (!formData) return;

    const updatedTickets = [...formData.ticketType];
    const ticket = updatedTickets[ticketIndex];

    if (!ticket.attendees) return;

    ticket.attendees = ticket.attendees.filter(
      (_, index) => index !== attendeeIndex
    );

    setFormData({
      ...formData,
      ticketType: updatedTickets,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData) {
      toast("error", "No event data to update.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token: ", token);
      if (!token) {
        toast("error", "Authentication token is missing. Please log in.");
        return;
      }

      // Create FormData object
      const updateFormData = new FormData();
      updateFormData.append("title", formData.title);
      updateFormData.append("description", formData.description);
      updateFormData.append("date", new Date(formData.date).toISOString());
      updateFormData.append("ticketType", JSON.stringify(formData.ticketType));
      updateFormData.append("location", formData.location);
      updateFormData.append("venue", formData.venue);
      updateFormData.append("time", formData.time);
      updateFormData.append(
        "socialMediaLinks",
        JSON.stringify(formData.socialMediaLinks)
      );
      if (formData.gallery) {
        formData.gallery.forEach((image, index) => {
          updateFormData.append(`gallery[${index}]`, image);
        });
      }
      console.log("Update form data" , updateFormData)
      // Add new image if selected
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("file", imageFile);

        await axios.patch(
          `${BASE_URL}api/v1/events/image/${eventId}`,
          imageFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        console.log("No new image selected, skipping image update.");
      }

      const response = await axios.patch(
        `${BASE_URL}api/v1/events/${eventId}`,
        updateFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast("success", "Event updated successfully!");
      console.log("Update response:", response.data);

      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error updating event:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        });

        if (error.response?.status === 401) {
          toast("error", "Unauthorized. Redirecting to login...");
          router.push("/auth/login");
          return;
        }

        const errorMessage =
          error.response?.data && typeof error.response.data === "object"
            ? (error.response.data as Record<string, string>).message ||
            "An error occurred"
            : "Failed to update the event. Please try again.";
        toast("error", errorMessage);
      } else {
        console.error("Unexpected error:", error);
        toast("error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up image preview on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-8 px-4 sm:px-6 lg:px-8">
      <AnimatePresence>
        {showToast && (
          <Toast
            type={toastProps.type}
            message={toastProps.message}
            onClose={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="max-w-5xl mx-auto space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <motion.button
            onClick={() => router.push("/dashboard")}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            whileHover={{ scale: 1.05 }}
          >
            <BiArrowBack className="text-xl" />
            <span>Back to Dashboard</span>
          </motion.button>
          <ToggleMode />
        </div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative group h-[200px] md:h-[300px] w-full rounded-2xl overflow-hidden bg-gradient-to-r from-purple-100 to-blue-100 dark:from-gray-700 dark:to-gray-600">
            {(imagePreview || event?.image) && (
              <Image
                src={imagePreview || event?.image || "/default-image.jpg"}
                alt="Event preview"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
            )}
            <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <BiImageAdd className="text-5xl text-white mb-2" />
              <span className="text-white text-lg font-medium">
                Change Event Image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-white via-purple-50 to-blue-50 text-black dark:text-gray-100 dark:from-gray-800 dark:via-gray-800/50 dark:to-gray-900 rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-purple-100 dark:border-purple-900/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 text-center mb-12"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Update Event
          </motion.h1>

          {event ? (
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* BASIC EVENT DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  className="space-y-6"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.label className="block" whileHover={{ scale: 1.01 }}>
                    <span className="text-purple-700 dark:text-purple-300 font-sm sm:font-medium mb-2 block">
                      Event Title
                    </span>
                    <input
                      type="text"
                      value={formData?.title || ""}
                      onChange={(e) => handleInputChange(e, "title")}
                      className="p-2 sm:p-4 mt-1 block w-full rounded-xl border-2 border-purple-100 dark:border-purple-900/50 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-900 dark:bg-gray-800 dark:text-white transition-all duration-200"
                    />
                  </motion.label>

                  <motion.label className="block" whileHover={{ scale: 1.01 }}>
                    <span className="text-purple-700 dark:text-purple-300 font-sm sm:font-medium mb-2 block">
                      Description
                    </span>
                    <textarea
                      value={formData?.description || ""}
                      onChange={(e) => handleInputChange(e, "description")}
                      rows={4}
                      className="p-2 sm:p-4 mt-1 block w-full rounded-xl border-2 border-purple-100 dark:border-purple-900/50 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-900 dark:bg-gray-800 dark:text-white transition-all duration-200"
                    />
                  </motion.label>

                  <motion.label className="block" whileHover={{ scale: 1.01 }}>
                    <span className="text-purple-700 dark:text-purple-300 font-sm sm:font-medium mb-2 flex items-center">
                      <FaCalendarAlt className="mr-2 text-blue-500" /> Host Name
                    </span>
                    <input
                      type="text"
                      value={formData?.hostName || ""}
                      onChange={(e) => handleInputChange(e, "hostName")}
                      className="p-2 sm:p-4 mt-1 block w-full rounded-xl border-2 border-purple-100 dark:border-purple-900/50 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-900 dark:bg-gray-800 dark:text-white transition-all duration-200"
                    />
                  </motion.label>
                </motion.div>

                <motion.div
                  className="space-y-6"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {/* DATE AND TIME */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.label className="block" whileHover={{ scale: 1.01 }}>
                      <span className="text-purple-700 dark:text-purple-300 font-sm sm:font-medium mb-2 block flex items-center">
                        <FaCalendarAlt className="mr-2 text-blue-500" /> Date
                      </span>
                      <input
                        type="date"
                        value={formData?.date || ""}
                        onChange={(e) => handleInputChange(e, "date")}
                        className="p-2 sm:p-4 mt-1 block w-full rounded-xl border-2 border-purple-100 dark:border-purple-900/50 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-900 dark:bg-gray-800 dark:text-white transition-all duration-200"
                      />
                    </motion.label>

                    <motion.label className="block" whileHover={{ scale: 1.01 }}>
                      <span className="text-purple-700 dark:text-purple-300 font-sm sm:font-medium mb-2 block flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-blue-500" /> Time
                      </span>
                      <input
                        type="time"
                        value={formData?.time || ""}
                        onChange={(e) => handleInputChange(e, "time")}
                        className="p-2 sm:p-4 mt-1 block w-full rounded-xl border-2 border-purple-100 dark:border-purple-900/50 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-900 dark:bg-gray-800 dark:text-white transition-all duration-200"
                      />
                    </motion.label>
                  </div>

                  {/* LOCATION DETAILS */}
                  <motion.label className="block" whileHover={{ scale: 1.01 }}>
                    <span className="text-purple-700 dark:text-purple-300 font-sm sm:font-medium mb-2 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-blue-500" /> Location
                    </span>
                    <input
                      type="text"
                      value={formData?.location || ""}
                      onChange={(e) => handleInputChange(e, "location")}
                      className="p-2 sm:p-4 mt-1 block w-full rounded-xl border-2 border-purple-100 dark:border-purple-900/50 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-900 dark:bg-gray-800 dark:text-white transition-all duration-200"
                    />
                  </motion.label>

                  <motion.label className="block" whileHover={{ scale: 1.01 }}>
                    <span className="text-purple-700 dark:text-purple-300 font-sm sm:font-medium mb-2 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-blue-500" /> Venue
                    </span>
                    <input
                      type="text"
                      value={formData?.venue || ""}
                      onChange={(e) => handleInputChange(e, "venue")}
                      className="p-2 sm:p-4 mt-1 block w-full rounded-xl border-2 border-purple-100 dark:border-purple-900/50 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-900 dark:bg-gray-800 dark:text-white transition-all duration-200"
                    />
                  </motion.label>
                </motion.div>
              </div>

              {/* SOCIAL MEDIA LINKS */}
              <motion.div
                className="space-y-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                  Social Media Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { 
                      icon: <FaInstagram className="text-pink-500" />,
                      name: 'instagram',
                      placeholder: 'Instagram URL',
                      ringColor: 'ring-pink-500'
                    },
                    {
                      icon: <FaFacebookF className="text-blue-600" />,
                      name: 'facebook', 
                      placeholder: 'Facebook URL',
                      ringColor: 'ring-blue-500'
                    },
                    {
                      icon: <FaTwitter className="text-blue-400" />,
                      name: 'twitter',
                      placeholder: 'Twitter URL', 
                      ringColor: 'ring-blue-400'
                    }
                  ].map((social) => (
                    <div key={social.name} className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        {social.icon}
                      </div>
                      <input
                        type="text"
                        value={formData?.socialMediaLinks?.[social.name as keyof typeof formData.socialMediaLinks] || ''}
                        onChange={(e) => {
                          if (!formData) return;
                          setFormData({
                            ...formData,
                            socialMediaLinks: {
                              ...formData.socialMediaLinks,
                              [social.name]: e.target.value
                            }
                          });
                        }}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 
                          dark:border-gray-600 focus:ring-2 focus:border-transparent 
                          bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                          focus:${social.ringColor}`}
                        placeholder={social.placeholder}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* TICKET TYPES */}
              <motion.div
                className="space-y-6"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 flex items-center">
                  <FaTicketAlt className="mr-2 text-blue-500" />
                  Ticket Types
                  </h2>
                  <motion.button
                  type="button"
                  onClick={handleAddTicketType}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl 
                       shadow-lg hover:shadow-purple-500/20 transition-all duration-200"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(147, 51, 234, 0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  >
                    Add Ticket Type
                  </motion.button>
                </div>

                <div className="space-y-6">
                  {formData?.ticketType?.map((ticket, ticketIndex) => (
                  <motion.div
                    key={ticketIndex}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ticketIndex * 0.1 }}
                  >
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-gray-900 dark:text-white">
                        {ticket.name || `Ticket Type ${ticketIndex + 1}`}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                        ${ticket.price}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteTicketType(ticketIndex)}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>

                    <div className="p-6 space-y-6 bg-white dark:bg-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Ticket Name
                          </label>
                        <input
                          type="text"
                          name="name"
                          value={ticket.name}
                          onChange={(e) => handleInputChange(e, "ticketType", ticketIndex)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                              focus:ring-2 focus:ring-blue-500 focus:border-transparent
                              bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="e.g., VIP, Regular"
                        />
                        </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Quantity
                          </label>
                          <input
                          type="number"
                          name="quantity"
                          value={ticket.quantity}
                          onChange={(e) => handleInputChange(e, "ticketType", ticketIndex)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                              focus:ring-2 focus:ring-blue-500 focus:border-transparent
                              bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price
                        </label>
                        <input
                        type="number"
                        name="price"
                        value={ticket.price}
                        onChange={(e) => handleInputChange(e, "ticketType", ticketIndex)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        step="0.01"
                        />
                      </div>
                      </div>
                    </div>

                    {/* Ticket Features */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ticket Features
                      </label>
                      <div className="space-y-2">
                      {(ticket.details || '').split('\n').map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                        <span className="text-blue-500">•</span>
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                          const newFeatures = ticket.details?.split('\n') || [];
                          newFeatures[index] = e.target.value;
                          const updatedTickets = [...formData.ticketType];
                          updatedTickets[ticketIndex] = {
                            ...ticket,
                            details: newFeatures.join('\n')
                          };
                          setFormData({ ...formData, ticketType: updatedTickets });
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Add a feature..."
                        />
                        <button
                          type="button"
                          onClick={() => {
                          const newFeatures = ticket.details?.split('\n').filter((_, i) => i !== index) || [];
                          const updatedTickets = [...formData.ticketType];
                          updatedTickets[ticketIndex] = {
                            ...ticket,
                            details: newFeatures.join('\n')
                          };
                          setFormData({ ...formData, ticketType: updatedTickets });
                          }}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FaTrash />
                        </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                        const currentFeatures = ticket.details || '';
                        const updatedTickets = [...formData.ticketType];
                        updatedTickets[ticketIndex] = {
                          ...ticket,
                          details: currentFeatures + '\n'
                        };
                        setFormData({ ...formData, ticketType: updatedTickets });
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400
                           dark:hover:text-blue-300 mt-2"
                      >
                        + Add Feature
                      </button>
                      </div>
                    </div>

                    {/* Attendees Section */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-medium text-gray-800 dark:text-white">
                        Pre-registered Attendees
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleAddAttendee(ticketIndex)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700
                             dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <FaUserPlus />
                        <span>Add Attendee</span>
                      </button>
                      </div>
                      <div className="space-y-3">
                      {ticket.attendees?.map((attendee, attendeeIndex) => (
                        <div key={attendeeIndex} className="flex items-center space-x-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                          type="text"
                          value={attendee.name}
                          onChange={(e) => handleAttendeeChange(
                            ticketIndex,
                            attendeeIndex,
                            "name",
                            e.target.value
                          )}
                          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Attendee Name"
                          />
                          <input
                          type="email"
                          value={attendee.email}
                          onChange={(e) => handleAttendeeChange(
                            ticketIndex,
                            attendeeIndex,
                            "email",
                            e.target.value
                          )}
                          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Attendee Email"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttendee(ticketIndex, attendeeIndex)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FaTrash />
                        </button>
                        </div>
                      ))}
                      </div>
                    </div>
                    </div>
                  </motion.div>
                  ))}
                </div>
              </motion.div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                       rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white
                       rounded-lg hover:from-blue-700 hover:to-purple-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transform hover:scale-105 transition-all duration-200
                       shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <span className="animate-spin">⌛</span>
                    <span>Updating...</span>
                  </div>
                  ) : (
                  <div className="flex items-center space-x-2">
                    <BiSave />
                    <span>Update Event</span>
                  </div>
                  )}
                </button>
                </div>
            </form>
          ) : (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Update;