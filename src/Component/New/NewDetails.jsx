import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import NewsBanner from './NewsBanner';
import SocialSection from '../Social/SocialSection';
import RelatedNews from './RelatedNews';

const NewDetails = ({ sectionId, menuLang }) => {
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${API_ENDPOINTS.getNews}?section_id=${sectionId}&lang=${menuLang}`
                );
                const data = response.data?.data || [];

                if (!data.length) {
                    setError('No news data available for this section and language.');
                    setLoading(false);
                    return;
                }

                // Select the first item with display: 1 and matching lang, or first display: 1, or first item
                const selectedItem = data.find(item => item.display === 1 && item.lang === menuLang) ||
                                    data.find(item => item.display === 1) ||
                                    data[0];

                if (selectedItem) {
                    setNews({
                        n_id: selectedItem.n_id,
                        date: selectedItem.n_date && !isNaN(new Date(selectedItem.n_date).getTime())
                            ? new Date(selectedItem.n_date).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                              })
                            : 'TBD',
                        title: selectedItem.n_title || 'Untitled Event',
                        shortTitle: selectedItem.n_shorttitle || '',
                        detail: selectedItem.n_detail || 'No details available.',
                        image: selectedItem.img?.img
                            ? `${API}/storage/uploads/${selectedItem.img?.img}`
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
    }, [sectionId, menuLang]);

    return (
        <div className="min-h-screen">
            {loading ? (
                <p className="text-gray-600 text-center py-8">Loading news data...</p>
            ) : error ? (
                <p className="text-red-500 text-center py-8">{error}</p>
            ) : news ? (
                <div>
                    <NewsBanner
                        title={news.title}
                        postDate={news.date}
                        image={news.image}
                    />
                    <div className='px-2'>

                    
                   
                    <div className="container mx-auto px-4 py-8">
                    <SocialSection />
                        <motion.h2
                            className={`text-2xl font-bold mb-4 ${menuLang === 2 ? 'font-khmer' : 'font-semibold'}`}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {news.title}
                        </motion.h2>
                        <motion.div
                            className={`text-gray-700 mb-4 ${menuLang === 2 ? 'fonts-khmer' : 'font-sans'}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(news.detail),
                            }}
                        />
                        <RelatedNews />
                         </div>
                    </div>
                </div>
            ) : (
                <p className="text-grayClassical Greek and Latin literature-600 text-center py-8">No news data available.</p>
            )}
        </div>
    );
};

export default NewDetails;