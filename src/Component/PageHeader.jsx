import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import PageSearch from "./PageSearch";
import { API_ENDPOINTS } from "../Service/APIconfig";
import PageNavbar from "./PageNavbar";
import axios from "axios";

const PageHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [menus, setMenus] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileDropdowns, setMobileDropdowns] = useState({}); 

  const searchContainerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation(); // ✅ For active link detection

  useEffect(() => {
    axios.get(API_ENDPOINTS.getMenu)
      .then((res) => {
        const data = res.data?.data || [];
        const selectedLang = 1;
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

  const toggleMobileDropdown = (menuId) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
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
              <div className="hidden lg:block">
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
                <button onClick={toggleMobileMenu} className="lg:hidden text-gray-600 hover:text-red-800 p-2">
                  {isMobileMenuOpen ? <FaTimes className="text-3xl" /> : <FaBars className="text-3xl" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden fixed top-0 left-0 w-full h-full bg-white shadow-md z-40 overflow-y-auto"
        >
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
              {menus
                .filter((menu) => menu.menup_id === null)
                .map((menu) => {
                  const isActive = location.pathname === `/${menu.title.toLowerCase()}`;
                  const children = (menu.children || []).filter((child) => child.display === 1);
                  const hasChildren = children.length > 0;

                  return (
                    <div key={menu.menu_id}>
                      <div
                        onClick={() => toggleMobileDropdown(menu.menu_id)}
                        className="flex items-center justify-between">
                        <Link
                          to={`/${menu.title.toLowerCase()}`}
                          className={`uppercase hover:text-red-800 ${isActive ? "text-red-900 font-bold" : ""}`}
                          onClick={toggleMobileMenu}
                        >
                          {menu.title}
                        </Link>
                        {hasChildren && (
                          <button>
                            <FiChevronDown
                              className={`transition-transform ${mobileDropdowns[menu.menu_id] ? "rotate-180" : ""}`}
                            />
                          </button>
                        )}
                      </div>

                      {hasChildren && mobileDropdowns[menu.menu_id] && (
                        <div className="ml-4 mt-2 space-y-2">
                          {children.map((child) => (
                            <Link
                              key={child.menu_id}
                              to={`/${child.title.toLowerCase()}`}
                              className={`block hover:text-red-800 ${location.pathname === `/${child.title.toLowerCase()}` ? "text-red-900 font-bold" : ""
                                }`}
                              onClick={toggleMobileMenu}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
