"use client"
import React from 'react';

const BlogHero = () => {
  return (
    <section className="relative transition-all duration-300 pt-24 sm:pt-28 md:pt-32 lg:pt-36 xl:pt-40 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Text Content */}
          <div className="grid gap-6 sm:gap-8 justify-self-center text-center lg:justify-self-start lg:text-left max-w-xl lg:max-w-full">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] font-black capitalize leading-tight">
                The Blog<span className="text-indigo-600">.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-md mx-auto lg:mx-0 lg:max-w-lg leading-relaxed">
                Explore Office Box Blogs: Insights, Inspiration, and Innovation
              </p>
            </div>
          </div>

          {/* Image Stack */}
          <div className="relative w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
              {/* Aspect ratio container */}
              <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                {/* Background rotated cards */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Purple card - rotated right */}
                  <div className="absolute w-[85%] sm:w-[90%] h-[85%] sm:h-[90%] bg-indigo-600 shadow-xl rounded-lg sm:rounded-xl transform rotate-6 transition-transform duration-300 hover:rotate-12"></div>
                  
                  {/* Pink/Secondary card - rotated left */}
                  <div className="absolute w-[85%] sm:w-[90%] h-[85%] sm:h-[90%] bg-pink-500 shadow-xl rounded-lg sm:rounded-xl transform -rotate-6 transition-transform duration-300 hover:-rotate-12"></div>
                  
                  {/* Main image card */}
                  <div className="absolute w-[85%] sm:w-[90%] h-[85%] sm:h-[90%] bg-white shadow-2xl rounded-lg sm:rounded-xl overflow-hidden border-4 sm:border-[6px] border-white transition-transform duration-300 hover:scale-105 z-10">
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
                      {/* Placeholder for image */}
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      {/* 
                      Replace the placeholder div above with your actual Image component:
                      <img 
                        src="/path-to-your-image.jpg" 
                        className="w-full h-full object-cover" 
                        alt="Blog hero" 
                      />
                      */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: Decorative elements */}
      <div className="absolute top-1/2 left-0 w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/3 right-0 w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -20px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(20px, 20px) scale(1.05);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default BlogHero;