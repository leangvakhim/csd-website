import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";

// Animation variants for the section
const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
            when: "beforeChildren",
            staggerChildren: 0.2,
        },
    },
};

// Animation variants for individual date cards
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const ImportantSection = ({ section }) => {
    const [sectionData, setSectionData] = useState(null);
    const [dates, setDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch section data
                const sectionRes = await axios.get(
                    `${API_ENDPOINTS.getImportant}?section_id=${section.sec_id}`
                );

                if (sectionRes.data?.data?.length) {
                    setSectionData(sectionRes.data.data[0]);

                    // Fetch dates if needed (assuming a different endpoint for dates)
                    try {
                        const datesRes = await axios.get(
                            `${API_ENDPOINTS.getSubImportant}?section_id=${section.sec_id}`
                        );
                        setDates(datesRes.data?.data || []);
                    } catch (datesError) {
                        console.warn("Could not fetch dates:", datesError);
                        setDates([]);
                    }
                } else {
                    setSectionData(null);
                    setDates([]);
                }
            } catch (err) {
                console.error("ImportantSection API error", err);
                setError("Failed to load important dates");
                setSectionData(null);
                setDates([]);
            } finally {
                setLoading(false);
            }
        };

        if (section?.sec_id) {
            fetchData();
        }
    }, [section]);

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Loading important dates...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    if (!sectionData && !dates.length) {
        return <div className="text-center py-8 text-gray-600">No important dates available.</div>;
    }

    return (
        <div className="my-16">
            <motion.section
                className="container mx-auto px-4"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
            >
                <div className='flex flex-col lg:flex-row gap-6'>
                    {sectionData && (
                        <motion.div className="mb-8" variants={cardVariants}>
                            <motion.h2 className="text-3xl font-semibold mb-4" variants={cardVariants}>
                                {sectionData.idd_title}
                            </motion.h2>
                            <motion.p className="text-gray-800" variants={cardVariants}>
                                {sectionData.idd_subtitle}
                            </motion.p>
                        </motion.div>
                    )}

                    {dates.length > 0 && (
                        <div className="space-y-4 w-full">
                            {dates.map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={cardVariants}
                                    className="bg-white rounded-lg shadow-md p-6"
                                >
                                    <div className="grid lg:grid-cols-12 items-center gap-4">
                                        <div className="bg-pink-100 px-4 py-2 flex flex-col items-center xl:col-span-4 col-span-12">
                                            <h3 className="text-lg font-normal mb-2">{item.sidd_tag}</h3>
                                            <span className="text-pink-700 text-lg text-center rounded-md font-semibold">
                                                {item.sidd_date ? new Date(item.sidd_date).toLocaleDateString(undefined, {
                                                    day: 'numeric',
                                                    month: 'short'
                                                }) : 'Date not specified'}
                                            </span>
                                        </div>
                                        <div className="lg:col-span-8 col-span-12">
                                            <h6 className="text-lg font-semibold mt-2">{item.sidd_title}</h6>
                                            <p className="text-gray-800">{item.sidd_subtitle}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.section>
        </div>
    );
};

export default ImportantSection;