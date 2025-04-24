import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import PageSearch from "./PageSearch";
import { API_ENDPOINTS } from "../Service/APIconfig";
import PageNavbar from './PageNavbar'
import axios from "axios";

const PageHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [menus, setMenus] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);

  const searchContainerRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    axios.get(API_ENDPOINTS.getMenu)
      .then((res) => {
        const data = res.data?.data || [];
        const selectedLang = 1; // 1 for English, 2 for Khmer
        const filteredMenus = data
          .filter(menu => menu.lang === selectedLang)
          .filter(display => display.display === 1)
          .sort((a, b) => b.menu_order - a.menu_order);
        setMenus(filteredMenus);
      })
      .catch((err) => {
        console.error("Error fetching menu data:", err);
      });
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearchBar = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleClickOutside = (e) => {
    if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
      setIsSearchOpen(false);
    }
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white shadow-md sticky top-0">
      {/* Search Bar */}
      {isSearchOpen && (
        <div className="absolute top-0 left-0 w-full bg-red-800 py-4 z-50">
          <div className="max-w-7xl mx-auto px-4" ref={searchContainerRef}>
            <PageSearch onToggle={toggleSearchBar} />
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className={`p-4 ${isSearchOpen ? "pt-26" : ""}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-14 h-14 bg-gray-200" />
              <h2 className="lg:text-lg font-normal text-sm uppercase hidden sm:block">
                Faculty of Science <br /> Department of Computer Science
              </h2>
            </Link>

            {/* Desktop Navigation and Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden xl:block">
                <PageNavbar
                  menus={menus}
                  activeMenu={activeMenu}
                  onMenuClick={setActiveMenu}
                  isMobileMenuOpen={isMobileMenuOpen}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                {!isSearchOpen && (
                  <button onClick={toggleSearchBar} className="p-2 text-gray-600 hover:text-red-800">
                    <IoMdSearch className="text-3xl" />
                  </button>
                )}
                <button onClick={toggleMobileMenu} className="xl:hidden text-gray-600 hover:text-red-800 p-2">
                  {isMobileMenuOpen ? <FaTimes className="text-3xl" /> : <FaBars className="text-3xl" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="xl:hidden fixed top-0 left-0 w-full h-full bg-white shadow-md z-40 overflow-y-auto">
          <div className="p-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-14 h-14 bg-gray-200" />
              <h2 className="text-sm font-normal uppercase">
                Faculty of Science <br /> Department of Computer Science
              </h2>
            </Link>

            <button onClick={toggleMobileMenu} className="absolute right-6 top-4 text-gray-600 hover:text-red-800">
              <FaTimes className="text-3xl" />
            </button>

            <div className="flex flex-col space-y-4 mt-10">
              <Link to="/" className="py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              {menus.map((menu) => (
                <div key={menu.menu_id}>
                  <Link
                    to={`/${menu.title.toLowerCase()}`}
                    className="py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {menu.title}
                  </Link>
                  {menu.children && activeMenu === menu.menu_id && (
                    <div className="ml-4">
                      {menu.children
                        .filter((child) => child.display === 1)
                        .map((child) => (
                          <Link
                            key={child.menu_id}
                            to={`/${child.title.toLowerCase()}`}
                            className="block py-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {child.title}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default PageHeader;
