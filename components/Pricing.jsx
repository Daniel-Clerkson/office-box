"use client";

import { AiOutlineCheckCircle } from "react-icons/ai";
import { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ButtonGroup from "./ButtonGroup";
import Link from "next/link";
import { API_BASE_URL } from "@/utils/API";

const Plan = ({ title }) => {
  return (
    <div className="flex items-center gap-2 text-black">
      <AiOutlineCheckCircle className="text-primary text-xl" />
      <span className="text-xs">{title}</span>
    </div>
  );
};

const PricingCard = ({ plan }) => {
  return (
    <div className="mx-2 md:mx-3 cursor-pointer p-10 transition-all hover:shadow-lg flex flex-col gap-8 rounded-3xl border-neutral-200 border">
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold capitalize text-black">
          {plan.name}
        </h2>
        <span className="text-neutral-400 text-sm">{plan.description}</span>
      </div>
      
      <div className="flex flex-col gap-5">
        {plan.perks?.map((perk, index) => (
          <Plan key={index} title={perk} />
        ))}
      </div>
      
      <div className="mx-auto">
        <div className="text-3xl text-center font-dm leading-none flex items-center pb-4 mb-4">
          <span className="font-medium text-black">
            ₦{plan.price.toLocaleString()}
          </span>
          <span className="text-lg ml-1 font-normal text-neutral-400">
            /Daily
          </span>
        </div>
        
        <Link href="/book" className="w-full">
          <button className="w-full capitalize md:text-base text-sm hover:bg-primary hover:shadow-md hover:shadow-primary hover:border-2 border-2 border-transparent py-3 px-6 text-white bg-primary hover:border-primary hover:text-white rounded-full">
            Start Now
          </button>
        </Link>
        
        <span className="w-full justify-center items-center flex text-primary mt-5 font-semibold animate-bounce cursor-pointer">
          Try it out
        </span>
      </div>
    </div>
  );
};

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Replace API_BASE_URL with your actual base URL
      const response = await fetch(`${API_BASE_URL}/plans`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      
      const data = await response.json();
      setPlans(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative section container h-full mx-auto px-0 xl:px-16 flex flex-col gap-5"
      id="pricing"
    >
      <div>
        <span className="service-name text-center">PRICING PLAN</span>
        <h2 className="section-title text-center text-black">
          Choose your pricing policy
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-red-500">Error loading plans: {error}</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-neutral-400">No plans available</p>
        </div>
      ) : (
        <Carousel {...carouselParams}>
          {plans.map((plan, index) => (
            <div key={plan._id} className="relative">
              {/* Show "Suggested" badge on 2nd and 3rd items */}
              {(index === 1 || index === 2) && (
                <span className="absolute -top-1 left-10 bg-primary text-white px-2 py-1 rounded-md z-10">
                  Suggested
                </span>
              )}
              <PricingCard plan={plan} />
            </div>
          ))}
        </Carousel>
      )}
    </section>
  );
};

export default Pricing;

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
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const carouselParams = {
  additionalTransfrom: 0,
  arrows: false,
  autoPLaySpeed: 3000,
  centerMode: false,
  className: "",
  containerClass: "carousel-container",
  customButtonGroup: <ButtonGroup />,
  dotListClass: "",
  draggable: true,
  focusOnSelect: false,
  infinite: true,
  itemClass: "",
  keyBoardControl: true,
  minimumTouchDrag: 80,
  renderButtonGroupOutside: true,
  renderDotsOutside: false,
  responsive: responsive,
  showDots: false,
  sliderClass: "",
  slidesToSlide: 1,
};
