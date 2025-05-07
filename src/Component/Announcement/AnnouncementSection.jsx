import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes, FaSpinner, FaArrowRight } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
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

const AnnouncementSection = ({ section, menuLang }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // const isHomePage = location.pathname === "/home";
  const [newsItems, setNewsItems] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [headerLoading, setHeaderLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headerError, setHeaderError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const BASE_IMAGE_URL = `${API}/storage/uploads`;
  const DEFAULT_IMAGE = '/placeholder-image.jpg';

  const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

  const filteredNews = newsItems.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleClearSearch = () => setSearchTerm('');

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        setHeaderLoading(true);
        const response = await axios.get(API_ENDPOINTS.getHeaderSection);
        const headerList = response.data?.data || [];

        const matchedHeader = headerList.find(
          (item) =>
            item.hsec_sec === section.sec_id &&
            item.section?.sec_type === "Announcement" &&
            item.section?.display === 1 &&
            item.section?.active === 1
        );
        setHeaderData({
          hsec_title: matchedHeader.hsec_title || "Announcements",
          hsec_amount: matchedHeader.hsec_amount || 4,
          hsec_subtitle: matchedHeader.hsec_subtitle || "",
          hsec_btntitle: matchedHeader.hsec_btntitle || "",
          hsec_routepage: await resolvePageAlias(matchedHeader.hsec_routepage) || "",
        });
      } catch (error) {
        console.error('Failed to fetch header data:', error);
        setHeaderError('Failed to load section header. Using default values.');
        setHeaderData({
          hsec_title: "Announcements",
          hsec_amount: 4
        });
      } finally {
        setHeaderLoading(false);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.getAnnouncement);
        const transformed = response.data.data
          .filter((announcement) => {
            // Ensure announcement exists and has required properties
            if (!announcement) return false;

            return (
              announcement.display === 1 &&
              announcement.active === 1 &&
              announcement.lang === currentLang
            );
          })
          .slice(0, 4)
          .map((announcement) => {
            // Safely handle date conversion
            let formattedDate = 'TBD';
            try {
              if (announcement.am_postdate) {
                formattedDate = new Date(announcement.am_postdate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });
              }
            } catch (error) {
              console.warn(`Invalid date format for announcement ${announcement.am_id}:`, error);
            }

            return {
              id: announcement.am_id ?? null,
              title: announcement.am_title ?? '',
              description: announcement.am_shortdesc ?? '',
              ref_id: announcement.ref_id ?? '',
              date: formattedDate,
              imageUrl: announcement?.img?.img
                ? `${BASE_IMAGE_URL}/${announcement.img.img}`
                : DEFAULT_IMAGE
            };
          });

        setNewsItems(transformed);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
        setError('Failed to load announcements. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHeaderData().then(fetchAnnouncements);
  }, []);

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

  if (headerLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-red-800" />
      </div>
    );
  }

  if (headerError || error) {
    return (
      <div className="text-center py-12 text-red-600">
        {headerError && <p>{headerError}</p>}
        {error && <p>{error}</p>}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="my-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-center mb-8"
        >
          <h1 className={`${currentLang === 2 ? "font-khmer" : "font-sans"
            } text-3xl font-semibold mb-4`}>
            {headerData.hsec_title}
          </h1>
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="w-full md:w-auto mt-4 md:mt-0"
            >
              {headerData.hsec_routepage ? (
                  <button
                      onClick={() => navigate(headerData.hsec_routepage)}
                      className={`flex text-red-800 hover:text-red-900 items-center border-b border-red-800 pb-1`}
                    >
                    <span className={`mr-2 lg:text-sm text-[12px] ${currentLang === 2 ? "fonts-khmer" : "font-sans"
                      }`}>{headerData.hsec_btntitle}</span>
                    <FaArrowRight className="text-red-800" />
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search announcement"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="border rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring focus:border-red-300 w-full"
                            aria-label="Search announcement"
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
            </motion.div>
        </motion.div>

        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {newsItems.map(item => (
                <div
                  key={item.ref_id}
                  className="bg-white rounded-lg flex flex-col lg:flex-row shadow-md overflow-hidden cursor-pointer"
                  onClick={() => {
                    const prefix = window.location.pathname.startsWith('/km') ? '/km' : '';
                    navigate(`${prefix}/announcement/${item.ref_id}`);
                  }}
                  >
                  <div className="p-3 w-full lg:w-1/2 h-full">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE;
                      }}
                    />
                  </div>
                  <div className="p-6 flex  w-full lg:w-1/2 flex-col justify-center">
                    <h2 className={`text-lg font-semibold mb-4 line-clamp-2 overflow-hidden ${currentLang === 2 ? "fonts-khmer text-[20px]" : "font-sans"
                      }`}>{item.title}</h2>
                    <p className={`${currentLang === 2 ? "fonts-khmer" : "font-sans"
                      } text-gray-600 line-clamp-3 overflow-hidden`}>{item.description}</p>
                    <p className={`text-gray-500 text-sm mt-2 ${currentLang === 2 ? "fonts-khmer text-[18px]" : "font-sans"
                      }`}>{item.date}</p>
                  </div>
                </div>
              ))}
          </div>
        ): (
          <p className="text-center text-gray-500">
            No announcemnt found.
          </p>
        )}
      </div>
    </div>
  );
};

export default AnnouncementSection;