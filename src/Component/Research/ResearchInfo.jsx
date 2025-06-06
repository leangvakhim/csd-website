import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes, FaArrowRight } from 'react-icons/fa';
import { MdExplore, MdComputer } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { API_ENDPOINTS, API, axiosInstance } from '../../Service/APIconfig';

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

const ResearchInfo = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const [researchData, setResearchData] = useState([]);
    const [headerData, setHeaderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

      // Debounce the search term
      const debouncedSearchTerm = useDebounce(searchTerm, 300);
      const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

      useEffect(() => {
        const fetchData = async () => {
          try {
            const researchResponse = await axiosInstance.get(API_ENDPOINTS.getResearch);
            const researchData = researchResponse.data?.data || [];
            const formattedResearchData = researchData
              .filter((item) => item.display === 1 && item.active === 1
                && item.lang === currentLang)
              .map((item) => ({
                id: item.rsd_id,
                ref_id: item.ref_id,
                title: item.rsd_title || 'Untitled Research',
                description: item.rsd_subtitle || 'No description available',
                image: item.image?.img
                  ? `${API}/storage/uploads/${item.image.img}`
                  : '/placeholder-image.jpg',
                lead: item.rsd_lead || 'Unknown Lead',
              }));

            setResearchData(formattedResearchData);

            setLoading(false);
          } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data. Please try again later.');
            setLoading(false);
          }
        };

        fetchData();
      }, []);

      const filteredSections = researchData
        .filter((section) => {
          const matchesSearch =
            section.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            section.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            section.lead.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
          return matchesSearch;
        })
        .slice(0, headerData?.amount || researchData.length);

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

    const totalPages = Math.ceil(filteredSections.length / itemsPerPage);

    const indexOfLastStudent = currentPage * itemsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
    const displayedData = filteredSections.slice(indexOfFirstStudent, indexOfLastStudent);

    const paginationRange = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);

        const range = [];

        if (currentPage <= 3) {
        range.push(1, 2, 3, 4, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
        range.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
        range.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }

        return range;
    };

    // Reset to page 1 when tab or search query changes
    // useEffect(() => {
    //     setCurrentPage(1);
    // }, [debouncedSearchTerm]);

    const maxPagesToShow = 5; // Show up to 5 page numbers (e.g., 1, 2, ..., 9, 10)
    let pageNumbers = [];
    const totalItems = displayedData.length;

    if (totalPages <= maxPagesToShow) {
        // If total pages are less than or equal to maxPagesToShow, show all pages
        pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
    } else {
        // Show first 2 pages, ellipsis, and last 2 pages
        const firstPages = [1, 2];
        const lastPages = [totalPages - 1, totalPages];
        pageNumbers = [...firstPages];

        // Add ellipsis if there are pages between the first and last sets
        if (totalPages > 5) {
        pageNumbers.push('...');
        }

        pageNumbers.push(...lastPages);
    }

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

      return (
        <div className="my-8 sm:my-12 lg:my-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-center mb-6 sm:mb-8">
              <div className="mb-4 sm:mb-6 xl:mb-0">
                <div className='flex justify-between'>
                  <h2 className={`text-2xl sm:text-3xl font-semibold mb-2 ${currentLang === 2 ? 'font-khmer' : 'font-semibold'}`}>
                    Students Research
                  </h2>
                  <div className='block xl:hidden'>
                    <div className=" flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto">
                        <div className="relative w-full ">
                            <input
                                type="text"
                                placeholder="Search researchs"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="border rounded-full py-2 px-4 pl-10 focus:outline-none w-full"
                                aria-label="Search researchs"
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
                    </div>
                  </div>

                </div>
                <p className={`text-gray-600 mt-4 sm:mt-6 text-sm sm:text-base max-w-2xl ${currentLang === 2 ? 'fonts-khmer' : 'font-sans-serif'}`}>
                  A Deep Dive into Computer Science Research: From Fundamentals to Future Innovations
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-center lg:mt-0 ">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto">
                        <div className="relative w-full hidden xl:block">
                            <input
                                type="text"
                                placeholder="Search researchs"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="border rounded-full py-2 px-4 pl-10 focus:outline-none w-full"
                                aria-label="Search researchs"
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
                    </div>
                </div>
            </div>

            <div className="mt-8 sm:mt-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                  {filteredSections?.length > 0 && filteredSections.map((section) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true, amount: 0.3 }}
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
                            <span className={`truncate w-full ${currentLang === 2 ? 'fonts-khmer' : 'font-sans-serif'}`}>
                              {section.lead}
                            </span>
                          </button>
                        </div>
                        <div>
                          <h3 className={`line-clamp-1 overflow-hidden text-sm sm:text-base lg:text-xl font-semibold mb-1 sm:mb-2 ${currentLang === 2 ? 'fonts-khmer text-[20px]' : 'font-sans-serif'}`}>
                            {section.title}
                          </h3>
                          <p className={`line-clamp-2 overflow-hidden mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base sm:line-clamp-2 ${currentLang === 2 ? 'fonts-khmer' : 'font-sans-serif'}`}>
                            {section.description}
                          </p>
                          <button
                            onClick={() => {
                              const prefix = window.location.pathname.startsWith('/km') ? '/km' : '';
                              navigate(`${prefix}/research/${section.ref_id}`);
                            }}
                            className={`bg-red-900 hover:bg-red-800 text-xs sm:text-sm lg:text-base text-white py-1 sm:py-1.5 px-3 sm:px-4 lg:px-6 rounded-full flex items-center gap-1 font-normal ${currentLang === 2 ? 'fonts-khmer' : 'font-sans-serif'
                              }`}

                          >
                            <MdExplore className={`mr-1 text-xs sm:text-base `} />
                            {currentLang === 1 ? "Explore" : "មើលបន្ថែម"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
          </div>
          {totalItems > 0 && (
            <div className="flex justify-center mt-6 space-x-2">
                <button
                onClick={() => handlePageChange(currentPage - 1)}
                className={`sm:px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-200 ${currentPage === 1 && "opacity-50 cursor-not-allowed"
                    }`}
                >
                <HiChevronLeft size={18} />
                </button>

                {paginationRange().map((page, index) =>
                page === '...' ? (
                    <span key={index} className="px-3 py-1 text-gray-700">...</span>
                ) : (
                    <button
                    key={index}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border rounded-md text-md ${currentPage === page ? "bg-red-800 text-white" : "text-gray-700 hover:bg-gray-200"}`}
                    >
                    {page}
                    </button>
                )
                )}

                <button
                onClick={() => handlePageChange(currentPage + 1)}
                className={`sm:px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-200 ${currentPage === totalPages && "opacity-50 cursor-not-allowed"
                    }`}
                >
                <HiChevronRight size={18} />
                </button>
            </div>
        )}
        </div>

    );
}

export default ResearchInfo