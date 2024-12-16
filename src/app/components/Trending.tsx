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

function Trending() {
  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <div className="bg-primary flex flex-col gap-6 items-center py-10">
      {/* Section Title */}
      <motion.h2
        className="flex flex-col w-fit text-center items-center text-white/90 text-2xl font-bold"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Trending Events <br />
        <motion.hr
          className="w-1/2 border-2 border-orange-700"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6 }}
        />
      </motion.h2>

      {/* Event Cards */}
      <motion.div
        className="flex flex-col sm:flex-row items-center sm:items-start gap-10"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.2 }}
      >
        {trendingevent.map((item, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover="hover"
            className="card-container"
          >
            <Card
              sx={{
                width: 256,
                background: "transparent",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <CardMedia
                sx={{ height: 256 }}
                image={item.imageurl}
                title={item.title}
              />
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
    </div>
  );
}

export default Trending;
