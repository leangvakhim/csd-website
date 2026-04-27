import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { API } from '../../Service/APIconfig';
import { useData } from "../../Context/DataContext";


const SocialSection = ({ sectionId, menuLang }) => {
    const [settings, setSettings] = useState(null);
    const location = useLocation();
    const [currentLang, setCurrentLang] = useState(1);
    const [socialLinks, setSocialLinks] = useState([]);

    const { globalData } = useData();

    useEffect(() => {
        if (globalData?.socialSettings) {
            const socialData = globalData.socialSettings || [];
            const filtered = Array.isArray(socialData)
                ? socialData.filter(item => item.active === 1 && item.display === 1)
                : [];
            const sorted = filtered.sort((a, b) => a.setsoc_order - b.setsoc_order);
            setSocialLinks(sorted);
        }
    }, [globalData?.socialSettings]);

    if (socialLinks.length === 0) return null;

    return (

        <div className="my-16 ">
            <div className="container mx-auto px-4 ">
                <div className="flex justify-start ">
                    <motion.div
                        className="flex space-x-3"
                        initial="visible"
                        animate="visible"
                    >
                        {socialLinks.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            className="bg-white p-2 rounded-xl shadow-md cursor-pointer"
                            aria-label={`Social Media Icon ${index + 1}`}
                            >
                        <Link
                            to={item.setsoc_link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <img
                            src={`${API}/storage/uploads/${item.img?.img}`}
                            alt={item.setsoc_title}
                            className="h-6 w-6 object-contain"
                            />
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