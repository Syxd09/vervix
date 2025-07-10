// components/ProductItem.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const ProductItem = ({
  id,
  name,
  price,
  image,
  hoverImage,
  category,
  isBestseller,
}) => {
  const { currency, addToCart, products } = useContext(ShopContext);
  const navigate = useNavigate();
  const [showSizePopup, setShowSizePopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  const product = products.find((p) => p._id === id);

  const handleAddToCart = () => {
    setShowSizePopup(true);
  };

  const confirmSizeAdd = () => {
    if (selectedSize) {
      addToCart(id, selectedSize);
      setShowSizePopup(false);
      setSelectedSize("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden relative group transition-all hover:shadow-lg">
      <div
        onClick={() => navigate(`/product/${id}`)}
        className="cursor-pointer w-full aspect-[4/5] overflow-hidden relative"
      >
        <img
          src={image[0]}
          alt={name}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute top-0 left-0"
        />
        <img
          src={hoverImage}
          alt="hover"
          className="w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        />
        {isBestseller && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded">
            ★ Bestseller
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col justify-between gap-1">
        <h3
          className="font-medium text-sm sm:text-base cursor-pointer"
          onClick={() => navigate(`/product/${id}`)}
        >
          {name}
        </h3>
        <p className="text-gray-600 text-xs">{category}</p>
        <p className="font-semibold text-sm">
          {currency}
          {price}
        </p>
        <button
          onClick={handleAddToCart}
          className="mt-1 bg-black text-white text-xs py-1 px-3 rounded hover:bg-gray-800 transition-all"
        >
          Add to Cart
        </button>
      </div>

      {showSizePopup && product && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="bg-white p-4 rounded-xl w-60 text-center shadow-lg">
            <h4 className="text-sm font-semibold mb-2">Select Size</h4>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {product.sizes.map((size, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSize(size)}
                  className={`border px-3 py-1 rounded text-sm ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              onClick={confirmSizeAdd}
              className="bg-black text-white text-xs py-1 px-4 rounded"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductItem;
