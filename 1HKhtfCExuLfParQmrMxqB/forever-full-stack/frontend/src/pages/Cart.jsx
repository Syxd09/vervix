import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets"; // keep if you use it somewhere
import CartTotal from "../components/CartTotal";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, addToCart } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [showSizeSelector, setShowSizeSelector] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            tempData.push({
              _id: productId,
              size: size,
              quantity: cartItems[productId][size],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const handleRemoveItem = (productId, size) => {
    updateQuantity(productId, size, 0);
    toast.success("Item removed from cart", {
      style: {
        background: '#10B981',
        color: '#fff',
      },
    });
  };

  const handleQuantityChange = (productId, size, delta) => {
    const currentQty = cartItems[productId]?.[size] || 0;
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      updateQuantity(productId, size, 0);
      toast.success("Item removed from cart", {
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });
    } else {
      updateQuantity(productId, size, newQty);
    }
  };

  const handleSizeChange = (productId, oldSize, newSize, quantity) => {
    if (oldSize === newSize) return;
    updateQuantity(productId, oldSize, 0);
    addToCart(productId, newSize, quantity); // quantity is the current qty, so transfer properly
    setShowSizeSelector(null);
    toast.success("Size updated successfully", {
      style: {
        background: '#3B82F6',
        color: '#fff',
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Title text1="YOUR" text2="CART" />
          <p className="text-slate-600 mt-3 text-lg">
            Review your selected items and proceed to checkout
          </p>
        </motion.div>
        {cartData.length > 0 ? (
          <>
            {/* Cart Items */}
            <div className="space-y-6 mb-12">
              <AnimatePresence>
                {cartData.map((item, index) => {
                  const productData = products.find((p) => p._id === item._id);
                  if (!productData) return null;

                  return (
                    <motion.div
                      key={`${item._id}-${item.size}`}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative"
                    >
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                          {/* Product Image & Info */}
                          <div
                            onClick={() => navigate(`/product/${productData._id}`)}
                            className="flex gap-4 cursor-pointer group/item flex-1"
                          >
                            <div className="relative">
                              <img
                                src={productData.image[0]}
                                alt={productData.name}
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border-2 border-slate-100 group-hover/item:border-blue-300 group-hover/item:scale-105 transition-all duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-slate-900 group-hover/item:text-blue-600 transition-colors duration-300 line-clamp-2">
                                {productData.name}
                              </h3>
                              <div className="flex flex-wrap gap-3 mt-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                                  {currency}{productData.price}
                                </span>
                                {/* Size Selector */}
                                <div className="relative">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowSizeSelector(showSizeSelector === `${item._id}-${item.size}` ? null : `${item._id}-${item.size}`);
                                    }}
                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors duration-200 z-50"
                                  >
                                    Size: {item.size}
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                  {showSizeSelector === `${item._id}-${item.size}` && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[140px] max-w-[200px]"
                                    >
                                      <div className="p-2">
                                        <p className="text-xs text-slate-500 mb-2 px-2 font-medium">Available sizes:</p>
                                        {/* Scrollable container */}
                                        <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                          <div className="space-y-1 pr-1">
                                            {productData.sizes.map((size) => (
                                              <button
                                                key={size}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleSizeChange(item._id, item.size, size, item.quantity);
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 flex items-center justify-between ${
                                                  size === item.size
                                                    ? 'bg-blue-100 text-blue-800 font-medium border border-blue-200'
                                                    : 'hover:bg-slate-100 text-slate-700 border border-transparent'
                                                }`}
                                              >
                                                <span>{size}</span>
                                                {size === item.size && (
                                                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                  </svg>
                                                )}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                        {productData.sizes.length > 6 && (
                                          <div className="mt-2 pt-2 border-t border-slate-100">
                                            <p className="text-xs text-slate-400 text-center">
                                              {productData.sizes.length} sizes available
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Quantity & Actions */}
                          <div className="flex sm:flex-col items-center sm:items-end gap-4 justify-between sm:justify-center">
                            {/* Quantity Controls (with aria and disabling at min=1) */}
                            <div className="flex items-center bg-slate-100 rounded-xl p-1">
                              <button
                                onClick={() => handleQuantityChange(item._id, item.size, -1)}
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-600 hover:text-red-500 hover:bg-red-50 
                                  disabled:opacity-50 transition-all duration-200 shadow-sm"
                                type="button"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="flex items-center justify-center px-6 py-1 text-base font-bold text-slate-900 min-w-[2rem] text-center select-none">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item._id, item.size, 1)}
                                aria-label="Increase quantity"
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-600 hover:text-emerald-500 hover:bg-emerald-50 
                                  transition-all duration-200 shadow-sm"
                                type="button"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </button>
                            </div>
                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item._id, item.size)}
                              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 group/delete"
                              title="Remove item"
                            >
                              <svg className="w-5 h-5 group-hover/delete:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        {/* Subtotal */}
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <div className="flex justify-between items-center">
                            <span className="text-xl mt-2 text-slate-600">Subtotal:</span>
                            <span className="text-lg font-semibold text-slate-900">
                              {currency}{(productData.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Overlay to close size selector */}
                      {showSizeSelector === `${item._id}-${item.size}` && (
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowSizeSelector(null)}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            {/* Checkout Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg p-6 sm:p-8"
            >
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Continue Shopping */}
                <div className="flex-1">
                  <Link
                    to="/collection"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 group"
                  >
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </Link>
                  <p className="text-sm text-slate-500 mt-2">
                    Discover more amazing products in our collection
                  </p>
                </div>
                {/* Cart Total & Checkout */}
                <div className="w-full lg:w-96">
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200/60">
                    <CartTotal />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/place-order")}
                      className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      <span>PROCEED TO CHECKOUT</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          /* Empty cart state, unchanged */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Your cart is empty
              </h3>
              <p className="text-slate-600 mb-8">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <Link to="/collection">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Start Shopping
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cart;
