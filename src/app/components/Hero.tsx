import Image from "next/image";
import React from "react";

function Hero() {
  return (
    <div className="flex bg-primary flex-col sm:flex-row p-4">
      <div className="w-fit flex flex-col gap-5 items-center  ">
        <h1 className=" text-lg sm:text-2xl md:text-5xl text-orange-500 max-w-xl ">
          FINDING & ATTENDING EVENTS HAS NEVER BEEN EASIER{" "}
        </h1>
        <p className="max-w-xl text-white/90  text-base sm:text-2xl ">
          A platform for you to discover, share and promote your events, Sell
          your tickets here!
        </p>
        <div className="w-full flex flex-row gap-5 items-start">
          <button className="h-12 w-full rounded items-center justify-center text-lg font-semibold text-black bg-white ">
            Learn More
          </button>
          <button className="h-12 w-full text-white rounded items-center justify-center text-lg font-semibold bg-gradient-to-r from-[#ff5604] to-[#fcaa00] ">
            Create Event
          </button>
        </div>
      </div>
      <Image src={"/logo.png"} width={100} height={100} alt="Hero Image" />
    </div>
  );
}

export default Hero;
