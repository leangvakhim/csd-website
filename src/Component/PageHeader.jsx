import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import PageSearch from "./PageSearch";
import { API_ENDPOINTS, axiosInstance } from "../Service/APIconfig";
import PageNavbar from "./PageNavbar";
import Flag from "react-world-flags";

const PageHeader = ({ currentLang, setCurrentLang, settings, setSettings }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [menus, setMenus] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileDropdowns, setMobileDropdowns] = useState({});
  const [menusWithAlias, setMenusWithAlias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchContainerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [menuRes, pageRes] = await Promise.all([
          axiosInstance.get(API_ENDPOINTS.getMenu),
          axiosInstance.get(API_ENDPOINTS.getPage),
        ]);
        const menuData = menuRes.data?.data || [];
        const pageData = pageRes.data?.data || [];
        // Filter menus by language and display status, sort by menu_order
        const filteredMenus = menuData
          .filter((menu) => menu.lang === currentLang && menu.display === 1)
          .sort((a, b) => b.menu_order - a.menu_order);
        // Build a menu tree with children and sanitized p_alias
        const menuMap = new Map();
        filteredMenus.forEach((menu) => {
          menu.children = [];
          menuMap.set(menu.menu_id, { ...menu });
        });
        filteredMenus.forEach((menu) => {
          if (menu.menup_id) {
            const parent = menuMap.get(menu.menup_id);
            if (parent) {
              parent.children.push(menuMap.get(menu.menu_id));
            }
          }
        });

        menuMap.forEach((menu) => {
          if (menu.children && menu.children.length > 0) {
            menu.children.sort((a, b) => a.menu_order - b.menu_order);
          }
        });

        // Combine menus with page aliases, sanitizing p_alias
        const combinedMenus = Array.from(menuMap.values())
          .filter((menu) => !menu.menup_id) // Top-level menus only
          .map((menu) => {
            const matchedPage = pageData.find((page) => page.p_menu === menu.menu_id);
            let p_alias = matchedPage ? matchedPage.p_alias : null;
            if (p_alias) {
              p_alias = p_alias.replace(/^\/?(km\/)?/, "").replace(/\/$/, "");
              if (p_alias === "home") p_alias = "";
            }
            return {
              ...menu,
              p_alias,
              children: menu.children.map((child) => {
                const childPage = pageData.find((page) => page.p_menu === child.menu_id);
                let childAlias = childPage ? childPage.p_alias : null;
                if (childAlias) {
                  childAlias = childAlias.replace(/^\/?(km\/)?/, "").replace(/\/$/, "");
                  if (childAlias === "home") childAlias = "";
                }
                return {
                  ...child,
                  p_alias: childAlias,
                };
              }),
            };
          });
        setMenus(filteredMenus);
        setMenusWithAlias(combinedMenus);
      } catch (err) {
        console.error("Error fetching menus or pages:", err);
        setError("Failed to load navigation. Please try again.");
        setSettings((prev) => ({
          ...prev,
          logoUrl: "/placeholder-icon.png",
        }));
        // Fallback menu structure
        setMenusWithAlias([
          {
            menu_id: "fallback",
            title: currentLang === 2 ? "ទំព័រដើម" : "Home",
            p_alias: "",
            children: [],
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentLang, setSettings]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleSearchBar = () => {
    setIsSearchOpen((prev) => !prev);
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
    const newLang = currentLang === 1 ? 2 : 1;
    let currentPath = location.pathname;
    const query = location.search;
    // Remove /km prefix if present
    if (currentPath.startsWith("/km")) {
      currentPath = currentPath.replace(/^\/km/, "") || "/";
    }
    // Ensure no duplicate /km when switching to Khmer
    const newPath = newLang === 2 ? `/km${currentPath === "/" ? "" : currentPath}` : currentPath || "/";
    navigate(`${newPath}${query}`);
    setCurrentLang(newLang);
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

  const getMenuUrl = (menu) => {
    const basePath = currentLang === 2 ? "/km" : "";
    // Use p_alias if available, otherwise fallback to "/"
    const aliasPath = menu.p_alias ? `/${menu.p_alias}` : "/";
    return `${basePath}${aliasPath}`;
  };

  return (
    <div
      lang={currentLang === 2 ? "km" : "en"}
      className={`bg-white shadow-md sticky top-0 z-50 ${currentLang === 2 ? "lang-khmer" : "lang-english"}`}
    >
      {/* Loading State */}
      {isLoading && (
        <div className={`text-center py-2 text-gray-600 ${currentLang === 2 ? "font-khmer" : "font-sans"}`}>
          {currentLang === 2 ? "កំពុងផ្ទុក..." : "Loading navigation..."}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={`text-center py-2 text-red-600 ${currentLang === 2 ? "font-khmer" : "font-sans"}`}>
          {error}
        </div>
      )}

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="absolute top-0 left-0 w-full bg-red-800 py-4 z-50">
          <div className="max-w-7xl mx-auto px-4" ref={searchContainerRef}>
            <PageSearch onToggle={toggleSearchBar} currentLang={currentLang} />
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className={`p-4 ${isSearchOpen ? "pt-20 md:pt-26" : ""}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2">
            {/* Logo */}
            <Link to={settings.baseUrl || "/"} className="flex items-center space-x-2">
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="w-10 h-10 md:w-14 md:h-14 object-contain"
                onError={(e) => {
                  if (e.target.src !== "/placeholder-icon.png") {
                    e.target.src = "/placeholder-icon.png";
                  }
                }}
              />
              <h2
                className={`lg:text-lg text-sm uppercase hidden sm:block ${currentLang === 2
                  ? "font-khmer leading-5 md:leading-8"
                  : "font-bold leading-5 md:leading-normal"
                  }`}
              >
                {settings.facultyTitle} <br className="hidden lg:block" /> {settings.departmentTitle}
              </h2>
            </Link>

            {/* Desktop Navigation and Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden lg:block">
                <PageNavbar
                  menus={menusWithAlias}
                  activeMenu={activeMenu}
                  onMenuClick={setActiveMenu}
                  isMobileMenuOpen={isMobileMenuOpen}
                  currentLang={currentLang}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleLanguage}
                  aria-label={`Switch to ${currentLang === 1 ? "Khmer" : "English"}`}
                  className="p-2 text-sm bg-gray-100 rounded hover:bg-gray-200 flex items-center space-x-2"
                >
                  <Flag
                    code={currentLang === 1 ? "KH" : "GB"}
                    alt={currentLang === 1 ? "Khmer" : "English"}
                    className="w-6 h-4"
                  />
                  <span className={currentLang === 2 ? "font-khmer" : "font-sans"}>
                    {currentLang === 1 ? "KH" : "EN"}
                  </span>
                </button>
                {!isSearchOpen && (
                  <button
                    onClick={toggleSearchBar}
                    aria-label="Toggle search"
                    className="p-2 text-gray-600 hover:text-red-800"
                  >
                    <IoMdSearch className="text-2xl md:text-3xl" />
                  </button>
                )}
                <button
                  onClick={toggleMobileMenu}
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  className="lg:hidden text-gray-600 hover:text-red-800 p-2"
                >
                  {isMobileMenuOpen ? <FaTimes className="text-2xl md:text-3xl" /> : <FaBars className="text-2xl md:text-3xl" />}
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
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Link to={settings.baseUrl || "/"} className="flex items-center space-x-2">
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    if (e.target.src !== "/placeholder-icon.png") {
                      e.target.src = "/placeholder-icon.png";
                    }
                  }}
                />
                <h2
                  className={`text-sm font-normal uppercase ${currentLang === 2 ? "font-khmer" : "font-sans"}`}
                >
                  {settings.facultyTitle} <br /> {settings.departmentTitle}
                </h2>
              </Link>

              <button
                onClick={toggleMobileMenu}
                aria-label="Close mobile menu"
                className="text-gray-600 hover:text-red-800"
              >
                <FaTimes className="text-3xl" />
              </button>
            </div>

            <div className="flex flex-col space-y-4">
              {menusWithAlias.map((menu) => {
                const isActive = location.pathname === getMenuUrl(menu);
                const children = menu.children || [];
                const hasChildren = children.length > 0;

                return (
                  <div key={menu.menu_id}>
                    <div
                      onClick={() => hasChildren && toggleMobileDropdown(menu.menu_id)}
                      className="flex items-center justify-between"
                    >
                      <Link
                        to={getMenuUrl(menu)}
                        className={`uppercase hover:text-red-800 ${currentLang === 2 ? "fonts-khmer" : "font-sans"
                          } ${isActive ? "text-red-900 font-bold" : ""}`}
                        onClick={toggleMobileMenu}
                      >
                        {menu.title}
                      </Link>
                      {hasChildren && (
                        <button aria-label={`Toggle ${menu.title} submenu`}>
                          <FiChevronDown
                            className={`transition-transform ${mobileDropdowns[menu.menu_id] ? "rotate-180" : ""
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
                            to={getMenuUrl(child)}
                            className={`block hover:text-red-800 ${currentLang === 2 ? "fonts-khmer" : "font-sans"
                              } ${location.pathname === getMenuUrl(child) ? "text-red-900 font-bold" : ""}`}
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

