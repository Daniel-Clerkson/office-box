"use client"
import Image from "next/image";
import image from "../assets/images/workspace/site-img (8).jpg";

const CommunityHero = () => {
  return (
    <>
      <section className="hero section font-dm relative transition-all duration-300 xl:pt-40">
        <div className="hero__container container grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="hero__data grid gap-8 justify-self-center text-center xs:max-w-sm sm:max-w-lg lg:max-w-full lg:text-left">
            <div>
              <h1 className="hero__title section-title xl:text-[50px] font-black capitalize">
                OfficeBox Communities<span className=" text-primary">.</span>
              </h1>
              <p className="hero__text section-text text-lg pb-0 xl:max-w-md">
                We act as a platform for people to co-work, ideate, co- create
                and network. Integral to this is our ability to build
                experiences around our communities.
              </p>
            </div>
          </div>
          <div className=" relative w-full h-72 justify-center flex">
            <div className=" absolute rotate-6 sm:w-96 w-80 h-72 bg-primary shadow rounded-md"></div>
            <div className=" absolute -rotate-6 sm:w-96 w-80 h-72 bg-secondary shadow rounded-md"></div>
            <div className=" sm:w-96 w-80 h-72 flex justify-center items-center  p-px aspect-square bg-white shadow-md absolute rounded-md">
              <Image
                src={image}
                className="w-full h-full object-cover bg-center"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CommunityHero;
