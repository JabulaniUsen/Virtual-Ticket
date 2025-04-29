// components/EventGallerySection.tsx
import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { type EventFormData } from '@/types/event';

interface EventGallerySectionProps {
  event: EventFormData;
}

export const EventGallerySection = ({ event }: EventGallerySectionProps) => {
  if (!event?.gallery || event.gallery.length === 0) return null;

  return (
    <Box sx={{ textAlign: 'center', mt: 5, mb: 8, px: 4 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        GALLERY
      </Typography>
      <div className="flex justify-center gap-4 flex-wrap">
        {event.gallery.map((img, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={index} 
            sx={{ 
              position: 'relative', 
              overflow: 'hidden', 
              borderRadius: 2, 
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Image 
                src={typeof img === 'string' ? img : URL.createObjectURL(img)} 
                alt={`${event.title} gallery ${index + 1}`} 
                width={350} 
                height={300}
                className="h-[50vh] object-cover"
                style={{ 
                  borderRadius: '8px', 
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }} 
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </motion.div>
          </Grid>
        ))}
      </div>
    </Box>
  );
};