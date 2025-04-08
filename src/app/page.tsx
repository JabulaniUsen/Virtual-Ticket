'use client';
import { useState, useEffect } from "react";
import Hero from "./components/home/Hero";
import Trending from "./components/home/Trending";
import Footer from "./components/home/Footer";
import Header from "./components/home/Header";
import FeaturedEvent from "./components/home/FeaturedEvent";
import AllEvents from "./components/home/AllEvents";
import Tutorial from "./components/home/Tutorial";
import LatestEvent from "./components/home/LatestEvent";
import EventCalendar from '@/components/Calendar/EventCalendar';
import ChatBot from "../components/Chatbot/chatbot";
import ServerDown from "./503/page";
import { BASE_URL } from "@/config";
import axios from "axios";

export default function Home() {
  const [isServerDown, setIsServerDown] = useState(false);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/v1/events/all-events`);
        if (response.status === 503) {
          setIsServerDown(true);
        } else {
          setIsServerDown(false);
        }
      } catch (error) {
        setIsServerDown(true);
        console.log(error);
      }
    };

    checkServerStatus();
    // Check server status every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isServerDown) {
    return <ServerDown />;
  }

  return (
    <main>
      <EventCalendar />
      <Header />
      <Hero />
      <FeaturedEvent />
      <LatestEvent />
      <AllEvents />
      <Trending />
      <Tutorial />
      <ChatBot />
      <Footer />
    </main>
  );
}
