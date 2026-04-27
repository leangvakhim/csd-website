import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import { useData } from '../../Context/DataContext';
import { API } from '../../Service/APIconfig';

const CareerSection = ({ section, menuLang, careerDetailPage }) => {
    const { globalData, isLoading } = useData();
    const navigate = useNavigate();
    const [careers, setCareers] = useState([]);
    const [headerData, setHeaderData] = useState({
        hsec_title: 'default title',
        hsec_subtitle: 'default subtitle',
        hsec_btntitle: null,
        hsec_routepage: null,
    });

    const BASE_IMAGE_URL = `${API}/storage/uploads`;
    const DEFAULT_IMAGE = '/placeholder-image.jpg';
    const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

    useEffect(() => {
        if (globalData) {
            // 1. Get Header Section
            if (Array.isArray(globalData.headers)) {
                const filtered = globalData.headers.find(
                    item => item.hsec_sec === section?.sec_id && item.section?.sec_type === "Career"
                );
                if (filtered) {
                    setHeaderData({
                        hsec_title: filtered.hsec_title || 'default title',
                        hsec_subtitle: filtered.hsec_subtitle || 'default subtitle',
                        hsec_btntitle: filtered.hsec_btntitle,
                        hsec_routepage: filtered.hsec_routepage,
                    });
                }
            }

            // 2. Get Career List
            if (Array.isArray(globalData.career)) {
                const formattedCareers = globalData.career
                    .filter(
                        (item) =>
                            item.display === 1 &&
                            item.active === 1 &&
                            item.lang === currentLang
                    )
                    .map((item) => ({
                        id: item.c_id,
                        ref_id: item.ref_id,
                        title: item.c_title,
                        description: item.c_shorttitle,
                        date: new Date(item.c_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        }),
                        imageUrl: item.img?.img ? `${BASE_IMAGE_URL}/${item.img?.img}` : DEFAULT_IMAGE,
                    }));

                setCareers(formattedCareers);
            }
        }
    }, [currentLang, globalData, section]);

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    };

    if (isLoading) return null;

    const getDetailPath = (alias, refId) => {
        const prefix = window.location.pathname.startsWith('/km') ? '/km' : '';
        if (!alias) return '#';
        const path = alias.startsWith('/') ? alias : `/${alias}`;
        const fullPath = (prefix && path.startsWith(prefix)) ? path : `${prefix}${path}`;
        return `${fullPath}/${refId}`;
    };

    return (
        <div className="my-16 py-4">
            <motion.div
                className="container mx-auto px-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
            >
                <div className="flex flex-col sm:flex-row gap-8">
                    <motion.div
                        className="w-full sm:w-1/2 text-center sm:text-left"
                        variants={itemVariants}
                    >
                        <div className="flex flex-col sm:flex-row items-start mb-8">
                            <div className="mr-6">
                                <h2 className={`text-3xl font-semibold mb-2 ${currentLang === 2 ? "font-khmer" : "font-semibold"}`}>{headerData.hsec_title}</h2>
                                <p className={`mt-4 text-gray-800 ${currentLang === 2 ? "fonts-khmer" : "font-sans"}`}>{headerData.hsec_subtitle}</p>
                            </div>
                            {headerData.hsec_btntitle && (
                                <button
                                    onClick={() => navigate(headerData.hsec_routepage)}
                                    className="bg-red-700 text-white p-3 rounded-lg flex items-center justify-center mt-4 sm:mt-0 hover:bg-red-800 transition duration-300"
                                >
                                    <FaArrowRight className="h-6 w-6" />
                                </button>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex space-x-4 w-full sm:w-1/2 overflow-x-auto snap-x snap-mandatory"
                        variants={containerVariants}
                    >
                        {careers.length > 0 ? (
                            careers.map((career, index) => (
                                <motion.div
                                    key={career.ref_id}
                                    onClick={() => {
                                        navigate(getDetailPath(careerDetailPage?.p_alias, career.ref_id));
                                    }}
                                    className="snap-start cursor-pointer relative sm:w-80 w-70 flex-shrink-0 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <img
                                        src={career.imageUrl}
                                        alt={career.title}
                                        className="w-full h-52 object-cover"
                                        onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                                    />
                                    <div
                                        className="absolute bottom-0 left-0 w-full text-white p-4 space-y-2"
                                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                                    >
                                        <h3 className={`text-lg font-semibold line-clamp-1 overflow-hidden ${currentLang === 2 ? "fonts-khmer" : "font-sans"}`}>{career.title}</h3>
                                        <p className={`text-gray-200 line-clamp-1 overflow-hidden ${currentLang === 2 ? "fonts-khmer" : "font-sans"}`}>{career.description}</p>
                                        <div className="flex items-center text-sm">
                                            <FaCalendarAlt className="mr-2" />
                                            <p className={`text-gray-200 ${currentLang === 2 ? "fonts-khmer" : "font-sans"}`}>{career.date}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-gray-600 text-center w-full py-8">
                                No careers available at the moment.
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default CareerSection;