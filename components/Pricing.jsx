"use client";

import { AiOutlineCheckCircle } from "react-icons/ai";
import { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ButtonGroup from "./ButtonGroup";
import Link from "next/link";
import { API_BASE_URL } from "@/utils/API";

const PricingCard = ({ plan }) => {
  return (
    <div className="mx-4 my-8 bg-white rounded-2xl shadow-2xl border-1 border-gray-400">
      {/* Top: Name & Description */}
      <div className="p-8 ">
        <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
        <p className="mt-3 text-gray-600">{plan.description}</p>
      </div>

      {/* Middle: Perks */}
      <div className="p-8">
        <ul className="space-y-4">
          {plan.perks?.map((perk, index) => (
            <li key={index} className="flex items-start gap-3">
              <AiOutlineCheckCircle className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <span className="text-gray-700">{perk}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom: Price & Button */}
      <div className="p-8 bg-gray-50 rounded-2xl border-t border-gray-100">
        <div className="text-center">
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">
              ₦{plan.price.toLocaleString()}
            </span>
            <span className="text-gray-600"> /Daily</span>
          </div>

          <Link href="/book" className="block">
            <button className="w-full py-3 px-6 bg-primary hover:scale-105 cursor-pointer rounded-2xl border border-gray-300 text-gray-800 font-medium hover:bg-gray-100 transition">
              Start Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/plans`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();

        const plansList = Array.isArray(data)
          ? data
          : data?.plans || data?.data || [];

        setPlans(plansList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <section className="py-20 text-center">
        <p className="text-gray-500">Loading plans...</p>
      </section>
    );
  }

  if (plans.length === 0) {
    return (
      <section className="py-20 text-center">
        <p className="text-gray-500">No plans available.</p>
      </section>
    );
  }

  return (
    <section className="py-16 px-4" id="pricing">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
        <p className="mt-4 text-gray-600">
          Simple and transparent pricing for everyone
        </p>
      </div>

      <Carousel
        responsive={responsive}
        arrows={false}
        customButtonGroup={<ButtonGroup />}
        renderButtonGroupOutside={true}
        infinite={true}
        draggable={true}
        showDots={false}
      >
        {plans.map((plan) => (
          <div key={plan._id} className="px-4">
            <PricingCard plan={plan} />
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default Pricing;

// Minimal responsive settings
const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};
