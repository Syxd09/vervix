import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import { Link } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";

// Single animated category card
const AnimatedCategoryCard = ({ to, gradient, title, subtitle, textClasses, delay = 0, children }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -120px 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className="group relative block rounded-lg shadow-luxury overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <Link to={to} className="h-full inline-block w-full">
        <div className={`h-80 sm:h-96 ${gradient} flex items-center justify-center`}>
          <div className={`text-center px-4 ${textClasses}`}>
            <h3 className="font-playfair text-2xl font-bold mb-2 transition-colors group-hover:text-orange-700">
              {title}
            </h3>
            <p className="transition-colors">{subtitle}</p>
            {children}
          </div>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-5 group-hover:bg-opacity-0 transition-all duration-300 pointer-events-none"></div>
      </Link>
    </motion.div>
  );
};

const BestSeller = () => {
  const { products, addToCart, currency } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const [activePopup, setActivePopup] = useState(null);
  const [selectedSize, setSelectedSize] = useState({});
  const [visibleItems, setVisibleItems] = useState({});

  const itemRefs = useRef([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  useEffect(() => {
    // Intersection Observer for grid fade-in
    const observer = new window.IntersectionObserver(
      (entries) => {
        const newVisible = { ...visibleItems };
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            newVisible[entry.target.dataset.index] = true;
          }
        });
        setVisibleItems(newVisible);
      },
      { threshold: 0.25 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      itemRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
    // eslint-disable-next-line
  }, [bestSeller]);

  const handleAddToCart = (productId) => setActivePopup(productId);

  const confirmAddToCart = (productId) => {
    const size = selectedSize[productId];
    if (!size) {
      alert("Please select a size.");
      return;
    }
    addToCart(productId, size);
    setActivePopup(null);
  };

  return (
    <div className="my-10 px-4 sm:px-6 lg:px-8">
      {/* Section header */}
      <div className="text-center text-3xl py-8">
        <Title text1="BEST" text2="SELLERS" />
        <p className="w-full md:w-3/4 mx-auto text-xs sm:text-sm md:text-base text-gray-600">
          Shop our most loved products handpicked by thousands of customers.
        </p>
      </div>

      {/* Product grid - Intersection Observer fade-up */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-20">
        {bestSeller.map((item, index) => (
          <div
            key={item._id}
            ref={(el) => (itemRefs.current[index] = el)}
            data-index={index}
            className={`relative border rounded overflow-hidden bg-white shadow group flex flex-col transform transition-all duration-700 ${
              visibleItems[index]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{
              transitionDelay: `${index * 120}ms`
            }}
          >
            {/* Product Image with hover swap */}
            <Link to={`/product/${item._id}`} className="block">
              <div className="w-full aspect-square bg-gray-100 overflow-hidden relative">
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                {item.image.length > 1 && (
                  <img
                    src={item.image[1]}
                    alt={`${item.name} hover`}
                    className="w-full h-full object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                )}
              </div>
            </Link>

            {/* Info & Actions */}
            <div className="p-3 flex-1 flex flex-col justify-between gap-2">
              <div>
                <Link to={`/product/${item._id}`}>
                  <h3 className="text-base font-medium text-gray-900 truncate">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-gray-700 font-semibold text-sm">
                  {currency}
                  {item.price}
                </p>
              </div>
              <button
                onClick={() => handleAddToCart(item._id)}
                className="mt-2 bg-black text-white py-1.5 text-sm rounded hover:bg-gray-800 active:scale-95 transition-all"
              >
                Add to Cart
              </button>
            </div>

            {/* Size Selector Popup */}
            {activePopup === item._id && (
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-20 p-4">
                <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-[90%] sm:max-w-xs animate-fade-in">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">
                    Select Size
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.sizes.map((size, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          setSelectedSize((prev) => ({
                            ...prev,
                            [item._id]: size,
                          }))
                        }
                        className={`border rounded px-3 py-1 text-sm ${
                          selectedSize[item._id] === size
                            ? "bg-black text-white border-black"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => setActivePopup(null)}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => confirmAddToCart(item._id)}
                      className="bg-black text-white px-4 py-1.5 rounded text-sm hover:bg-gray-800"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Animated Categories Section */}
      <section className="my-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <AnimatedCategoryCard
            to="/collection?category=men"
            gradient="bg-gradient-to-br from-primary-black to-secondary-black"
            title="Men's Collection"
            subtitle={
              <span className="text-luxury-gold group-hover:text-white transition-colors">Sophisticated & Timeless</span>
            }
            textClasses="text-white"
            delay={0.09}
          />
          <AnimatedCategoryCard
            to="/collection?category=women"
            gradient="bg-gradient-to-br from-luxury-gold to-warm-gold"
            title="Women's Collection"
            subtitle={
              <span className="text-primary-black group-hover:text-white transition-colors">Elegant & Refined</span>
            }
            textClasses="text-white"
            delay={0.18}
          />
          <AnimatedCategoryCard
            to="/collection?category=unisex"
            gradient="bg-gradient-to-br from-warm-gray to-light-gray"
            title="Unisex Collection"
            subtitle={
              <span className="text-luxury-gold group-hover:text-primary-black transition-colors">Modern & Versatile</span>
            }
            textClasses="text-primary-black"
            delay={0.26}
          />
          <AnimatedCategoryCard
            to="/collection?category=kids"
            gradient="bg-gradient-to-br from-indigo-300 to-yellow-100"
            title="Kids Collection"
            subtitle={
              <span className="text-orange-400 group-hover:text-indigo-900 transition-colors">Fun & Playful</span>
            }
            textClasses="text-indigo-900"
            delay={0.35}
          />
        </div>
        <div className="text-center mt-12">
          <Link
            to="/collection"
            className="inline-block btn-luxury hover-lift px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-yellow-400 hover:to-orange-500 transition"
          >
            View All Collections
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BestSeller;
