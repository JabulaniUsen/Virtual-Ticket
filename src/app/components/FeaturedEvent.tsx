import Image from "next/image";
import React from "react";
import { FaTicket } from "react-icons/fa6";

const event = {
  title: "Sample Event",
  description: "An amazing event.",
  date: "2024-12-01",
  location: "New York",
  imgurl: "/image.png",
  eventtype: "LISTENING PARTY",
  ticketTypes: [
    { name: "Basic", price: 50 },
    { name: "VIP", price: 100 },
  ],
};

function FeaturedEvent() {
  return (
    <div className="flex flex-col gap-6 items-end">
      <h2 className=" capitalize text-purple-600 border-r-2 border-purple-600 ">
        Featured event
      </h2>
      <div>
        <Image src={event.imgurl} height={300} width={300} alt={event.title} />
        <div>
          <div>
            <h3>{event.title}</h3>
            <p>{event.date}</p>
            <button>{event.eventtype}</button>
          </div>
          <div>
            <p>{event.location}</p>
            <p>
              <FaTicket />
              NGN 10,000
            </p>
            <p>
              the homeless experience brings you live music centered around a
              theme of social
            </p>
          </div>
          <button>Attend Event</button>
        </div>
      </div>
    </div>
  );
}

export default FeaturedEvent;
