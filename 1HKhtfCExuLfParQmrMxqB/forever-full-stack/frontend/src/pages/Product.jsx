import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'
import Title from '../components/Title'
import { motion } from "framer-motion";

const Product = () => {
  const { productId } = useParams()
  const { products, currency, addToCart } = useContext(ShopContext)
  const [productData, setProductData] = useState(false)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [productId]);


  useEffect(() => {
    if (products.length > 0) {
      const found = products.find(item => item._id === productId)
      if (found) {
        setProductData(found)
        setImage(found.image[0])
      }
    }
  }, [productId, products])

  const incrementQty = () => setQuantity(q => (q < 10 ? q + 1 : 10))
  const decrementQty = () => setQuantity(q => (q > 1 ? q - 1 : 1))

  return productData ? (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="border-t-2 transition-opacity bg-gradient-to-br from-white to-orange-50 min-h-screen"
    >
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className='text-2xl text-center pt-8 mt-20 mb-8 border-t'
      >
        <Title text1={'Buy'} text2={'NOW'} />
      </motion.div>
      <div className="flex gap-12 flex-col md:flex-row max-w-6xl mx-auto bg-white/90 rounded-2xl p-8 shadow-2xl">
        {/* Images */}
        <div className="flex-1 flex flex-col-reverse gap-4 md:flex-row">
          <div className="flex md:flex-col overflow-x-auto md:overflow-y-scroll justify-between md:justify-start md:w-[19%] w-full gap-2">
            {productData.image.map((item, idx) => (
              <motion.img
                whileHover={{ scale: 1.09, zIndex: 2, boxShadow: "0px 0px 16px 0px #ffb96d22" }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                src={item}
                key={idx}
                onClick={() => setImage(item)}
                className={`h-20 w-20 md:w-full object-cover rounded-lg border-2 ${
                  item === image ? 'border-orange-500 shadow-lg' : 'border-gray-200'
                } cursor-pointer transition-all duration-200`}
                alt=""
              />
            ))}
          </div>
          <motion.div
            className="w-full md:w-[81%] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <motion.img
              key={image}
              src={image}
              alt=""
              className="rounded-xl shadow-xl transition-all object-contain w-full h-80 md:h-[32rem] bg-white/80"
              initial={{ opacity: 0, y: 20, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </motion.div>
        </div>
        {/* Product Info */}
        <motion.div
          className="flex-1 flex flex-col gap-5 justify-between bg-gray-50/60 shadow-lg rounded-xl p-7"
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
        >
          <div>
            <h1 className="font-bold text-3xl md:text-4xl text-gray-800 mb-2">{productData.name}</h1>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4].map(i => (
                <img src={assets.star_icon} key={i} alt="star" className="w-4 h-4" />
              ))}
              <img src={assets.star_dull_icon} alt="star dull" className="w-4 h-4" />
              <p className="pl-2 text-gray-500 text-sm">(122)</p>
            </div>
            <div className="mt-5 flex items-end gap-2">
              <span className="text-orange-600 text-4xl font-extrabold">{currency}{productData.price}</span>
              <span className="text-gray-400 line-through text-base">
                {currency}{Math.round(productData.price * 1.2)}
              </span>
            </div>
            <p className="mt-4 text-gray-600 leading-7">{productData.description}</p>
          </div>
          <div>
            <div className="flex flex-col gap-2 my-8">
              <label className="font-semibold text-gray-900 mb-2">Select Size</label>
              <div className="flex gap-2 flex-wrap">
                {productData.sizes.map((item, idx) => (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.95 }}
                    className={`border px-5 py-2 rounded-full text-sm font-medium shadow bg-white hover:bg-orange-50 transition-all ${
                      item === size ? 'border-orange-500 bg-orange-100 text-orange-600 shadow-md scale-105' : 'border-gray-300 text-gray-700'
                    }`}
                    onClick={() => setSize(item)}
                  >{item}</motion.button>
                ))}
              </div>
            </div>
            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center bg-slate-100 rounded-xl p-1">
                <button
                  onClick={decrementQty}
                  disabled={quantity === 1}
                  aria-label="Decrease quantity"
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-600 hover:text-red-500 hover:bg-red-50 disabled:opacity-50 transition-all duration-200 shadow-sm"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="flex items-center justify-center px-7 py-1 text-base font-bold text-slate-900 min-w-[3rem] text-center select-none">
                  {quantity}
                </span>
                <button
                  onClick={incrementQty}
                  disabled={quantity === 10}
                  aria-label="Increase quantity"
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-600 hover:text-emerald-500 hover:bg-emerald-50 disabled:opacity-50 transition-all duration-200 shadow-sm"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
            <button
              onClick={() => addToCart(productData._id, size, quantity)}
              className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 shadow text-white px-10 py-3 text-lg font-bold rounded-xl w-full transition-all duration-200 tracking-wide mt-2 mb-3"
            >
              ADD TO CART
            </button>
            <hr className="mt-4" />
            <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold text-lg">✓</span>
                100% Original product.
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold text-lg">✓</span>
                Cash on delivery available on this product.
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold text-lg">✓</span>
                Easy return & exchange policy within 7 days.
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Description & Review Section */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mt-20 max-w-6xl mx-auto"
      >
        <div className="flex">
          <b className="border-t-2 border-orange-500 px-5 py-3 text-base text-orange-600 font-semibold bg-white rounded-tl-xl">
            Description
          </b>
          <span className="border-t px-5 py-3 text-base text-gray-500 bg-gray-50 rounded-tr-xl">Reviews (122)</span>
        </div>
        <div className="flex flex-col gap-4 border border-gray-200 px-8 py-8 text-md text-gray-600 bg-white rounded-b-2xl shadow-md leading-relaxed">
          <p>
            An <span className="font-semibold text-black">e-commerce website</span> is an online platform that facilitates the buying and selling of products or services over the internet.
          </p>
          <p>
            E-commerce websites display products/services with detailed descriptions, images, prices, and options (e.g., size, color). Each product usually has a dedicated page for full detail and easy shopping experience.
          </p>
        </div>
      </motion.div>
      {/* Related products animated */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.16 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="max-w-6xl mx-auto mt-16"
      >
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
      </motion.div>
    </motion.div>
  ) : (
    <div className="min-h-[60vh] flex items-center justify-center opacity-0"></div>
  )
}

export default Product
