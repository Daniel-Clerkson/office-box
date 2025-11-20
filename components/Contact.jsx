"use client";

import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";

const Contact = () => {
  return (
    <>
      <div className="container my-12 py-12 mx-auto px-4 md:px-6 lg:px-12">
        <section className="mb-20 text-gray-800">
          <div className="flex flex-wrap justify-center">
            <div className="flex-initial shrink w-full xl:w-5/12 lg:w-6/12">
              <div className="lg:py-12 lg:pl-6 mb-6 lg:mb-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.6257925774357!2d8.558202175163713!3d12.000374688232776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11ae816f8162eb8f%3A0x3337579ce2ca7879!2s44%20Ahmadu%20Bello%2C%20GRA%20700213%2C%20Kano%2C%20Nigeria!5e0!3m2!1sen!2sbj!4v1695409316378!5m2!1sen!2sbj"
                  className="h-80 w-full border-0 rounded-lg shadow-lg"
                  loading="lazy"
                  title="Google Maps Embed"
                />
              </div>
            </div>
            <div className="flex-initial shrink w-full xl:w-7/12 lg:w-6/12 mb-6 md:mb-0 lg:-ml-12">
              <div className="bg-primary h-full -z-10 rounded-lg p-6 lg:pl-12 text-white flex items-center py-12 lg:py-0">
                <div className="lg:pl-12">
                  <h3 className="text-2xl font-bold uppercase mb-6 pb-2">
                    Contact us
                  </h3>
                  <h5 className="text-xl font-medium mb-2">Address:</h5>
                  <p className="mb-10 text-sm">
                    44 Ahmadu Bello way, <br /> Nassarawa GRA Kano.
                  </p>
                  <h5 className="text-xl font-medium mb-4">Follow us:</h5>
                  <div className="flex flex-row gap-2 text-2xl cursor-pointer">
                    <a href="https://linktr.ee/officebox_ng#494504980">
                      <FaInstagram />
                    </a>
                    <a href="https://linktr.ee/officebox_ng#494504980">
                      <FaFacebook />
                    </a>
                    <a href="https://linktr.ee/officebox_ng#494504980">
                      <FaTiktok />
                    </a>
                    <a href="https://linktr.ee/officebox_ng#494504980">
                      <FaWhatsapp />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
