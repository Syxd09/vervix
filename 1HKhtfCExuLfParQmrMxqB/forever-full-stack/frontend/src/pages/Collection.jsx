import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Collection = () => {
  const navigate = useNavigate();
  const { products, search, showSearch, addToCart, currency } =
    useContext(ShopContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [activePopup, setActivePopup] = useState(null);
  const [selectedSize, setSelectedSize] = useState({});
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [activeFilters, setActiveFilters] = useState(0);

  const categories = ["Men", "Women", "Kids", "Unisex"];
  const types = ["Topwear", "Bottomwear", "Winterwear"];

  const toggleCategory = (value) => {
    setCategory((prev) => {
      const newCategory = prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];
      updateActiveFilters(newCategory, subCategory);
      return newCategory;
    });
  };

  const toggleSubCategory = (value) => {
    setSubCategory((prev) => {
      const newSubCategory = prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];
      updateActiveFilters(category, newSubCategory);
      return newSubCategory;
    });
  };

  const updateActiveFilters = (cats, subCats) => {
    setActiveFilters(cats.length + subCats.length);
  };

  const clearAllFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setPriceRange({ min: 0, max: 10000 });
    setActiveFilters(0);
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    productsCopy = productsCopy.filter(
      (item) => item.price >= priceRange.min && item.price <= priceRange.max
    );

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let sorted = [...filterProducts];

    switch (sortType) {
      case "low-high":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        return;
    }

    setFilterProducts(sorted);
  };

  // Size selection implementation from BestSeller
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

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products, priceRange]);

  useEffect(() => {
    sortProduct();
  }, [sortType, filterProducts]);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setCategory([cat]);
      setActiveFilters(1);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="pt-28 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <Title text1="ALL" text2="COLLECTIONS" />
          <p className="text-gray-600 mt-2">
            Discover our complete range of premium products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 flex-shrink-0">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="w-full flex items-center justify-between p-4 bg-white rounded shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <span className="font-semibold text-gray-900 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  Filters
                  {activeFilters > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {activeFilters}
                    </span>
                  )}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${
                    showFilter ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Filter Panel */}
            <div
              className={`${
                showFilter ? "block" : "hidden"
              } lg:block space-y-6`}
            >
              <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                {/* Filter Header */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                        />
                      </svg>
                      Filters
                    </h3>
                    {activeFilters > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {/* Categories */}
                <div className="p-4 border-b border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center group cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={category.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Types */}
                <div className="p-4 border-b border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-3">Type</h4>
                  <div className="space-y-2">
                    {types.map((type) => (
                      <label
                        key={type}
                        className="flex items-center group cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={subCategory.includes(type)}
                          onChange={() => toggleSubCategory(type)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Price Range
                  </h4>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            min: Number(e.target.value),
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            max: Number(e.target.value),
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {currency}
                      {priceRange.min} - {currency}
                      {priceRange.max}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Sort and Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {filterProducts.length}
                  </span>{" "}
                  products found
                </p>
                {activeFilters > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      Active filters:
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {activeFilters}
                    </span>
                  </div>
                )}
              </div>

              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              >
                <option value="relevant">Sort by: Relevant</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>

            {/* Products Grid */}
            {filterProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filterProducts.map((item) => (
                  <div
                    key={item._id}
                    className="relative border rounded overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col"
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

                    {/* Product Info */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-2">
                      <div>
                        <Link to={`/product/${item._id}`}>
                          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-lg font-semibold text-gray-900 mb-3">
                          {currency}
                          {item.price}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAddToCart(item._id)}
                        className="mt-2 bg-black text-white py-2 px-4 text-sm rounded hover:bg-gray-800 active:scale-95 transition-all duration-200 font-medium"
                      >
                        Add to Cart
                      </button>
                    </div>

                    {/* Size Selection Popup - Same as BestSeller */}
                    {activePopup === item._id && (
                      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-20 p-4">
                        <div className="bg-white rounded shadow-lg p-4 w-full max-w-[90%] sm:max-w-xs">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
