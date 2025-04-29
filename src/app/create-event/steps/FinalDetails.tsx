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
import { BASE_URL } from '../../../../config';


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
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setToast({ type: "error", message: "Please login to create an event" });
        router.push("/auth/login");
        return;
      }

      const submitFormData = new FormData();

      if (!formData.image) {
        setToast({ type: "error", message: "Main event image is required" });
        setIsLoading(false);
        return;
      }

      formData.gallery.forEach((file) => {
        submitFormData.append("gallery", file);
      });

      submitFormData.append("gallery", formData.image);

      submitFormData.append("title", formData.title.trim());
      submitFormData.append("description", formData.description.trim());
      submitFormData.append("date", new Date(formData.date).toISOString());
      submitFormData.append("location", formData.location.trim());

      const ticketTypeData = formData.ticketType.map((ticket) => ({
        name: ticket.name.trim(),
        price: ticket.price.trim(),
        quantity: ticket.quantity.trim(),
        sold: "0",
        details: ticket.details?.trim() || "",
        attendees: ticket.attendees || [],
      }));
      submitFormData.append("ticketType", JSON.stringify(ticketTypeData));

      submitFormData.append("time", formatTime(formData.time));
      submitFormData.append("venue", formData.venue.trim());
      submitFormData.append("isVirtual", formData.isVirtual.toString());
      submitFormData.append("socialMediaLinks", JSON.stringify({
        twitter: formData.socialMediaLinks?.twitter?.trim() || "",
        facebook: formData.socialMediaLinks?.facebook?.trim() || "",
        instagram: formData.socialMediaLinks?.instagram?.trim() || "",
      }));
      if (formData.isVirtual && formData.virtualEventDetails) {
        submitFormData.append(
          "virtualEventDetails",
          JSON.stringify({
            platform: formData.virtualEventDetails.platform,
            meetingId: formData.virtualEventDetails.meetingId,
            meetingUrl: formData.virtualEventDetails.meetingUrl,
            passcode: formData.virtualEventDetails.passcode,
            requiresPassword: formData.virtualEventDetails.requiresPassword,
            virtualPassword: formData.virtualEventDetails.virtualPassword,
            enableWaitingRoom: formData.virtualEventDetails.enableWaitingRoom,
            lockRoom: formData.virtualEventDetails.lockRoom
          })
        );
      }

      const event = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: new Date(formData.date).toISOString(),
        location: formData.location.trim(),
        ticketType: JSON.stringify(
          formData.ticketType.map((ticket) => ({
            name: ticket.name.trim(),
            price: ticket.price.trim(),
            quantity: ticket.quantity.trim(),
            sold: "0",
            details: ticket.details?.trim() || "",
            attendees: ticket.attendees || [],
          }))
        ),
        time: formatTime(formData.time),
        venue: formData.venue.trim(),
        socialMediaLinks: {
          twitter: formData.socialMediaLinks?.twitter?.trim() || "",
          facebook: formData.socialMediaLinks?.facebook?.trim() || "",
          instagram: formData.socialMediaLinks?.instagram?.trim() || "",
        },
        
      };
     


      console.log("Submitting:", {
        event,
        files: {
          gallery: formData.image.name,
          image: formData.gallery.map((f) => f.name),
        },
      });
      console.log("form data", submitFormData);

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

      if (response.status === 201 || response.status === 200) {
        setToast({ type: "success", message: "Event created successfully!" });
        router.push("/dashboard");
      } else if (response.status === 401) {
        setToast({ type: "error", message: "Session expired, redirecting to login..." });
        router.push("/auth/login");
      } 
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        setToast({
          type: "error",
          message: error.response?.data?.message || "Failed to create event",
        });
      } else {
        console.error("Unexpected error:", error);
        setToast({
          type: "error",
          message: "An unexpected error occurred",
        });
      }
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
            className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transform transition-all duration-200 shadow-lg ${
              isLoading
                ? "opacity-75 cursor-not-allowed"
                : "hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-xl"
            }`}
          >
            {isLoading ? "Creating Event..." : "Create Event"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FinalDetails;
