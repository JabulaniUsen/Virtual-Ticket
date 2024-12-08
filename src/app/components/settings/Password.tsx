import React, { useState } from "react";

const Password = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password updated");
  };

  return (
    <div className="flex flex-col items-start justify-start p-4 sm:p-2 dark:bg-gray-900 h-full">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Password Settings</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Manage your password settings. Ensure your account is secure by keeping your password updated and enabling extra security measures.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
       
        <div className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium dark:text-gray-300">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter current password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-300">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter new password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-300">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Confirm new password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* ============== && •TWO-FACTOR AUTHENTICATION• && ================= */}
        <div className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Two-Factor Authentication</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Enable two-factor authentication (2FA) for an extra layer of security. You&apos;ll need to enter a code sent to your mobile device in addition to your password.
          </p>
          <a href="auth/twoFacAuth" target="_blank" rel="noopener noreferrer">
          <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:outline-none">
           Set Up Two-Factor Authentication 
          </button>
          </a>
        </div>

        {/* ============== && •PASSWORD RECOVERY SECTION• && ================= */}
        <div className="col-span-1 md:col-span-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Password Recovery</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Forgot your password? Use the recovery option to reset it.
          </p>
          <a href="/auth/forgot-password">
          <button className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none">
            Send Recovery Email
          </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Password;
