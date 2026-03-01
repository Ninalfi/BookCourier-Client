import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaSun,
  FaMoon,
  FaHome,
  FaBook,
  FaTachometerAlt,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaComments,
  FaShoppingCart,
  FaBars,
  FaBlog,
} from "react-icons/fa";
import Logo from "./Logo";
import { useAuth } from "../../contexts/AuthProvider";
import { useCart } from "../../contexts/CartContext";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { cart } = useCart();

  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
 const defaultAvatar = "https://i.ibb.co.com/0y4FCqHp/5472d1b09d3d724228109d381d617326.jpg";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(savedTheme);
    setTheme(savedTheme);
  }, []);

  const handleThemeToggle = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(next);
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2 transition-colors ${
      isActive ? "text-(--color-primary) font-semibold" : "text-(--bc-text)"
    } hover:text-(--bc-accent)`;

  const links = (
    <>
      <li>
        <NavLink to="/" className={navItemClass}>
          <FaHome /> Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/books" className={navItemClass}>
          <FaBook /> Books
        </NavLink>
      </li>
      <li>
        <NavLink to="/coverage" className={navItemClass}>
          <FaMapMarkedAlt /> Coverage
        </NavLink>
      </li>
      <li>
        <NavLink to="/blog" className={navItemClass}>
          <FaBlog /> Blog
        </NavLink>
      </li>
      <li>
        <NavLink to="/contact" className={navItemClass}>
          <FaComments /> Contact
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard" className={navItemClass}>
          <FaTachometerAlt /> Dashboard
        </NavLink>
      </li>
    </>
  );

  return (

    <header className="sticky top-0 z-50 w-full">
      {/* Top info bar */}
      <div className="bg-(--color-primary) text-(--bc-surface) text-sm py-2 px-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:gap-6">
            <span className="flex items-center gap-2">
              <FaPhoneAlt /> +880 1234 567890
            </span>
            <span className="flex items-center gap-2">
              <FaEnvelope /> book_courier@gmail.com
            </span>
            <span className="hidden md:flex items-center gap-2">
              <FaClock /> Sat – Fri: 7 AM – 11 PM
            </span>
          </div>

          <button
            type="button"
            className="hidden md:flex items-center gap-2 hover:opacity-90"
          >
            <FaComments /> Live Chat
          </button>
        </div>
      </div>

      {/* Main navbar */}
      <div className="border-b border-base-300 bg-(--bc-bg)/90 backdrop-blur-md shadow-md transition-colors">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center text-2xl font-bold text-(--bc-text)">
            <Logo />
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex menu-horizontal gap-6 font-medium">
            {links}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle desktop */}
            <button
              onClick={handleThemeToggle}
              className="btn btn-circle border hidden md:flex bg-(--bc-surface) text-(--bc-text)"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-3 border rounded-full border-(--color-primary)"
              aria-label="Cart"
              title="Cart"
            >
              <FaShoppingCart className="text-(--color-primary)" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth buttons desktop */}
            <div className="hidden md:flex">
              {!user ? (
                <div className="flex gap-3">
                  <NavLink to="/login" className="btn-outline">
                    Login
                  </NavLink>
                  <NavLink to="/register" className="btn-primary">
                    Register
                  </NavLink>
                </div>
              ) : (
                <div className="flex items-center gap-3">
          
                  <div className="relative group">
                    <img
                      src={user?.photoURL || defaultAvatar}
                      onError={(e) => (e.target.src = defaultAvatar)}
                      alt="user"
                      className="w-10 h-10 rounded-full border cursor-pointer"
                    />
                    <span className="absolute hidden group-hover:block bg-black text-white text-sm px-2 py-1 rounded-md -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      {user?.displayName}
                    </span>
                  </div>
                  

                  <button
                    className="btn-outline"
                    onClick={() => logOut().catch(() => {})}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-3 border rounded-full border-(--color-primary)"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open menu"
              title="Menu"
            >
              <FaBars className="text-(--color-primary)" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-(--color-primary) bg-(--bc-surface) p-4">
            <ul className="flex flex-col gap-3">{links}</ul>

            <div className="mt-4 flex flex-col gap-3">
              {!user ? (
                <>
                  <NavLink to="/login" className="btn-outline w-full text-center">
                    Login
                  </NavLink>
                  <NavLink to="/register" className="btn-primary w-full text-center">
                    Register
                  </NavLink>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <img
                      src={user?.photoURL || defaultAvatar}
                      className="w-10 h-10 rounded-full border object-cover"
                      alt="user"
                    />
                    <p className="text-(--bc-text)">{user?.displayName}</p>
                  </div>
                  <button className="btn-outline w-full" onClick={() => logOut()}>
                    Logout
                  </button>
                </>
              )}
              <button
                onClick={handleThemeToggle}
                className="btn btn-circle border bg-(--bc-surface) text-(--bc-text)"
                aria-label="Toggle theme"
                title="Toggle theme"
              >
                {theme === "dark" ? <FaSun /> : <FaMoon />}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;