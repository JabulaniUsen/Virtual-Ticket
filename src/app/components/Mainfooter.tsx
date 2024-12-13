import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaArrowRight,
} from "react-icons/fa6";

function Mainfooter() {
  return (
    <footer className=" bg-primary  px-24 pt-8 w-full flex flex-row justify-between items-start ">
      <div className=" flex flex-row justify-between w-full  ">
        <div className=" flex flex-col items-start justify-start w-fit ">
          <h3 className=" text-white text-xl font-bold mb-6 ">Content</h3>
          <Link href={"/"} className="text-white text-sm w-fit">
            Trending events
          </Link>
          <Link href={"/"} className="text-white text-sm w-fit">
            Sponsored events
          </Link>
          <Link href={"/"} className="text-white text-sm w-fit">
            Featured event
          </Link>{" "}
          <Link href={"/"} className="text-white text-sm w-fit">
            Join V-tix mail
          </Link>
        </div>
        <div className=" flex flex-col items-start justify-start w-fit ">
          <h3 className=" text-white text-xl font-bold mb-6 ">Our Company</h3>
          <Link href={"/"} className="text-white text-sm w-fit">
            About us
          </Link>
          <Link href={"/"} className="text-white text-sm w-fit">
            Contact us
          </Link>
          <Link href={"/"} className="text-white text-sm w-fit">
            Support
          </Link>
          <Link href={"/"} className="text-white text-sm w-fit">
            FAQ
          </Link>
        </div>
        <div className=" flex flex-col items-start justify-start w-fit ">
          <h3 className=" text-white text-xl font-bold mb-6 ">Services</h3>
          <Link href={"/"} className="text-white text-sm w-fit">
            Host event
          </Link>
          <Link href={"/"} className="text-white text-sm w-fit">
            Terms & Conditions
          </Link>
          <Link href={"/"} className="text-white text-sm w-fit">
            Privacy Policy
          </Link>
          <Link href={"/"} className="text-white text-sm w-fit">
            Report an event
          </Link>
        </div>
      </div>
      <div className="flex flex-col p-6 w-fit h-fit bg-orange-800 rounded-xl justify-start items-start gap-4">
        <h3 className="text-white text-lg font-normal">Subscribe</h3>
        <form action="">
          <input
            className="w-80 h-10 px-4 py-2 bg-white/70 rounded-md text-black/50 text-xs font-normal"
            type="text"
            name="name"
            id="name"
          />
          <div className="w-80 flex flex-row items-center justify-center  ">
            <input
              className=" h-10 px-4 w-full py-2 bg-white/70 rounded-l-md  text-black/50 text-xs font-normal"
              type="email"
              name="email"
              id="email"
            />
            <button
              className=" rounded-r-md h-full p-2 bg-orange-600 hover:bg-orange-900 "
              type="submit"
            >
              <FaArrowRight className=" fill-white stroke-white w-6 h-6 " />
            </button>
          </div>
        </form>
        <p className="text-white text-sm font-normal">
          Want to be the first to know about new <br /> events 💃🏾, exclusive
          offers and possible <br /> discounts? Subscribe to our newsletter
        </p>
      </div>
      <hr />
      <div className="flex flex-row justify-between ">
        <div className="w-fit">
          <Image src={"/logo.png"} width={100} height={100} alt="Logo" />
        </div>
        <div className="flex flex-row gap-1 justify-center w-fit">
          <Link href={"/"}>Home</Link>
          <Link href={"/"}>Terms</Link>
          <Link href={"/"}>Privacy</Link>
        </div>
        <div className=" flex gap-2 flex-row justify-center w-fit">
          <div className="w-auto h-auto rounded-full border border-white/50">
            <FaInstagram className="fill-white w-4 h-4 " />
          </div>
          <div className="w-auto h-auto rounded-full border border-white/50">
            <FaFacebookF className="fill-white w-4 h-4 " />
          </div>
          <div className="w-auto h-auto rounded-full border border-white/50">
            <FaTwitter className="fill-white w-4 h-4 " />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Mainfooter;
