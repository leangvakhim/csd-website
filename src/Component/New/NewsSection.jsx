import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes, FaSpinner, FaArrowRight } from 'react-icons/fa';
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

const NewsSection = ({ section, menuLang }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/home';
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [headerLoading, setHeaderLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headerError, setHeaderError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [headerData, setHeaderData] = useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const BASE_IMAGE_URL = `${API}/storage/uploads`;
  const DEFAULT_IMAGE = '/placeholder-image.jpg';
  const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

  // Fetch header data
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        setHeaderLoading(true);
        const response = await axios.get(API_ENDPOINTS.getHeaderSection);
        const headerList = response.data?.data || [];

        const matchedHeader = headerList.find(
          (item) =>
            item.hsec_sec === section.sec_id &&
            item.section?.sec_type === "New" &&
            item.section?.display === 1 &&
            item.section?.active === 1
        );

        if (matchedHeader) {
          setHeaderData({
            hsec_title: matchedHeader.hsec_title || 'New',
            hsec_amount: typeof matchedHeader.hsec_amount === 'number' && matchedHeader.hsec_amount !== null ? matchedHeader.hsec_amount : 4,
          });
        } else {
          setHeaderData({
            hsec_title: 'New',
            hsec_amount: 4,
          });
        }
      } catch (error) {
        console.error('Failed to fetch header data:', error.message, error);
        setHeaderError('Failed to load section header.');
        setHeaderData({
          hsec_title: '',
          hsec_amount: 4,
        });
      } finally {
        setHeaderLoading(false);
      }
    };

    fetchHeaderData();
  }, []);

  // Fetch news data
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.getNews);
        const newsList = Array.isArray(response.data?.data) ? response.data.data : [];

        const filteredList = newsList.filter(
          item => item.img &&
            item.img.img &&
            item.lang === currentLang &&
            item.display === 1
        );
        const transformed = filteredList.map(announcement => ({
          id: announcement.n_id,
          tag: announcement.n_tags,
          title: announcement.n_title,
          description: announcement.n_shorttitle || '',
          date: announcement.n_postdate
            ? new Date(announcement.n_postdate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
            : 'TBD',
          imageUrl: announcement?.img?.img
            ? `${BASE_IMAGE_URL}/${announcement.img.img}`
            : DEFAULT_IMAGE,
        }));

        setNewsItems(
          isHomePage ? transformed.slice(0, headerData.hsec_amount) : transformed
        );
      } catch (error) {
        console.error('Failed to fetch news:', error);
        setError('Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [currentLang, headerData.hsec_amount, isHomePage]);

  const tags = [...new Set(newsItems.map(item => item.tag).filter(tag => tag))];

  const filteredNews = newsItems.filter(item => {
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
    <div className="sm:my-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-center mb-8"
        >
          <h1 className={`${menuLang === 2 ? "font-khmer " : "font-sans"
            } text-3xl font-semibold mb-4`}>
            {headerData.hsec_title}
          </h1>

          {!isHomePage && (
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search by title"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="border rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring focus:border-blue-300 w-full"
                  aria-label="Search news"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
            </div>
          )}
          {isHomePage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="w-full md:w-auto mt-4 md:mt-0"
            >
              <button
                onClick={() => navigate('/news&events')}
                className="flex text-red-800 hover:text-red-900 items-center border-b border-red-800 pb-1"
              >
                <span className="mr-2 lg:text-sm text-[12px]">View All</span>
                <FaArrowRight className="text-red-800" />
              </button>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredNews.length > 0 ? (
            filteredNews.slice(0, isHomePage ? 4 : undefined).map(item => (
              <div
                key={item.id}
                className="bg-white rounded-lg flex flex-col lg:flex-row shadow-md overflow-hidden cursor-pointer"
                onClick={() => navigate(`/news/${item.id}`)}
              >
                <div className="p-3 w-full lg:w-1/2 h-58">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="p-6 flex flex-col w-full lg:w-1/2 justify-center">
                  {item.tag && (
                    <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-semibold self-start mb-2">
                      {item.tag}
                    </span>
                  )}
                  <h3 className={`${menuLang === 2 ? "fonts-khmer text-[20px]" : "font-sans"
                    } text-lg font-semibold mb-4`}>{item.title}</h3>
                  <p className={`${menuLang === 2 ? "fonts-khmer text-[18px]" : "font-sans"
                    } text-gray-600`}>{item.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 col-span-full py-12">
              <p>No news found matching your criteria.</p>
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

export default NewsSection;