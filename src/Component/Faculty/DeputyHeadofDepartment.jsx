
import React, {useEffect, useState} from 'react'
import { motion } from 'framer-motion';
import { SlSocialFacebook } from "react-icons/sl";
import { PiTelegramLogoDuotone } from "react-icons/pi";
import { RiDoubleQuotesR } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';
import axios from 'axios';

const DeputyHeadofDepartment = () => {
    const [deputyData, setDeputyData] = useState([]);

    useEffect(() => {
        const fetchDeputies = async () => {
            try {
            const res = await axios.get(API_ENDPOINTS.getFaculty);
            const allFaculty = res.data?.data || [];
            const deputies = allFaculty.filter(item =>
                [2, 3].includes(item.f_order) &&
                item.display === 1 &&
                item.active === 1
            );
            const formattedDeputies = deputies.map(deputy => ({
                id: deputy.f_id,
                name: deputy.f_name,
                bio: deputy.f_portfolio || 'No bio available.',
                image: deputy.img?.img
                ? `${API}/storage/uploads/${deputy.img.img}`
                : "/placeholder-icon.png",
                facebook: '#', // You can update later if real links are provided
                telegram: '#',
            }));

            console.log("formattedDeputies is: ",formattedDeputies);

            setDeputyData(formattedDeputies);
            } catch (error) {
            console.error("Error fetching deputy heads:", error);
            }
        };

        fetchDeputies();
    }, []);

    return (
        <div className='my-16'>
            <div className='container mx-auto px-4'>
                <div className='space-y-10'>
                    <div>
                        <h1 className={`text-2xl font-normal mb-4  `}>Deputy Head of Department:</h1>
                    </div>
                    <div className='flex flex-col xl:flex-row xl:flex-wrap gap-8 justify-center'>
                        {deputyData.map((deputy, index) => (
                            <div
                                key={deputy.id} // Use unique id for the key
                                className={`
                                    shadow-lg rounded-2xl p-4
                                    xl:w-[calc(50%-1rem)]  // Subtract half of gap (8px = 0.5rem)
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
                                    <div className='space-y-6 max-w-md relative'>
                                        <div className='flex justify-between items-center' >
                                            <h1 className='text-2xl font-semibold '>{deputy.name}</h1>
                                            <div className=' text-right'>
                                                <RiDoubleQuotesR className='text-7xl text-red-900' />
                                            </div>
                                        </div>

                                        <p className='text-left'>{deputy.bio}</p>
                                        <Link
                                            to={`/deputy/${deputy.id}`} // Use dynamic route to navigate to the detail page
                                        >
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

export default DeputyHeadofDepartment

