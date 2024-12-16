"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion"; // Import Framer Motion

// Array of trending events
const trendingevent = [
  {
    title: "Owl Fest",
    imageurl: "/image.png",
    location: "New York",
    id: "",
    eventtype: "CONCERT",
  },
  {
    title: "Homeless Live Experience",
    imageurl: "/image-1.png",
    location: "Terra Kulture, Tiamiyu Savage Street,",
    id: "",
    eventtype: "BEACH PARTY",
  },
  {
    title: "Love in the boulevard",
    imageurl: "/image-2.png",
    location: "New York",
    id: "",
    eventtype: "LISTENING PARTY",
  },
  {
    title: "YOLO Beach Daycation",
    imageurl: "/image-4.png",
    location: "New York",
    id: "",
    eventtype: "CONCERT",
  },
];

function Newevent() {
  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50 }, // Cards start slightly below and invisible
    visible: {
      opacity: 1,
      y: 0, // Cards move to their final position
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      scale: 1.05, // Zoom in slightly on hover
      transition: { duration: 0.3 },
    },
  };

  // Parent container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }, // Stagger the animations of child elements
    },
  };

  return (
    <motion.div
      className="bg-primary flex flex-col gap-6 items-center py-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants} // Apply container animation
    >
      {/* Section title */}
      <motion.h2
        className="flex flex-col w-fit text-center items-center text-white/90 text-2xl font-bold"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        New Events
        <motion.hr
          className="w-1/2 border-2 border-orange-700 mt-2"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6 }}
        />
      </motion.h2>

      {/* Cards container */}
      <motion.div
        className="flex flex-col sm:flex-row items-center sm:items-start gap-10"
        variants={containerVariants} // Ensure child animations are staggered
      >
        {trendingevent.map((item, index) => (
          <motion.div
            key={index}
            className="card-container"
            variants={cardVariants} // Apply animation to each card
            whileHover="hover" // Trigger hover animation
          >
            <Card
              sx={{
                width: 256,
                background: "transparent",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* Card image */}
              <CardMedia
                sx={{ height: 256 }}
                image={item.imageurl}
                title={item.title}
              />
              {/* Card content */}
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  className="text-white w-full"
                  component="div"
                >
                  {item.title}
                </Typography>
                <Button className="text-white" size="small">
                  {item.eventtype}
                </Button>
                <Typography
                  className="text-white"
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                >
                  {item.location}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Newevent;
