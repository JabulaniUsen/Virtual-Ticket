import Hero from "./components/home/Hero";
import Trending from "./components/home/Trending";
// import Mainheader from "./components/home/Mainheader";
import Footer from "./components/home/Footer";
// import { motion, AnimatePresence } from "framer-motion";
// import Newevent from "./components/home/Newevents";
import Header from "./components/home/Header";
import FeaturedEvent from "./components/home/FeaturedEvent";
import AllEvents from "./components/home/AllEvents";
import Pricing from "./components/home/Pricing";
import Tutorial from "./components/home/Tutorial";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <FeaturedEvent />
      <AllEvents />
      <Trending />
      <Pricing />
      <Tutorial />
      {/* <Newevent /> */}
      <Footer />
    </>
  );
}
