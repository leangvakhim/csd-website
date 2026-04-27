import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from "../../Context/DataContext";

import { RiDoubleQuotesR } from "react-icons/ri";

const TypeSection = ({ section, menuLang }) => {
  const [scholarships, setScholarships] = useState([]);
  const [mainTitle, setMainTitle] = useState('');
  const [description, setDescription] = useState('');

  // Fetching Scholarship Types (Full-Funded, Merit-Based, etc.)
  const { globalData } = useData();

  useEffect(() => {
    if (section && section.sec_id && globalData) {
      // Use subTypes from globalData
      const allScholarships = globalData.subTypes || [];
      const filteredScholarships = allScholarships.filter(item => item?.tse?.tse_sec === section.sec_id);
      setScholarships(filteredScholarships);

      // Use types from globalData
      const tseData = globalData.types || [];
      const filteredTse = tseData.find(t => t.tse_sec === section.sec_id);
      if (filteredTse && filteredTse.text) {
        setMainTitle(filteredTse.text.title || 'Default Title');
        setDescription(filteredTse.text.desc || 'No description available.');
      }
    }
  }, [section, globalData]);


  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="my-16">
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
      >
        <div className="mb-8 flex flex-col lg:flex-row xl:justify-between xl:items-start gap-6">
          <h2 className={`text-3xl font-bold ${menuLang === 2 ? 'font-khmer' : 'font-semibold'}`}>{mainTitle}</h2>

          <p className={`text-gray-800 max-w-2xl ${menuLang === 2 ? 'fonts-khmer leading-8' : 'font-sans'}`}>{description}</p>
        </div>
      </motion.div>
      <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4 mx-auto container"
          variants={containerVariants}
        >
      {
        scholarships.map((scholarship, index) => {
          if (scholarship.tse?.tse_type === 1) {
            return (
              <motion.div
                key={index}
                className={`rounded-lg p-6 shadow-lg border !border-gray-300 ${index % 2 === 1 ? 'mr-4 bg-red-800 text-white' : 'ml-4 bg-white text-gray-800'}`}
                variants={itemVariants}
              >
                <h2 className={`text-xl font-semibold mb-4 ${menuLang === 2 ? 'fonts-khmer text-[20px]' : 'font-sans'}`}>{scholarship.stse_title}</h2>
                <div className="space-y-4">
                  <div className={`flex items-start gap-2 mb-4 ${menuLang === 2 ? 'fonts-khmer' : 'font-sans'}`}>
                    <p className="text-lg" dangerouslySetInnerHTML={{ __html: scholarship.stse_detail }} />
                  </div>
                </div>
              </motion.div>
            );
          } else if (scholarship.tse?.tse_type === 2) {
            return null;
          }
          return null;
        })
      }
      </motion.div>
      {scholarships.filter(s => s.tse?.tse_type === 2).length > 0 && (
        <motion.section
          className="my-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={containerVariants}
            >
              {scholarships
                .filter(s => s.tse?.tse_type === 2)
                .map((s, i) => (
                  <motion.div
                    key={i}
                    className={`shadow-lg rounded-lg p-6 relative ${
                      i === 0 ? 'bg-red-800 text-white' : 'bg-white text-gray-800'
                    }`}
                    variants={itemVariants}
                  >
                    <div className="absolute top-[-40px] right-4 text-7xl opacity-90 text-red-700">
                      <RiDoubleQuotesR />
                    </div>
                    <h2
                      className={`text-xl font-semibold mb-2 ${
                        i !== 0 ? 'text-red-800' : ''
                      } ${menuLang === 2 ? 'font-khmer !text-lg' : 'font-sans'}`}
                    >
                      {s.stse_title}
                    </h2>
                    <p className={`${i !== 0 ? 'text-gray-700' : ''} ${menuLang === 2 ? 'fonts-khmer leading-8' : 'font-sans'}`}>
                      {s.stse_detail.replace(/<\/?[^>]+(>|$)/g, '')}
                    </p>
                  </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default TypeSection;