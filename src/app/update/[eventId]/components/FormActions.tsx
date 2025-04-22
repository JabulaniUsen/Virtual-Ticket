// import { motion } from "framer-motion";
import { BiSave } from "react-icons/bi";

interface FormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

export default function FormActions({ isLoading, onCancel }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-4 mt-8">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
             rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white
             rounded-lg hover:from-blue-700 hover:to-purple-700
             disabled:opacity-50 disabled:cursor-not-allowed
             transform hover:scale-105 transition-all duration-200
             shadow-lg hover:shadow-xl flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <span className="animate-spin mr-2">🔄</span>
            <span>Updating...</span>
          </>
        ) : (
          <>
            <BiSave className="mr-2" />
            <span>Update Event</span>
          </>
        )}
      </button>
    </div>
  );
}