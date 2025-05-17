import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RiDoubleQuotesR } from 'react-icons/ri';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';

const HeadofDepartment = () => {
    const [head, setHead] = useState(null);
    const [socials, setSocials] = useState([]);
    const prefix = window.location.pathname.startsWith('/km') ? '/km' : '';

    const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;
    useEffect(() => {
        const fetchHead = async () => {
            try {
                // Fetch faculty data
                const res = await axios.get(API_ENDPOINTS.getFaculty);
                const allFaculty = res.data?.data || [];

                const filteredHead = allFaculty
                    .filter(item => item.display === 1 && item.active === 1 && item.lang === currentLang)
                    .sort((a, b) => a.f_order - b.f_order);

                if (filteredHead.length) {
                    const headData = filteredHead[0];
                    setHead({
                        id: headData.f_id,
                        ref_id: headData.ref_id,
                        name: headData.f_name,
                        position: headData.f_position,
                        image: headData.img?.img
                            ? `${API}/storage/uploads/${headData.img.img}`
                            : "/placeholder-icon.png",
                    });

                    // Fetch social media data
                    const socialRes = await axios.get(API_ENDPOINTS.getSocial);
                    const allSocials = socialRes.data?.data || [];
                    const filteredSocials = allSocials.filter(
                        social =>
                            social.social_faculty === headData.f_id &&
                            social.display === 1 &&
                            social.active === 1
                    );
                    setSocials(filteredSocials);
                } else {
                    console.warn("No matching Khmer records found for currentLang =", currentLang);
                }
            } catch (error) {
                console.error("Error fetching head of department or socials:", error);
            }
        };

        fetchHead();
    }, [currentLang]);

    return (
        <div className='my-16'>
            <div className='container mx-auto px-4'>
                <div className='space-y-10'>
                    <div id="head-department-header">
                        <h1 className={`text-2xl font-normal mb-4 ${currentLang === 2 ? "font-khmer" : "font-semibold"}`}>{currentLang === 1 ? "Head of Department:" : "ប្រធានដេប៉ាតឺម៉ង់"}</h1>
                    </div>
                    {head && (
                        <div key={head.ref_id} className='max-w-5xl mx-auto shadow-lg rounded-2xl items-center p-4' id="head-department-profile">
                            <div className="flex flex-col lg:flex-row gap-6 items-center">
                                {/* Image Container */}
                                <div className="relative w-96 h-96 mb-4 group" id="profile-image-container">
                                    <img
                                        src={head.image}
                                        alt={head.name}
                                        className="w-full h-full rounded-2xl object-cover group-hover:brightness-90 transition-all duration-300"
                                        onError={(e) => {
                                            e.target.src = "/placeholder-icon.png";
                                        }}
                                        id="profile-image"
                                    />
                                    {/* Social Media Overlay */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center"
                                        id="social-media-overlay"
                                    >
                                        <div className="absolute top-4 right-4 group-hover:bg-black/10 p-2 transition-all duration-300 rounded-2xl" id="social-icons-container">
                                            <motion.div
                                                initial={{ y: 20 }}
                                                animate={{ y: 0 }}
                                                className="space-y-2"
                                                id="social-icons"
                                            >
                                                {socials.length > 0 ? (
                                                    socials.map(social => (
                                                        <motion.div
                                                            key={social.social_id}
                                                            whileHover={{ scale: 1.1 }}
                                                            className="bg-white p-2.5 rounded-full shadow-lg"
                                                            id={`social-icon-${social.social_id}`}
                                                        >
                                                            <Link
                                                                to={social.social_link || "#"}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-gray-700 hover:text-red-600"
                                                            >
                                                                <img
                                                                    src={
                                                                        social.img?.img
                                                                            ? `${API}/storage/uploads/${social.img.img}`
                                                                            : "/placeholder-icon.png"
                                                                    }
                                                                    alt={social.social_name || "Social Icon"}
                                                                    className="w-6 h-6 object-contain items-center"
                                                                    onError={(e) => {
                                                                        e.target.src = "/placeholder-icon.png";
                                                                    }}
                                                                />
                                                            </Link>
                                                        </motion.div>
                                                    ))
                                                ) : (
                                                    <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        className="bg-white p-3 rounded-full shadow-lg"
                                                        id="default-social-icon"
                                                    >
                                                        <Link
                                                            to="#"
                                                            className="text-gray-700 hover:text-red-600"
                                                        >
                                                            <img
                                                                src="/placeholder-icon.png"
                                                                alt="Default Social Icon"
                                                                className="w-6 h-6 rounded-full object-cover"
                                                            />
                                                        </Link>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>
                                <div className='space-y-6 max-w-xl relative' id="profile-info">
                                    <div className='flex justify-between items-center'>
                                        <h1 className={`text-3xl font-semibold ${currentLang === 2 ? "fonts-khmer" : "font-sans"}`} id="professor-name">{head.name}</h1>
                                        <div className='text-right'>
                                            <RiDoubleQuotesR className='text-7xl text-red-900' />
                                        </div>
                                    </div>
                                    <p className={`!text-xl ${currentLang === 2 ? "fonts-khmer" : "font-sans"}`}>{head.position}</p>
                                    <Link
                                        to={`${prefix}/faculty/${head.ref_id}`}
                                    >
                                        <button className={`bg-red-900 px-6 py-2 text-gray-50 rounded-2xl ${currentLang === 2 ? "fonts-khmer" : "font-sans"}`} id="view-button">
                                            {currentLang === 1 ? "View" : "មើលបន្ថែម"}
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HeadofDepartment;