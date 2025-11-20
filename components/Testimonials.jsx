"use client";

import { FaStar, FaStarHalf } from "react-icons/fa";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
// import ButtonGroup from "./ButtonGroup"; // Removed import
import Image from "next/image";

const Card = ({ star, title, imgSrc, testimony, name, occupation }) => {
  return (
    <div className="mx-2 font-dm flex flex-col gap-2 select-none text-black dark:text-white border border-[#4e4e4e31] p-5 rounded-lg hover:shadow-xl transition-all">
      <div className="text-primary flex gap-1">
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        {star}
      </div>
      {/* <h2 className="text-lg font-semibold mb-2">{title}</h2> */}
      <p className="leading-loose text-gray-900 text-xs">{testimony}</p>
      <div className="flex items-center gap-2 mt-2">
        <Image
          className=" rounded-lg w-14 aspect-square object-cover object-top"
          src={imgSrc}
          width={40}
          height={40}
          alt="testimonials"
        />
        <div className="flex flex-col gap-px">
          <h3 className="font-semibold text-gray-900 text-sm">{name}</h3>
          <p className="text-primary font-medium text-xs">{occupation}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <>
    
      <script src="https://elfsightcdn.com/platform.js" async></script>
      <div className="elfsight-app-6a705347-f6c3-49f6-b4b6-fedb5b5b0946" data-elfsight-app-lazy suppressHydrationWarning></div>
    </>
  );
};

export default Testimonials;

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const carouselParams = {
  additionalTransfrom: 0,
  arrows: true, // Changed from false to true to show built-in arrows
  autoPLaySpeed: 100,
  centerMode: false,
  className: "",
  containerClass: "carousel-container",
  // customButtonGroup: <ButtonGroup />, // Removed custom button group
  dotListClass: "",
  draggable: true,
  focusOnSelect: false,
  infinite: true,
  itemClass: "",
  keyBoardControl: true,
  minimumTouchDrag: 80,
  renderButtonGroupOutside: false, // Changed to false as the custom button group is removed
  renderDotsOutside: false,
  responsive: responsive,
  showDots: false,
  sliderClass: "",
  slidesToSlide: 1,
};