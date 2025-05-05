import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FacultyMemeber = () => {
    const [facultyMembers, setFacultyMembers] = useState([]);
    const [socials, setSocials] = useState({});
    const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;
    useEffect(() => {
        const fetchFacultyMembers = async () => {
            try {
                // Fetch faculty data
                const res = await axios.get(API_ENDPOINTS.getFaculty);
                const allFaculty = res.data?.data || [];

                const filteredMembers = allFaculty
                    .filter(item => item.display === 1 && item.active === 1 && item.lang === currentLang)
                    .slice(3);

                const formattedMembers = filteredMembers.map(member => ({
                    id: member.f_id,
                    name: member.f_name,
                    position: member.f_position,
                    bio: member.f_portfolio || 'No bio available.',
                    image: member.img?.img
                        ? `${API}/storage/uploads/${member.img.img}`
                        : "/placeholder-icon.png",
                }));

                setFacultyMembers(formattedMembers);

                // Fetch social media data
                const socialRes = await axios.get(API_ENDPOINTS.getSocial);
                const allSocials = socialRes.data?.data || [];
                const socialsByMember = {};

                formattedMembers.forEach(member => {
                    socialsByMember[member.id] = allSocials.filter(
                        social =>
                            social.social_faculty === member.id &&
                            social.display === 1 &&
                            social.active === 1
                    );
                });

                setSocials(socialsByMember);
            } catch (error) {
                console.error("Error fetching faculty members or socials:", error);
            }
        };

        fetchFacultyMembers();
    }, [currentLang]);

    return (
        <div className='my-16'>
            <div className='container mx-auto px-4'>
                <div className='space-y-10'>
                    <h1 className={`text-2xl font-normal mb-4 ${currentLang === 2 ? "font-khmer" : "font-semibold"}`}>{currentLang === 1 ? "Faculty Members" : "បុគ្គលិកដេប៉ាតឺម៉ង់"}</h1>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                        {facultyMembers.map((member) => (
                            <div key={member.id} className='shadow-lg rounded-2xl p-4'>
                                <div className='gap-6 items-center'>
                                    {/* Image Container */}
                                    <div className="relative w-full h-96 mb-4 group">
                                        <img
                                            src={member.image}
                                            alt={member.name}
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
                                                    {socials[member.id]?.length > 0 ? (
                                                        socials[member.id].map(social => (
                                                            <motion.div
                                                                key={social.social_id}
                                                                whileHover={{ scale: 1.1 }}
                                                                className="bg-white p-2.5 rounded-full shadow-lg"
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
                                                                        className="w-5 h-5 object-contain items-center"
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
                                    <div className='space-y-6 max-w-md relative text-center'>
                                        <div className='space-y-2'>
                                            <h1 className={`text-2xl font-semibold ${currentLang === 2 ? "fonts-khmer" : "font-sans"}`}>{member.name}</h1>
                                            <p className={`${currentLang === 2 ? "fonts-khmer" : "font-sans"}`}>{member.position}</p>
                                        </div>
                                        <Link
                                            to={`/faculty/${member.id}`}
                                            className='bg-red-900 px-6 py-2 text-gray-50 rounded-2xl inline-block'
                                        >
                                            {currentLang === 1 ? "View" : "មើលបន្ថែម"}
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

export default FacultyMemeber;