import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";

const PageNavbar = ({ menus }) => {
  const [dropdown, setDropdown] = useState(null);
  const location = useLocation();
  const navbarRef = useRef(null); // Renamed for clarity

  // Close dropdown if the user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="container mx-auto relative lg:flex lg:space-x-6 text-sm 2xl:text-base"
      ref={navbarRef}
    >
      <div className="lg:flex space-x-6 uppercase">
        {menus
          .filter((menu) => menu.menup_id === null) // Parent menus only
          .map((menu) => {
            const isActive = location.pathname === `/${menu.title.toLowerCase()}`;
            const hasChildren =
              menu.children &&
              menu.children.length > 0 &&
              menu.children.some((child) => child.display === 1);

            return (
              <div
                key={menu.menu_id}
                className="relative hidden lg:block"
                onMouseEnter={() => setDropdown(menu.title)}
                onMouseLeave={() => setDropdown(null)}
              >
                {/* Parent Menu Item as Link */}
                <Link
                  // to={`/${menu.title.toLowerCase()}`}
                  to={menu.p_alias}
                  className={`flex items-center uppercase hover:text-red-900 ${
                    isActive ? "text-red-900 font-bold" : ""
                  }`}
                  onClick={() => setDropdown(null)} // Close dropdown on click
                >
                  {menu.title}
                  {hasChildren && <FiChevronDown className="inline ml-2" />}
                </Link>

                {/* Dropdown for Child Menus */}
                {hasChildren && dropdown === menu.title && (
                  <motion.div
                    className="absolute left-0 mt-0 bg-white shadow-md rounded-md py-2 w-52 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {menu.children
                      .filter((child) => child.display === 1)
                      .map((child) => (
                        <Link
                          key={child.menu_id}
                          to={`/${child.title.toLowerCase()}`}
                          className={`block px-4 py-2 hover:text-red-900 ${
                            location.pathname ===
                            `/${child.title.toLowerCase()}`
                              ? "text-red-900 font-bold"
                              : ""
                          }`}
                          onClick={() => setDropdown(null)}
                        >
                          {child.title}
                        </Link>
                      ))}
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