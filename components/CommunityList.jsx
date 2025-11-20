"use client"
import Image from "next/image";
import image from "../assets/images/The ART-HOUSE Community.jpg";

const CommunityList = () => {
  return (
    <div className="w-full justify-center items-center flex">
      <div className="w-full justify-center items-center flex mx-5 lg:max-w-6xl section">
        <div className="flex justify-center items-center w-full flex-col md:flex-row p-1 gap-5">
          <div className="w-full sm:max-w-md h-72 flex justify-center items-center  p-px aspect-square bg-slate-200 shadow-md rounded-md">
            <Image
              src={image}
              className="w-full h-full rounded-2xl object-cover object-top"
              alt="The ART-HOUSE Community"
            />
          </div>
          <div className="w-full md:text-start text-center">
            <h1 className="font-bold text-lg text-gray-600 ">
              The ART-HOUSE Community
            </h1>
            <h3 className="font-medium text-sm text-gray-600  pt-1">
              Discover ART House: Where Creativity Finds Its Home
            </h3>
            <p className="text-sm text-gray-600 pt-2">
              Welcome to ART House, a vibrant and dynamic community nestled
              within Office Box, dedicated to celebrating the artistry and
              creativity of talented artisans. ART House serves as a unique
              platform for artists and craftsmen to showcase their exceptional
              works of art, from paintings and sculptures to handmade crafts and
              beyond.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityList;
