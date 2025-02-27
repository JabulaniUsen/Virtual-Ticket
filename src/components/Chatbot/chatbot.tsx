'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaMicrophone, FaPaperPlane, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '@/config';


const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Array<{ type: 'user' | 'bot', content: string }>>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const newMessage = { type: 'user' as const, content: inputMessage };
        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/chatbot/query`, {
                message: inputMessage
            });

            setMessages(prev => [...prev, { type: 'bot', content: response.data.response }]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { type: 'bot', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            
            const audioChunks: BlobPart[] = [];
            
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const formData = new FormData();
                formData.append('audio', audioBlob);

                try {
                    const response = await axios.post(`${API_URL}/chatbot/voice`, formData);
                    setInputMessage(response.data.text);
                } catch (error) {
                    console.error('Error processing voice:', error);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-white dark:bg-gray-800 
                                         rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
                    >
                        {/* Chat Header */}
                        <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <FaRobot className="text-xl" />
                                <h3 className="font-semibold">Virtual Assistant</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-blue-700 rounded-full transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div 
                            ref={chatContainerRef}
                            className="h-[380px] overflow-y-auto p-4 space-y-4 scroll-smooth"
                        >
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl ${
                                            message.type === 'user'
                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none'
                                        }`}
                                    >
                                        {message.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl rounded-bl-none">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-.3s]" />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-.5s]" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    className={`p-2 rounded-full transition-colors ${
                                        isRecording
                                            ? 'bg-red-500 text-white animate-pulse'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    <FaMicrophone />
                                </button>
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type your message..."
                                    className="flex-1 p-2 rounded-xl border dark:border-gray-700 bg-gray-100 dark:bg-gray-700
                                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                >
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Bot Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            >
                <FaRobot className="text-2xl" />
            </motion.button>
        </div>
    );
};

export default ChatBot;