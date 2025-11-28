// components/Pricing.jsx   (or app/pricing/Pricing.jsx)
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { API_BASE_URL } from "@/utils/API";

// Dynamically load carousel only on the client → fixes hydration error 100%
const Carousel = dynamic(
  () => import("react-multi-carousel").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <PricingSkeleton />,
  }
);

import "react-multi-carousel/lib/styles.css";

// Nice loading skeleton (shows while fetching data or loading carousel)
const PricingSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-16">
    <div className="text-center mb-12">
      <div className="h-10 bg-gray-300 rounded-lg w-80 mx-auto mb-4 animate-pulse"></div>
      <div className="h-6 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-4 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t">
            <div className="h-12 bg-gray-300 rounded-xl mt-6"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Single pricing card
const PricingCard = ({ plan }) => {
  return (
    <div className="mx-auto max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
        <p className="mt-3 text-gray-600">{plan.description}</p>
      </div>

      <div className="px-8 flex-1">
        <ul className="space-y-4">
          {plan.perks?.map((perk, index) => (
            <li key={index} className="flex items-start gap-3">
              <AiOutlineCheckCircle className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-gray-700">{perk}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-8 bg-gray-50 border-t border-gray-200">
        <div className="text-center">
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">
              ₦{plan.price.toLocaleString()}
            </span>
            <span className="text-gray-600"> /Daily</span>
          </div>

          <Link href="/book" className="block">
            <button className="w-full py-4 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition transform hover:scale-105 shadow-lg">
              Start Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Main component
const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/plans`);
        if (!res.ok) throw new Error("Failed to fetch plans");

        const data = await res.json();
        const plansList = Array.isArray(data)
          ? data
          : data?.plans || data?.data || [];

        setPlans(plansList);
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 3000, min: 1600 }, items: 4 },
    desktop: { breakpoint: { max: 1600, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
  };

  // Show skeleton while loading
  if (loading) {
    return <PricingSkeleton />;
  }

  if (plans.length === 0) {
    return (
      <section className="py-20 text-center">
        <p className="text-gray-500 text-lg">No plans available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gray-50" id="pricing">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900">Choose Your Plan</h2>
        <p className="mt-4 text-lg text-gray-600">
          Simple, transparent pricing — perfect for any budget
        </p>
      </div>

      <Carousel
        responsive={responsive}
        swipeable={true}
        draggable={true}
        showDots={true}
        infinite={plans.length > 3}
        autoPlay={false}
        keyBoardControl={true}
        removeArrowOnDeviceType={["tablet", "mobile"]}
        itemClass="px-4 pb-12" // space for dots + horizontal padding
        containerClass="pb-8"
      >
        {plans.map((plan) => (
          <PricingCard key={plan._id} plan={plan} />
        ))}
      </Carousel>
    </section>
  );
};

export default Pricing;