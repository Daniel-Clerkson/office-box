"use client"

import React, { useEffect, useState } from "react";
import WorkSpace5 from "../assets/images/workspace/site-img (6).jpg";
import WorkSpace6 from "../assets/images/workspace/site-img (6).jpg";
import WorkSpace7 from "../assets/images/workspace/site-img (7).jpg";
import WorkSpace8 from "../assets/images/workspace/site-img (8).jpg";
import Image from "next/image";

const images = [
  WorkSpace6,
  WorkSpace8,
  WorkSpace7,
  WorkSpace5,
];

const CoWorkingCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="hero__img justify-self-center relative w-full sm:h-[380] h-[400px]  z-10 flex-col lg:h-[400px] p-2 border-2 border-primary rounded-3xl flex xs:max-w-sm sm:max-w-lg lg:max-w-full">
      {images.map((image, index) => (
        <Image
          key={index}
          src={image}
          alt="Hero Carousel"
          className={`absolute h-full w-full duration-700 transition-opacity ${
            index === currentIndex
              ? "opacity-100 scale-100"
              : "opacity-0 scale-90"
          } hero__img justify-self-center w-full h-full object-cover object-center rounded-3xl`}
        />
      ))}
    </div>
  );
};

export default CoWorkingCarousel;
