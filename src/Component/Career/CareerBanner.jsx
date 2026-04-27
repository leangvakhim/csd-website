import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt } from 'react-icons/fa';
import { useData } from '../../Context/DataContext';
import { API } from '../../Service/APIconfig';

const CareerBanner = ({careerId, menuLang}) => {
    const { globalData, isLoading } = useData();
    const [bannerSection, setBannerSection] = useState(null);
    const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

    useEffect(() => {
        if (globalData?.career && careerId) {
            const allCareers = globalData.career || [];
            const selected = allCareers.find(
                item => item.ref_id === Number(careerId) && item.lang === currentLang
            );

            if (selected) {
                setBannerSection({
                    title: selected.c_title,
                    description: selected.c_shorttitle,
                    image: `${API}/storage/uploads/${selected.img?.img}`,
                    postDate: selected.c_date
                    ? new Date(selected.c_date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        })
                    : 'TBD',
                });
            }
        }
    }, [careerId, currentLang, globalData]);

    if (isLoading || !bannerSection) return null;

    return (
        <section>
            <div className=''>
                <div className=''>
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true, amount: 0.5 }}
                            className="h-full overflow-hidden relative group"
                        >
                            <div className='h-[600px]'>
                                <img
                                    src={bannerSection.image}
                                    alt={bannerSection.title}
                                    className="w-full h-full bg-cover bg-center"
                                />
                            </div>

                            <div className="absolute inset-0 bg-black opacity-50"></div>
                            <div className="container mx-auto absolute inset-0 p-6 flex flex-col justify-between text-white">
                                <div className="flex flex-col justify-center items-end py-4">

                                </div>
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
                                    className={`text-2xl font-bold drop-shadow-md ${currentLang === 2 ? 'font-khmer leading-10' : 'font-semibold'}`}
                                    >
                                    {bannerSection.title}
                                    </motion.h1>
                                    <motion.p
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    className={`mt-2 text-md flex items-center text-gray-50 drop-shadow-md ${currentLang === 2 ? 'fonts-khmer' : 'font-sans-serif'}`}
                                    >
                                    <FaCalendarAlt className="mr-2 text-lg" />
                                    {currentLang === 1 ? "Post on" : "បង្ហោះនៅថ្ងៃ"}: {bannerSection.postDate}
                                    </motion.p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CareerBanner