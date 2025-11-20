import React from "react";

import Button from "./Button";

import Icon from "../assets/images/OfficeBOX-icon.png";
import Arrow from "../assets/images/animated/arrow-hand.svg";
import Spark from "../assets/images/animated/snow,.svg";
import HeroSponsored1 from "../assets/images/stemlab.png";
import HeroSponsored2 from "../assets/images/hero-sponsored-(2).svg";
import HeroSponsored3 from "../assets/images/kudinka.png";
import HeroCarousel from "./HeroCarousel";
import AutoTypingEffect from "./AutoTypingEffect";
import Image from "next/image";

export default function Hero() {
  const words = ["People", "Community", "Investors", "Productivity"];
  const typingSpeed = 100;
  return (
    <>
      <section className="hero section font-dm relative transition-all duration-300 text-white xl:pt-40">
        <div className="hero__container container grid gap-12 lg:grid-cols-2 lg:items-center xl:max-w-5xl">
          <div className="hero__data grid gap-8 justify-self-center text-center xs:max-w-sm sm:max-w-lg lg:max-w-full lg:text-left">
            <div>
              <h1 className="hero__title section-title xl:text-[50px] font-black capitalize ">
                Where Collaboration Meets{" "}
                <AutoTypingEffect words={words} typingSpeed={typingSpeed} />
              </h1>
              <p className="hero__text section-text pb-0 xl:max-w-md">
                Welcome to OfficeBox, the leading destination for co-working,
                software development, and tech innovation in Nigeria. We go
                beyond being a traditional workspace – we are a dynamic platform
                that encourages collaboration, creativity, and connectivity
              </p>
            </div>

            <form
              action=""
              className="hero__from flex flex-col gap-4 md:flex-row xl:max-w-md"
            >
              <input
                type="email"
                placeholder="Enter email address"
                className="hero__from-input h-[52px] w-full rounded-lg border border-gray-300 px-4 text-center font-semibold text-gray-900 outline-none transition-all duration-300 placeholder:text-[15px] placeholder:font-normal placeholder:text-gray-600 dark:border-none  md:text-left"
              />
              <Button url="/" className="hero__from-button">
                Subscribe
              </Button>
            </form>

            <div className="hero__sponsored inline-flex items-center justify-center gap-3 lg:justify-start">
              <p className="hero__sponsored-text text-[12px] text-gray-600">
                Trusted by:
              </p>

              <div className="hero__sponsored-list inline-flex items-center gap-2">
                <Image
                  src={HeroSponsored1}
                  alt="hero sponsored"
                  className="hero__sponsored-icon w-18"
                />
                <Image
                  src={HeroSponsored3}
                  alt="hero sponsored"
                  className="hero__sponsored-icon w-12"
                />
                <Image
                  src={HeroSponsored2}
                  alt="hero sponsored"
                  className="hero__sponsored-icon w-14"
                />
              </div>
            </div>
          </div>

          <HeroCarousel />

          <div className="hidden xl:block">
            <div className=" absolute bottom-5 opacity-30 hidden xl:block right-10">
              <Image
                src={Icon}
                alt="hero Image"
                className="hero__Image justify-self-center w-72 h-72 bg-cover bg-center rounded-3xl"
              />
            </div>
            <Image
              src={Arrow}
              alt="hero Image"
              className="absolute bottom-8 left-144 -rotate-12 elem-move w-28 -z-1"
            />
            <Image
              src={Spark}
              alt="hero Image"
              className="absolute top-24 elem-zoom right-28 w-28"
            />
          </div>
        </div>
      </section>
    </>
  );
}
