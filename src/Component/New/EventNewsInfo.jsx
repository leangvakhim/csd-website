import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { PiCalendarDots } from 'react-icons/pi';
import { useData } from '../../Context/DataContext';
import { API } from '../../Service/APIconfig';
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const EventNewsInfo = ({section, newDetailPage, eventDetailPage, announcementDetailPage}) => {
    const { globalData, isLoading } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const prefix = window.location.pathname.startsWith('/km') ? '/km' : '';
    const [headerData, setHeaderData] = useState({
        hsec_title: 'News & Events',
        hsec_subtitle: '',
        hsec_amount: 8,
    });
    const BASE_IMAGE_URL = `${API}/storage/uploads`;
    const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;
    const [activeTab, setActiveTab] = useState(currentLang === 2 ? 'ទាំងអស់' : 'All');
    const [newsItems, setNewsItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = headerData.hsec_amount || 8;

    useEffect(() => {
        if (globalData && section) {
            // 1. Process Header Data
            const headerList = globalData.headers || [];
            const matchedHeader = headerList.find(
                (item) =>
                item.hsec_sec === section.sec_id &&
                item.section?.sec_type === "LoNE" &&
                item.section?.display === 1 &&
                item.section?.active === 1
            );

            if (matchedHeader) {
              setHeaderData({
                hsec_title: matchedHeader.hsec_title,
                hsec_subtitle: matchedHeader.hsec_subtitle,
                hsec_amount: matchedHeader.hsec_amount || 8,
              });
            }

            // 2. Process Items (News, Events, Announcements)
            const newsData = globalData.news || [];
            const eventsData = globalData.events || [];
            const announcementsData = globalData.announcements || [];

            const extractData = (dataArray, prefixType) => dataArray
                .filter(item => item.lang === currentLang)
                .map(item => ({
                    id: item[`${prefixType}_id`],
                    ref_id: item[`ref_id`],
                    title: item[`${prefixType}_title`],
                    description: item[`${prefixType}_shorttitle`] || item[`${prefixType}_shortdesc`] || '',
                    date: new Date(item[`${prefixType}_date`] || item[`${prefixType}_postdate`]),
                    image: item.img?.img || '',
                    tag: item[`${prefixType}_tag`] || item[`${prefixType}_tags`] || '',
                    route_url: prefixType === 'n' ? 'news' : prefixType === 'e' ? 'event' : prefixType === 'am' ? 'announcement' : '',
                }));

            const allItems = [
                ...extractData(newsData, 'n'),
                ...extractData(eventsData, 'e'),
                ...extractData(announcementsData, 'am'),
            ];

            allItems.sort((a, b) => b.date - a.date);
            setNewsItems(allItems);
        }
    }, [currentLang, section, globalData]);


    // Animation variants for the cards
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        hover: { scale: 1.05, transition: { duration: 0.3 } },
    };

    // List of tabs (dynamic based on language)
    const tabs = currentLang === 2
      ? ['ទាំងអស់', 'ព័ត៌មាន', 'ព្រឹត្តិការណ៍']
      : ['All', 'News', 'Events'];

    // Filter news items based on active tab and search query
    const filteredNewsItems = newsItems.filter((item) => {
        const matchesTab =
            activeTab === 'All' || activeTab === 'ទាំងអស់' ||
            ((activeTab === 'News' || activeTab === 'ព័ត៌មាន') && (item.route_url === 'news' || item.route_url === 'announcement')) ||
            ((activeTab === 'Events' || activeTab === 'ព្រឹត្តិការណ៍') && item.route_url === 'event');

        const matchesSearch = searchQuery
            ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        return matchesTab && matchesSearch;
    });

    const totalPages = Math.ceil(filteredNewsItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const displayedData = filteredNewsItems.slice(indexOfFirstItem, indexOfLastItem);

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
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery]);

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (isLoading) return null;

    const getDetailPath = (routeUrl, refId) => {
        let alias = '';
        if (routeUrl && routeUrl.toLowerCase() === 'news') alias = newDetailPage?.p_alias || '';
        else if (routeUrl && routeUrl.toLowerCase() === 'event') alias = eventDetailPage?.p_alias || '';
        else if (routeUrl && routeUrl.toLowerCase() === 'announcement') alias = announcementDetailPage?.p_alias || '';

        if (!alias) return '#';
        const path = alias.startsWith('/') ? alias : `/${alias}`;
        const fullPath = (prefix && path.startsWith(prefix)) ? path : `${prefix}${path}`;
        return `${fullPath}/${refId}`;
    };

    return (
        <div className="container mx-auto p-3 sm:p-5 mt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            {/* Header */}
            <div className="mb-4 md:mb-0">
            <h1 className={`text-2xl sm:text-3xl font-bold text-gray-800 ${currentLang === 2 ? "font-khmer " : "font-bold"
                            }`}>
                                 {headerData.hsec_title}
            </h1>
            <p className={`text-xs sm:text-sm text-gray-600 mt-2 ${currentLang === 2 ? "fonts-khmer leading-8" : "font-sans"
                            }`}>
                {headerData.hsec_subtitle}
            </p>
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-1/2 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch size={16} className="sm:w-5 sm:h-5" />
            </span>
            <input
                type="text"
                placeholder={currentLang === 2 ? 'ស្វែងរក' : 'Search'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm ${currentLang === 2 ? 'fonts-khmer' : 'font-sans'}`}
            />
            </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
            {tabs.map((tab) => (
            <div
                key={tab}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full cursor-pointer text-xs sm:text-lg ${currentLang === 2 ? "fonts-khmer " : "font-sans"
                } ${
                    activeTab === tab ? 'bg-red-800 text-white' : 'bg-gray-200 text-gray-800'
                }`}
                onClick={() => setActiveTab(tab)}
            >
                {tab}
            </div>
            ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {displayedData.length > 0 ? (
            displayedData.map((event) => (
                <motion.div
                key={`${event.route_url}-${event.id}`}
                className="bg-white rounded-lg shadow-md p-3 sm:p-4"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                >
                    <Link
                        to={getDetailPath(event.route_url, event.ref_id)}
                        className="block group"
                        aria-label={event.title}
                    >
                    <div className="flex flex-col sm:flex-row sm:items-center">
                        <img
                            src={event.image ? `${BASE_IMAGE_URL}/${event.image}` : '/placeholder-image.jpg'}
                            alt={event.title}
                            className="w-full h-64 sm:h-60 object-cover rounded-md mb-3 sm:mb-0 sm:w-1/2"
                        />
                        <div className="w-full lg:w-1/2  p-4 sm:p-5">
                        {event.tag && (
                            <span className={`${currentLang === 2 ? "fonts-khmer " : "font-sans"
                            } bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-semibold self-start mb-2`}>
                                {event.tag}
                            </span>
                        )}
                        <h3 className={`${currentLang === 2 ? "fonts-khmer text-[20px]" : "font-sans"
                            } line-clamp-2 overflow-hidden text-base sm:text-lg lg:text-xl font-semibold mt-2 mb-3 sm:mb-4`}>
                            {event.title}
                        </h3>
                        <p className={`${currentLang === 2 ? "fonts-khmer text-[18px]" : "font-sans"
                            } text-xs line-clamp-2 overflow-hidden sm:text-sm text-gray-700`}>
                            {event.description}
                        </p>
                        <span className={`${currentLang === 2 ? "fonts-khmer text-[16px]" : "font-sans"
                            } text-xs sm:text-sm text-gray-700 flex items-center gap-2 mt-3 sm:mt-4`}>
                            <PiCalendarDots className="text-red-800 size-6" />
                            {event.date.toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                    </div>
                    </Link>
                </motion.div>
            ))
            ) : (
            <p className="text-gray-600 col-span-full text-center text-sm sm:text-base">
                No results found for "{searchQuery}"
            </p>
            )}
        </div>

        {/* Pagination Controls */}
        {filteredNewsItems.length > itemsPerPage && (
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

export default EventNewsInfo;