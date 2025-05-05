
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';
import CareerBanner from './CareerBanner';
import SocialSection from '../Social/SocialSection';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import RelatedCareer from './RelatedCareer';




const CareerDetails = ({ sectionId, menuLang, careerId }) => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${API_ENDPOINTS.getCareer}?section_id=${sectionId}&lang=${menuLang}`
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
                    setSections({
                        c_id: selectedItem.c_id,
                        date: selectedItem.c_date && !isNaN(new Date(selectedItem.c_date).getTime())
                            ? new Date(selectedItem.c_date).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            })
                            : 'TBD',
                        title: selectedItem.c_title || 'Untitled News',
                        shortTitle: selectedItem.c_shorttitle || '',
                        detail: selectedItem.c_detail || 'No details available.',
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
    }, [sectionId, menuLang]);


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
                <p className="text-sm sm:text-base lg:text-lg text-gray-500 animate-pulse">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
                <p className="text-sm sm:text-base lg:text-lg text-red-500">{error}</p>
            </div>
        );
    }

    console.log('Career sections:', sections);

    return (
        <div className="bg-white">
            <CareerBanner careerId={careerId} />
            <div>
                <div className="container mx-auto px-4 ">
                    <div>

                        <SocialSection />


                        <motion.h2
                            className={`text-2xl font-bold mb-4 ${menuLang === 2 ? "font-khmer" : "font-semibold"}`}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {sections.title}
                        </motion.h2>
                        <motion.div
                            className={`text-gray-700 mb-4 ${menuLang === 2 ? "fonts-khmer" : "font-sans-serif"}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(sections.detail),
                            }}
                        />
                        <RelatedCareer />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerDetails;