import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_ENDPOINTS } from "../../Service/APIconfig";

// Animation variants
const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.2 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// StatisticCard Component
const StatisticCard = ({ value, rank, className = "" }) => {
    return (
        <motion.div
            className={`flex flex-col items-center justify-center text-center ${className}`}
            variants={cardVariants}
        >
            <div
                className="text-3xl text-gray-50 font-normal mb-4"
                dangerouslySetInnerHTML={{ __html: value }}
            />
            <div className="text-xl text-gray-50 font-normal">{rank}</div>
        </motion.div>
    );
};

// AboutSection Component
const AboutSection = ({ section }) => {
    const [stats, setStats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        axios
            .get(API_ENDPOINTS.getSetting)
            .then((res) => {
                const settings = res.data?.data || [];
                const data = settings.find(item => item.lang === 1);
                // const data = res.data?.data; // single object, no map needed
                if (!data) throw new Error("Invalid API response");
                const formattedStats = [
                    { value: data.set_amstu.toLocaleString(), rank: "Students" },
                    { value: data.set_enroll.toLocaleString(), rank: "Increase Enrollment" },
                    { value: "1<sup class='text-md'>st</sup>", rank: "University In Cambodia" },
                ];
                setStats(formattedStats);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("API error:", err);
                const fallbackStats = [
                    { value: "2,000", rank: "Students" },
                    { value: "5,000", rank: "Increase Enrollment" },
                    { value: "1<sup class='text-md'>st</sup>", rank: "University In Cambodia" },
                ];
                setStats(fallbackStats);
                setError("Failed to load statistics");
                setIsLoading(false);
            });

            // console.log("response is: ",response);
    }, [section]);

    if (isLoading) return <div className="text-center py-8 text-gray-600">Loading...</div>;
    if (error && stats.length === 0) return <div className="text-center py-8 text-gray-600">{error}</div>;

    return (
        <div className="my-16 py-4">
            <motion.section
                className="container mx-auto px-4"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
            >
                <div className="flex justify-center">
                    <motion.div
                        variants={cardVariants}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-full xl:max-w-6xl"
                    >
                        <div className="flex p-6 items-center justify-center rounded-3xl bg-red-900 text-white">
                            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 w-full">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        variants={cardVariants}
                                        transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
                                    >
                                        <StatisticCard
                                            value={stat.value}
                                            rank={stat.rank}
                                            className="text-center text-lg font-semibold"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
};

export default AboutSection;
