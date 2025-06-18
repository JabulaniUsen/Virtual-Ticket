'use client';
import { Suspense, lazy } from "react";
import Hero from "./components/home/Hero";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import ServerDown from "./503/page";
import { useServerStatus } from "@/hooks/useEvents";
import QueryProvider from "@/providers/QueryProvider";
import { CardSkeleton } from "@/components/ui/Skeleton";

// Lazy load heavy components
const EventCalendar = lazy(() => import('@/components/Calendar/EventCalendar'));
const LatestEvent = lazy(() => import("./components/home/LatestEvent"));
const AllEvents = lazy(() => import("./components/home/AllEvents"));
const Trending = lazy(() => import("./components/home/Trending"));
const Tutorial = lazy(() => import("./components/home/Tutorial"));

export default function Home() {
  const isServerDown = useServerStatus();

  if (isServerDown) {
    return <ServerDown />;
  }

  return (
    <QueryProvider>
      <main>
        <Suspense fallback={<CardSkeleton />}>
          <EventCalendar />
        </Suspense>
        <Header />
        <Hero />
        
        <Suspense fallback={<CardSkeleton />}>
          <LatestEvent />
        </Suspense>
        
        <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
        </div>}>
          <AllEvents />
        </Suspense>
        
        <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
        </div>}>
          <Trending />
        </Suspense>
        
        <Suspense fallback={<CardSkeleton />}>
          <Tutorial />
        </Suspense>
        
        <Footer />
      </main>
    </QueryProvider>
  );
}