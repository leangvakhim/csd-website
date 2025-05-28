import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { IoMdSearch } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { axiosInstance, API_ENDPOINTS } from '../Service/APIconfig';

// Utility function for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const PageSearch = ({ onToggle, placeholder = 'Search pages...', debounceDelay = 300 }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const resultsRef = useRef(null);
  const prevQueryRef = useRef('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, debounceDelay);

  const toggleSearch = useCallback(() => {
    onToggle();
    setQuery('');
    setFocusedIndex(-1);
    setSearchResults([]);
    setError(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [onToggle]);

  useEffect(() => {
    setSearchResults([]);
  }, []);

  const fetchData = async () => {
    if (debouncedQuery.trim() === prevQueryRef.current) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('Fetching pages from:', `${API_ENDPOINTS.getPage}?query=${encodeURIComponent(debouncedQuery)}`);
      const response = await axiosInstance.get(`${API_ENDPOINTS.getPage}?query=${encodeURIComponent(debouncedQuery)}`);
      console.log('Response:', response.data);
      setSearchResults(Array.isArray(response.data?.data) ? response.data.data : []);
      prevQueryRef.current = debouncedQuery.trim();
    } catch (err) {
      console.error('Error fetching pages:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError('Authentication failed: Please log in or try again.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch page results. Please try again.');
      }
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    try {
      console.log('Attempting to refresh token...');
      const refreshResponse = await axiosInstance.post(API_ENDPOINTS.refreshToken, {
        refreshToken: localStorage.getItem('refreshToken'),
      });
      localStorage.setItem('authToken', refreshResponse.data.token);
      console.log('Token refreshed successfully');
      prevQueryRef.current = '';
      await fetchData();
    } catch (refreshErr) {
      console.error('Failed to refresh token:', refreshErr.response?.data || refreshErr.message);
      setError('Unable to authenticate. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      setError(null);
      prevQueryRef.current = '';
      return;
    }

    fetchData();
  }, [debouncedQuery]);

  useEffect(() => {
    if (focusedIndex >= 0 && resultsRef.current) {
      const focusedElement = resultsRef.current.querySelector(`#result-${focusedIndex}`);
      if (focusedElement) {
        focusedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setQuery('');
        setFocusedIndex(-1);
        setSearchResults([]);
        setError(null);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setQuery('');
        setFocusedIndex(-1);
        setSearchResults([]);
        setError(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (!searchResults.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (focusedIndex >= 0) {
          const selectedItem = searchResults[focusedIndex];
          console.log('Selected:', selectedItem);
          if (selectedItem.p_alias) {
            navigate(selectedItem.p_alias);
            toggleSearch();
          }
        }
      }
    },
    [searchResults, focusedIndex, navigate, toggleSearch]
  );

  const handleResultClick = useCallback(
    (item) => {
      console.log('Selected:', item);
      if (item.p_alias) {
        navigate(item.p_alias);
        toggleSearch();
      }
    },
    [navigate, toggleSearch]
  );

  return (
    <div className="relative flex flex-col justify-center items-center w-full" ref={containerRef}>
      <motion.div
        className="relative flex items-center w-full min-w-[300px] max-w-6xl"
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <motion.div className="relative flex items-center w-full">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Global page search"
            aria-activedescendant={focusedIndex >= 0 ? `result-${focusedIndex}` : undefined}
            className="w-full px-6 py-4 rounded-lg border bg-white border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-800"
          />
          <div className="text-2xl absolute right-6 text-gray-500">
            <IoMdSearch />
          </div>
        </motion.div>
        <button
          onClick={toggleSearch}
          className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </motion.div>

      {debouncedQuery.trim() && (
        <div
          ref={resultsRef}
          className="absolute top-16 w-full min-w-[300px] max-w-6xl bg-white border border-gray-300 rounded-lg shadow-md max-h-96 overflow-y-auto z-50"
          role="listbox"
          aria-live="polite"
        >
          <div className="w-full">
            {isLoading ? (
              <div className="px-4 py-2 text-gray-500 flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </div>
            ) : error ? (
              <div className="px-4 py-2 text-red-500">
                {error}
                <button className="ml-2 text-blue-500 underline" onClick={handleRetry}>
                  Retry
                </button>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="px-4 py-2 text-gray-600 font-semibold border-b border-gray-200">
                  Pages
                </div>
                {searchResults.map((item, index) => (
                  <div
                    key={item.id || index}
                    id={`result-${index}`}
                    className={`flex items-start px-4 py-3 text-gray-700 cursor-pointer hover:bg-gray-100 ${
                      focusedIndex === index ? 'bg-gray-100' : ''
                    }`}
                    role="option"
                    aria-selected={focusedIndex === index}
                    onClick={() => handleResultClick(item)}
                  >
                    {item.p_image && (
                      <img
                        src={item.p_image}
                        alt={item.p_title || 'Page image'}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                        onError={(e) => (e.target.style.display = 'none')} // Hide broken images
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{item.p_title || 'Untitled Page'}</div>
                      {item.p_subtitle && (
                        <div className="text-sm text-gray-500 mt-1">{item.p_subtitle}</div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="px-4 py-2 text-gray-500">No pages found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PageSearch;