
import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { API_ENDPOINTS, API } from '../../Service/APIconfig'
import { motion } from 'framer-motion';
import { SlSocialFacebook } from "react-icons/sl";
import { PiTelegramLogoDuotone } from "react-icons/pi";
import { Link } from 'react-router-dom';

const FacultyMemeber = () => {
    const [FacultyMembers, setFacultyMembers] = useState([]);

    useEffect(() => {
        const fetchFacultyMembers = async () => {
            try {
            const res = await axios.get(API_ENDPOINTS.getFaculty);
            const allFaculty = res.data?.data || [];

            const filteredMembers = allFaculty.filter(item =>
                item.f_order >= 4 &&
                item.display === 1 &&
                item.active === 1 &&
                item.lang === 1
            );

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
            } catch (error) {
            console.error("Error fetching faculty members:", error);
            }
        };

        fetchFacultyMembers();
    }, []);

    return (
        <div className='my-16'>
            <div className='container mx-auto px-4'>
                <div className='space-y-10'>
                    <h1  className={`text-2xl font-normal mb-4  `} >Faculty Members</h1>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                        {FacultyMembers.map((deputy) => (
                            <div key={deputy.id} className='shadow-lg rounded-2xl p-4'>
                                <div className='gap-6 items-center'>
                                    {/* Image Container */}
                                    <div className="relative w-full h-96 mb-4 group">
                                        <img
                                            src={deputy.image}
                                            alt={deputy.name}
                                            className="w-full h-full rounded-2xl object-cover group-hover:brightness-90 transition-all duration-300"
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
                                                    className=" space-y-2"
                                                >
                                                    {/* Facebook Link */}
                                                    <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        className="bg-white p-3 rounded-full shadow-lg"
                                                    >
                                                        <Link to="#" className="text-gray-700 hover:text-red-600">
                                                            <SlSocialFacebook className="text-xl" />
                                                        </Link>
                                                    </motion.div>

                                                    {/* Telegram Link */}
                                                    <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        className="bg-white p-3 rounded-full shadow-lg"
                                                    >
                                                        <Link to="#" className="text-gray-700 hover:text-red-400">
                                                            <PiTelegramLogoDuotone className="text-xl" />
                                                        </Link>
                                                    </motion.div>
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    </div>
                                    <div className='space-y-6 max-w-md relative text-center'>
                                        <div className='space-y-2'>
                                            <h1 className='text-2xl font-semibold '>{deputy.name}</h1>
                                            <p className=''>{deputy.position}</p>
                                        </div>
                                        <Link
                                        to={`/faculty/${deputy.id}`}
                                        className='bg-red-900 px-6 py-2 text-gray-50 rounded-2xl'>
                                            View
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