import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import EventBanner from './EventBanner';
import SocialSection from '../Social/SocialSection';
import RelatedEvent from './RelatedEvent';
import { useLocation } from 'react-router-dom';

const EventsNewsDetails = ({ eventId, menuLang }) => {
    const [event, setEvent] = useState(null); // Kept for potential future use
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const currentLang = location.pathname.includes('/km') ? 2 : 1;


    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_ENDPOINTS.getEvent}`);
                const data = response.data?.data || [];

                const selectedItem = data.find(item =>
                    item.display === 1 &&
                    item.lang === currentLang &&
                    item.ref_id === Number(eventId)
                );

                if (selectedItem) {
                    setNews({
                        e_id: selectedItem.e_id,
                        date: selectedItem.e_date && !isNaN(new Date(selectedItem.e_date).getTime())
                            ? new Date(selectedItem.e_date).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                              })
                            : 'TBD',
                        title: selectedItem.e_title || 'Untitled News',
                        shortTitle: selectedItem.e_shorttitle || '',
                        detail: selectedItem.e_detail || 'No details available.',
                        image: selectedItem.img?.img
                            ? `${API}/storage/uploads/${selectedItem.img.img}`
                            : '/placeholder-image.jpg',
                    });
                } else {
                    setError('No relevant news found.');
                }
                setLoading(false);
            } catch (err) {
                const errorMessage = err.response?.status === 404
                    ? 'News not found.'
                    : `Failed to load news data: ${err.message}`;
                console.error('Failed to fetch news data:', err);
                setError(errorMessage);
                setLoading(false);
            }
        };
        fetchNews();
    }, [eventId, currentLang]);

    return (
        <div className=" bg-white">
            {loading ? (
                <motion.div
                    className="flex items-center justify-center min-h-screen px-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 animate-pulse">
                        Loading...
                    </p>
                </motion.div>
            ) : error ? (
                <motion.div
                    className="flex items-center justify-center min-h-screen px-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-sm sm:text-base lg:text-lg text-red-500">{error}</p>
                </motion.div>
            ) : news ? (
                <div>
                    <EventBanner
                        eventId={eventId}
                        newId={news.e_id} // Assuming newId is same as e_id; adjust if different
                        title={news.title}
                        postDate={news.date}
                        image={news.image}
                    />
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <SocialSection event={event} news={news} />
                        <motion.h2
                            className={`text-2xl font-bold mb-4 ${currentLang === 2 ? 'font-khmer' : 'font-semibold'}`}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {news.title}
                        </motion.h2>
                        <motion.div
                            className={`text-gray-700 mb-4 ${currentLang === 2 ? 'fonts-khmer' : 'font-sans-serif'}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(news.detail),
                            }}
                        />

                    </div>
                    <RelatedEvent eventId={eventId} newId={news.e_id} />
                </div>
            ) : (
                <motion.div
                    className="flex items-center justify-center min-h-screen px-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                        No news details found.
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default EventsNewsDetails;