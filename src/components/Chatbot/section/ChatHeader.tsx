import { FaRobot, FaTimes } from 'react-icons/fa';

interface ChatHeaderProps {
    onClose: () => void;
}

const ChatHeader = ({ onClose }: ChatHeaderProps) => {
    return (
        <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
                <FaRobot className="text-xl" />
                <h3 className="font-semibold">Virtual Assistant</h3>
            </div>
            <button
                onClick={onClose}
                className="p-1 hover:bg-blue-700 rounded-full transition-colors"
            >
                <FaTimes />
            </button>
        </div>
    );
};

export default ChatHeader;