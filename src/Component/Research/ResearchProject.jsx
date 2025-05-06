import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';
import { motion } from 'framer-motion';

const ResearchProject = ({rsdtId}) => {
    const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;
    const [projectRequirement, setProjectRequirement] = useState({ rsdp_title: '', rsdp_detail: '' });

    useEffect(() => {
        if (rsdtId) {
            axios.get(API_ENDPOINTS.getRsdProject)
                .then((res) => {
                    const allProjects = res.data?.data;
                    const match = allProjects.find(item => item.rsdp_rsdtile === rsdtId);
                    if (match) {
                        setProjectRequirement({
                            rsdp_title: match.rsdp_title,
                            rsdp_detail: match.rsdp_detail
                        });
                    }
                })
                .catch(err => console.error("Error fetching project requirements:", err));
        }
    }, [rsdtId]);

    return (
        <section>
            <div className="my-16">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="container mx-auto px-4"
                >
                    <div className="xl:h-[479px] h-full flex flex-col xl:flex-row items-center gap-8 py-8 xl:py-0">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true, amount: 0.5 }}
                            className="w-full px-4 xl:px-0"
                        >
                            <h2 className={`text-2xl xl:text-3xl font-bold mb-4 ${currentLang === 2 ? 'font-khmer' : 'font-semibold'}`}>
                                {projectRequirement.rsdp_title}
                            </h2>
                            <div
                                className={`text-sm lg:text-lg text-gray-800 ${currentLang === 2 ? 'fonts-khmer leading-8' : 'font-sans-serif'}`}
                                dangerouslySetInnerHTML={{ __html: projectRequirement.rsdp_detail }}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default ResearchProject