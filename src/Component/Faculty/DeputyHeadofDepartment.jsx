import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RiDoubleQuotesR } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';

const DeputyHeadofDepartment = () => {
    const [deputyData, setDeputyData] = useState([]);
    const [socials, setSocials] = useState({});

    useEffect(() => {
        const fetchDeputies = async () => {
            try {
                // Fetch faculty data
                const facultyRes = await axios.get(API_ENDPOINTS.getFaculty);
                const allFaculty = facultyRes.data?.data || [];
                const deputies = allFaculty.filter(item =>
                    [2, 3].includes(item.f_order) &&
                    item.display === 1 &&
                    item.active === 1 &&
                    item.lang === 1 // Assuming 1 is the current language ID
                );
                const formattedDeputies = deputies.map(deputy => ({
                    id: deputy.f_id,
                    name: deputy.f_name,
                    bio: deputy.f_portfolio || 'No bio available.',
                    image: deputy.img?.img
                        ? `${API}/storage/uploads/${deputy.img.img}`
                        : "/placeholder-icon.png",
                }));

                setDeputyData(formattedDeputies);

                // Fetch social media data
                const socialRes = await axios.get(API_ENDPOINTS.getSocial);
                const allSocials = socialRes.data?.data || [];
                const socialsByDeputy = {};

                formattedDeputies.forEach(deputy => {
                    socialsByDeputy[deputy.id] = allSocials.filter(
                        social =>
                            social.social_faculty === deputy.id &&
                            social.display === 1 &&
                            social.active === 1
                    );
                });

                setSocials(socialsByDeputy);
            } catch (error) {
                console.error("Error fetching deputy heads or socials:", error);
            }
        };

        fetchDeputies();
    }, []);

    return (
        <div className='my-16'>
            <div className='container mx-auto px-4'>
                <div className='space-y-10'>
                    <div>
                        <h1 className="text-2xl font-normal mb-4">Deputy Head of Department:</h1>
                    </div>
                    <div className='flex flex-col xl:flex-row xl:flex-wrap gap-8 justify-center'>
                        {deputyData.map((deputy, index) => (
                            <div
                                key={deputy.id}
                                className={`
                                    shadow-lg rounded-2xl p-4
                                    xl:w-[calc(50%-1rem)]
                                    ${index === deputyData.length - 1 && deputyData.length % 2 !== 0 ?
                                        'xl:mx-auto' : ''}
                                `}
                            >
                                <div className="flex flex-col lg:flex-row gap-4 items-center">
                                    {/* Image Container */}
                                    <div className="relative w-80 h-72 mb-4 group">
                                        <img
                                            src={deputy.image}
                                            alt={deputy.name}
                                            className="w-full h-full rounded-2xl object-cover group-hover:brightness-90 transition-all duration-300"
                                            onError={(e) => {
                                                e.target.src = "/placeholder-icon.png";
                                            }}
                                        />

                                        {/* Social Media Overlay */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            whileHover={{ opacity: 1 }}
                                            className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center"
                                        >
                                            {/* Social Icons Container */}
                                            <div className="absolute top-4 right-4 group-hover:bg-black/10 p-2 transition-all duration-300 rounded-2xl">
                                                <motion.div
                                                    initial={{ y: 20 }}
                                                    animate={{ y: 0 }}
                                                    className="space-y-2"
                                                >
                                                    {socials[deputy.id]?.length > 0 ? (
                                                        socials[deputy.id].map(social => (
                                                            <motion.div
                                                                key={social.social_id}
                                                                whileHover={{ scale: 1.1 }}
                                                                className="bg-white p-3 rounded-full shadow-lg"
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
                                                                        className="w-6 h-6 rounded-full object-cover"
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
                                    <div className='space-y-6 max-w-md relative'>
                                        <div className='flex justify-between items-center'>
                                            <h1 className='text-2xl font-semibold'>{deputy.name}</h1>
                                            <div className='text-right'>
                                                <RiDoubleQuotesR className='text-7xl text-red-900' />
                                            </div>
                                        </div>
                                        <p className='text-left'>{deputy.bio}</p>
                                        <Link to={`/faculty/${deputy.id}`}>
                                            <button className='bg-red-900 px-6 py-2 text-gray-50 rounded-2xl'>
                                                View
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeputyHeadofDepartment;