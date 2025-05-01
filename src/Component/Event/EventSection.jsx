import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes, FaSpinner, FaArrowRight } from 'react-icons/fa';
import { PiCalendarDots } from 'react-icons/pi';
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

const EventSection = ({ section, menuLang }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === "/home";
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [headerLoading, setHeaderLoading] = useState(true);
    const [error, setError] = useState(null);
    const [headerError, setHeaderError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [headerData, setHeaderData] = useState({
        hsec_title: "Events & News",
        hsec_amount: 4
    });
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const BASE_IMAGE_URL = `${API}/storage/uploads`;
    const DEFAULT_IMAGE = '/placeholder-image.jpg'; // Ensure this path is valid

    useEffect(() => {
        const fetchHeaderData = async () => {
            try {
                setHeaderLoading(true);
                const response = await axios.get(API_ENDPOINTS.getHeaderSection);
                if (response.data) {
                    if (isHomePage && response.data.splits) {
                        // On homepage, find the "Events" section in splits
                        const eventSplit = response.data.splits.find(
                            split => split.section_type === "events" || split.hsec_title.toLowerCase().includes("events")
                        );
                        if (eventSplit) {
                            setHeaderData({
                                hsec_title: eventSplit.hsec_title || "Events & News",
                                hsec_amount: eventSplit.hsec_amount || 4
                            });
                        } else {
                            // Fallback to default if no events section in splits
                            setHeaderData({
                                hsec_title: "Events & News",
                                hsec_amount: 4
                            });
                        }
                    } else if (response.data.hsec_title) {
                        // Non-homepage: use section-specific header data
                        setHeaderData({
                            hsec_title: response.data.hsec_title,
                            hsec_amount: response.data.hsec_amount || 4
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch header data:', error);
                setHeaderError('Failed to load section header. Using default values.');
            } finally {
                setHeaderLoading(false);
            }
        };

        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await axios.get(API_ENDPOINTS.getEvent);
                const transformed = response.data.data
                    .filter(event => event.section?.sec_id === section.sec_id)
                    .map(item => ({
                        id: item.event_id,
                        tag: item.event_category || 'Events',
                        title: item.event_title,
                        description: item.event_shortdesc,
                        date: item.event_date
                            ? new Date(item.event_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })
                            : 'TBD',
                        imageUrl: item.image?.img ? `${BASE_IMAGE_URL}/${item.image.img}` : DEFAULT_IMAGE
                    }))
                    .slice(0, headerData.hsec_amount);

                setEvents(transformed);
            } catch (error) {
                console.error('Failed to fetch events:', error);
                setError('Failed to load events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchHeaderData().then(fetchEvents);
    }, [headerData.hsec_amount, section, menuLang, isHomePage]);

    const tags = [...new Set(events.map(item => item.tag))];

    const filteredEvents = events.filter(item => {
        const matchesSearch =
            item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        const matchesTag = selectedTag ? item.tag === selectedTag : true;
        return matchesSearch && matchesTag;
    });

    const handleClearSearch = () => setSearchTerm('');
    const handleClearFilter = () => setSelectedTag('');

    // Split title for homepage
    const displayTitle = isHomePage
        ? headerData.hsec_title.split('&')[0].trim() || 'Events'
        : headerData.hsec_title;

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
        <div className="my-8 sm:my-12 lg:my-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex flex-col lg:flex-row justify-between items-center mb-6 sm:mb-8"
                >
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3 sm:mb-4">
                            {displayTitle}
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500">
                            {setHeaderData.hsec_subtitle}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 items-center mt-4 lg:mt-0">
                        {/* Search and Filter Container (Non-Homepage Only) */}
                        {!isHomePage && (
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                {/* Search Field */}
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        placeholder="Search events"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="border rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring focus:border-blue-300 w-full"
                                        aria-label="Search events"
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
                                        aria-label="Filter by category"
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
                        )}

                        {/* View All Button */}
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
                                    <span className="mr-2 xl:text-sm text-[12px]">View All</span>
                                    <FaArrowRight className="text-red-800" />
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Events List */}
                <div className="py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                >
                                    <div
                                        className="bg-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-col lg:flex-row items-center hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                        onClick={() => navigate(`/events/${event.id}`)}
                                    >
                                        <div className="w-full lg:w-1/2 flex justify-center items-center mb-4 lg:mb-0">
                                            <img
                                                src={event.imageUrl}
                                                alt={event.title}
                                                className="w-full h-[180px] sm:h-[200px] lg:h-[220px] object-cover rounded-2xl hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = DEFAULT_IMAGE;
                                                }}
                                            />
                                        </div>

                                        <div className="w-full lg:w-1/2 p-4 sm:p-5">
                                            {event.tag && (
                                                <span className="text-xs font-semibold text-red-600 uppercase bg-red-100 px-2 py-1 rounded-full">
                                                    {event.tag}
                                                </span>
                                            )}
                                            <h5 className="text-base sm:text-lg lg:text-xl font-semibold mt-2 mb-3 sm:mb-4">
                                                {event.title}
                                            </h5>
                                            <p className="text-xs sm:text-sm text-gray-700 line-clamp-3">
                                                {event.description}
                                            </p>
                                            <span className="text-xs sm:text-sm text-gray-700 flex items-center gap-2 mt-3 sm:mt-4">
                                                <PiCalendarDots className="text-red-600" />
                                                {event.date}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center text-gray-600 col-span-full py-12">
                                <p>No events found matching your criteria.</p>
                                {!isHomePage && (searchTerm || selectedTag) && (
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
        </div>
    );
};

export default EventSection;