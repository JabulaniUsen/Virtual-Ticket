import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Toast } from "./Toast";
import { motion } from "framer-motion";
import { IoMailUnreadOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { BASE_URL } from '../../config';


interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastProps, setToastProps] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
  }>({
    type: "success",
    message: "",
  });

  const router = useRouter();
  const toast = useCallback(
    (type: "success" | "error" | "warning" | "info", message: string) => {
      setToastProps({ type, message });
      setShowToast(true);
    },
    []
  );

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast("error", "Authentication token is missing. Please log in");
        router.push("/auth/login");
        return;
      }

      // Add timeout and cancel token for better request handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await axios.get(
        `${BASE_URL}api/v1/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      setNotifications(response.data.notifications);
      setLoading(false);
    } catch (error) {
      if (axios.isCancel(error)) {
        toast("error", "Request timed out");
      } else {
        console.error("Error fetching notifications:", error);
        // toast("error", "Failed to fetch notifications");
      }
      setLoading(false);
    }
  }, [router, toast]);

  // Implement debounced refresh
  useEffect(() => {
    fetchNotifications();
    const refreshInterval = setInterval(fetchNotifications, 30000); // Refresh every 30s
    return () => clearInterval(refreshInterval);
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast("error", "No token found");
        return;
      }

      // Optimistic update
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );

      await axios.patch(
        `${BASE_URL}api/v1/notifications/read/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast("success", "Notification marked as read");
    } catch (error) {
      // Revert on error
      console.log(error);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, isRead: false } : notification
        )
      );
      toast("error", "Failed to mark notification as read");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast("error", "No token found");
        return;
      }

      // Optimistic update
      setNotifications(prev => prev.filter(notification => notification.id !== id));

      await axios.delete(`${BASE_URL}api/v1/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast("success", "Notification deleted successfully");
    } catch (error) {
      console.log(error);
      
      fetchNotifications();
      toast("error", "Failed to delete notification");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 mt-4">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 max-w-7xl mx-auto ml-0 sm:ml-4">
      <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg ">
        {showToast && (
          <Toast
            type={toastProps.type}
            message={toastProps.message}
            onClose={() => setShowToast(false)}
          />
        )}
        
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          Notifications
        </h1>

        {notifications.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 dark:text-gray-400">No notifications available.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {notifications
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-5 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg
                    ${notification.isRead 
                      ? "bg-gray-100 dark:bg-gray-700" 
                      : "bg-white dark:bg-gray-800"}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {notification.message}
                      </p>
                      <time className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(notification.createdAt).toLocaleString()}
                      </time>
                    </div>
                    
                    <div className="flex flex-row lg:flex-col items-center gap-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <IoMailUnreadOutline className="w-5 h-5" />
                          <span>Mark as Read</span>
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <MdDeleteOutline className="w-5 h-5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;