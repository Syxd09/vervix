import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const navRef = useRef(null);
  const location = useLocation();

  // REMOVED: underlineProps & related animation logic

  const { setShowSearch, getCartCount, token, setToken, setCartItems } =
    useContext(ShopContext);

  const navigate = useNavigate();

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  const handleCollectionClick = () => {
    navigate("/collection");
    setDropdownVisible(false);
  };

  const handleCategoryClick = (category) => {
    navigate(`/collection?category=${category}`);
    setDropdownVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: "HOME", to: "/" },
    { name: "ABOUT", to: "/about" },
    { name: "CONTACT", to: "/contact" },
  ];

  const collectionCategories = ["Men", "Women", "Kids", "Unisex"];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow z-50 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20">
        <Link to="/">
          <img src={assets.logo} alt="Logo" className="w-32 sm:w-40" />
        </Link>

        <nav
          ref={navRef}
          className="relative hidden sm:flex gap-6 text-sm font-medium text-gray-700 items-center"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `relative transition nav-item ${
                  isActive ? "nav-active text-black font-semibold" : "hover:text-black"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.name}
                  {/* Animated underline using layoutId */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-underline"
                      className="absolute left-0 right-0 -bottom-1 h-[2.5px] rounded bg-black"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}

          <div className="relative" ref={dropdownRef}>
            <NavLink
              to="/collection"
              className={({ isActive }) =>
                `relative transition nav-item ${
                  isActive ? "nav-active text-black font-semibold" : "hover:text-black"
                }`
              }
              onClick={e => {
                e.preventDefault();
                setDropdownVisible(!dropdownVisible);
              }}
            >
              {({ isActive }) => (
                <>
                  <span>COLLECTION</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-underline"
                      className="absolute left-0 right-0 -bottom-1 h-[2.5px] rounded bg-black"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
            {dropdownVisible && (
              <div className="absolute top-full mt-2 bg-white shadow rounded w-40 text-sm text-gray-700 z-50">
                <div
                  onClick={handleCollectionClick}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b"
                >
                  All Collections
                </div>
                {collectionCategories.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-5">
          <img
            onClick={() => {
              setShowSearch(true);
              navigate("/collection");
            }}
            src={assets.search_icon}
            className="w-5 cursor-pointer"
            alt="search"
          />

          <div className="relative" ref={profileRef}>
            <img
              onClick={() => {
                if (!token) navigate("/login");
                else setProfileVisible(!profileVisible);
              }}
              className="w-5 cursor-pointer"
              src={assets.profile_icon}
              alt="profile"
            />
            {token && profileVisible && (
              <div className="absolute right-0 top-8 flex flex-col gap-2 w-40 p-4 bg-white shadow-lg rounded-md text-sm text-gray-600 z-20">
                <p className="cursor-pointer hover:text-black">My Profile</p>
                <p
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            )}
          </div>

          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5" alt="cart" />
            <span className="absolute -right-2 -bottom-2 text-[10px] w-4 h-4 bg-black text-white flex items-center justify-center rounded-full">
              {getCartCount()}
            </span>
          </Link>

          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            className="w-5 cursor-pointer sm:hidden"
            alt="menu"
          />
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 z-40 ${
          visible ? "translate-x-0 w-[80%] sm:w-[60%]" : "translate-x-full w-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <p className="font-semibold text-gray-700">Menu</p>
            <img
              onClick={() => setVisible(false)}
              src={assets.dropdown_icon}
              className="h-4 rotate-180 cursor-pointer"
              alt="close"
            />
          </div>

          <div className="flex flex-col text-gray-600">
            <NavLink
              to="/"
              onClick={() => setVisible(false)}
              className="px-6 py-3 hover:bg-gray-100 transition"
            >
              HOME
            </NavLink>
            <div className="border-t" />
            <div
              className="px-6 pt-3 font-semibold text-gray-700 cursor-pointer"
              onClick={handleCollectionClick}
            >
              COLLECTION
            </div>
            {collectionCategories.map((cat) => (
              <div
                key={cat}
                onClick={() => {
                  handleCategoryClick(cat);
                  setVisible(false);
                }}
                className="px-6 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {cat}
              </div>
            ))}
            <div className="border-t my-2" />
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={() => setVisible(false)}
                className="px-6 py-3 hover:bg-gray-100 transition"
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
