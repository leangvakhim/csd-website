import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaCalendarAlt, FaTimes, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const FourColScholarshipSection = () => {
  const navigate = useNavigate();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [headerLoading, setHeaderLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headerError, setHeaderError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [headerData, setHeaderData] = useState({
    hsec_title: "Available Scholarships", // Default title
    hsec_amount: 4 // Default number of scholarships
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const BASE_IMAGE_URL = `${API}/storage/uploads`;
  const DEFAULT_IMAGE = '/placeholder-image.jpg';

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        setHeaderLoading(true);
        // Assuming API_ENDPOINTS.getHeaderSection is the endpoint for header data
        const response = await axios.get(API_ENDPOINTS.getHeaderSection);
        if (response.data && response.data.hsec_title) {
          setHeaderData({
            hsec_title: response.data.hsec_title,
            hsec_amount: response.data.hsec_amount || 4
          });
        }
      } catch (error) {
        console.error('Failed to fetch header data:', error);
        setHeaderError('Failed to load section header. Using default values.');
      } finally {
        setHeaderLoading(false);
      }
    };

    const fetchScholarships = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.getScholarship);
        const transformed = response.data.data
          .map(item => ({
            id: item.sc_id,
            tag: item.sc_sponsor,
            title: item.sc_title,
            description: item.sc_shortdesc,
            deadline: new Date(item.sc_deadline).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            imageUrl: item.image?.img ? `${BASE_IMAGE_URL}/${item.image.img}` : DEFAULT_IMAGE
          }))
          .slice(0, headerData.hsec_amount); // Use the amount from header data
        
        setScholarships(transformed);
      } catch (error) {
        console.error('Failed to fetch scholarships:', error);
        setError('Failed to load scholarships. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHeaderData().then(fetchScholarships);
  }, [headerData.hsec_amount]); // Re-fetch when hsec_amount changes

  const tags = [...new Set(scholarships.map(item => item.tag))];

  const filteredScholarships = scholarships.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesTag = selectedTag ? item.tag === selectedTag : true;
    return matchesSearch && matchesTag;
  });

  const handleClearSearch = () => setSearchTerm('');
  const handleClearFilter = () => setSelectedTag('');

  if (headerLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-red-800" />
      </div>
    );
  }

  if (headerError || error) {
    return (
      <div className="text-center py-12 text-red-800">
        {headerError && <p>{headerError}</p>}
        {error && <p>{error}</p>}
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-800 text-white px-4 py-2 rounded-xl hover:bg-red-900"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="my-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:justify-between items-center gap-8 mb-6">
          <h2 className="text-2xl font-semibold">{headerData.hsec_title}</h2>
          <div className='flex flex-col sm:flex-row gap-6 sm:gap-4'>
            {/* Search Field */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring focus:border-blue-300 w-full"
                aria-label="Search scholarships"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <FaTimes className="text-sm" />
                </button>
              )}
            </div>

            {/* Tag Filter Dropdown */}
            <div className="relative w-full">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-50" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="border rounded-full py-2 pl-10 bg-red-800 text-gray-50 focus:outline-none focus:ring focus:border-blue-300 appearance-none w-full"
                aria-label="Filter by bank"
              >
                <option value="">All</option>
                {tags.map((tag, i) => (
                  <option key={i} value={tag}>{tag}</option>
                ))}
              </select>
              {selectedTag && (
                <button
                  onClick={handleClearFilter}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-50 hover:text-gray-200"
                  aria-label="Clear filter"
                >
                  <FaTimes className="text-sm" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scholarships List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredScholarships.length > 0 ? (
            filteredScholarships.map((scholarship) => (
              <div key={scholarship.id} className="bg-white flex flex-col xl:flex-row rounded-lg shadow-md p-4 items-center overflow-hidden">
                <div className="w-78 h-68 bg-gray-100 flex items-center justify-center rounded-2xl">
                  <img
                    src={scholarship.imageUrl}
                    alt={`${scholarship.tag} scholarship`}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_IMAGE;
                    }}
                  />
                </div>
                <div className="p-4">
                  <p className='text-red-800 mb-4'>{scholarship.tag}</p>
                  <h3 className="text-lg font-semibold mb-2">{scholarship.title}</h3>
                  <p className="text-gray-800 mb-2">{scholarship.description}</p>
                  <p className="text-md py-4 text-gray-800 mb-2 flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    Deadline: {scholarship.deadline}
                  </p>
                  <button
                    className="bg-red-800 hover:bg-red-900 text-white py-2 px-4 rounded-xl cursor-pointer"
                    onClick={() => navigate(`/scholars/${scholarship.id}`)}
                    aria-label={`View details for ${scholarship.title}`}
                  >
                    View Detail
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 col-span-full py-12">
              <p>No scholarships found matching your criteria.</p>
              {(searchTerm || selectedTag) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTag('');
                  }}
                  className="mt-4 text-red-800 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FourColScholarshipSection;