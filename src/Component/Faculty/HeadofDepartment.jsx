import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SlSocialFacebook } from "react-icons/sl";
import { PiTelegramLogoDuotone } from "react-icons/pi";
import { RiDoubleQuotesR } from "react-icons/ri";
import { API_ENDPOINTS, API } from '../../Service/APIconfig';

const HeadofDepartment = () => {
    const [head, setHead] = useState(null);

    useEffect(() => {
        const fetchHead = async () => {
            try {
                const res = await axios.get(API_ENDPOINTS.getFaculty);
                const allFaculty = res.data?.data || [];
                const filteredHead = allFaculty.find(item => item.f_order === 1);

                if (filteredHead) {
                    setHead({
                        id: filteredHead.f_id,
                        name: filteredHead.f_name,
                        bio: filteredHead.f_portfolio || 'No bio available.',
                        image: filteredHead.img?.img
                            ? `${API}/storage/uploads/${filteredHead.img.img}`
                            : "/placeholder-icon.png",
                        socialLinks: {
                            facebook: '#',
                            telegram: '#',
                        },
                    });
                }
            } catch (error) {
                console.error("Error fetching head of department:", error);
            }
        };

        fetchHead();
    }, []);

    return (
        <div className='my-16'>
            <div className='container mx-auto px-4'>
                <div className='space-y-10'>
                    <div id="head-department-header">
                        <h1 className={`text-2xl font-normal mb-4 `}
                            >Head of Department</h1>
                    </div>
                    {head && (
                        <div key={head.id} className='max-w-5xl mx-auto shadow-lg rounded-2xl items-center p-4' id="head-department-profile">
                            <div className="flex flex-col lg:flex-row gap-6 items-center ">
                                {/* Image Container */}
                                <div className="relative w-96 h-96 mb-4 group" id="profile-image-container">
                                    <img
                                        src={head.image}
                                        alt={head.name}
                                        className="w-full h-full rounded-2xl object-cover group-hover:brightness-90 transition-all duration-300"
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
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    className="bg-white p-3 rounded-full shadow-lg"
                                                    id="facebook-icon"
                                                >
                                                    <Link to={head.socialLinks.facebook} className="text-gray-700 hover:text-red-600">
                                                        <SlSocialFacebook className="text-xl" />
                                                    </Link>
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    className="bg-white p-3 rounded-full shadow-lg"
                                                    id="telegram-icon"
                                                >
                                                    <Link to={head.socialLinks.telegram} className="text-gray-700 hover:text-red-400">
                                                        <PiTelegramLogoDuotone className="text-xl" />
                                                    </Link>
                                                </motion.div>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>
                                <div className='space-y-6 max-w-xl relative' id="profile-info">
                                    <div className='flex justify-between items-center'>
                                        <h1 className='text-2xl font-semibold ' id="professor-name">{head.name}</h1>
                                        <div className='text-right'>
                                            <RiDoubleQuotesR className='text-7xl text-red-900' />
                                        </div>
                                    </div>
                                    <p>{head.bio}</p>
                                    <Link to={`/head/${head.id}`}>
                                        <button className='bg-red-900 px-6 py-2 text-gray-50 rounded-2xl' id="view-button">View</button>
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

export default HeadofDepartment