import React, { useState, useEffect } from 'react';
import { PiGraduationCapDuotone } from "react-icons/pi";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useData } from "../../Context/DataContext";
import { API } from '../../Service/APIconfig';

const AvailableSection = ({section, menuLang}) => {
    const { globalData, isLoading } = useData();

    const [apdTitle, setApdTitle] = useState('');
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        if (globalData?.availables) {
            const dataList = globalData.availables;
            const match = dataList.find(item => item.apd_sec === section?.sec_id);
            if (match) {
                setApdTitle(match.apd_title || 'Available Programs & Degree');
            }
        }

        if (globalData?.subAvailables && globalData?.pages) {
            const dataList = globalData.subAvailables;
            const pages = globalData.pages;
            
            const filtered = dataList.filter(item => item.apd?.apd_sec === section?.sec_id && item.display === 1);
            const mapped = filtered.map(item => {
                const programLink = item.sapd_routepage || '';
                const matchPage = pages.find((page) => page.p_title === programLink.replace('/', ''));
                return {
                    title: item.sapd_title,
                    image: item.image?.img ? `${API}/storage/uploads/${item.image.img}` : '',
                    link: matchPage ? matchPage.p_alias : programLink
                };
            });
            setPrograms(mapped);
        }
    }, [section?.sec_id, globalData]);

    if (isLoading) return null;

    return (
        <div className="my-16">
            <div>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="container mx-auto px-4"
            >
                <h2 className={`text-3xl font-bold mb-8 ${menuLang === 2 ? 'font-khmer' : 'font-semibold'}`}>
                    {apdTitle}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                    {programs.map((program, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 * index }}
                            viewport={{ once: true }}
                            className="relative rounded-lg overflow-hidden"
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to={program.link}>
                                <div className="h-52 sm:h-64 md:h-72 lg:h-80">
                                    <img
                                        src={program.image}
                                        alt={program.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="absolute inset-x-0 bottom-0 bg-white shadow-md rounded-2xl p-2 px-4 flex items-center justify-center gap-6 mb-2 mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-10">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                            <PiGraduationCapDuotone className="text-2xl text-red-700" />
                                        </div>
                                        <span className="border h-6"></span>
                                        <div className={`text-sm sm:text-[14px] xl:text-lg font-medium text-center ${menuLang === 2 ? 'fonts-khmer text-[18px]' : 'font-sans-serif'}`}>
                                            {program.title}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    </div>
    )
}

export default AvailableSection