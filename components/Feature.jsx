"use client"
import { RiCheckboxCircleLine } from "react-icons/ri";
import CoWorkingCarousel from "./CoWorkCarousel";
import Link from "next/link";
const Feature = () => {
  return (
    <section className="feature section transition-all duration-300">
      <div className="feature__container container grid gap-12 lg:grid-cols-2 lg:items-center xl:max-w-5xl">
        <div className="feature__data justify-self-center text-center xs:max-w-sm sm:max-w-md lg:order-2 lg:max-w-full lg:text-left">
          <h1 className="feature__title section-title font-bold">
            Explore Our Co-working Spaces.
          </h1>
          <p className="feature__text section-text text-sm">
            Reserve your place among a community of entrepreneurs primed for
            connections, collaboration, and growth. Enjoy the use of
            complimentary co-working stations, host business meetings in our
            business rooms, and organize industry-specific events with free
            Wi-Fi, Identify core software developers to help you build your
            product to life, all from one place.
          </p>
          <ul className="feature__list flex flex-col gap-4 pb-8">
            <li className="feature__item inline-flex items-center justify-start gap-2 text-[15px] text-gray-600 ">
              <RiCheckboxCircleLine className="text-[1.3rem] text-secondary" />
              Find peace and comfort.
            </li>
            <li className="feature__item inline-flex items-center justify-start gap-2 text-[15px] text-gray-600 ">
              <RiCheckboxCircleLine className="text-[1.3rem] text-secondary" />
              Plenty of workspace.
            </li>
          </ul>
          <Link href="/book-a-space">
            <button className="lg:inline-flex flex h-[52px] items-center justify-center rounded-xl w-full md:w-fit  bg-primary hover:bg-secondary  py-4 px-8 font-sans text-[15px] font-semibold capitalize text-white">
              Book a Space
            </button>
          </Link>
        </div>

        <CoWorkingCarousel />
      </div>
    </section>
  );
};

export default Feature;
