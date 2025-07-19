import React, { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import Title from "../components/Title"; // ✅ Make sure this path is correct

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
  const intervalRef = useRef(null);
  const hoverRef = useRef(false);

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      if (!hoverRef.current) {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    }, 5000);
  };

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <>
      {/* Section Heading */}
      <div className="text-center pt-12 pb-4 bg-white mt-14">
        <Title text1="Shop" text2="The Collection" />
      </div>

      {/* Hero Carousel */}
      <div
        className="relative w-full z-0 overflow-hidden group"
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
      >
        <div className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[65vh] xl:h-[70vh] relative overflow-hidden">
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${images.length * 100}%`,
            }}
          >
            {images.map((img, i) => (
              <Link
                to="/collection"
                key={i}
                className="w-full flex-shrink-0 h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[65vh] xl:h-[70vh] relative"
              >
                <img
                  src={img}
                  alt={`Slide ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
              </Link>
            ))}
          </div>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentIndex
                    ? "bg-white scale-125 shadow-md"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroCarousel;
