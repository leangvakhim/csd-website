import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { MdExplore, MdComputer } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';

// Custom hook for debouncing
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

const ResearchSection = ({section}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [researchData, setResearchData] = useState([]);
  const [headerData, setHeaderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce the search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const researchResponse = await axios.get(API_ENDPOINTS.getResearch);
        const researchData = researchResponse.data?.data || [];

        const formattedResearchData = researchData
          .filter((item) => item.display === 1 && item.active === 1
            && item.lang === currentLang)
          .map((item) => ({
            id: item.rsd_id,
            title: item.rsd_title || 'Untitled Research',
            description: item.rsd_subtitle || 'No description available',
            image: item.image?.img
              ? `${API}/storage/uploads/${item.image.img}`
              : '/placeholder-image.jpg',
            lead: item.rsd_lead || 'Unknown Lead',
          }));

        setResearchData(formattedResearchData);

        const headerResponse = await axios.get(API_ENDPOINTS.getHeaderSection);
        const headerList = headerResponse.data?.data || [];

        const matchedHeader = headerList.find(
          (item) =>
            item.hsec_sec === section.sec_id &&
            item.section?.sec_type === "Research" &&
            item.section?.display === 1 &&
            item.section?.active === 1
        );

        if (matchedHeader) {
          setHeaderData({
            title: matchedHeader.hsec_title || '',
            subtitle: matchedHeader.hsec_subtitle || '',
          });
        } else {
          setHeaderData({
            title: '',
            subtitle: '',
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter sections based on debounced search term and selected filter
  const filteredSections = researchData.filter((section) => {
    const matchesSearch =
      section.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      section.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      section.lead.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesFilter = selectedFilter
      ? section.title.toLowerCase().includes(selectedFilter.toLowerCase())
      : true;
    return matchesSearch && matchesFilter;
  });

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="my-8 text-center text-gray-600">
        Loading research data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8 text-center text-gray-600">
        {error}
      </div>
    );
  }

  return (
    <div className="my-8 sm:my-12 lg:my-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row justify-between items-center mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-6 xl:mb-0">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
              {headerData?.title || 'Students Research'}
            </h2>
            <p className="text-gray-600 mt-4 sm:mt-6 text-sm sm:text-base max-w-2xl">
              {headerData?.subtitle ||
                'A Deep Dive into Computer Science Research: From Fundamentals to Future Innovations'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search for research..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-full py-2 px-4 pl-10 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 w-full transition-all"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-sm" />
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
            <button
              onClick={() => setSelectedFilter(selectedFilter ? '' : 'IoT')}
              className="flex items-center gap-2 bg-red-800 text-white px-4 py-2 rounded-full shadow hover:bg-red-900 transition w-full sm:w-auto justify-center text-sm sm:text-base"
            >
              <FaFilter className="text-sm" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="mt-8 sm:mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {filteredSections.map((section) => (
              <div
                key={section.id}
                className="bg-white rounded-lg shadow-md relative group overflow-hidden"
              >
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-48 sm:h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="absolute inset-0 p-3 sm:p-4 lg:p-6 flex flex-col justify-between text-white">
                  <div className="flex flex-col justify-center items-end py-2 sm:py-3">
                    <button className="text-black text-[9px] sm:text-[10px] lg:text-xs bg-gray-300 py-1 sm:py-1.5 px-2 sm:px-3 lg:px-4 shadow-md rounded-full flex items-center mb-2">
                      <MdComputer className="mr-1 text-xs sm:text-sm" />
                      <span className="truncate w-full">
                        {section.lead}
                      </span>
                    </button>
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base lg:text-xl font-semibold mb-1 sm:mb-2 line-clamp-2">
                      {section.title}
                    </h3>
                    <p className="mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base line-clamp-2 sm:line-clamp-3">
                      {section.description}
                    </p>
                    <button
                      onClick={() => {
                        navigate(`/research/${section.id}`);
                      }}
                      className="bg-red-900 hover:bg-red-800 text-xs sm:text-sm lg:text-base text-white py-1 sm:py-1.5 px-3 sm:px-4 lg:px-6 rounded-full flex items-center"
                    >
                      <MdExplore className="mr-1 text-xs sm:text-base" />
                      {currentLang === 1 ? "Explore" : "មើលបន្ថែម"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchSection;