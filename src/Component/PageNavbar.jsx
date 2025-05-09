import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";

const PageNavbar = ({ menus, activeMenu, onMenuClick, isMobileMenuOpen, currentLang }) => {
  const [dropdown, setDropdown] = useState(null);
  const location = useLocation();
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getMenuUrl = (menu) => {
    const basePath = currentLang === 2 ? "/km" : "";
    // Use p_alias if available, otherwise fallback to "/"
    const aliasPath = menu.p_alias ? `/${menu.p_alias}` : "/";
    return `${basePath}${aliasPath}`;
  };

  return (
    <nav
      lang={currentLang === 2 ? "km" : "en"}
      className={`container mx-auto relative lg:flex lg:space-x-6 text-sm 2xl:text-base ${
        currentLang === 2 ? "lang-khmer font-khmer" : "lang-english font-sans"
      }`}
      ref={navbarRef}
    >
      <div className="md:flex space-x-6 uppercase">
        {menus
          .filter((menu) => menu.menup_id === null)
          .map((menu) => {
            const isActive = location.pathname === getMenuUrl(menu);
            const hasChildren =
              menu.children &&
              menu.children.length > 0 &&
              menu.children.some((child) => child.display === 1);

            return (
              <div
                key={menu.menu_id}
                className="relative hidden lg:block"
                onMouseEnter={() => setDropdown(menu.menu_id)}
                onMouseLeave={() => setDropdown(null)}
              >
                <Link
                  to={getMenuUrl(menu)}
                  className={`flex items-center text-[16px] uppercase hover:text-red-900 ${
                    currentLang === 2 ? "font-khmer" : "font-sans"
                  } ${isActive ? "text-red-900 font-bold" : ""}`}
                  onClick={() => {
                    setDropdown(null);
                    onMenuClick(menu.menu_id);
                  }}
                >
                  {menu.title}
                  {hasChildren && <FiChevronDown className="inline ml-2" />}
                </Link>

                {hasChildren && dropdown === menu.menu_id && (
                  <motion.div
                    className="absolute left-0 mt-0 bg-white shadow-md rounded-md py-2 w-52 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {menu.children
                      .filter((child) => child.display === 1)
                      .map((child) => {
                        const childUrl = getMenuUrl(child);
                        return (
                          <Link
                            key={child.menu_id}
                            to={childUrl}
                            className={`block px-4 py-2 text-[18px] hover:text-red-900 ${
                              currentLang === 2 ? "font-khmer" : "font-semibold"
                            } ${
                              location.pathname === childUrl
                                ? "text-red-900 font-bold"
                                : ""
                            }`}
                            onClick={() => {
                              setDropdown(null);
                              onMenuClick(child.menu_id);
                            }}
                          >
                            {child.title}
                          </Link>
                        );
                      })}
                  </motion.div>
                )}
              </div>
            );
          })}
      </div>
    </nav>
  );
};

export default PageNavbar;