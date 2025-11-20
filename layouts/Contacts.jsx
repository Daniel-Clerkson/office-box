import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Contact from "../components/Contact";
import ScrollUp from "../components/ScrollUp";

const Contacts = () => {
  window.scrollTo({
    top: "0",
    behavior: "smooth",
  });
  return (
    <>
      <Header />
      <div className="transition-all duration-300 dark:bg-gray-900">
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
