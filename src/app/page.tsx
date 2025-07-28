'use client';
import { Suspense, lazy } from "react";
import Hero from "./components/home/Hero";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import ServerDown from "./503/page";
import { useServerStatus } from "@/hooks/useEvents";
import { CardSkeleton } from "@/components/ui/Skeleton";
import PartnerCarousel from "@/components/ui/PartnerCarousel";

// Use lazy loading instead of dynamic for better performance
const EventCalendar = lazy(() => import('@/components/Calendar/EventCalendar'));
const LatestEvent = lazy(() => import("./components/home/LatestEvent"));
const AllEvents = lazy(() => import("./components/home/AllEvents"));
const Trending = lazy(() => import("./components/home/Trending"));
const Tutorial = lazy(() => import("./components/home/Tutorial"));

// Reusable skeleton component
const GridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}
  </div>
);

export default function Home() {
  const isServerDown = useServerStatus();

  if (isServerDown) {
    return <ServerDown />;
  }

  return (
    <main className="overflow-x-hidden">
      <Header />
      <Hero />
      
      {/* Separate Suspense boundaries for better component loading */}
      <Suspense fallback={<CardSkeleton />}>
        <EventCalendar />
      </Suspense>
      
      <Suspense fallback={<CardSkeleton />}>
        <LatestEvent />
      </Suspense>
      
      <Suspense fallback={<GridSkeleton />}>
        <AllEvents />
      </Suspense>
      
      <Suspense fallback={<GridSkeleton />}>
        <Trending />
      </Suspense>
      
      <Suspense fallback={<CardSkeleton />}>
        <PartnerCarousel />
      </Suspense>
      
      <Suspense fallback={<CardSkeleton />}>
        <Tutorial />
      </Suspense>
      
      <Footer />
    </main>
  );
}
