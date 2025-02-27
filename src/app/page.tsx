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

export default function Home() {


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
