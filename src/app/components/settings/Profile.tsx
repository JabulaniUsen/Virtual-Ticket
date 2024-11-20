import Image from 'next/image';
import React, { useState } from 'react';

const Profile = () => {
  const [formData, setFormData] = useState({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file); // Generate a preview URL
      setFormData({ ...formData, profilePhoto: imageUrl });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', formData);
  };

  return (
    <div className="max-w-4xl mt-2 p-6">

      <h1 className="text-2xl font-bold mb-2">Profile Account</h1>
      <p className="text-gray-600 mb-6">
        Manage your Virtual Ticket account. All changes will be applied to your events and account settings.
      </p>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ========================== && •PROFILE SETUP SECTION• && ============================= */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src={formData.profilePhoto || 'https://via.placeholder.com/150'}
              width={150}
              height={150}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-md"
            />
          </div>
          <label htmlFor="profilePhoto" className="cursor-pointer">
            <span className="text-blue-500 font-semibold underline">
              Upload Profile Photo
            </span>
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

        {/* Full Name and Business Name */}
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
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
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

        {/* Email and Phone Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-none shadow-md dark:shadow-gray-500/50 bg-transparent dark:bg-gray-800 rounded-lg px-3 py-2"
              placeholder="Enter your email"
            />
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
          </div>
        </div>

        {/* Additional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Website</label>
            <input
              type="text"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-none shadow-md dark:shadow-gray-500/50 bg-transparent dark:bg-gray-800 rounded-lg px-3 py-2"
              placeholder="Enter your company website"
            />
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
          </div>
        </div>

        {/* Time Zone and Event Category */}
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
            <label className="block text-sm font-medium mb-1">Event Category</label>
            <select
              name="eventCategory"
              value={formData.eventCategory}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-none shadow-md dark:shadow-gray-500/50 bg-transparent dark:bg-gray-800 rounded-lg px-3 py-2"
            >
              <option value="">Select an event category</option>
              <option value="concert">Concert</option>
              <option value="conference">Conference</option>
              <option value="sports">Sports</option>
              <option value="theatre">Theatre</option>
              <option value="exhibition">Exhibition</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
