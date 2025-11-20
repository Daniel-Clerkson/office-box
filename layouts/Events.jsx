import React from "react";
import Header from "../components/Header";
import EventHero from "../components/EventHero";
import EventList from "../components/EventList";
import Footer from "../components/Footer";
import ScrollUp from "../components/ScrollUp";

const Event = () => {
  window.scrollTo({
    top: "0",
    behavior: "smooth",
  });
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-gray-900 w-full">
        <EventHero />
        <EventList />
      </div>
      <Footer />
      <ScrollUp />
    </>
  );
};

export default Event;
