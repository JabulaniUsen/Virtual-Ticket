import { motion } from 'framer-motion';
import { FaRobot } from 'react-icons/fa';

interface ChatToggleButtonProps {
    onClick: () => void;
}

const ChatToggleButton = ({ onClick }: ChatToggleButtonProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
            <FaRobot className="text-2xl" />
        </motion.button>
    );
};

export default ChatToggleButton;