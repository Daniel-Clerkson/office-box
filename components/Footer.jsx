"use client";
import Link from "next/link";
import Logo from "../assets/images/OfficeBOX-icon.png";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
const usefulLinks = [
  { title: "Blog", url: "/blog" },
  { title: "Events", url: "/events" },
  { title: "Contact", url: "/contact" },
  { title: "Communities", url: "/communities" },
];
const suggestedPlans = [
  { title: "Meeting Room", url: "/book-a-space" },
  { title: "Dedicated Desk", url: "/book-a-space" },
  { title: "Standard Office", url: "/book-a-space" },
  { title: "Premium Office", url: "/book-a-space" },
];
const socials = [
  { title: "Instagram", url: "https://www.instagram.com/officebox_ng" },
  {
    title: "Facebook",
    url: "https://www.facebook.com/share/1GYH2JnueB/?mibextid=wwXIfr",
  },
  {
    title: "TikTok",
    url: "https://www.tiktok.com/@officebox_ng?_t=zs-8yskbsjtfxu&_r=1",
  },
  {
    title: "Instagram",
    url: "https://chat.whatsapp.com/FeV3iH8ZbOfIAJzOMOJUOp?mode=ac_t",
  },
];
const Footer = () => {
  return (
    <footer className="footer pt-32 pb-8 transition-all duration-300">
      <div className="footer__container container grid gap-24">
        <div className="footer__group grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-12 xl:grid-cols-[1fr,repeat(3,0.5fr)]">
          <div className="footer__content">
            <Link
              href="/"
              className="footer__content-link inline-flex items-center pb-2 font-dm font-semibold text-[20px] text-gray-900 "
            >
              <Image src={Logo} alt="Logo Icon" className=" w-12" />
            </Link>
            <p className="footer__content-text section-text pb-0 lg:max-w-[320px]">
              OfficeBox: Nigeria's premier tech coworking hub. Collaborate,
              connect, and work in a dynamic space with free Wi-Fi and coffee.
            </p>
          </div>

          <div className="footer__content">
            <h3 className="footer__content-title pb-4 font-dm font-semibold text-[20px] text-gray-900 ">
              Useful Links
            </h3>

            <ul className="footer__content-list flex flex-col gap-3">
              {usefulLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.url}
                    className="footer__link text-[15px] text-gray-600 hover:text-secondary  "
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__content">
            <h3 className="footer__content-title pb-4 font-dm font-semibold text-[20px] text-gray-900 ">
              Suggested Plans
            </h3>

            <ul className="footer__content-list flex flex-col gap-3">
              {suggestedPlans.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.url}
                    className="footer__link text-[15px] text-gray-600 hover:text-secondary"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__content">
            <h3 className="footer__content-title pb-4 font-dm font-semibold text-[20px] text-gray-900 ">
              Follow Us
            </h3>

            <ul className="footer__content-list flex flex-col gap-3">
              {socials.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.url}
                    className="footer__link text-[15px] text-gray-600 hover:text-secondary"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="footer__copy border-t border-gray-300 pt-8 text-center text-[15px] text-gray-600">
          © Copyrights 2023, all rights reserved - by STEM INNOVATORS LAB
          LIMITED
        </p>
      </div>
    </footer>
  );
};

export default Footer;
