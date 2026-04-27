import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt } from 'react-icons/fa';
import { API } from '../../Service/APIconfig';
import { useData } from "../../Context/DataContext";

import { useLocation } from 'react-router-dom';

const EventBanner = ({ eventId, menuLang}) => {
    const [bannerSection, setBannerSection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const currentLang = location.pathname.includes('/km') ? 2 : 1;

    const { globalData } = useData();

    useEffect(() => {
        if (eventId && globalData?.events) {
            const allEvents = globalData.events || [];
            const selectedEvent = allEvents.find(
                item => item.ref_id === Number(eventId) && item.lang === currentLang
            );
            if (selectedEvent) {
                setBannerSection({
                    title: selectedEvent.e_title || 'Untitled Event',
                    postDate: selectedEvent.e_date
                        ? new Date(selectedEvent.e_date).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                          })
                        : 'TBD',
                    image: selectedEvent.img?.img
                        ? `${API}/storage/uploads/${selectedEvent.img?.img}`
                        : '/placeholder-image.jpg',
                });
                setError(null);
            } else {
                setError('Event not found.');
            }
            setLoading(false);
        }
    }, [eventId, currentLang, globalData?.events]);


    if (!bannerSection) {
        return null;
    }


    return (
        <motion.div
            className="relative w-full h-[600px] text-white bg-cover bg-center flex items-end"
            style={{ backgroundImage: `url(${bannerSection.image})` }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
        >
            {/* Fixed Overlay using RGBA */}
            <div
                className="absolute inset-0"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            ></div>

            <div className="ml-6">
                {/* Content Positioned at Bottom */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="relative z-10 max-w-xl px-6 pb-8 space-y-8"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: -50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true, amount: 0.5 }}
                        className={`text-3xl sm:text-4xl font-bold drop-shadow-md ${currentLang === 2 ? 'font-khmer leading-10' : 'font-sans'}`}
                    >
                        {bannerSection.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        viewport={{ once: true, amount: 0.5 }}
                        className="mt-2 text-md flex items-center text-gray-50 drop-shadow-md"
                    >
                        <FaCalendarAlt className={`mr-2 text-lg ${menuLang === 2 ? 'fonts-khmer' : 'font-sans'}`} />
                        {currentLang === 1 ? "Post on" : "បង្ហោះនៅថ្ងៃ"}: {bannerSection.postDate}
                    </motion.p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default EventBanner;