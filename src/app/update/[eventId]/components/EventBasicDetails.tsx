import { motion } from "framer-motion";
import { FaUserPlus, FaCalendarAlt,  FaClock, FaHeading, FaAlignLeft } from "react-icons/fa";
import { Event } from "../../../../types/event";

interface EventBasicDetailsProps {
  formData: Event | null;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => void;
}

export default function EventBasicDetails({ 
  formData, 
  handleInputChange 
}: EventBasicDetailsProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <motion.div
      className="space-y-8 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-gray-800/90 dark:to-gray-800/80 p-8 rounded-2xl shadow-lg border border-indigo-100/60 dark:border-gray-700/50 backdrop-blur-sm dark:text-gray-100 text-gray-800"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Header */}
      <div className="pb-2 border-b border-indigo-100/50 dark:border-gray-700/50">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          Basic Details
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Fill in the essential information about your event
        </p>
      </div>

      {/* Event Title */}
      <div className="space-y-3">
        <label className="flex items-center text-sm font-medium text-indigo-700 dark:text-indigo-300">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2.5 rounded-xl mr-3 shadow-md">
            <FaHeading className="text-white text-lg" />
          </span>
          Event Title
        </label>
        <input
          type="text"
          value={formData?.title || ""}
          onChange={(e) => handleInputChange(e, "title")}
          className="w-full px-5 py-4 rounded-xl border border-indigo-100/70 dark:border-indigo-900/50 bg-white/90 dark:bg-gray-700/40 focus:bg-white dark:focus:bg-gray-800 backdrop-blur-sm placeholder-gray-400/80 focus:ring-2 focus:ring-indigo-300/80 dark:focus:ring-indigo-700/50 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
          placeholder="Enter event title..."
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-3">
        <label className="flex items-center text-sm font-medium text-indigo-700 dark:text-indigo-300">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2.5 rounded-xl mr-3 shadow-md">
            <FaAlignLeft className="text-white text-lg" />
          </span>
          Event Description
        </label>
        <textarea
          value={formData?.description || ""}
          onChange={(e) => handleInputChange(e, "description")}
          rows={5}
          className="w-full px-5 py-4 rounded-xl border border-indigo-100/70 dark:border-indigo-900/50 bg-white/90 dark:bg-gray-700/40 focus:bg-white dark:focus:bg-gray-800 backdrop-blur-sm placeholder-gray-400/80 focus:ring-2 focus:ring-indigo-300/80 dark:focus:ring-indigo-700/50 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
          placeholder="Describe your event in detail..."
          required
        />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Host Name */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-indigo-700 dark:text-indigo-300">
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2.5 rounded-xl mr-3 shadow-md">
              <FaUserPlus className="text-white text-lg" />
            </span>
            Host Name
          </label>
          <input
            type="text"
            value={formData?.hostName || ""}
            onChange={(e) => handleInputChange(e, "hostName")}
            className="w-full px-5 py-4 rounded-xl border border-indigo-100/70 dark:border-indigo-900/50 bg-white/90 dark:bg-gray-700/40 focus:bg-white dark:focus:bg-gray-800 backdrop-blur-sm placeholder-gray-400/80 focus:ring-2 focus:ring-indigo-300/80 dark:focus:ring-indigo-700/50 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
            placeholder="Enter host name"
            required
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          {/* Date */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-medium text-indigo-700 dark:text-indigo-300">
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2.5 rounded-xl mr-2 shadow-md">
                <FaCalendarAlt className="text-white text-lg" />
              </span>
              Date
            </label>
            <input
              type="date"
              value={formatDate(formData?.date)}
              onChange={(e) => handleInputChange(e, "date")}
              className="w-full px-5 py-4 rounded-xl border border-indigo-100/70 dark:border-indigo-900/50 bg-white/90 dark:bg-gray-700/40 focus:bg-white dark:focus:bg-gray-800 backdrop-blur-sm focus:ring-2 focus:ring-indigo-300/80 dark:focus:ring-indigo-700/50 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
              required
            />
          </div>

          {/* Time */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-medium text-indigo-700 dark:text-indigo-300">
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2.5 rounded-xl mr-2 shadow-md">
                <FaClock className="text-white text-lg" />
              </span>
              Time
            </label>
            <input
              type="time"
              value={formData?.time || ""}
              onChange={(e) => handleInputChange(e, "time")}
              className="w-full px-5 py-4 rounded-xl border border-indigo-100/70 dark:border-indigo-900/50 bg-white/90 dark:bg-gray-700/40 focus:bg-white dark:focus:bg-gray-800 backdrop-blur-sm focus:ring-2 focus:ring-indigo-300/80 dark:focus:ring-indigo-700/50 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
              required
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}