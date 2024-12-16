import Image from "next/image";
import React from "react";

function Hero() {
  return (
    <div className="flex flex-col items-center justify-between sm:flex-row p-12 bg-primary transition-all duration-300 ease-in-out">
      <div className="w-fit flex flex-col gap-5 items-center text-center sm:text-left">
        <h1 className="text-lg sm:text-2xl md:text-5xl text-orange-500 max-w-xl transition-transform transform hover:scale-105">
          FINDING & ATTENDING EVENTS HAS NEVER BEEN EASIER
        </h1>
        <p className="max-w-xl text-white/90 text-base sm:text-2xl">
          A platform for you to discover, share and promote your events, Sell
          your tickets here!
        </p>
        <div className="w-full flex flex-row gap-5 items-start mt-5 sm:mt-0">
          <button className="h-12 w-full rounded text-lg font-semibold text-black bg-white transition-transform transform hover:scale-105">
            Learn More
          </button>
          <button className="h-12 w-full text-white rounded text-lg font-semibold bg-gradient-to-r from-[#ff5604] to-[#fcaa00] transition-transform transform hover:scale-105">
            Create Event
          </button>
        </div>
      </div>
      <Image
        src={"/hero.png"}
        width={665}
        height={588}
        alt="Hero Image"
        className="transition-opacity duration-300 ease-in-out hover:opacity-90"
      />
    </div>
  );
}

export default Hero;
