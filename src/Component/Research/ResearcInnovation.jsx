import React, { useEffect, useState } from "react";
import { MdComputer, MdExplore } from "react-icons/md";
import { AiOutlineRobot } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { API_ENDPOINTS } from "../../Service/APIconfig";

const ResearchInnovations = () => {
    const navigate = useNavigate();
    const [researchData, setResearchData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const bottomSections = [
        {
            id: "bottom-1",
            title: "Sustainable Computing",
            description: "Exploring energy-efficient algorithms and green technologies.",
            image: "/images/sustainable.jpg", // Replace with your actual path
            buttons: [
                { icon: <MdComputer className="mr-1" />, label: "Green Tech" },
                { icon: <AiOutlineRobot className="mr-1" />, label: "Automation" },
            ],
        },
        {
            id: "bottom-2",
            title: "Human-Centered AI",
            description: "Designing systems that prioritize user well-being and ethics.",
            image: "/images/human-ai.jpg", // Replace with your actual path
            buttons: [
                { icon: <MdComputer className="mr-1" />, label: "UX Research" },
                { icon: <AiOutlineRobot className="mr-1" />, label: "AI Ethics" },
            ],
        },
    ];

    useEffect(() => {
        const fetchResearch = async () => {
            try {
                const res = await axios.get(API_ENDPOINTS.getResearch);
                const data = res.data?.data || [];

                const filtered = data
                    .filter((item) => item.display === 1 && item.active === 1)
                    .map((item) => ({
                        id: item.rsd_id,
                        title: item.rsd_title,
                        subtitle: item.rsd_subtitle,
                        description: item.rsd_description,
                        image: item.rsd_image,
                        exploreText: "Explore",
                        buttons: [
                            { icon: <MdComputer className="mr-2" />, text: "Computational Advancements" },
                            { icon: <AiOutlineRobot className="mr-2" />, text: "AI & Systems Optimization" },
                        ],
                    }));

                setResearchData(filtered);
                setLoading(false);
            } catch (err) {
                setError("Failed to load research data.");
                setLoading(false);
            }
        };

        fetchResearch();
    }, []);

    if (loading) return <div className="text-center py-10 text-gray-500">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="my-8 sm:my-12 lg:my-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-6 sm:mb-8">
                    Research & Innovations
                </h1>

                {researchData.slice(0, 1).map((item) => (
                    <motion.div
                        key={item.id}
                        className="bg-black rounded-3xl w-full flex flex-col lg:flex-row items-center mx-auto overflow-hidden mb-8 sm:mb-12"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10 px-4 py-6 sm:p-8 w-full items-center justify-between">
                            <div className="w-full lg:w-1/2 flex items-center">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-auto object-cover rounded-xl shadow-md aspect-[4/3] sm:aspect-[16/9]"
                                />
                            </div>

                            <div className="w-full lg:w-1/2 text-left text-white">
                                <motion.h1
                                    className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 uppercase"
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                >
                                    {item.title}
                                </motion.h1>
                                <motion.h3
                                    className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4"
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                >
                                    {item.subtitle}
                                </motion.h3>
                                <motion.p
                                    className="text-sm sm:text-base lg:text-lg font-normal mb-4 lg:text-justify"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                >
                                    {item.description}
                                </motion.p>

                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    {item.buttons.map((btn, btnIndex) => (
                                        <motion.button
                                            key={btnIndex}
                                            className="text-sm sm:text-base flex items-center bg-gray-900/50 px-3 sm:px-4 py-2 rounded-3xl gap-1 font-normal"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.2 * btnIndex }}
                                            viewport={{ once: true, amount: 0.3 }}
                                        >
                                            {btn.icon}
                                            {btn.text}
                                        </motion.button>
                                    ))}
                                </div>

                                <div className="mt-4">
                                    <motion.button
                                        className="text-sm sm:text-base bg-red-900 hover:bg-red-800 text-white py-2 px-4 sm:px-6 rounded-3xl flex items-center font-normal"
                                        onClick={() => navigate(`research/${item.id}`)}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8, delay: 0.8 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                    >
                                        <MdExplore className="mr-2" />
                                        {item.exploreText}
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {researchData.map((section, index) => (
                        <motion.div
                            key={section.id}
                            className="relative bg-white rounded-lg shadow-md overflow-hidden group h-[400px] sm:h-[450px]"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 * index }}
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <img
                                src={section.image}
                                alt={section.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                            <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between text-white">
                                <div className="flex flex-col gap-2 items-end">
                                    {section.buttons.map((button, btnIndex) => (
                                        <motion.button
                                            key={btnIndex}
                                            className="text-xs sm:text-sm flex items-center bg-gray-900/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-3xl font-normal"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.2 * btnIndex }}
                                            viewport={{ once: true, amount: 0.3 }}
                                        >
                                            {button.icon}
                                            {button.label}
                                        </motion.button>
                                    ))}
                                </div>
                                <div>
                                    <motion.h3
                                        className="text-base sm:text-lg lg:text-xl font-normal mb-3 sm:mb-4"
                                        initial={{ opacity: 0, x: -50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                    >
                                        {section.title}
                                    </motion.h3>
                                    <motion.p
                                        className="text-xs sm:text-sm lg:text-base font-normal mb-4 sm:block hidden"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8, delay: 0.6 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                    >
                                        {section.description}
                                    </motion.p>
                                    <motion.button
                                        onClick={() => navigate(`research/${section.id}`)}
                                        className="text-sm sm:text-base bg-red-900 hover:bg-red-800 text-white py-2 px-4 sm:px-6 rounded-3xl flex items-center font-normal"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8, delay: 0.8 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                    >
                                        <MdExplore className="mr-2" />
                                        Explore
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResearchInnovations;
