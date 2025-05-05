import React, { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';

const RelatedCareer = ({ sectionId, menuLang }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(
                    `${API_ENDPOINTS.getCareer}?section_id=${sectionId}&lang=${menuLang}`
                );
                const data = response.data?.data || [];
                const eventData = Array.isArray(data) ? data : [data].filter(Boolean);
                const formattedEvents = eventData
                    .map((item, index) => ({
                        id: item.c_id || index + 1,
                        title: item.c_title || 'Untitled Event',
                        image: item.img?.img
                            ? `${API}/storage/uploads/${item.img.img}`
                            : '/placeholder-image.jpg',
                        description: item.c_shorttitle || 'No description available.',
                        date: item.c_date || 'TBD',
                        category: item.c_tags,
                    }))
                    .slice(0, 4); // 🔥 Limit to 4 items

                setEvents(formattedEvents);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to load events.');
                setLoading(false);
            }
        };
        fetchEvents();
    }, [sectionId, menuLang]);

    if (loading) {
        return (
            <div className="my-16">
                <div className="container mx-auto px-4">
                    <p>Loading events...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-16">
                <div className="container mx-auto px-4">
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!events.length) {
        return (
            <div className="my-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl mb-6 font-semibold">Related Articles</h2>
                    <p>No related events found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-16">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between">
                    <h2 className={`text-4xl mb-6 font-semibold ${menuLang === 2 ? "font-khmer" : "font-semibold"}`}>Related Articles</h2>
                    {/* Scroll buttons removed to match RelatedArtical */}
                </div>

                {/* Events Section */}
                <div className="py-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {events.map((event) => (
                            <Link
                                key={event.id}
                                to={`/career/${event.id}`}
                                className="text-start"
                            >
                                <motion.div
                                    className="bg-white rounded-2xl shadow-md flex flex-col lg:flex-row justify-center hover:shadow-lg transition-shadow duration-300"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="mx-auto w-full lg:w-1/2 flex justify-center items-center">
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-56 object-cover rounded-2xl"
                                        />
                                    </div>

                                    <div className="p-6 w-full lg:w-1/2">
                                        {event.category && (
                                            <span className={`text-xs font-semibold text-red-600 uppercase bg-indigo-100 px-2 py-1 rounded-full ${menuLang === 2 ? "fonts-khmer" : "font-sans-serif"}`}>
                                                {event.category}
                                            </span>
                                        )}
                                        <h3 className={`mt-2 text-lg font-semibold text-gray-900 ${menuLang === 2 ? "font-khmer" : "font-semibold"}`}>
                                            {event.title}
                                        </h3>
                                        <p className={`mt-2 text-sm text-gray-800 ${menuLang === 2 ? "fonts-khmer" : "font-sans-serif"}`}>
                                            {event.description}
                                        </p>
                                        <span className={`text-sm text-gray-800 flex items-center gap-4 mt-4 ${menuLang === 2 ? "fonts-khmer" : "font-sans-serif"}`}>
                                            <FaCalendarAlt />
                                            {event.date}
                                        </span>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RelatedCareer;