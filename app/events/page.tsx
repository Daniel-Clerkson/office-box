"use client"
import Header from "../../components/Header";
import EventHero from "../../components/EventHero";
import EventList from "../../components/EventList";
import Footer from "../../components/Footer";
import ScrollUp from "../../components/ScrollUp";
import { useEffect } from "react";

const Event = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white w-full">
        <EventHero />
        <EventList />
      </div>
      <Footer />
      <ScrollUp />
    </>
  );
};

export default Event;
