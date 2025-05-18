'use client';
import React from 'react';
import { Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';



interface ShareEventSectionProps {
    eventSlug: string;
    setToast: (toast: { type: 'error' | 'success'; message: string } | null) => void;
}

export const ShareEventSection: React.FC<ShareEventSectionProps> = ({ eventSlug, setToast }) => {
    const copyLink = () => {
        const link = `${window.location.origin}/${eventSlug}`;
        navigator.clipboard.writeText(link);
        setToast({ type: 'success', message: `Event link copied: ${link}` });
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <Box className="relative p-8 text-center">
            <motion.h5
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-xl font-bold mb-4"
            >
                SHARE THE EXCITEMENT!
            </motion.h5>

            <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-gray-600 dark:text-gray-300 mb-6"
            >
                LET OTHERS KNOW ABOUT THIS AMAZING EVENT. CLICK BELOW TO COPY THE EVENT LINK AND SPREAD THE WORD!
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
            >
                <Button
                    onClick={copyLink}
                    startIcon={<ContentCopyIcon />}
                    variant="outlined"
                    size="large"
                    className="px-6 py-2 font-semibold rounded-full border border-gray-400 hover:border-gray-600 transition-all"
                >
                    COPY EVENT LINK
                </Button>
            </motion.div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.2 }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
                className="absolute top-5 left-5 w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700"
            />

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.2 }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
                className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-600"
            />
        </Box>
    );
};