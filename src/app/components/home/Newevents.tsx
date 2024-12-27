"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
}

function Newevent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // FETCH EVENTS: Function for fetching event data
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true); 
      setError(null);

      const response = await fetch(
        "https://v-ticket-backend.onrender.com/api/v1/events/all-events"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false); // Fetching complete, set loading to false
    }
  }, []);

  useEffect(() => {
    fetchEvents(); // Run the fetchEvents function when component mounts
  }, [fetchEvents]);

  // CARD ANIMATIONS: Variants for individual card animations
  const cardVariants = {
    hidden: { opacity: 0, y: 50 }, // Cards start below view and invisible
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.05, transition: { duration: 0.3 } }, // Hover zoom effect
  };

  // CONTAINER ANIMATIONS: Variants for parent container animations
  const containerVariants = {
    hidden: { opacity: 0 }, // Initially invisible
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }, // Staggered animations for child elements
  };

  if (loading) {
    return <div className="text-white">Loading...</div>; // Render a loading state
  }

  if (error) {
    return <div className="text-white">Error: {error}</div>; // Render an error state
  }

  return (
    <motion.div
      className="bg-primary flex flex-col gap-6 items-center py-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants} // Parent container animation
    >
      {/* SECTION TITLE */}
      <motion.h2
        className="flex flex-col w-fit text-center items-center text-white/90 text-2xl font-bold"
        initial={{ opacity: 0, y: -30 }} // Title animation
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        New Events
        <motion.hr
          className="w-1/2 border-2 border-orange-700 mt-2"
          initial={{ scaleX: 0 }} // Line animation
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6 }}
        />
      </motion.h2>

      {/* EVENTS CONTAINER */}
      <motion.div
        className="flex flex-col sm:flex-row flex-wrap items-center sm:items-start gap-10"
        variants={containerVariants} // Ensure staggered animations for cards
      >
        {events.map((event, index) => (
          <motion.div
            key={index}
            className="card-container"
            variants={cardVariants} // Animation for individual cards
            whileHover="hover" // Hover animation
          >
            <Card
              sx={{
                width: 256,
                background: "transparent",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* CARD IMAGE */}
              <CardMedia
                sx={{ height: 256 }}
                image={event.image}
                title={event.title}
              />
              {/* CARD CONTENT */}
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  className="text-white w-full"
                  component="div"
                >
                  {event.title}
                </Typography>
                <Button className="text-white" size="small">
                  {"HOT"}
                </Button>
                <Typography className="text-white" variant="body2">
                  {event.location}
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
