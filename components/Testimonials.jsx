// components/Testimonials.jsx
"use client";

import { useEffect } from "react";

const Testimonials = () => {
  useEffect(() => {
    // Load Elfsight script only on client
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    script.dataset.useServiceCore = ""; // recommended by Elfsight
    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="py-16 px-4 bg-gray-50" id="testimonials">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          What Our Customers Say
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Real reviews from real people
        </p>
      </div>

      <div 
        className="elfsight-app-6a705347-f6c3-49f6-b4b6-fedb5b5b0946" 
        data-elfsight-app-lazy
      ></div>
    </section>
  );
};

export default Testimonials;