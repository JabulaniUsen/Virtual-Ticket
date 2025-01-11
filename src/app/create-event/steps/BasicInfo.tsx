'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import { EventFormData } from '../page';

interface BasicInfoProps {
  formData: EventFormData;
  updateFormData: (data: Partial<EventFormData>) => void;
  onNext: () => void;
  setToast: (toast: { type: 'success' | 'error'; message: string; } | null) => void;
}

const BasicInfo = ({ formData, updateFormData, onNext, setToast }: BasicInfoProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (formData.image) {
      const previewUrl = URL.createObjectURL(formData.image);
      setImagePreview(previewUrl);

      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      };
    }
  }, [formData.image]);

  const handleImageChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setToast({ type: 'error', message: 'Please upload an image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setToast({ type: 'error', message: 'File size should be less than 5MB' });
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    updateFormData({ image: file });

    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageChange(file);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setToast({ type: 'error', message: 'Please enter an event title' });
      return false;
    }
    if (!formData.description.trim()) {
      setToast({ type: 'error', message: 'Please enter an event description' });
      return false;
    }
    if (!formData.image) {
      setToast({ type: 'error', message: 'Please upload an event image' });
      return false;
    }
    if (!formData.date) {
      setToast({ type: 'error', message: 'Please select an event date' });
      return false;
    }
    if (!formData.time) {
      setToast({ type: 'error', message: 'Please select an event time' });
      return false;
    }
    if (!formData.venue.trim()) {
      setToast({ type: 'error', message: 'Please enter an event venue' });
      return false;
    }
    if (!formData.location.trim()) {
      setToast({ type: 'error', message: 'Please enter an event location' });
      return false;
    }
    return true;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="shadow-lg w-full p-0 sm:p-2"
    >
      <h2 className="sm:text-2xl text-xl font-bold text-gray-900 dark:text-white mb-4">
        Event Basic Information
      </h2>

      <div className="space-y-4 sm:space-y-6">
     
        <div
          className={`relative border-2 border-dashed rounded-xl p-4 sm:p-8 text-center cursor-pointer
            ${isDragging 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600'}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageChange(file);
            }}
          />

          {imagePreview ? (
            <div className="relative h-48 w-full">
              <Image
                src={imagePreview}
                alt="Event preview"
                fill
                className="object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  if (imagePreview) {
                    URL.revokeObjectURL(imagePreview);
                  }
                  setImagePreview(null);
                  updateFormData({ image: null });
                }}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full
                         hover:bg-red-600 transition-colors duration-200"
              >
                <FaTrash size={12} />
              </button>
        
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center h-full cursor-pointer"
            >
              <FaCloudUploadAlt className="w-12 h-12 text-gray-400" />
              <div className="text-gray-600 dark:text-gray-300">
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Drag and drop your event image here
                </p>
                <p className="text-sm">or click to browse</p>
              </div>
            </div>
          )}
        </div>

        {/* Event Details Form */}
        <div className="grid gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter event title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Describe your event"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => updateFormData({ date: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => updateFormData({ time: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Venue *
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => updateFormData({ venue: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter venue name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => updateFormData({ location: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter location"
                required
              />
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => {
              if (validateForm()) {
          onNext();
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg
                hover:from-blue-700 hover:to-purple-700 transform hover:scale-105
                transition-all duration-200 shadow-lg w-full
                sm:w-auto glass-effect"
          >
            Continue to Ticket Setup
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default BasicInfo;