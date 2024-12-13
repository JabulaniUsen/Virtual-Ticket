import Hero from "./components/Hero";
import Trending from "./components/Trending";
import Mainheader from "./components/Mainheader";
import Mainfooter from "./components/Mainfooter";
import Newevent from "./components/Newevents";
export default function Home() {
  return (
    <>
      <Mainheader />
      <Hero />
      <Trending />
      <Newevent />
      <Mainfooter />
    </>
  );
}
