"use client"
import Image from "next/image";
import LogoDark from "../assets/images/OfficeBOX-logo-dark.png";
import LogoLight from "../assets/images/OfficeBOX-logo-light.png";

const Logo = () => {
  

  return (
    <Image
      src={ LogoDark }
      alt="Logo"
      title="Loading State"
      className="w-40" // Adjust the classes as needed
    />
  );
};

export default Logo;
