import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes, FaSpinner, FaArrowRight } from 'react-icons/fa';
import { PiCalendarDots } from 'react-icons/pi';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { API_ENDPOINTS, API, axiosInstance } from '../../Service/APIconfig';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const EventSection = ({ section, menuLang }) => {
    const navigate = useNavigate();
    const location = useLocation();
    // const isHomePage = location.pathname === '/home';
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [headerLoading, setHeaderLoading] = useState(true);
    const [error, setError] = useState(null);
    const [headerError, setHeaderError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [headerData, setHeaderData] = useState({});
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const prefix = window.location.pathname.startsWith('/km') ? '/km' : '';

    const BASE_IMAGE_URL = `${API}/storage/uploads`;
    const DEFAULT_IMAGE = '/placeholder-image.jpg';
    const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

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
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setHeaderLoading(true);
                const response = await axiosInstance.get(API_ENDPOINTS.getHeaderSection);
                const headerList = response.data?.data || [];
                const matchedHeader = headerList.find(
                    (item) =>
                        item.hsec_sec === section.sec_id &&
                        item.section?.sec_type === "Event" &&
                        item.section?.display === 1 &&
                        item.section?.active === 1
                );

                if (!matchedHeader) {
                    throw new Error("No matched header section found for this Event section.");
                }

                if (matchedHeader) {
                    setHeaderData({
                        hsec_title: matchedHeader.hsec_title || 'Event',
                        hsec_subtitle: matchedHeader.hsec_subtitle || "",
                        hsec_btntitle: matchedHeader.hsec_btntitle || "",
                        hsec_routepage: await resolvePageAlias(matchedHeader.hsec_routepage) || "",
                        hsec_amount: typeof matchedHeader.hsec_amount === 'number' && matchedHeader.hsec_amount !== null ? matchedHeader.hsec_amount : 4,
                    });
                    } else {
                    setHeaderData({
                        hsec_title: 'Event',
                        hsec_amount: 4,
                    });
                }

            } catch (error) {
                console.error('Failed to fetch header data:', error);
                setHeaderError('Failed to load section header. Using default values.');
            } finally {
                setHeaderLoading(false);
            }

            try {
                setLoading(true);
                const response = await axiosInstance.get(API_ENDPOINTS.getEvent);

                const data = Array.isArray(response.data.data)
                    ? response.data.data
                    : [response.data.data];
                const transformed = data
                    .filter((item) =>
                        item.img && item.img.img && item.lang === currentLang
                    )
                    .slice(0, headerData.hsec_amount)
                    .sort((a, b) => b.e_order - a.e_order)
                    .map(item => ({
                        id: item.e_id,
                        ref_id: item.ref_id,
                        tag: item.e_tags || 'Events',
                        title: item.e_title || 'Untitled Event',
                        description: item.e_shorttitle || 'No description available',
                        date: item.e_date
                            ? new Date(item.e_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })
                            : 'TBD',
                        imageUrl: item.img.img ? `${BASE_IMAGE_URL}/${item.img.img}` : DEFAULT_IMAGE,
                    }));

                setEvents(transformed);
            } catch (error) {
                console.error('Failed to fetch events:', error);
                setError('Failed to load events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [headerData.hsec_amount]); // Add dependencies to prevent infinite loop
// }, [headerData.hsec_amount, isHomePage]); // Add dependencies to prevent infinite loop

    const tags = [...new Set(events.map(item => item.tag))];

    const filteredEvents = events
        .slice(0, headerData.hsec_amount)
        .filter(item => {
        const matchesSearch =
            item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        const matchesTag = selectedTag ? item.tag === selectedTag : true;
        return matchesSearch && matchesTag;
    });

    const handleClearSearch = () => setSearchTerm('');

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
        <div className="my-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
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
                               placeholder="Search events"
                               value={searchTerm}
                               onChange={e => setSearchTerm(e.target.value)}
                               className="border rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring focus:border-red-300 w-full text-sm"
                               aria-label="Search events"
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

                {/* Events List */}
                {filteredEvents.length < 5 ? (
                    <div className="py-4">
                        {filteredEvents.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
                                {filteredEvents.map((event, index) => (
                                    <motion.div
                                        key={event.ref_id}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.2 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                    >
                                        <Link
                                            to={`${prefix}/events/${event.ref_id}`}
                                            className="block group"
                                            aria-label={event.title}
                                        >
                                            <div className="bg-white h-full lg:h-[300px] rounded-2xl p-4 sm:p-5 shadow-md flex flex-col lg:flex-row items-center hover:shadow-lg transition-shadow duration-300">
                                                <div className="w-full lg:w-1/2 h-full flex justify-center items-center mb-4 lg:mb-0">
                                                    <img
                                                        src={event.imageUrl}
                                                        alt={event.title}
                                                        className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                                                        loading="lazy"
                                                        onError={e => (e.target.src = DEFAULT_IMAGE)}
                                                    />
                                                </div>
                                                <div className="w-full lg:w-1/2  p-4 sm:p-5">
                                                    {event.category && (
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
                                                        } text-xs line-clamp-3 overflow-hidden sm:text-sm text-gray-700`}>
                                                        {event.description}
                                                    </p>
                                                    <span className={`${currentLang === 2 ? "fonts-khmer text-[16px]" : "font-sans"
                                                        } text-xs sm:text-sm text-gray-700 flex items-center gap-2 mt-3 sm:mt-4`}>
                                                        <PiCalendarDots className="text-red-600" />
                                                        {event.date}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No events found.</p>
                        )}
                    </div>
                ) : (
                    <div className="py-4 overflow-hidden">
                        {filteredEvents.length > 0 ? (
                            <div className=" flex overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide gap-4 px-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-transparent">
                                {filteredEvents.map((event, index) => (
                                    <motion.div
                                        key={event.ref_id}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.2 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        className="w-[calc(50%-0.5rem)] min-w-[calc(50%-0.5rem)] snap-start flex-shrink-0"
                                    >
                                        <Link
                                            to={`${prefix}/events/${event.ref_id}`}
                                            className="block group"
                                            aria-label={event.title}
                                        >
                                            <div className="bg-white h-full lg:h-[300px] rounded-2xl p-4 sm:p-5 shadow-md flex flex-col lg:flex-row items-center hover:shadow-lg transition-shadow duration-300">
                                                <div className="w-full lg:w-1/2 h-full flex justify-center items-center mb-4 lg:mb-0">
                                                    <img
                                                        src={event.imageUrl}
                                                        alt={event.title}
                                                        className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                                                        loading="lazy"
                                                        onError={e => (e.target.src = DEFAULT_IMAGE)}
                                                    />
                                                </div>
                                                <div className="w-full lg:w-1/2  p-4 sm:p-5">
                                                    {event.category && (
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
                                                        } text-xs line-clamp-3 overflow-hidden sm:text-sm text-gray-700`}>
                                                        {event.description}
                                                    </p>
                                                    <span className={`${currentLang === 2 ? "fonts-khmer text-[16px]" : "font-sans"
                                                        } text-xs sm:text-sm text-gray-700 flex items-center gap-2 mt-3 sm:mt-4`}>
                                                        <PiCalendarDots className="text-red-600" />
                                                        {event.date}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No events found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventSection;