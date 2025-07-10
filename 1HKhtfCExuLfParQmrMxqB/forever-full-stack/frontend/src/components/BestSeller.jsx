import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import { Link } from "react-router-dom";

const BestSeller = () => {
  const { products, addToCart, currency } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const [activePopup, setActivePopup] = useState(null);
  const [selectedSize, setSelectedSize] = useState({});

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

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
      <div className="text-center text-3xl py-8">
        <Title text1="BEST" text2="SELLERS" />
        <p className="w-3/4 mx-auto text-xs sm:text-sm md:text-base text-gray-600">
          Shop our most loved products handpicked by thousands of customers.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {bestSeller.map((item) => (
          <div
            key={item._id}
            className="relative border rounded overflow-hidden bg-white shadow hover:shadow-lg transition-all duration-300 group flex flex-col"
          >
            {/* Product Image with Hover Swap */}
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
                <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-[90%] sm:max-w-xs">
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

export default BestSeller;
