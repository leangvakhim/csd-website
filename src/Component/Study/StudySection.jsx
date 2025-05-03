import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS } from "../../Service/APIconfig";
import { PiGraduationCapDuotone } from "react-icons/pi";

const StudySection = ({key, section, menuLang}) => {
    const [studyInfo, setStudyInfo] = useState({ title: '', subtitle: '' });
    const [yearCards, setYearCards] = useState([]);

    useEffect(() => {
        const fetchStudyInfo = async () => {
            try {
                const res = await axios.get(API_ENDPOINTS.getStudy);
                const data = Array.isArray(res.data?.data) ? res.data.data : [];

                const matched = data.find(
                  (item) => item.section?.sec_type === 'Study' && item.std_sec === section.sec_id
                );

                if (matched) {
                  setStudyInfo({
                    title: matched.std_title,
                    subtitle: matched.std_subtitle,
                  });
                }
            } catch (err) {
                console.error('Failed to fetch study info:', err);
            }
        };

        fetchStudyInfo();

        const fetchYears = async () => {
            try {
                const res = await axios.get(API_ENDPOINTS.getSubStudyDegree);
                const allYears = Array.isArray(res.data?.data) ? res.data.data : [];

                const filteredYears = allYears
                  .filter(y => y.studydegree?.std_id === y.y_std && y.studydegree?.std_sec === section.sec_id)
                  .sort((a, b) => a.y_order - b.y_order);

                setYearCards(filteredYears);
            } catch (err) {
                console.error("Failed to fetch year data:", err);
            }
        };

        fetchYears();
    }, [section.sec_id]);

    return (
        <div className="my-16 py-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="container mx-auto text-center px-4 "
            >
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-3xl font-semibold mb-4"
                >
                    {studyInfo.title}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-lg xl:max-w-[743px] w-full mx-auto text-gray-600 mb-8"
                >
                    {studyInfo.subtitle}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                  className={`${yearCards.length === 2 ? `grid gap-6 max-w-3xl mx-auto grid-cols-1 sm:grid-cols-2 justify-center` : `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10`}`}
                  // className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10"
                  // className="grid gap-6 max-w-3xl mx-auto grid-cols-1 sm:grid-cols-2 justify-center   "
                >
                  {yearCards.map((card, index) => (
                    <motion.div
                      key={card.y_id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.2 }}
                      viewport={{ once: true }}
                      className={`rounded-xl p-6 shadow-md transition-all ${index === 0 ? 'bg-red-900 text-white' : 'bg-white text-black'}`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-0`}>
                            <PiGraduationCapDuotone size={32} className={`${index === 0 ? 'text-white' : 'text-black'}`} />
                        </div>
                      <h3 className="text-2xl font-semibold mb-2 text-start">{card.y_title}</h3>
                      <p className="mb-4 text-start">{card.y_subtitle}</p>
                      <div
                        className="text-md leading-relaxed text-left"
                        dangerouslySetInnerHTML={{ __html: card.y_detail || '' }}
                      />
                    </motion.div>
                  ))}
                </motion.div>

            </motion.div>
        </div>
    );
}

export default StudySection