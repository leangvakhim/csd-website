import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes, FaArrowRight } from 'react-icons/fa';
import { MdExplore, MdComputer } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from "framer-motion";
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

const ResearchSection = ({section, menuLang}) => {
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

  const resolvePageAlias = async (routePage) => {
    try {
      const res = await axios.get(API_ENDPOINTS.getPage);
      const pages = Array.isArray(res.data?.data) ? res.data.data : [];

      const matched = pages.find((page) => page.p_title === routePage);
      return matched?.p_alias || null;
    } catch (error) {
      console.error("Failed to fetch page alias:", error);
      return null;
    }
  }

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
            ref_id: item.ref_id,
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
            routepage: await resolvePageAlias(matchedHeader.hsec_routepage) || "",
            btntitle: matchedHeader.hsec_btntitle || '',
            amount: matchedHeader.hsec_amount || '',
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

  const filteredSections = researchData
    .filter((section) => {
      const matchesSearch =
        section.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        section.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        section.lead.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      return matchesSearch;
    })
    .slice(0, headerData?.amount);

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
            <div className='flex justify-between'>
              <h2 className={`text-2xl sm:text-3xl font-semibold mb-2 ${currentLang === 2 ? 'font-khmer' : 'font-semibold'}`}>
                {headerData?.title || 'Students Research'}
              </h2>
              <div className='block xl:hidden'>
                {headerData.btntitle ? (
                  <button
                      onClick={() => navigate(headerData.routepage)}
                      className={`flex text-red-800 hover:text-red-900 items-center border-b border-red-800 pb-1 mr-8`}
                      >
                      <span className={`mr-2 lg:text-sm text-[12px] ${currentLang === 2 ? "fonts-khmer" : "font-sans"
                          }`}>{headerData.btntitle}</span>
                      <FaArrowRight className="text-red-800" />
                  </button>
                ) : (
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
                )}
              </div>
            </div>
            <p className={`text-gray-600 mt-4 sm:mt-6 text-sm sm:text-base max-w-2xl ${currentLang === 2 ? 'fonts-khmer' : 'font-sans-serif'}`}>
              {headerData?.subtitle ||
                'A Deep Dive into Computer Science Research: From Fundamentals to Future Innovations'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center lg:mt-0 ">
            {headerData.btntitle ? (
              <button
                  onClick={() => navigate(headerData.routepage)}
                  className={`flex text-red-800 hover:text-red-900 items-center border-b border-red-800 pb-1 mr-8`}
                  >
                  <span className={`hidden xl:block mr-2 lg:text-sm text-[12px] ${currentLang === 2 ? "fonts-khmer" : "font-sans"
                      }`}>{headerData.btntitle}</span>
                  <FaArrowRight className="text-red-800 hidden xl:block" />
              </button>
            ) : (
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
            )}
          </div>
        </div>

        {/* 1 Card of research */}
        {filteredSections.length === 1 && (
          <motion.div
            key={filteredSections[0].ref_id}
            className="bg-black rounded-2xl w-full flex flex-col sm:flex-row items-center mx-auto overflow-hidden mb-6 sm:mb-8 lg:mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 w-full items-center justify-between">
              <div className="w-full sm:w-1/2 flex items-center">
                <img
                  src={filteredSections[0].image}
                  alt={filteredSections[0].title}
                  className="w-full h-auto object-cover rounded-lg shadow-md aspect-[4/3] sm:aspect-[16/9]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
              </div>

              <div className="w-full sm:w-1/2 text-left text-white">
                <motion.h1
                  className={`text-xl font-semibold mb-2 sm:mb-3 uppercase line-clamp-1 ${currentLang === 2 ? "fonts-khmer text-[20px]" : "font-sans-serif"}`}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {filteredSections[0].title}
                </motion.h1>
                <motion.h3
                  className={`text-lg font-semibold line-clamp-3 overflow-hidden mb-2 sm:mb-3 ${currentLang === 2 ? "fonts-khmer" : "font-sans-serif"}`}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {filteredSections[0].description}
                </motion.h3>

                  <div className="flex flex-col justify-center items-start py-2 sm:py-3">
                    <button className="text-black text-[9px] sm:text-[10px] lg:text-xs bg-gray-300 py-1 sm:py-1.5 px-2 sm:px-3 lg:px-4 shadow-md rounded-full flex items-center mb-2">
                      <MdComputer className="mr-1 text-xs sm:text-sm" />
                      <span className={`truncate w-full ${currentLang === 2 ? 'fonts-khmer' : 'font-sans-serif'}`}>
                        {filteredSections[0].lead}
                      </span>
                    </button>
                  </div>
                <div className="mt-3 sm:mt-4">
                  <button
                    onClick={() => {
                      const prefix = window.location.pathname.startsWith('/km') ? '/km' : '';
                      navigate(`${prefix}/research/${filteredSections[0].ref_id}`);
                    }}
                    className={`bg-red-900 hover:bg-red-800 text-xs sm:text-sm lg:text-base text-white py-1 sm:py-1.5 px-3 sm:px-4 lg:px-6 rounded-full flex items-center gap-1 font-normal ${currentLang === 2 ? 'fonts-khmer' : 'font-sans-serif'
                      }`}
                  >
                    <MdExplore className={`mr-1 text-xs sm:text-base `} />
                    {currentLang === 1 ? "Explore" : "មើលបន្ថែម"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {/* 2 Cards of research */}
        {filteredSections.length === 2 && (
          <div className="mt-8 sm:mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
              {filteredSections.map((section) => (
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
        )}
        {/* 3 Cards of research */}
        {filteredSections.length === 3 && (
          <div>
            <motion.div
              key={filteredSections[0].ref_id}
              className="bg-black rounded-2xl w-full flex flex-col sm:flex-row items-center mx-auto overflow-hidden mb-6 sm:mb-8 lg:mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 w-full items-center justify-between">
                <div className="w-full sm:w-1/2 flex items-center">
                  <img
                    src={filteredSections[0].image}
                    alt={filteredSections[0].title}
                    className="w-full h-auto object-cover rounded-lg shadow-md aspect-[4/3] sm:aspect-[16/9]"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                </div>

                <div className="w-full sm:w-1/2 text-left text-white">
                  <motion.h1
                    className={`text-xl font-semibold mb-2 sm:mb-3 uppercase line-clamp-1 ${currentLang === 2 ? "fonts-khmer text-[20px]" : "font-sans-serif"}`}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    {filteredSections[0].title}
                  </motion.h1>
                  <motion.h3
                    className={`text-lg font-semibold line-clamp-3 overflow-hidden mb-2 sm:mb-3 ${currentLang === 2 ? "fonts-khmer" : "font-sans-serif"}`}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    {filteredSections[0].description}
                  </motion.h3>

                    <div className="flex flex-col justify-center items-start py-2 sm:py-3">
                      <button className="text-black text-[9px] sm:text-[10px] lg:text-xs bg-gray-300 py-1 sm:py-1.5 px-2 sm:px-3 lg:px-4 shadow-md rounded-full flex items-center mb-2">
                        <MdComputer className="mr-1 text-xs sm:text-sm" />
                        <span className={`truncate w-full ${currentLang === 2 ? 'fonts-khmer' : 'font-sans-serif'}`}>
                          {filteredSections[0].lead}
                        </span>
                      </button>
                    </div>
                  <div className="mt-3 sm:mt-4">
                    <button
                      onClick={() => {
                        const prefix = window.location.pathname.startsWith('/km') ? '/km' : '';
                        navigate(`${prefix}/research/${filteredSections[0].ref_id}`);
                      }}
                      className={`bg-red-900 hover:bg-red-800 text-xs sm:text-sm lg:text-base text-white py-1 sm:py-1.5 px-3 sm:px-4 lg:px-6 rounded-full flex items-center gap-1 font-normal ${currentLang === 2 ? 'fonts-khmer' : 'font-sans-serif'
                        }`}
                    >
                      <MdExplore className={`mr-1 text-xs sm:text-base `} />
                      {currentLang === 1 ? "Explore" : "មើលបន្ថែម"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="mt-8 sm:mt-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                {filteredSections.slice(1, 3).map((section) => (
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
        )}
        {/* 4 Cards of research */}
        {filteredSections.length === 4 && (
          <div className="mt-8 sm:mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
              {filteredSections.map((section) => (
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
        )}
        {/* More than 5 Cards of research */}
        {filteredSections.length > 4 && (
          <div className="mt-8 sm:mt-12">
            <div className="flex overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-transparent px-4 snap-x snap-mandatory space-x-4">
              {filteredSections.map((section) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="w-[calc(50%-0.5rem)] min-w-[calc(50%-0.5rem)] snap-start flex-shrink-0 bg-white rounded-lg shadow-md relative group overflow-hidden"
                >
                  {/* Content wrapper for image + overlays */}
                  <div className="relative w-full h-full">
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
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchSection;