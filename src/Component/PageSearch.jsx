import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { IoMdSearch } from "react-icons/io";

// Utility function for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const PageSearch = ({ onToggle, data }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(-1); // For keyboard navigation

  // Debounce the query to avoid excessive filtering
  const debouncedQuery = useDebounce(query, 300);

  // Toggle search and focus input
  const toggleSearch = useCallback(() => {
    onToggle();
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [onToggle]);

  // Handle click outside and escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setQuery("");
        setFocusedIndex(-1);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setQuery("");
        setFocusedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!filteredData.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < filteredData.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      // Handle selection (e.g., navigate to item or trigger action)
      console.log("Selected:", filteredData[focusedIndex]);
    }
  };

  // Filter data based on debounced query
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data) || !debouncedQuery.trim()) {
      return [];
    }

    return data.filter((item) =>
      // Search across multiple fields (e.g., name, description)
      Object.values(item)
        .filter((value) => typeof value === "string")
        .some((value) => value.toLowerCase().includes(debouncedQuery.toLowerCase()))
    );
  }, [debouncedQuery, data]);

  return (
    <div className="relative flex flex-col justify-center items-center w-full" ref={containerRef}>
      <motion.div
        className="relative flex items-center w-full min-w-[300px] max-w-6xl"
        layout
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Input Field */}
        <motion.div className="relative flex items-center w-full">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Global search"
            className="w-full px-6 py-4 rounded-lg border bg-white border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-800"
          />
          <div className="text-2xl absolute right-6 text-gray-500">
            <IoMdSearch />
          </div>
        </motion.div>
      </motion.div>

      {/* Search Results */}
      {debouncedQuery.trim() && (
        <div
          className="absolute top-14 w-full min-w-[300px] max-w-6xl bg-gray-50 border border-gray-300 rounded-lg shadow-md max-h-60 overflow-y-auto z-50"
          role="listbox"
          aria-live="polite"
        >
          <div className="w-full">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100 ${
                    focusedIndex === index ? "bg-gray-100" : ""
                  }`}
                  role="option"
                  aria-selected={focusedIndex === index}
                  onClick={() => console.log("Selected:", item)} // Replace with your action
                >
                  {item.name}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PageSearch;