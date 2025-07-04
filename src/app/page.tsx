'use client';
import { Suspense } from "react";
import Hero from "./components/home/Hero";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import ServerDown from "./503/page";
import { useServerStatus } from "@/hooks/useEvents";
import { CardSkeleton } from "@/components/ui/Skeleton";
import dynamic from "next/dynamic";


const EventCalendar = dynamic(() => import('@/components/Calendar/EventCalendar'), {
  loading: () => <CardSkeleton />,
  ssr: false
});

const LatestEvent = dynamic(() => import("./components/home/LatestEvent"), {
  loading: () => <CardSkeleton />,
  ssr: false
});

const AllEvents = dynamic(() => import("./components/home/AllEvents"), {
  loading: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
    </div>
  ),
  ssr: false
});

const Trending = dynamic(() => import("./components/home/Trending"), {
  loading: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
    </div>
  ),
  ssr: false
});

const Tutorial = dynamic(() => import("./components/home/Tutorial"), {
  loading: () => <CardSkeleton />,
  ssr: false
});

export default function Home() {
  const isServerDown = useServerStatus();

  if (isServerDown) {
    return <ServerDown />;
  }

  return (
    <main>
      <Header />
      <Hero />
      
      <Suspense fallback={<CardSkeleton />}>
        <EventCalendar />
        <LatestEvent />
        <AllEvents />
        <Trending />
        <Tutorial />
      </Suspense>
      
      <Footer />
    </main>
  );
}