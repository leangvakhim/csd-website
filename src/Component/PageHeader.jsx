import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import PageSearch from "./PageSearch";
import { API_ENDPOINTS, API } from "../Service/APIconfig";
import PageNavbar from "./PageNavbar";
import axios from "axios";
import Flag from "react-world-flags";

const PageHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [menus, setMenus] = useState([]);
  const [settings, setSettings] = useState({
    facultyTitle: "",
    departmentTitle: "",
    logoUrl: "/placeholder-icon.png", // Store resolved URL
  });
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileDropdowns, setMobileDropdowns] = useState({});
  const [currentLang, setCurrentLang] = useState(1); // Default to English (1)
  const [pages, setPages] = useState([]);
  const [menusWithAlias, setMenusWithAlias] = useState([]);
  const searchContainerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();

  // Function to get the logo URL based on the image ID
  const getLogoUrl = async (imageId) => {
    if (!imageId) {
      console.warn("No imageId provided for logo");
      return "/placeholder-icon.png";
    }
    try {
      console.log(`Fetching logo for imageId: ${imageId}`);
      const res = await axios.get(`${API_ENDPOINTS.getImage}?id=${imageId}`);
      console.log("Image API response:", res.data);
      // Handle various response formats
      const filename =
        res.data?.img ||
        res.data?.image_url ||
        res.data?.image?.img ||
        res.data?.filename ||
        res.data?.image?.filename;
      if (!filename) {
        console.warn("No valid filename or URL in image API response:", res.data);
        return "/placeholder-icon.png";
      }
      const url = filename.startsWith("http")
        ? filename
        : `${API}/storage/uploads/${filename}`;
      console.log(`Resolved logo URL: ${url}`);
      return url;
    } catch (err) {
      console.error(`Error fetching logo URL for imageId ${imageId}:`, err);
      return "/placeholder-icon.png";
    }
  };

useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch menus, settings, and pages at the same time
      const [menuRes, settingRes, pageRes] = await Promise.all([
        axios.get(API_ENDPOINTS.getMenu),
        axios.get(API_ENDPOINTS.getSetting),
        axios.get(API_ENDPOINTS.getPage),
      ]);

      // Handle menus
      const menuData = menuRes.data?.data || [];
      const filteredMenus = menuData
        .filter((menu) => menu.lang === currentLang)
        .filter((menu) => menu.display === 1)
        .sort((a, b) => b.menu_order - a.menu_order);
      setMenus(filteredMenus);

      // Handle settings and resolve logo
      const settingData = settingRes.data?.data;
      if (settingData && Array.isArray(settingData)) {
        const langSettings = settingData.find((item) => item.lang === currentLang) || settingData[0];
        if (langSettings) {
          const logoUrl = await getLogoUrl(langSettings.set_logo);
          setSettings({
            facultyTitle: langSettings.set_facultytitle || "",
            departmentTitle: langSettings.set_facultydep || "",
            logoUrl: logoUrl || "/placeholder-icon.png",
          });
        } else {
          console.warn("No settings found for current language or default");
          setSettings((prev) => ({
            ...prev,
            logoUrl: "/placeholder-icon.png",
          }));
        }
      } else {
        console.warn("Settings data is not an array:", settingData);
        setSettings((prev) => ({
          ...prev,
          logoUrl: "/placeholder-icon.png",
        }));
      }

      // Handle pages and combine alias with menu
      const pageData = pageRes.data?.data || [];
      const combinedMenus = filteredMenus.map(menu => {
        const matchedPage = pageData.find(page => page.p_menu === menu.menu_id);
        return {
          ...menu,
          p_alias: matchedPage ? matchedPage.p_alias : null,
        };
      });
      setMenusWithAlias(combinedMenus);

    } catch (err) {
      console.error("Error fetching menus, settings, or pages:", err);
      setSettings((prev) => ({
        ...prev,
        logoUrl: "/placeholder-icon.png",
      }));
    }
  };

  fetchData();
}, [currentLang]);

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

  const toggleLanguage = () => {
    setCurrentLang((prevLang) => (prevLang === 1 ? 2 : 1));
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
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-icon.png";
                }}
              />
              <h2 className="lg:text-lg font-normal text-sm uppercase hidden sm:block">
                {settings.facultyTitle} <br /> {settings.departmentTitle}
              </h2>
            </Link>

            {/* Desktop Navigation and Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden lg:block">
                <PageNavbar
                  // menus={menus}
                  menus={menusWithAlias}
                  activeMenu={activeMenu}
                  onMenuClick={setActiveMenu}
                  isMobileMenuOpen={isMobileMenuOpen}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleLanguage}
                  className="p-2 text-sm bg-gray-100 rounded hover:bg-gray-200 flex items-center space-x-2"
                >
                  <Flag
                    code={currentLang === 1 ? "KH" : "GB"}
                    alt={currentLang === 1 ? "Khmer" : "English"}
                    className="w-6 h-4"
                  />
                  <span>{currentLang === 1 ? "KH" : "EN"}</span>
                </button>
                {!isSearchOpen && (
                  <button onClick={toggleSearchBar} className="p-2 text-gray-600 hover:text-red-800">
                    <IoMdSearch className="text-3xl" />
                  </button>
                )}
                <button
                  onClick={toggleMobileMenu}
                  className="lg:hidden text-gray-600 hover:text-red-800 p-2"
                >
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
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-icon.png";
                }}
              />
              <h2 className="text-sm font-normal uppercase">
                {settings.facultyTitle} <br /> {settings.departmentTitle}
              </h2>
            </Link>

            <button
              onClick={toggleMobileMenu}
              className="absolute right-6 top-4 text-gray-600 hover:text-red-800"
            >
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
                        className="flex items-center justify-between"
                      >
                        <Link
                          to={`/${menu.title.toLowerCase()}`}
                          className={`uppercase hover:text-red-800 ${
                            isActive ? "text-red-900 font-bold" : ""
                          }`}
                          onClick={toggleMobileMenu}
                        >
                          {menu.title}
                        </Link>
                        {hasChildren && (
                          <button>
                            <FiChevronDown
                              className={`transition-transform ${
                                mobileDropdowns[menu.menu_id] ? "rotate-180" : ""
                              }`}
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
                              className={`block hover:text-red-800 ${
                                location.pathname === `/${child.title.toLowerCase()}`
                                  ? "text-red-900 font-bold"
                                  : ""
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