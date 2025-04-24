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
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (section?.sec_id) {
            axios
                .get(`${API_ENDPOINTS.getImportant}?section_id=${section.sec_id}`)
                .then((res) => {
                    setItems(res.data?.data || []);
                })
                .catch((err) => console.error("ImportantSection API error", err));
        }
    }, [section]);

    if (!items.length) {
        return <div className="text-center py-8 text-gray-600">No important dates available.</div>;
    }

    // The API returns a single section object with no individual date entries
    // If your API only returns section info, you might need another endpoint for dates
    const sectionData = items[0];

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
                    <motion.div className="mb-8" variants={cardVariants}>
                        <motion.h2 className="text-3xl font-semibold mb-4" variants={cardVariants}>
                            {sectionData.idd_title}
                        </motion.h2>
                        <motion.p className="text-gray-800" variants={cardVariants}>
                            {sectionData.idd_subtitle}
                        </motion.p>
                    </motion.div>

                    {/* If you had individual dates, map them here. */}

                    {/* Example static mapping of dates if present */}
                    {sectionData.dates && (
                        <div className="space-y-4">
                            {sectionData.dates.map((item, index) => (
                                <motion.div key={index} variants={cardVariants} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="grid lg:grid-cols-12 items-center gap-4">
                                        <div className="bg-pink-100 px-4 py-2 flex flex-col items-center xl:col-span-4 col-span-12">
                                            <h3 className="text-lg font-normal mb-2">{item.title}</h3>
                                            <span className="text-pink-700 text-lg text-center rounded-md font-semibold">
                                                {new Date(item.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                        <div className="xl:col-span-8 col-span-12">
                                            <h4 className="text-xl font-semibold mt-2">{item.subtitle}</h4>
                                            <p className="text-gray-800">{item.description}</p>
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