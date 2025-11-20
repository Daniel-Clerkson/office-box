"use client";

import { AiOutlineCheckCircle } from "react-icons/ai";
import { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ButtonGroup from "./ButtonGroup";
import Link from "next/link";
import { API_BASE_URL } from "@/utils/API";

// ──────────────────────────────────────────────────────────────
// Sub-Components
// ──────────────────────────────────────────────────────────────

const Plan = ({ title }) => {
  return (
    // Clean text and primary color icon for perks list
    <div className="flex items-center gap-3 text-gray-700">
      <AiOutlineCheckCircle className={`text-primary text-xl flex-shrink-0`} />
      <span className={`text-base font-medium text-gray-700`}>{title}</span>
    </div>
  );
};

const PricingCard = ({ plan, isSuggested }) => {
  // Styles for the main container
  const cardContainerClasses = `
    mx-2 md:mx-3 cursor-pointer p-0 transition-all duration-300 transform hover:scale-[1.02]
    rounded-xl overflow-hidden shadow-2xl border-2 border-transparent
    ${isSuggested ? 'border-primary' : 'hover:border-gray-300'}
  `;

  // Styles for the Price/Button section (The "split" bottom section)
  const priceSectionClasses = `
    p-8 ${isSuggested ? 'bg-primary' : 'bg-gray-100'}
  `;

  // Styles for the main info section
  const infoSectionClasses = 'p-8 pt-10 flex flex-col gap-6 bg-white';

  const buttonClasses = `
    w-full capitalize md:text-lg font-bold cursor-pointer text-sm py-3 px-6 rounded-lg transition-colors
    ${isSuggested 
      ? 'bg-white text-primary hover:bg-gray-200' 
      : 'bg-primary text-white hover:bg-indigo-700'
    }
  `;

  const priceTextClasses = isSuggested ? 'text-white' : 'text-gray-900';
  const unitTextClasses = isSuggested ? 'text-indigo-200' : 'text-neutral-400';

  return (
    <div className={cardContainerClasses}>
      {/* 1. TOP SECTION (Info & Perks) */}
      <div className={infoSectionClasses}>
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-extrabold capitalize text-gray-800">
            {plan.name}
          </h2>
          <span className="text-base text-gray-500">{plan.description}</span>
        </div>
        
        <div className="flex flex-col gap-4 min-h-[150px]"> 
          {plan.perks?.map((perk, index) => (
            <Plan key={index} title={perk} /> 
          ))}
        </div>
      </div>
      
      {/* 2. BOTTOM SECTION (Price & Action) - The colored split */}
      <div className={priceSectionClasses}>
        <div className="text-center mb-6">
          <div className="text-5xl font-extrabold leading-none flex items-baseline justify-center">
            <span className={`font-extrabold ${priceTextClasses}`}>
              ₦{plan.price.toLocaleString()}
            </span>
            <span className={`text-xl ml-2 font-normal ${unitTextClasses}`}>
              /Daily
            </span>
          </div>
        </div>
        
        <Link href="/book" className="w-full">
          <button className={buttonClasses}>
            Start Now
          </button>
        </Link>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────

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
      
      const response = await fetch(`${API_BASE_URL}/plans`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      
      const rawData = await response.json();

      let plansList = [];
      if (Array.isArray(rawData)) {
          plansList = rawData;
      } else if (rawData?.plans && Array.isArray(rawData.plans)) {
          plansList = rawData.plans;
      } else if (rawData?.data && Array.isArray(rawData.data)) {
          plansList = rawData.data;
      }
      
      setPlans(plansList);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative section container h-full mx-auto px-4 xl:px-16 flex flex-col gap-12 pt-20 pb-28 bg-white" 
      id="pricing"
    >
      <div className="text-center">
        <span className="service-name text-center text-primary font-semibold uppercase tracking-widest text-sm">PRICING PLAN</span>
        <h2 className="section-title text-center text-4xl sm:text-5xl font-extrabold text-gray-900 mt-2">
          Choose your pricing policy
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary border-t-4"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-red-500 font-medium text-lg">⚠️ Error loading plans: {error}</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-neutral-400 text-lg">😔 No plans available at this time.</p>
        </div>
      ) : (
        <Carousel {...carouselParams}>
          {plans.map((plan, index) => {
            // Suggest 2nd card only for a cleaner emphasis
            const isSuggested = index === 1; 

            return (
              <div key={plan._id || index} className="relative py-4">
                {isSuggested && (
                  <span className="absolute -top-0 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-gray-900 font-bold px-4 py-1 rounded-full shadow-lg z-10 text-xs tracking-wider uppercase">
                    Most Popular
                  </span>
                )}
                <PricingCard plan={plan} isSuggested={isSuggested} />
              </div>
            );
          })}
        </Carousel>
      )}
    </section>
  );
};

export default Pricing;

// ──────────────────────────────────────────────────────────────
// Carousel Configuration 
// ──────────────────────────────────────────────────────────────

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