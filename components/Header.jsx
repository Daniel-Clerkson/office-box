"use client";

import { useEffect, useState } from "react";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import Logo from "./Logo";
import Link from "next/link";

const Header = () => {
  // === header toggle ===
  const [menuOpen, setMenuOpen] = useState(false);

  const setHandleMenu = () => {
    setMenuOpen((even) => !even);
  };

  // === add header shadow when scrolling ===
  const [headerShadow, setHeaderShadow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const addHeaderShadow = () => {
        window.scrollY >= 100 ? setHeaderShadow(true) : setHeaderShadow(false);
      };
      window.addEventListener("scroll", addHeaderShadow);

      return () => {
        window.removeEventListener("scroll", addHeaderShadow);
      };
    }
  }, []);

  return (
    <>
      <header
        className={`header fixed top-0 left-0 z-20 w-full font-dm bg-white transition-all duration-300 ${
          headerShadow ? "shadow-md" : "shadow-none"
        }`}
      >
        <div className="header__container container flex h-24 items-center justify-between">
          <Link
            href="/"
            className="header__link inline-flex items-center font-serif text-[20px] text-gray-900"
          >
            <Logo />
          </Link>

          <div
            className={`header__menu fixed top-24 left-0 w-full origin-top bg-white py-8 px-16 text-center shadow-md transition-all duration-300  md:static md:top-0 md:flex md:w-max md:scale-y-100 md:items-center md:gap-6 md:p-0 md:opacity-100 md:shadow-none lg:gap-8 ${
              menuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
            }`}
          >
            <ul className="header__list mb-6 flex flex-col gap-6 md:mb-0 md:flex-row lg:gap-8">
              {[
                ["Blog", "/blog"],
                ["Communities", "/communities"],
                ["Events", "/events"],
                ["Contact Us", "/contact"],
              ].map(([title, url]) => (
                <li key={url.toString()}>
                  <Link
                    href={url}
                    className="header__link text-[15px] font-medium text-gray-900 hover:text-secondary  hover:text-secondary"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/book">
              <button className="flex h-[52px] items-center justify-center rounded-full w-full md:w-fit  bg-primary ho transition-all cursor-pointer  py-4 px-8 font-sans text-[15px] font-semibold capitalize text-white">
                get started
              </button>
            </Link>
          </div>

          <div
            className="header__toggle inline-flex cursor-pointer text-[1.3rem] text-gray-900  md:hidden"
            onClick={setHandleMenu}
          >
            {!menuOpen ? <RiMenu3Line /> : <RiCloseLine />}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
