import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";

const images = [
  assets.hero_img,
  assets.hero_img2,
  assets.hero_img3,
  assets.hero_img4,
  assets.hero_img5,
  assets.hero_img6,
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Auto-change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const nextSlide = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full mt-[6rem] z-0 overflow-hidden">
      <div className="relative group">
        {/* Image Container */}
        <div className="w-full h-[50vh] sm:h-[65vh] md:h-[75vh] lg:h-[85vh] xl:h-[90vh] max-h-[70vh] overflow-hidden">
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
          />
        </div>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Optional: Uncomment below to use arrows */}
        {/*
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-5 transform -translate-y-1/2 z-20 bg-white/60 backdrop-blur-lg hover:bg-white rounded-full p-2 shadow-md transition hover:scale-105"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-5 transform -translate-y-1/2 z-20 bg-white/60 backdrop-blur-lg hover:bg-white rounded-full p-2 shadow-md transition hover:scale-105"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        */}

        {/* Optional: Slide Counter */}
        {/*
        <div className="absolute top-5 right-6 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium z-30">
          {currentIndex + 1} / {images.length}
        </div>
        */}

        {/* Optional: CTA Button */}
        {/*
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30">
          <button className="bg-white/80 hover:bg-white text-gray-800 font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-lg transition transform hover:scale-105">
            SHOP NOW
          </button>
        </div>
        */}
      </div>
    </div>
  );
};

export default HeroCarousel;
