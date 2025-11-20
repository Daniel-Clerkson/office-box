"use client";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Contact from "../../components/Contact";
import ScrollUp from "../../components/ScrollUp";
import { useEffect } from "react";
const Contacts = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <>
      <Header />
      <div className="transition-all duration-300">
        <div className=" min-h-screen section">
          <Contact />
        </div>
      </div>
      <ScrollUp />
      <Footer />
    </>
  );
};

export default Contacts;
