'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaCloudUploadAlt, FaExclamationTriangle, FaEye, FaGoogle, FaIdCard, FaInfoCircle, FaKey, FaLink, FaLock, FaTrash, FaVideo } from 'react-icons/fa';
import { type EventFormData } from '@/types/event';
import { RiEarthLine } from 'react-icons/ri';

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

    // Create a new preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Update form data
    updateFormData({ image: file });

    // Reset file input to allow re-selection
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
      className={`relative border-2 border-dashed rounded-xl p-4 sm:p-8 text-center cursor-pointer ${
        isDragging
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-300 dark:border-gray-600"
      }`}
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
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
          >
            <FaTrash size={12} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full cursor-pointer">
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
          {/* VIRTUAL EVENTS */}
            <div className="flex items-center space-x-4 mb-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isVirtual}
                  onChange={(e) => updateFormData({ isVirtual: e.target.checked })}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Virtual Event
                </span>
              </label>
            </div>
                    
            {formData.isVirtual && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-sm border border-blue-100 dark:border-gray-600 mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 flex items-center">
                    <RiEarthLine className="mr-2" /> Virtual Event Setup
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                    Online Event
                  </span>
                </div>

                {/* Platform Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 dark:text-white text-gray-900">
                  {(['google-meet', 'zoom', 'whereby', 'custom'] as const).map((platform) => (
                    <motion.button
                      key={platform}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        updateFormData({
                          virtualEventDetails: {
                            ...formData.virtualEventDetails,
                            platform,
                            meetingUrl: platform === 'custom' ? '' : formData.virtualEventDetails?.meetingUrl,
                            meetingId: platform === 'zoom' ? '' : formData.virtualEventDetails?.meetingId
                          },
                          venue: 'Online',
                          location: platform === 'google-meet' ? 'Google Meet' : 
                                  platform === 'zoom' ? 'Zoom Meeting' : 
                                  platform === 'whereby' ? 'Whereby Meeting' :
                                  'Virtual Event'
                        });
                      }}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center dark:text-white text-gray-900
                        ${formData.virtualEventDetails?.platform === platform
                        ? 'border-blue-500 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-50 dark:from-blue-900/40 dark:via-purple-900/30 dark:to-blue-900/20 shadow-md'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-blue-400/20 hover:via-purple-400/30 hover:to-blue-200/30 dark:hover:from-blue-700/40 dark:hover:via-purple-700/30 dark:hover:to-blue-900/20 hover:border-blue-400 dark:hover:border-blue-400'
                        }`}
                      >
                      {platform === 'google-meet' && <FaGoogle className="text-red-500 text-2xl mb-2" />}
                      {platform === 'zoom' && <FaVideo className="text-blue-500 text-2xl mb-2" />}
                      {platform === 'whereby' && <FaVideo className="text-purple-500 text-2xl mb-2" />}
                      {platform === 'custom' && <FaKey className="text-green-500 text-2xl mb-2" />}
                      <span className="capitalize font-medium text-sm">
                        {platform === 'google-meet' ? 'Google Meet' : 
                        platform === 'whereby' ? 'Whereby' :
                        platform === 'custom' ? 'Custom Setup' : platform}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Google Meet  */}
                {formData.virtualEventDetails?.platform === 'google-meet' && (
                  <div className="space-y-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex items-start">
                      <FaInfoCircle className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Please paste your Google Meet link below. Make sure the link is accessible to attendees.
                    </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <FaLink className="mr-2" /> Google Meet Link *
                    </label>
                    <input
                    type="url"
                    value={formData.virtualEventDetails?.meetingUrl || ''}
                    onChange={(e) => updateFormData({
                      virtualEventDetails: {
                      ...formData.virtualEventDetails,
                      meetingUrl: e.target.value
                      }
                    })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    required
                    />
                  </div>
                  </div>
                )}

                {/* Whereby Section */}
                {formData.virtualEventDetails?.platform === 'whereby' && (
                  <div className="space-y-4 mb-6">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-start">
                        <FaInfoCircle className="text-purple-500 mt-1 mr-2 flex-shrink-0" />
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          A Whereby meeting link will be automatically generated when you publish your event.
                          You can customize the room name later in your Whereby dashboard.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Meeting Options
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={formData.virtualEventDetails?.enableWaitingRoom || false}
                            onChange={(e) => updateFormData({
                              virtualEventDetails: {
                                ...formData.virtualEventDetails,
                                enableWaitingRoom: e.target.checked
                              }
                            })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Enable waiting room</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={formData.virtualEventDetails?.lockRoom || false}
                            onChange={(e) => updateFormData({
                              virtualEventDetails: {
                                ...formData.virtualEventDetails,
                                lockRoom: e.target.checked
                              }
                            })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Lock room after start</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Zoom Section */}
                {formData.virtualEventDetails?.platform === 'zoom' && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <FaIdCard className="mr-2" /> Zoom Meeting ID *
                      </label>
                      <input
                        type="text"
                        value={formData.virtualEventDetails?.meetingId || ''}
                        onChange={(e) => updateFormData({
                          virtualEventDetails: {
                            ...formData.virtualEventDetails,
                            meetingId: e.target.value
                          }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="123 456 7890"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <FaLock className="mr-2" /> Zoom Passcode (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.virtualEventDetails?.passcode || ''}
                        onChange={(e) => updateFormData({
                          virtualEventDetails: {
                            ...formData.virtualEventDetails,
                            passcode: e.target.value
                          }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Leave empty if no passcode required"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        This is different from the event password. Only needed if your Zoom meeting has a passcode.
                      </p>
                    </div>
                  </div>
                )}

                {/* Custom Platform Section */}
                {formData.virtualEventDetails?.platform === 'custom' && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <FaLink className="mr-2" /> Meeting URL *
                      </label>
                      <input
                        type="url"
                        value={formData.virtualEventDetails?.meetingUrl || ''}
                        onChange={(e) => updateFormData({
                          virtualEventDetails: {
                            ...formData.virtualEventDetails,
                            meetingUrl: e.target.value
                          }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://your-platform.com/meeting-id"
                        required
                      />
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-start">
                        <FaExclamationTriangle className="text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          For custom platforms, you&apos;re responsible for creating the meeting and managing access.
                          Ensure the URL is correct and accessible to attendees.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Universal Virtual Password Section */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.virtualEventDetails?.requiresPassword || false}
                        onChange={(e) => updateFormData({
                          virtualEventDetails: {
                            ...formData.virtualEventDetails,
                            requiresPassword: e.target.checked,
                            virtualPassword: e.target.checked ? formData.virtualEventDetails?.virtualPassword || '' : ''
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Require Virtual Password
                      </span>
                    </label>
                    {formData.virtualEventDetails?.requiresPassword && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                        Extra Security
                      </span>
                    )}
                  </div>

                  {formData.virtualEventDetails?.requiresPassword && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="mt-3"
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <FaLock className="mr-2" /> Virtual Event Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          value={formData.virtualEventDetails?.virtualPassword || ''}
                          onChange={(e) => updateFormData({
                            virtualEventDetails: {
                              ...formData.virtualEventDetails,
                              virtualPassword: e.target.value
                            }
                          })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                          placeholder="Create a password for attendees"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          onClick={() => {
                            const input = document.querySelector('input[type="password"]') as HTMLInputElement;
                            if (input) {
                              input.type = input.type === 'password' ? 'text' : 'password';
                            }
                          }}
                        >
                          <FaEye />
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Attendees will need this password to access the virtual event. 
                        {formData.virtualEventDetails?.platform === 'zoom' && ' This is separate from the Zoom passcode.'}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
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