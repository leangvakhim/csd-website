import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';

const SocialSection = ({ sectionId, menuLang }) => {
    const location = useLocation();
    const [socialData, setSocialData] = useState({ contactDetails: { socialLinks: [] } });

    // Check if the current location matches the 'faculty/:id' path
    const isFacultyPage = location.pathname.startsWith('/faculty/');

    useEffect(() => {
        axios
            .get(`${API_ENDPOINTS.getSocialSetting}?section_id=${sectionId}&lang=${menuLang}`)
            .then((socialRes) => {
                const socialData = socialRes.data?.data || [];
                const contactDetails = {
                    socialLinks: socialData.map((item) => ({
                        title: item.setsoc_title || "",
                        link: item.setsoc_link || "",
                        image: item.img?.img ? `${API}/storage/uploads/${item.img.img}` : "",
                    })),
                };
                setSocialData({ contactDetails });
            })
            .catch((error) => {
                console.error('Error fetching social settings:', error);
            });
    }, [sectionId, menuLang]);

    return (
        <div className="my-16">
            <div className="container mx-auto px-4">
                <div className="flex justify-start">
                    <motion.div
                        className="flex space-x-3"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
                        }}
                    >
                        {socialData.contactDetails.socialLinks.map((social, index) => (
                            <motion.div
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                className={`p-2 rounded-xl shadow-md cursor-pointer ${isFacultyPage ? 'bg-white' : 'bg-red-800'}`}
                                aria-label={social.title}
                            >
                                <Link to={social.link} target="_blank" rel="noopener noreferrer">
                                    {social.image ? (
                                        <img 
                                            src={social.image} 
                                            alt={social.title}
                                            className={`h-5 w-5 ${isFacultyPage ? 'text-red-800' : 'text-white'}`}
                                        />
                                    ) : (
                                        <span className={`h-5 w-5 ${isFacultyPage ? 'text-red-800' : 'text-white'}`}>
                                            {social.title}
                                        </span>
                                    )}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SocialSection;