"use client"

import React, { useEffect, useState } from "react";
import WorkSpace1 from "../assets/images/workspace/site-img (1).jpg";
import WorkSpace2 from "../assets/images/workspace/site-img (2).jpg";
import WorkSpace3 from "../assets/images/workspace/site-img (3).jpg";
import WorkSpace4 from "../assets/images/workspace/site-img (4).jpg";
import WorkSpace5 from "../assets/images/workspace/site-img (5).jpg";
import WorkSpace6 from "../assets/images/workspace/site-img (6).jpg";
import WorkSpace7 from "../assets/images/workspace/site-img (7).jpg";
import WorkSpace8 from "../assets/images/workspace/site-img (8).jpg";
import Image from "next/image";

const images = [
  WorkSpace1,
  WorkSpace5,
  WorkSpace2,
  WorkSpace4,
  WorkSpace6,
  WorkSpace3,
  WorkSpace7,
  WorkSpace8,
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="hero__img justify-self-center relative w-full sm:h-[480] h-[400px]  z-10 flex-col lg:h-[580px] p-2 border-2 border-primary rounded-3xl flex xs:max-w-sm sm:max-w-lg lg:max-w-full">
      {images.map((image, index) => (
        <Image
          key={index}
          src={image}
          alt="Hero Carousel"
          className={`absolute h-full w-full bg-gray-200 duration-700 transition-opacity ${
            index === currentIndex
              ? "opacity-100 scale-100"
              : "opacity-0 scale-90"
          } hero__img justify-self-center w-full h-full object-cover object-center rounded-3xl`}
        />
      ))}
    </div>
  );
};

export default HeroCarousel;
