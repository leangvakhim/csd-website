import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, API, axiosInstance } from '../../Service/APIconfig';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import NewsBanner from './NewsBanner';
import SocialSection from '../Social/SocialSection';
import RelatedNews from './RelatedNews';

const NewDetails = ({ sectionId, menuLang, newId, newDetailPage }) => {
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(
                    `${API_ENDPOINTS.getNews}`
                );
                const data = response.data?.data || [];

                if (!data.length) {
                    setError('No news data available for this section and language.');
                    setLoading(false);
                    return;
                }

                const selectedItem = data.find(item =>
                    item.display === 1 &&
                    item.lang === currentLang &&
                    item.ref_id === Number(newId)
                );

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
    }, [sectionId, newId, currentLang]);

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
                        newId={newId}
                    />
                    <div className='px-2'>



                    <div className="container mx-auto px-4 py-8">
                    <SocialSection />
                        <motion.h2
                            className={`text-2xl font-bold mb-4 ${currentLang === 2 ? 'font-khmer' : 'font-semibold'}`}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {news.title}
                        </motion.h2>
                        <motion.div
                            className={`text-gray-700 mb-4 ${currentLang === 2 ? 'fonts-khmer' : 'font-sans'}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(news.detail),
                            }}
                        />
                        <RelatedNews newId={newId} newDetailPage={newDetailPage}/>
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