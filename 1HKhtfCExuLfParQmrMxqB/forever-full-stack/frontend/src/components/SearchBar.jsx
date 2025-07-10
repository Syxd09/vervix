import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const searchRef = useRef(null);

  useEffect(() => {
    setVisible(location.pathname.includes("collection"));
  }, [location]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    }

    if (showSearch && visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch, visible, setShowSearch]);

  if (!showSearch || !visible) return null;

  return (
    <div className="w-full flex justify-center z-50 relative">
      <div
        ref={searchRef}
        className="w-full max-w-2xl mx-auto mt-4 px-4 py-2 bg-white rounded-full shadow-md border border-gray-300 flex items-center gap-3 transition-all duration-300"
        style={{ zIndex: 50 }}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for products..."
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base"
        />
        <img
          src={assets.search_icon}
          alt="Search"
          className="w-5 h-5 opacity-70"
        />
      </div>
    </div>
  );
};

export default SearchBar;
