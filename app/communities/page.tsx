"use client";
import Header from "../../components/Header";
import CommunityHero from "../../components/CommunityHero";
import Footer from "../../components/Footer";
import CommunityList from "../../components/CommunityList";
import ScrollUp from "../../components/ScrollUp";
import { useEffect } from "react";

const Community = () => {
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
        <CommunityHero />
        <CommunityList />
      </div>
      <Footer />
      <ScrollUp />
    </>
  );
};

export default Community;
