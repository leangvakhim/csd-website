import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API } from "../../Service/APIconfig";

import { Link } from "react-router-dom";
import { useData } from "../../Context/DataContext";

const UnlockSection = ({key, section, menuLang}) => {
    const { globalData } = useData();
    const [unlockData, setUnlockData] = useState(null);
    const [umdAlias, setUmdAlias] = useState('');

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const getAlias = (routePage) => {
        if (!globalData?.pages) return null;
        const matched = globalData.pages.find((page) => page.p_title === routePage);
        return matched?.p_alias || null;
    };

    useEffect(() => {
        if (globalData?.unlocks) {
            const dataList = globalData.unlocks;
            const matched = dataList.find(item => item.umd_sec === section?.sec_id);
            if (matched) {
                setUnlockData(matched);
                const alias = getAlias(matched.umd_routepage);
                if (alias) {
                    setUmdAlias(alias);
                }
            }
        }
    }, [section?.sec_id, globalData?.unlocks, globalData?.pages]);

    if (!unlockData) return null;

    return (

        <div className="bg-black my-16">
            <div className="container mx-auto px-4">
                {unlockData && (
                    <motion.div
                        className="flex flex-col xl:flex-row items-center justify-center gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="xl:w-[514px] w-full p-6 relative">
                            <div className="absolute inset-0 border p-2 bg-sky-600 rounded-full w-4 h-4 top-24 left-10"></div>
                            <div className="absolute border p-2 bg-red-300 rounded-full w-12 h-12 top-0 left-32"></div>
                            <div className="absolute border p-2 bg-red-800 rounded-full w-18 h-18 top-26 right-0"></div>
                            <img
                                src={`${API}/storage/uploads/${unlockData.image?.img}`}
                                alt=""
                                className="w-full h-full mx-auto object-cover rounded-lg"
                            />
                        </div>
                        <motion.div className="text-white p-6 rounded-lg shadow-lg xl:w-[641px] mx-auto">
                            <h2 className={`text-3xl font-bold mb-4 ${menuLang === 2 ? "font-khmer" : "font-semibold"}`}>{unlockData.umd_title}</h2>
                            <p className={`mb-6 ${menuLang === 2 ? "fonts-khmer leading-8" : "font-sans"}`}>{unlockData.umd_detail}</p>
                            {/* <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="bg-white text-red-900 font-bold py-2 px-4 rounded-lg"
                            >
                                {unlockData.umd_btntext}
                            </motion.button> */}
                            <Link to={umdAlias || '/'}>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    className={`bg-white text-red-900 font-bold py-2 px-4 rounded-lg ${menuLang === 2 ? 'fonts-khmer' : 'font-sans'} `}
                                >
                                    {unlockData.umd_btntext}
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default UnlockSection;