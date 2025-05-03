import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';

// Animation variants for the section
const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
            when: 'beforeChildren',
            staggerChildren: 0.2,
        },
    },
};

// Animation variants for individual partner logos
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const PartnershipSection = ({ section }) => {
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const res = await axios.get(`${API_ENDPOINTS.getPartnership}?section_id=${section.sec_id}`);
                let data = res.data?.data ?? [];

                // Ensure data is an array
                if (data && !Array.isArray(data)) {
                    data = [data];
                }

                const formatted = data
                    .filter((partner) => partner.active === 1) 
                    .slice(0, 4)
                    .map((partner) => ({

                        src: partner.ps_img
                            ? `${API}/storage/uploads/${partner.img?.img}`
                            : null,
                        alt: partner.ps_title || 'Partner Logo', // Use title or fallback
                    }));

                // Only update state if data has changed to prevent unnecessary re-renders
                setPartners((prevPartners) => {
                    if (JSON.stringify(prevPartners) !== JSON.stringify(formatted)) {
                        return formatted;
                    }
                    return prevPartners;
                });
            } catch (error) {
                console.error('PartnershipSection: Error fetching partners:', error);
                setPartners([]); // Reset state on error
            }
        };

        fetchPartners();
    }, [section.sec_id]); // Use specific property to avoid unnecessary re-runs

    if (partners.length === 0) {
        console.log('PartnershipSection: No partners to render (partners array is empty)');
        return (
            <div className="text-center py-8 text-gray-600">
                No partners to display.
            </div>
        );
    }

    return (
        <div className="my-16">
            <motion.section
                className="container mx-auto px-8"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
            >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                    {/* Title */}
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-semibold mb-4">
                            Our Partnerships
                        </h2>
                    </div>

                    {/* Vertical Divider */}
                    <span className="border-r border-gray-300 h-10 hidden lg:block"></span>

                    {/* Partner Logos */}
                    <motion.div
                        className="flex flex-wrap justify-center xl:justify-start items-center gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {partners.map((partner, index) => (
                            <motion.div
                                key={index}
                                className="flex items-center justify-center"
                                variants={cardVariants}
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {partner.src ? (
                                    <img
                                        src={partner.src}
                                        alt={partner.alt}
                                        className="h-16 w-auto"
                                        aria-label={partner.alt}
                                        loading="lazy"
                                        onError={(e) => (e.currentTarget.src = '/fallback-logo.png')}
                                    />
                                ) : (
                                    <p className="text-gray-600">{partner.alt}</p>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
};

export default PartnershipSection;