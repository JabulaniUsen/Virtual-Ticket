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
      const response = await axios.get(
        `${BASE_URL}api/v1/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(response.data.notifications);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast("error", "Failed to fetch notifications");
    }
  }, [router, toast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast("error", "No token found");
        return;
      }

      await axios.patch(
        `${BASE_URL}api/v1/notifications/read/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(
        notifications.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
      toast("success", "Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
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

       const config = {
         method: "delete",
         maxBodyLength: Infinity,
         url: `${BASE_URL}api/v1/notifications/${id}`,
         headers: {
           Authorization: `Bearer ${token}`,
         },
       };

       await axios
         .request(config)
         .then((response) => {
           console.log(JSON.stringify(response.data));
           setNotifications((prevNotifications) =>
             prevNotifications.filter((notification) => notification.id !== id)
           );
           toast("success", "Notification deleted successfully");
         })
         .catch((error) => {
           console.error("Error deleting notification:", error);
           toast("error", "Failed to delete notification");
         });
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast("error", "Failed to delete notification");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 md:p-8 sm:p-2 rounded-xl shadow-lg w-fit lg:max-w-5xl mx-auto space-y-6 md:space-y-8">
      {showToast && (
        <Toast
          type={toastProps.type}
          message={toastProps.message}
          onClose={() => setShowToast(false)}
        />
      )}
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <div className="space-y-4">
          {notifications
            .sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-xl shadow-md ${
                  notification.isRead ? "bg-gray-200 dark:bg-gray-700 " : "bg-white dark:bg-gray-800"
                }`}
              >
                <div className="flex flex-col rounded md:flex-row justify-between  items-start md:items-center">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">
                      {notification.title}
                    </h2>
                    <p className="text-sm">{notification.message}</p>
                    <small className="text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <div className="flex w-3/4 sm:w-fit flex-row justify-between sm:flex-col sm:items-end space-x-2 mt-2 ml-4 gap-2 md:mt-0">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="whitespace-nowrap text-blue-500 flex flex-row gap-1 items-center justify-start hover:underline"
                      >
                        <IoMailUnreadOutline className="w-4 h-4 " />
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-500 w-fit flex flex-row gap-1 items-center justify-end hover:underline"
                    >
                      <MdDeleteOutline className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;