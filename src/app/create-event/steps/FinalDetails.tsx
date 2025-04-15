"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaImages,
  FaTrash,
} from "react-icons/fa";
import { type EventFormData } from '@/types/event';
import axios from "axios";
import { BASE_URL } from '../../../config';


interface FinalDetailsProps {
  formData: EventFormData;
  updateFormData: (data: Partial<EventFormData>) => void;
  onBack: () => void;
  setToast: (
    toast: { type: "success" | "error"; message: string } | null
  ) => void;
}

const FinalDetails = ({
  formData,
  updateFormData,
  onBack,
  setToast,
}: FinalDetailsProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  useEffect(() => {
    const previews = formData.gallery.map((file) => URL.createObjectURL(file));
    setGalleryPreviews(previews);

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formData.gallery]);

  const handleGalleryUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    const maxSize = 5 * 1024 * 1024;

    if (formData.gallery.length + files.length > 5) {
      setToast({ type: "error", message: "Maximum 5 gallery images allowed" });
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setToast({ type: "error", message: "Please upload only image files" });
        return;
      }

      if (file.size > maxSize) {
        setToast({
          type: "error",
          message: `${file.name} is too large (max 5MB)`,
        });
        return;
      }

      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    updateFormData({ gallery: [...formData.gallery, ...newFiles] });
    setGalleryPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeGalleryImage = (index: number) => {
    URL.revokeObjectURL(galleryPreviews[index]);
    const updatedGallery = formData.gallery.filter((_, i) => i !== index);
    const updatedPreviews = galleryPreviews.filter((_, i) => i !== index);
    updateFormData({ gallery: updatedGallery });
    setGalleryPreviews(updatedPreviews);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      console.log(token);
  
      if (!token) {
        setToast({ type: "error", message: "Please login to create an event" });
        router.push("/auth/login");
        return;
      }
  
      // Validate required fields
      if (!formData.image) {
        setToast({ type: "error", message: "Main event image is required" });
        setIsSubmitting(false);
        return;
      }
  
      // Additional validation for virtual events
      if (formData.isVirtual) {
        if (!formData.virtualEventDetails?.platform) {
          setToast({ type: "error", message: "Please select a virtual event platform" });
          setIsSubmitting(false);
          return;
        }
  
        // Platform-specific validations
        if (formData.virtualEventDetails.platform === 'custom' && !formData.virtualEventDetails.meetingUrl) {
          setToast({ type: "error", message: "Please enter a meeting URL for your custom platform" });
          setIsSubmitting(false);
          return;
        }
  
        if (formData.virtualEventDetails.platform === 'zoom' && !formData.virtualEventDetails.meetingId) {
          setToast({ type: "error", message: "Please enter a Zoom meeting ID" });
          setIsSubmitting(false);
          return;
        }
  
        if (formData.virtualEventDetails.requiresPassword && !formData.virtualEventDetails.virtualPassword) {
          setToast({ type: "error", message: "Please set a virtual event password" });
          setIsSubmitting(false);
          return;
        }
      }
  
      const submitFormData = new FormData();
      console.log(formData + "\n");
  
      // Append basic event data
      submitFormData.append("image", formData.image);
      formData.gallery.forEach((file) => {
        submitFormData.append("gallery", file);
      });
  
      submitFormData.append("title", formData.title.trim());
      submitFormData.append("description", formData.description.trim());
      submitFormData.append("date", new Date(formData.date).toISOString());
      submitFormData.append("location", formData.location.trim());
      submitFormData.append("isVirtual", String(formData.isVirtual));
      submitFormData.append("time", formatTime(formData.time));
      submitFormData.append("venue", formData.venue.trim());
      submitFormData.append("hostName", formData.hostName.trim());
  
      // Handle virtual event details
      if (formData.isVirtual && formData.virtualEventDetails) {
        const virtualDetails = {
          platform: formData.virtualEventDetails.platform,
          // Platform-specific fields
          ...(formData.virtualEventDetails.platform === 'custom' && {
            meetingUrl: formData.virtualEventDetails.meetingUrl
          }),
          ...(formData.virtualEventDetails.platform === 'zoom' && {
            meetingId: formData.virtualEventDetails.meetingId,
            passcode: formData.virtualEventDetails.passcode || null
          }),
          ...(formData.virtualEventDetails.platform === 'whereby' && {
            enableWaitingRoom: formData.virtualEventDetails.enableWaitingRoom || false,
            lockRoom: formData.virtualEventDetails.lockRoom || false
          }),
          // Universal virtual event fields
          requiresPassword: formData.virtualEventDetails.requiresPassword || false,
          virtualPassword: formData.virtualEventDetails.virtualPassword || null
        };
  
        submitFormData.append("virtualEventDetails", JSON.stringify(virtualDetails));
      }
  
      // HANDLE TICKET DATA
      const ticketTypeData = formData.ticketType.map((ticket) => ({
        name: ticket.name.trim(),
        price: ticket.price.trim(),
        quantity: ticket.quantity.trim(),
        sold: "0",
        details: ticket.details?.trim() || "",
        attendees: ticket.attendees || [],
      }));
      submitFormData.append("ticketType", JSON.stringify(ticketTypeData));
  
      // Handle social media links
      submitFormData.append("socialMediaLinks", JSON.stringify({
        twitter: formData.socialMediaLinks?.twitter?.trim() || "",
        facebook: formData.socialMediaLinks?.facebook?.trim() || "",
        instagram: formData.socialMediaLinks?.instagram?.trim() || "",
      }));
  
      // Create the event
      const response = await axios.post(
        `${BASE_URL}api/v1/events/create-event`,
        submitFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(token);
  
      // Handle Whereby room creation if applicable
      if (response.status === 201 && formData.isVirtual && formData.virtualEventDetails?.platform === 'whereby') {
        try {
          const wherebyResponse = await axios.post(
            `${BASE_URL}api/v1/events/${response.data.event.id}/create-whereby-room`,
            {
              enableWaitingRoom: formData.virtualEventDetails.enableWaitingRoom,
              lockRoom: formData.virtualEventDetails.lockRoom
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (wherebyResponse.status !== 201) {
            throw new Error("Failed to create Whereby room");
          }
        } catch (wherebyError) {
          console.error("Whereby room creation failed:", wherebyError);
          // Not critical - we can still proceed
        }
      }
  
      // Handle success
      if (response.status === 201 || response.status === 200) {
        setToast({ 
          type: "success", 
          message: formData.isVirtual 
            ? "Virtual event created successfully! Meeting details will be sent to attendees."
            : "Event created successfully!" 
        });
        router.push("/dashboard");
      } else if (response.status === 401) {
        setToast({ type: "error", message: "Session expired, redirecting to login..." });
        router.push("/auth/login");
      }
    } catch (error: unknown) {
      console.error("Event creation error:", error);
      
      let errorMessage = "An unexpected error occurred";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || "Failed to create event";
        
        // Special handling for virtual event errors
        if (error.response?.data?.error?.includes("virtual")) {
          errorMessage = "Virtual event setup failed. Please check your details.";
        }
      }
  
      setToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className=""
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <FaImages className="mr-3 text-blue-600" />
        Final Details
      </h2>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Host Name *
          </label>
          <input
            type="text"
            value={formData.hostName}
            onChange={(e) => updateFormData({ hostName: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter host name"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-800 dark:text-white mb-4">
            Event Gallery 
          </label>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={(e) => handleGalleryUpload(e.target.files)}
          />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {formData.gallery.map((_, index) => (
              <div
                key={index}
                className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg"
              >
                {galleryPreviews[index] && (
                  <Image
                    src={galleryPreviews[index]}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                )}
                <button
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>

          {formData.gallery.length < 5 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 border-2 border-dashed border-blue-500 dark:border-blue-400 rounded-xl text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
            >
              Add Gallery Images (Max 5)
            </button>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
            Social Media Links (Optional)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaInstagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-500" />
              <input
                type="url"
                value={formData.socialMediaLinks?.instagram || ""}
                onChange={(e) =>
                  updateFormData({
                    socialMediaLinks: {
                      ...formData.socialMediaLinks,
                      instagram: e.target.value,
                    },
                  })
                }
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Instagram URL"
              />
            </div>

            <div className="relative">
              <FaFacebookF className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
              <input
                type="url"
                value={formData.socialMediaLinks?.facebook || ""}
                onChange={(e) =>
                  updateFormData({
                    socialMediaLinks: {
                      ...formData.socialMediaLinks,
                      facebook: e.target.value,
                    },
                  })
                }
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Facebook URL"
              />
            </div>

            <div className="relative">
              <FaTwitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
              <input
                type="url"
                value={formData.socialMediaLinks?.twitter || ""}
                onChange={(e) =>
                  updateFormData({
                    socialMediaLinks: {
                      ...formData.socialMediaLinks,
                      twitter: e.target.value,
                    },
                  })
                }
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Twitter URL"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transform transition-all duration-200 shadow-lg ${
              isSubmitting
                ? "opacity-75 cursor-not-allowed"
                : "hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-xl"
            }`}
          >
            {isSubmitting ? "Creating Event..." : "Create Event"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FinalDetails;
