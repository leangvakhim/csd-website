import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../Service/APIconfig";
import { FaCheck } from "react-icons/fa";

const parseHTMLDetails = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const spans = doc.querySelectorAll("div span");
    return Array.from(spans).map((el) => el.textContent.trim());
};

const StudySection = () => {
    const { degree, subdegree } = useParams();
    const [selectedYear, setSelectedYear] = useState(null);
    const [studyPlans, setStudyPlans] = useState([]);
    const [studyHeader, setStudyHeader] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudyData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [subdegreeRes, degreeRes] = await Promise.all([
                    axios.get(API_ENDPOINTS.getSubStudyDegree),
                    axios.get(API_ENDPOINTS.getStudy),
                ]);

                const subPlans = subdegreeRes.data?.data || [];
                const degreeData = degreeRes.data?.data;
                console.log("getStudy response:", degreeRes.data);
                
                // Ensure that degreeData exists
                if (degreeData && degreeData.length > 0) {
                    // Set title/subtitle from the first item of the degree data
                    setStudyHeader({
                        title: degreeData[0].std_title,
                        subtitle: degreeData[0].std_subtitle,
                    });
                }

                // Format subdegree plans
                const formattedPlans = subPlans.map((item) => ({
                    id: item.y_id,
                    year: item.y_order,
                    title: item.y_title,
                    subtitle: item.y_subtitle,
                    courses: item.y_detail ? parseHTMLDetails(item.y_detail) : [],
                }));

                setStudyPlans(formattedPlans);
                setSelectedYear(formattedPlans[0]?.year);
            } catch (err) {
                console.error("API error:", err);
                setError("Failed to load study plans");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudyData();
    }, [degree, subdegree]);

    if (isLoading) {
        return <div className="text-center py-8 text-gray-600">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-gray-600">{error}</div>;
    }

    const selectedPlan = studyPlans.find((p) => p.year === selectedYear);

    // Determine grid columns based on study plans length
    const gridCols = studyPlans.length === 2 ? "max-w-3xl mx-auto grid-cols-1 sm:grid-cols-2" :
                     studyPlans.length === 3 ? "max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" :
                     studyPlans.length === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : 
                     "grid-cols-1 sm:grid-cols-2";

    return (
        <div className="my-16 py-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="container mx-auto text-center px-4"
            >
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-3xl font-semibold mb-4"
                >
                    {studyHeader?.title || "No title available"}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-lg xl:max-w-[743px] w-full mx-auto text-gray-600 mb-8"
                >
                    {studyHeader?.subtitle || "No subtitle available"}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className={`grid gap-6 ${gridCols}`}
                >
                    {studyPlans.map((year, index) => {
                        const isActive = selectedYear === year.year;

                        return (
                            <motion.div
                                key={year.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.2 }}
                                className={`rounded-xl p-6 shadow-md transition-all cursor-pointer ${isActive ? "bg-red-900" : "bg-white"}`}
                                onClick={() => setSelectedYear(year.year)}
                            >
                                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <img
                                        src="/path/to/your/image/graduation-cap.png"
                                        alt="Graduation Cap"
                                        className={`${isActive ? "opacity-80" : "opacity-100"} rounded-full`}
                                        width={40}
                                        height={40}
                                    />
                                </div>

                                <h3
                                    className={`text-2xl font-semibold mb-2 text-start ${isActive ? "text-white" : "text-black"}`}
                                >
                                    {year.title}
                                </h3>

                                <p
                                    className={`mb-4 text-start ${isActive ? "text-gray-50" : "text-black"}`}
                                >
                                    {year.subtitle}
                                </p>

                                <ul
                                    className={`text-left text-sm space-y-6 ${isActive ? "text-gray-50" : "text-gray-600"}`}
                                >
                                    {year.courses.map((course, i) => (
                                        <li key={i} className="flex items-start">
                                            <div className="flex mr-2 md:mr-4 mt-2">
                                                <FaCheck
                                                    size={18}
                                                    className={`${isActive ? "text-gray-50" : "text-red-900"}`}
                                                />
                                            </div>
                                            <span className="md:text-base">{course}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default StudySection;
