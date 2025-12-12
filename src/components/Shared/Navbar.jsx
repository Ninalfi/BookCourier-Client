import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../Logo/Logo";
import {
  FaSun, FaMoon, FaHome, FaBook, FaTachometerAlt, FaMapMarkedAlt,
  FaPhoneAlt, FaEnvelope, FaClock, FaComments, FaHeart, FaShoppingCart, FaBars
} from "react-icons/fa";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.add(savedTheme);
  }, []);

  const handleThemeToggle = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(next);
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  const links = (
    <>
      <li><NavLink to="/" className="flex items-center gap-1"><FaHome /> Home</NavLink></li>
      <li><NavLink to="/books" className="flex items-center gap-1"><FaBook /> Books</NavLink></li>
      <li><NavLink to="/dashboard" className="flex items-center gap-1"><FaTachometerAlt /> Dashboard</NavLink></li>
      <li><NavLink to="/coverage" className="flex items-center gap-1"><FaMapMarkedAlt /> Coverage</NavLink></li>
    </>
  );

  return (
    <div className="w-full shadow-md">

      {/* ====== TOP BAR ====== */}
      <div className="bg-(--color-primary) text-(--bc-surface) text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <FaPhoneAlt /> +208-6666-0112
            </span>

            <span className="flex items-center gap-1">
              <FaEnvelope /> info@example.com
            </span>

            <span className="hidden md:flex items-center gap-1">
              <FaClock /> Sunday – Fri: 9 AM – 6 PM
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 cursor-pointer">
              <FaComments /> Live Chat
            </span>

            {user ? (
              <button onClick={logOut} className="flex items-center gap-1">
                Log Out
              </button>
            ) : (
              <Link to="/auth/login" className="flex items-center gap-1">
                Login
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* ====== MAIN NAVBAR ====== */}
      <div className="bg-(--bc-bg) py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center text-2xl font-bold text-(--bc-text)">
            <Logo />
            <span className="ml-2">BookCourier</span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex menu menu-horizontal gap-6 text-(--bc-text) font-medium">
            {links}
          </ul>

          {/* Right side actions */}
          <div className="flex items-center gap-4">

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="btn btn-circle border bg-(--bc-surface) text-(--bc-text)"
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>

            {/* Wishlist */}
            <div className="relative p-3 border rounded-full border-(--color-primary)">
              <FaHeart className="text-(--color-primary)" />
              <span className="absolute top-0 right-0 bg-(--bc-accent) text-white rounded-full px-1 text-xs">
                0
              </span>
            </div>

            {/* Cart */}
            <div className="relative p-3 border rounded-full border-(--color-primary)">
              <FaShoppingCart className="text-(--color-primary)" />
              <span className="absolute top-0 right-0 bg-(--bc-accent) text-white rounded-full px-1 text-xs">
                0
              </span>
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden p-3 border rounded-full border-(--color-primary)">
              <FaBars className="text-(--color-primary)" />
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Navbar;
