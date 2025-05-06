
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
    const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

    useEffect(() => {
        if (careerId) {
            axios.get(`${API_ENDPOINTS.getCareer}`)
                .then((res) => {
                    const allCareers = res.data?.data || [];
                    const selectedCareer = allCareers.find(
                        item => item.ref_id === Number(careerId) && item.lang === currentLang
                    );

                    if (selectedCareer) {
                        setSections({
                            title: selectedCareer.c_title,
                            ref_id: selectedCareer.ref_id,
                            shortTitle: selectedCareer.c_shorttitle || '',
                            detail: selectedCareer.c_detail || 'No details available.',
                            image: `${API}/storage/uploads/${selectedCareer.img?.img}`,
                            date: selectedCareer.c_date && !isNaN(new Date(selectedCareer.c_date).getTime())
                                ? new Date(selectedCareer.c_date).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })
                                : 'TBD',
                        });
                        setLoading(false);
                    } else {
                        setError('Career not found.');
                        setLoading(false);
                    }
                })
                .catch((err) =>
                    console.error("Error fetching career details:", err)
                );
        }
    }, [careerId, currentLang]);

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

    return (
        <div className="min-h-screen">
            <CareerBanner careerId={careerId} />
            <div className='px-2'>
                <div className="container mx-auto px-4 py-8">
                    <SocialSection />
                    <motion.h2
                        className={`text-2xl font-bold mb-4 ${currentLang === 2 ? "font-khmer" : "font-semibold"}`}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {sections.title}
                    </motion.h2>
                    <motion.div
                        className={`text-gray-700 mb-4 ${currentLang === 2 ? "fonts-khmer" : "font-sans-serif"}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(sections.detail),
                        }}
                    />
                    <RelatedCareer careerId={careerId}/>
                </div>
            </div>
        </div>
    );
};

export default CareerDetails;