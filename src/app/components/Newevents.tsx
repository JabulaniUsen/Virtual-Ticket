"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";

const trendingevent = [
  {
    title: "Owl Fest",
    imageurl: "/image.png",
    location: "New York",
    id: "",
    eventtype: "CONCERT",
  },
  {
    title: "Homeless Live Experience",
    imageurl: "/image-1.png",
    location: "Terra Kulture, Tiamiyu Savage Street,",
    id: "",
    eventtype: "BEACH PARTY",
  },
  {
    title: "Love in the boulevard",
    imageurl: "/image-2.png",
    location: "New York",
    id: "",
    eventtype: "LISTENING PARTY",
  },
  {
    title: "YOLO Beach Daycation",
    imageurl: "/image-4.png",
    location: "New York",
    id: "",
    eventtype: "CONCERT",
  },
];

function Newevent() {
  return (
    <div className=" bg-primary flex flex-col gap-6 items-center ">
      <h2 className="flex flex-col w-fit text-center items-center text-white/90 text-2xl font-bold">
        New Events <br />{" "}
        <hr className="w-1/2 border-2 border-orange-700 " />
      </h2>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-10">
        {trendingevent.map((item, index) => (
          <Card key={index} sx={{ width: 256, background: "transparent" }}>
            <CardMedia
              sx={{ height: 256 }}
              image={item.imageurl}
              title="green iguana"
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                className="text-white w-full"
                component="div"
              >
                {item.title}
              </Typography>
              <Button className="text-white" size="small">
                {item.eventtype}
              </Button>
              <Typography
                className="text-white"
                variant="body2"
                sx={{ color: "text.secondary" }}
              >
                {item.location}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Newevent;
