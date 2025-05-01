'use client';
import { useState, useEffect, Suspense, lazy } from "react";
import Hero from "./components/home/Hero";
import Footer from "./components/home/Footer";
import Header from "./components/home/Header";
import { BASE_URL } from "../../config";
import axios from "axios";
import ServerDown from "./503/page";

// Lazy load heavy components
const EventCalendar = lazy(() => import('@/components/Calendar/EventCalendar'));
const FeaturedEvent = lazy(() => import("./components/home/FeaturedEvent"));
const LatestEvent = lazy(() => import("./components/home/LatestEvent"));
const AllEvents = lazy(() => import("./components/home/AllEvents"));
const Trending = lazy(() => import("./components/home/Trending"));
const Tutorial = lazy(() => import("./components/home/Tutorial"));

export default function Home() {
  const [isServerDown, setIsServerDown] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
  
    const checkServerStatus = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/v1/events/all-events`, {
          signal: controller.signal
        });
        if (isMounted) {
          setIsServerDown(response.status === 503);
        }
      } catch (error) {
        if (isMounted && !axios.isCancel(error)) {
          setIsServerDown(false);
          console.error('Server status check error:', error);
        }
      }
    };
  
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000);
  
    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  if (isServerDown) {
    return <ServerDown />;
  }

  return (
    <main>
      <Suspense fallback={<div>Loading calendar...</div>}>
        <EventCalendar />
      </Suspense>
      <Header />
      <Hero />
      
      <Suspense fallback={<div>Loading featured event...</div>}>
        <FeaturedEvent />
      </Suspense>
      
      <Suspense fallback={<div>Loading latest event...</div>}>
        <LatestEvent />
      </Suspense>
      
      <Suspense fallback={<div>Loading all events...</div>}>
        <AllEvents />
      </Suspense>
      
      <Suspense fallback={<div>Loading trending events...</div>}>
        <Trending />
      </Suspense>
      
      <Suspense fallback={<div>Loading tutorial...</div>}>
        <Tutorial />
      </Suspense>
      
      <Footer />
    </main>
  );
}