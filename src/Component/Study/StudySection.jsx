import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS } from "../../Service/APIconfig";
import { PiGraduationCapDuotone } from "react-icons/pi";

const StudySection = ({key, section, menuLang}) => {
    const [studyInfo, setStudyInfo] = useState({ title: '', subtitle: '', type: 0 });
    const [yearCards, setYearCards] = useState([]);

    useEffect(() => {
        const fetchStudyInfo = async () => {
            try {
                const res = await axios.get(API_ENDPOINTS.getStudy);
                const data = Array.isArray(res.data?.data) ? res.data.data : [];

                const matched = data.find(
                  (item) => item.section?.sec_type === 'Study' &&
                            item.std_sec === section.sec_id &&
                            item.section?.display === 1 &&
                            item.section?.active === 1
                );

                if (matched) {
                  setStudyInfo({
                    title: matched.std_title,
                    subtitle: matched.std_subtitle,
                    type: matched.std_type,
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
      <>
        {studyInfo.type === 1 && (
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
                      className={`text-3xl font-semibold mb-4 ${menuLang === 2 ? 'font-khmer' : 'font-semibold'}`}
                  >
                      {studyInfo.title}
                  </motion.h2>

                  <motion.p
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      viewport={{ once: true }}
                      className={`text-lg lg:max-w-[743px] w-full mx-auto text-gray-600 mb-8 ${
                        menuLang === 2 ? 'fonts-khmer' : 'font-sans'
                      }`}
                  >
                      {studyInfo.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                    className={`${
                      yearCards.length === 2
                        ? 'grid gap-6 max-w-3xl mx-auto grid-cols-1 sm:grid-cols-2 justify-center'
                        : yearCards.length === 3
                        ? 'grid gap-6 max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center'
                        : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10'
                    }`}
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
                        <h3 className={`text-2xl font-semibold mb-2 text-start ${menuLang === 2 ? 'fonts-khmer text-[20px]' : 'font-sans'}`}>{card.y_title}</h3>
                        <p className={`mb-4 text-start ${menuLang === 2 ? 'fonts-khmer text-[18px]' : 'font-sans'}`}>{card.y_subtitle}</p>
                        <div
                          className={`text-md leading-relaxed text-left ${menuLang === 2 ? 'fonts-khmer text-[18px]' : 'font-sans'} `}
                          dangerouslySetInnerHTML={{ __html: card.y_detail || '' }}
                        />
                      </motion.div>
                    ))}
                  </motion.div>

              </motion.div>
          </div>
        )}
        {studyInfo.type === 2 && (
          <div className='my-16'>
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }} // Trigger when 50% of the element is in view
            className=""
        >
            <div className="container mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className={`text-3xl font-bold text-gray-800 mb-6 ${
                      menuLang === 2 ? "font-khmer" : "font-semibold"
                    }`}
                >
                    {studyInfo.title}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className={`text-gray-600 lg:text-lg text-[12px] mb-12 sm:text-justify ${
                      menuLang === 2 ? "fonts-khmer" : "font-sans"
                    }`}
                >
                    {studyInfo.subtitle}
                </motion.p>
                <div className={`w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 ${
                          menuLang === 2 ? "!fonts-khmer leading-8 " : "font-sans"
                        }`}>
                  {yearCards.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, amount: 0.5 }}
                        className={`bg-white rounded-lg shadow-md ${
                          menuLang === 2 ? "!fonts-khmer leading-8 " : "font-sans"
                        }`}
                        dangerouslySetInnerHTML={{ __html: card?.y_detail || '' }}
                    />
                  ))}
                </div>
                  </div>
              </motion.div>
          </div>
        )}
      </>
    );
}

export default StudySection