import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import { Link } from "react-router-dom";

const LatestCollection = () => {
  const { products, addToCart, currency } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [activePopup, setActivePopup] = useState(null);
  const [selectedSize, setSelectedSize] = useState({});
  const [visibleItems, setVisibleItems] = useState({});

  const itemRefs = useRef([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newVisible = { ...visibleItems };
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            newVisible[entry.target.dataset.index] = true;
          }
        });
        setVisibleItems(newVisible);
      },
      { threshold: 0.2 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      itemRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [latestProducts]);

  const handleAddToCart = (productId) => {
    setActivePopup(productId);
  };

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
      <div className="text-center py-8">
        <Title text1="LATEST" text2="COLLECTIONS" />
        <p className="max-w-xl mx-auto text-sm sm:text-base text-gray-600 mt-2">
          Discover the freshest styles curated for every mood and moment.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {latestProducts.map((item, index) => (
          <div
            key={item._id}
            ref={(el) => (itemRefs.current[index] = el)}
            data-index={index}
            className={`relative border rounded overflow-hidden bg-white shadow transition-all duration-500 group flex flex-col transform ${
              visibleItems[index]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{
              transitionDelay: `${index * 100}ms`,
            }}
          >
            {/* Product Image with Hover Swap */}
            <Link to={`/product/${item._id}`} className="block">
              <div className="w-full aspect-square bg-gray-100 overflow-hidden relative">
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {item.image.length > 1 && (
                  <img
                    src={item.image[1]}
                    alt={`${item.name} hover`}
                    className="w-full h-full object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
                <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-[90%] sm:max-w-xs transform scale-95 animate-zoom-in">
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
    </div>
  );
};

export default LatestCollection;
