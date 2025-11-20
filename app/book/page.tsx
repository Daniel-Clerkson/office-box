"use client";
import React, { useEffect, useState } from "react";
import WorkSpace1 from "../../assets/images/workspace/site-img (1).jpg";
import WorkSpace2 from "../../assets/images/workspace/site-img (2).jpg";
import WorkSpace3 from "../../assets/images/workspace/site-img (1).jpg";
import WorkSpace4 from "../../assets/images/workspace/site-img (8).jpg";
import WorkSpace5 from "../../assets/images/workspace/site-img (2).jpg"
import WorkSpace6 from "../../assets/images/workspace/site-img (6).jpg";
import WorkSpace7 from "../../assets/images/workspace/site-img (7).jpg";
import WorkSpace8 from "../../assets/images/workspace/site-img (8).jpg";
import BookingForm from "../../components/BookingForm";
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



const BookSpace = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds


    return () => clearInterval(interval);
  }, []);
  return (
    <>
      {/* <Header /> */}
      <div className="w-full h-full min-h-screen relative">
        <div className="w-full h-full">
          {images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt="Hero Carousel"
              className={`absolute h-full w-full bg-gray-200 duration-700 transition-opacity ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              } justify-self-center w-full h-full object-cover object-center`}
            />
          ))}
        </div>
        <div className="z-10 w-full h-full min-h-screen  backdrop-blur-md flex items-center justify-center">
          <div className="w-full max-w-2xl transform rounded-2xl px-2 py-6 text-left align-middle shadow-xl transition-all">
            <BookingForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default BookSpace;
