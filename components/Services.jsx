"use client"
import Spark from "../assets/images/animated/spark,.svg";
import Image from "next/image";

export default function Services() {
  return (
    <section className="services relative section transition-all duration-300">
      <div className="services__wrapper bg-[#f9fafc] py-16 transition-all duration-300 ">
        <div className="services__container container grid gap-12">
          <div className="services__data justify-self-center text-center xs:max-w-sm sm:max-w-md lg:max-w-xl">
            <h1 className="services__title section-title capitalize text-primary font-bold underline">
              community is our central focus
            </h1>
            <p className="services__text section-text text-sm pb-0 font-dm">
              At OfficeBox, we place a strong emphasis on building a sense of
              community. Our mission revolves around creating inclusive
              environments where individuals with shared interests and ambitions
              can flourish. We are dedicated to nurturing a setting that
              promotes creativity, fosters collaboration, and encourages
              meaningful networking. As you savor a delightful cup of coffee in
              our welcoming atmosphere, your time with us promises to be a truly
              enjoyable and enriching experience."
            </p>
          </div>

          <div className="services__group grid items-start gap-8 justify-self-center xs:max-w-sm sm:max-w-md lg:max-w-3xl lg:grid-cols-2 xl:max-w-5xl xl:grid-cols-3">
            <div className="services__content flex items-start gap-6">
              <h3 className="services__content-number font-dm text-[28px] font-bold text-gray-900">
                01
              </h3>
              <div>
                <h3 className="services__content-title pb-2 font-dm text-[20px] font-bold text-gray-900">
                  Co-working
                </h3>
                <p className="services__content-text text-sm section-text pb-0 font-dm">
                  Our workspaces are designed to inspire collaboration and
                  productivity. Whether you need a flexible hot desk or a
                  dedicated workstation, we provide the ideal environment for
                  your work.
                </p>
              </div>
            </div>

            <div className="services__content flex items-start gap-6">
              <h3 className="services__content-number font-dm text-[28px] font-bold text-gray-900">
                02
              </h3>
    
              <div>
                <h3 className="services__content-title pb-2 font-dm text-[20px] font-bold text-gray-900">
                  Consultations
                </h3>
                <p className="services__content-text text-sm section-text pb-0 font-dm">
                  Our consultancy services are tailored to guide you through the
                  complex world of technology. From startups to established
                  businesses, we provide expert advice to help you navigate
                  challenges and seize opportunities.
                </p>
              </div>
              
            </div>

            <div className="services__content flex items-start gap-6">
              <h3 className="services__content-number font-dm text-[28px] text-gray-900 font-bold">
                03
              </h3>
              <div>
                <h3 className="services__content-title pb-2 font-dm font-bold text-[20px] text-gray-900">
                  Software Training
                </h3>
                <p className="services__content-text text-sm section-text pb-0 font-dm">
                  Whether you're a solo entrepreneur, scaling a startup, or
                  leading a global corporation, our network enables you to work
                  in proximity to clients, colleagues, or loved ones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" absolute top-20 opacity-30 hidden xl:block left-10">
        <Image
          src={Spark}
          alt="hero img"
          className="hero__img justify-self-center w-28 h-28 elem-updown bg-cover bg-center rounded-3xl"
        />
      </div>
    </section>
  );
}
