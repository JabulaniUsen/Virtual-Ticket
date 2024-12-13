import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import SuccessModal from './modal/successModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type FormDataType = {
  profilePhoto: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  timeZone: string;
  companyWebsite: string;
  address: string;
  eventCategory: string;
};

type ErrorMessagesType = Record<string, string>;

const Profile = () => {
  const [formData, setFormData] = useState<FormDataType>({
    profilePhoto: '',
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    timeZone: '',
    companyWebsite: '',
    address: '',
    eventCategory: '',
  });

  const [errorMessages, setErrorMessages] = useState<ErrorMessagesType>({});
  const [showModal, setShowModal] = useState(false);

  // Fetching user data from local storage after mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setFormData({
        profilePhoto: parsedUser.profilePhoto || '',
        fullName: parsedUser.fullName || '',
        businessName: parsedUser.businessName || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        timeZone: parsedUser.timeZone || '',
        companyWebsite: parsedUser.companyWebsite || '',
        address: parsedUser.address || '',
        eventCategory: parsedUser.eventCategory || '',
      });
    }
  }, []);

  // Saving form data to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('profileData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file); 
      setFormData({ ...formData, profilePhoto: imageUrl });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requiredFields: (keyof FormDataType)[] = [
      'fullName',
      'email',
      'phone',
      'timeZone',
      'address',
      'companyWebsite',
    ];

    const errors: Record<string, string> = {};
    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        errors[field] = 'This field is required.';
      }
    });

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
    } else {
      setErrorMessages({});
      toast.success('Profile updated successfully!');

      // Update the user data in localStorage (if necessary)
      const updatedUser = { ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Optionally, send the updated data to a server via an API call here
    }
  };

  return (
    <div className="max-w-4xl mt-2 p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-2">Profile Account</h1>
      <p className="text-gray-600 mb-6">
        Manage your Virtual Ticket account. All changes will be applied to your events and account settings.
      </p>

      {/* ===================== && •FORM SECTION• && =========================== */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ===================== && •PROFILE SETUP SECTION• && =========================== */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src={formData.profilePhoto || '/phishing.png'}
              width={150}
              height={150}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-md"
            />
          </div>
          <label htmlFor="profilePhoto" className="cursor-pointer">
            <span className="text-blue-500 font-semibold underline">Upload Profile Photo</span>
            <input
              type="file"
              id="profilePhoto"
              name="profilePhoto"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* ===================== && •INPUT FIELDS SECTION• && ========================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-none shadow-md dark:shadow-gray-500/50 bg-transparent dark:bg-gray-800 rounded-lg px-3 py-2"
              placeholder="Enter your full name"
            />
            {errorMessages.fullName && (
              <p className="text-red-500 text-sm">{errorMessages.fullName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Business Name (optional)</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-none shadow-md dark:shadow-gray-500/50 bg-transparent dark:bg-gray-800 rounded-lg px-3 py-2"
              placeholder="Enter your business name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-none shadow-md dark:shadow-gray-500/50 bg-transparent dark:bg-gray-800 rounded-lg px-3 py-2 text-gray-400"
              placeholder="Enter your email"
              readOnly
            />
            {errorMessages.email && (
              <p className="text-red-500 text-sm">{errorMessages.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-none shadow-md dark:shadow-gray-500/50 bg-transparent dark:bg-gray-800 rounded-lg px-3 py-2"
              placeholder="Enter your phone number"
            />
            {errorMessages.phone && (
              <p className="text-red-500 text-sm">{errorMessages.phone}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Website</label>
            <input
              type="text"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-none shadow-md dark:shadow-gray-500/50 bg-transparent dark:bg-gray-800 rounded-lg px-3 py-2"
              placeholder="Enter your company website "
            />
            {errorMessages.companyWebsite && (
              <p className="text-red-500 text-sm">{errorMessages.companyWebsite}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-none shadow-md dark:shadow-gray-500/50 bg-transparent dark:bg-gray-800 rounded-lg px-3 py-2"
              placeholder="Enter your address"
            />
            {errorMessages.address && (
              <p className="text-red-500 text-sm">{errorMessages.address}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Time Zone</label>
            <select
              name="timeZone"
              value={formData.timeZone}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-none shadow-md dark:shadow-gray-500/50 bg-transparent dark:bg-gray-800 rounded-lg px-3 py-2"
            >
              <option value="">Select your time zone</option>
              <option value="UTC-12:00">UTC-12:00</option>
              <option value="UTC-11:00">UTC-11:00</option>
              <option value="UTC+00:00">UTC+00:00 (GMT)</option>
              <option value="UTC+01:00">UTC+01:00 (CET)</option>
              <option value="UTC+05:30">UTC+05:30 (IST)</option>
              <option value="UTC+09:00">UTC+09:00 (JST)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Event Category (optional)</label>
            <select
              name="eventCategory"
              value={formData.eventCategory}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-none shadow-md dark:shadow-gray-500/50 bg-transparent dark:bg-gray-800 rounded-lg px-3 py-2"
            >
              <option value="">Select an event category</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Business">Business</option>
              <option value="Education">Education</option>
              <option value="Technology">Technology</option>
            </select>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Update Profile
          </button>
        </div>
      </form>

      {showModal && (
        <SuccessModal
          title="Settings Saved"
          message="Your profile has been successfully updated."
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Profile;
