import React, { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API } from '../../Service/APIconfig';
import { useData } from '../../Context/DataContext';

const RelatedNews = ({ sectionId, menuLang, newId, newDetailPage }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const prefix = window.location.pathname.startsWith('/km') ? '/km' : '';
    const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

    const { globalData, isLoading: isDataLoading } = useData();

    useEffect(() => {
        if (!globalData?.news || isDataLoading) return;

        const data = globalData.news;
        const filteredEvents = data.filter(
            item => item.lang === currentLang && item.ref_id !== Number(newId) && item.display === 1
        );

        const formattedEvents = filteredEvents
            .map((item, index) => ({
                id: item.n_id || index + 1,
                title: item.n_title || 'Untitled Event',
                ref_id: item.ref_id,
                image: item.img?.img
                    ? `${API}/storage/uploads/${item.img.img}`
                    : '/placeholder-image.jpg',
                description: item.n_shorttitle || 'No description available.',
                date: item.n_date
                    ? new Date(item.n_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    })
                    : 'TBD',
                category: item.n_tags,
            }))
            .slice(0, 4);

        setEvents(formattedEvents);
        setLoading(false);
    }, [newId, currentLang, globalData, isDataLoading]);

    if (loading) {
        return (
            <div className="my-16">
                <div className="container mx-auto px-4">
                    <p>Loading news...</p>
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
                    <h2 className={`text-4xl mb-6 font-semibold ${currentLang === 2 ? 'fonts-khmer' : 'font-sans'}`}>{currentLang === 1 ? "Related Articles" : "អត្ថបទដែលទាក់ទង"}</h2>
                    <p>{currentLang === 1 ? "No related news found." : "មិនមានព័ត៌មានដែលស្វែងរក"}</p>
                </div>
            </div>
        );
    }

    const getDetailPath = (alias, refId) => {
        if (!alias) return '#';
        const path = alias.startsWith('/') ? alias : `/${alias}`;
        const fullPath = (prefix && path.startsWith(prefix)) ? path : `${prefix}${path}`;
        return `${fullPath}/${refId}`;
    };

    return (
        <div className="my-16">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className={`flex flex-col sm:flex-row justify-between ${currentLang === 2 ? 'font-khmer' : 'font-sans'}`}>
                    <h2 className={`text-2xl mb-6 font-semibold ${currentLang === 2 ? 'font-khmer' : 'font-sans'}`}>{currentLang === 1 ? "Related Articles" : "អត្ថបទដែលទាក់ទង"}</h2>
                    {/* Scroll buttons removed to match RelatedArtical */}
                </div>

                {/* Events Section */}
                <div className="py-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {events.map((event) => (
                            <Link
                                key={event.ref_id}
                                to={getDetailPath(newDetailPage?.p_alias, event.ref_id)}
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
                                            <span className={`text-xs font-semibold text-red-600 uppercase bg-indigo-100 px-2 py-1 rounded-full ${currentLang === 2 ? 'fonts-khmer' : 'font-sans'}`}>
                                                {event.category}
                                            </span>
                                        )}
                                        <h3 className={`mt-2 text-lg font-semibold text-gray-900 ${currentLang === 2 ? 'fonts-khmer text-[20px]' : 'font-sans'}`}>
                                            {event.title}
                                        </h3>
                                        <p className={`mt-2 text-sm text-gray-800 ${currentLang === 2 ? 'fonts-khmer text-[18px]' : 'font-sans'}`}>
                                            {event.description}
                                        </p>
                                        <span className={`text-sm text-gray-800 flex items-center gap-4 mt-4 ${currentLang === 2 ? 'fonts-khmer text-[18px]' : 'font-sans'}`}>
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

export default RelatedNews;