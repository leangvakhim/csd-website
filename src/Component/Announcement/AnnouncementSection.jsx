import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes, FaSpinner, FaArrowRight } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_ENDPOINTS, API, axiosInstance } from '../../Service/APIconfig';

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

  const filteredNews = newsItems
    .slice(0, headerData.hsec_amount || 4)
    .filter(item => {
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
        const response = await axiosInstance.get(API_ENDPOINTS.getHeaderSection);
        const headerList = response.data?.data || [];

        const matchedHeader = headerList.find(
          (item) =>
            item.hsec_sec === section.sec_id &&
            item.section?.sec_type === "Announcement" &&
            item.section?.display === 1 &&
            item.section?.active === 1
        );
        setHeaderData({
          hsec_title: matchedHeader?.hsec_title || "Announcements",
          hsec_amount: matchedHeader?.hsec_amount || 4,
          hsec_subtitle: matchedHeader?.hsec_subtitle || "",
          hsec_btntitle: matchedHeader?.hsec_btntitle || "",
          hsec_routepage: await resolvePageAlias(matchedHeader?.hsec_routepage) || "",
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
        const response = await axiosInstance.get(API_ENDPOINTS.getAnnouncement);
        const transformed = response.data.data
          .filter((announcement) => {
            if (!announcement) return false;
            return (
              announcement.display === 1 &&
              announcement.active === 1 &&
              announcement.lang === currentLang
            );
          })
          .sort((a, b) => b.am_orders - a.am_orders)
          .slice(0, headerData.hsec_amount || 4)
          .map((announcement) => {
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
  }, [section.sec_id, currentLang]);

  const resolvePageAlias = async (routePage) => {
    try {
      const res = await axiosInstance.get(API_ENDPOINTS.getPage);
      const pages = Array.isArray(res.data?.data) ? res.data.data : [];
      const matched = pages.find((page) => page.p_title === routePage);
      return matched?.p_alias || null;
    } catch (error) {
      console.error("Failed to fetch page alias:", error);
      return null;
    }
  };

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
    <div className="my-8 sm:my-12 md:my-16">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8"
        >
          <div className="mb-4 sm:mb-0">
            <h1 className={`text-2xl sm:text-3xl font-semibold mb-2 sm:mb-3 ${currentLang === 2 ? "font-khmer" : "font-sans"}`}>
              {headerData.hsec_title || 'Events'}
            </h1>
            {headerData.hsec_subtitle && (
              <p className={`text-xs sm:text-sm text-gray-500 ${currentLang === 2 ? "font-khmer" : "font-sans"}`}>
                {headerData.hsec_subtitle}
              </p>
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="w-full sm:w-auto"
          >
            {headerData.hsec_routepage ? (
              <button
                onClick={() => navigate(headerData.hsec_routepage)}
                className={`flex text-red-800 hover:text-red-900 items-center border-b border-red-800 pb-1 text-sm sm:text-base ${currentLang === 2 ? "fonts-khmer" : "font-sans"}`}
              >
                <span className="mr-2">{headerData.hsec_btntitle}</span>
                <FaArrowRight className="text-red-800" />
              </button>
            ) : (
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search announcement"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="border rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring focus:border-red-300 w-full text-sm"
                  aria-label="Search announcement"
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
            )}
          </motion.div>
        </motion.div>

        {filteredNews.length < 3 ? (
          <div>
            {filteredNews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {filteredNews.map(item => (
                  <div
                    key={item.ref_id}
                    className="bg-white rounded-lg flex flex-col sm:flex-row shadow-md overflow-hidden cursor-pointer"
                    onClick={() => {
                      const prefix = window.location.pathname.startsWith('/km') ? '/km' : '';
                      navigate(`${prefix}/announcement/${item.ref_id}`);
                    }}
                  >
                    <div className="p-3 w-full sm:w-1/2 h-48 sm:h-64">
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
                    <div className="p-4 sm:p-6 flex w-full sm:w-1/2 flex-col justify-center">
                      <h2 className={`text-base sm:text-lg font-semibold mb-3 line-clamp-2 overflow-hidden ${currentLang === 2 ? "font-khmer" : "font-sans"}`}>
                        {item.title}
                      </h2>
                      <p className={`text-sm sm:text-base text-gray-600 line-clamp-3 overflow-hidden ${currentLang === 2 ? "fonts-khmer" : "font-sans"}`}>
                        {item.description}
                      </p>
                      <p className={`text-xs sm:text-sm text-gray-500 mt-2 ${currentLang === 2 ? "font-khmer" : "font-sans"}`}>
                        {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm sm:text-base">
                No announcements found.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto px-2 sm:px-4 scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-transparent">
            <div className="grid grid-flow-col auto-cols-[min(100%,20rem)] sm:auto-cols-[min(50%,22rem)] gap-4 snap-x snap-mandatory scroll-smooth">
              {filteredNews.map(item => (
                <div
                  key={item.ref_id}
                  className="bg-white rounded-lg flex flex-col sm:flex-row shadow-md overflow-hidden cursor-pointer snap-start"
                  onClick={() => {
                    const prefix = window.location.pathname.startsWith('/km') ? '/km' : '';
                    navigate(`${prefix}/announcement/${item.ref_id}`);
                  }}
                >
                  <div className="p-3 w-full sm:w-1/2 h-48 sm:h-64">
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
                  <div className="p-4 sm:p-6 flex w-full sm:w-1/2 flex-col justify-center">
                    <h2 className={`text-base sm:text-lg font-semibold mb-3 line-clamp-2 overflow-hidden ${currentLang === 2 ? "font-khmer" : "font-sans"}`}>
                      {item.title}
                    </h2>
                    <p className={`text-sm sm:text-base text-gray-600 line-clamp-3 overflow-hidden ${currentLang === 2 ? "fonts-khmer" : "font-sans"}`}>
                      {item.description}
                    </p>
                    <p className={`text-xs sm:text-sm text-gray-500 mt-2 ${currentLang === 2 ? "font-khmer" : "font-sans"}`}>
                      {item.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementSection;