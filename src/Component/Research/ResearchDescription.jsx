import React, { useState, useEffect } from 'react';
import { useData } from '../../Context/DataContext';
import { motion } from 'framer-motion';

const ResearchDescription = ({rsdtId}) => {
    const { globalData } = useData();
    const [descriptionSection, setDescriptionSection] = useState({ rsdd_title: '', rsdd_details: '' });
    const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

    useEffect(() => {
        if (rsdtId && globalData?.researchDescs) {
            const allItems = globalData.researchDescs;
            const filtered = allItems.find(item => item.rsdd_rsdtile == rsdtId);
            if (filtered?.rsdd_details) {
                setDescriptionSection({
                    rsdd_title: filtered.rsdd_title,
                    rsdd_details: filtered.rsdd_details
                });
            }
        }
    }, [rsdtId, globalData?.researchDescs]);

    if (!descriptionSection.rsdd_details) return null;


    return (
        <section>
            <div className="my-16 py-4">
                <div className="container mx-auto px-4"> {/* Added px-4 for horizontal padding */}
                    <div className="space-y-4 flex flex-col xl:flex-row gap-10">
                        <div className=" w-full mx-auto">
                            <motion.h2
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                                className={`xl:text-3xl w-full text-2xl font-extrabold text-gray-900 ${currentLang === 2 ? 'font-khmer' : 'font-semibold'}`}
                            >
                                {descriptionSection.rsdd_title}
                            </motion.h2>
                        </div>
                        <div className=" w-full mx-auto">
                            <motion.p
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                viewport={{ once: true }}
                                className={`text-sm w-full xl:text-lg text-gray-800 ${currentLang === 2 ? 'fonts-khmer leading-8' : 'font-sans-serif'}`}
                                dangerouslySetInnerHTML={{ __html: descriptionSection.rsdd_details }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ResearchDescription