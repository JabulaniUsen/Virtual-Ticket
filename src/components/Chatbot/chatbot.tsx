'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '@/config';
import ChatHeader from './section/ChatHeader';
import ChatMessages from './section/ChatMessages';
import ChatInput from './section/ChatInput';
import ChatToggleButton from './section/ChatToggleButton';


interface ChatMessage {
    type: 'user' | 'bot';
    content: string;
}

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        setTimeout(scrollToBottom, 100); // Add slight delay to ensure content is rendered
    }, [messages, isOpen]);

    const fetchChatHistory = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_URL}/chatbot/chats?email=${email}`);
            const chats = response.data;
            const chatMessages = chats.map((chat: { message: string; response: string }) => [
                { type: 'user' as const, content: chat.message },
                { type: 'bot' as const, content: chat.response },
            ]);
            setMessages(chatMessages.flat());
        } catch (error) {
            console.error('Error fetching chat history:', error);
        } finally {
            setIsLoading(false);
        }
    }, [email]);


    useEffect(() => {
        if (isOpen && email) {
            fetchChatHistory();
        }
    }, [isOpen, email, fetchChatHistory]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !email) return;

        const newMessage = { type: 'user' as const, content: inputMessage };
        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/chatbot/query`, {
                message: inputMessage,
                email: email,
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
                        <ChatHeader onClose={() => setIsOpen(false)} />
                        <ChatMessages messages={messages} isLoading={isLoading} />
                        <ChatInput
                            inputMessage={inputMessage}
                            isRecording={isRecording}
                            onInputChange={(e) => setInputMessage(e.target.value)}
                            onSendMessage={handleSendMessage}
                            onStartRecording={startRecording}
                            onStopRecording={stopRecording}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <ChatToggleButton onClick={() => setIsOpen(!isOpen)} />
        </div>
    );
};

export default ChatBot;