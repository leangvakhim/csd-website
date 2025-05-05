import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';
import { motion } from 'framer-motion';
import { MdComputer } from "react-icons/md";

const CareerBanner = ({careerId, menuLang}) => {
    const [bannerSection, setBannerSection] = useState(null);

    useEffect(() => {
        if (careerId) {
            axios.get(`${API_ENDPOINTS.getCareer}/${careerId}`)
                .then((res) => {
                    const data = res.data?.data;
                    setBannerSection({
                        title: data.c_title,
                        description: data.c_shortdesc,
                        image: `${API}/storage/uploads/${data.img?.img}`,
                        
                    });
                })
                .catch((err) => console.error("Error fetching research details:", err));
        }
    }, []);

    return (
        <section>
            <div className=''>
                <div className=''>
                    <div>
                        {bannerSection && (
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
                                        <motion.button
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8 }}
                                            viewport={{ once: true, amount: 0.5 }}
                                            className="text-black xl:text-[16px] text-[12px] bg-gray-400 py-2 px-4 shadow-md rounded-4xl flex items-center mb-2"
                                        >
                                            <MdComputer className="mr-2" />
                                            {bannerSection.lead}
                                        </motion.button>
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                        viewport={{ once: true, amount: 0.5 }}
                                        className='max-w-xl *:mb-6'
                                    >
                                        <h3 className={`lg:text-4xl text-3xl font-semibold mb-2 ${menuLang === 2 ? "font-khmer" : "font-semibold"}`}>
                                            {bannerSection.title}
                                        </h3>
                                        <motion.p
                                            initial={{ opacity: 0, y: 50 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.6 }}
                                            viewport={{ once: true, amount: 0.5 }}
                                            className={`mb-4 xl:text-[14px] text-gray-50 text-[12px] flex gap-2 ${menuLang === 2 ? "fonts-khmer" : "font-sans-serif"}`}
                                        >
                                            {bannerSection.description}
                                        </motion.p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CareerBanner