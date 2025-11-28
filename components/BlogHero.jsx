"use client"
import image from "../assets/images/workspace/site-img (7).jpg";
import Image from "next/image"

const BlogHero = () => {
  return (
    <>
      <section className="hero section font-dm relative transition-all duration-300 mt-30  xl:pt-40">
        <div className="hero__container container grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="hero__data grid gap-8 justify-self-center text-center xs:max-w-sm sm:max-w-lg lg:max-w-full lg:text-left">
            <div>
              <h1 className="hero__title section-title xl:text-[50px] font-black capitalize">
                The Blog<span className=" text-primary">.</span>
              </h1>
              <p className="hero__text section-text text-lg pb-0 xl:max-w-md">
                Explore Office Box Blogs: Insights, Inspiration, and Innovation
              </p>
            </div>
          </div>
          <div className=" relative w-full h-72 justify-center flex">
            <div className=" absolute rotate-6 sm:w-96 w-80 h-72 bg-primary shadow rounded-md"></div>
            <div className=" absolute -rotate-6 sm:w-96 w-80 h-72 bg-secondary shadow rounded-md"></div>
            <div className=" sm:w-96 w-80 h-72 flex justify-center items-center  p-px aspect-square bg-white shadow-md absolute rounded-md">
                <Image src={image} className="w-full h-full object-cover bg-center" alt="" />
              {/* <div className=" flex justify-between items-center">
                <div className=" rounded-full bg-gradient-to-r flex justify-center p-1 rotate-3 from-yellow-500 to-pink-500 md:w-28 w-20 aspect-square">
                  <div className="bg-gray-50 p-2 rounded-full w-full h-full -rotate-3 flex justify-center items-center">
                    <img src={Icon} className=" w-fit h-fit" alt="" />
                  </div>
                </div>
                <div className="flex justify-end items-center w-full">

                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogHero;
