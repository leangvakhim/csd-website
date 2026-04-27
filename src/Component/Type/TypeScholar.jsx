import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from "../../Context/DataContext";

const TypeScholar = ({ section }) => {
  const { globalData, isLoading } = useData();
  const [scholarships, setScholarships] = useState([]);
  const [mainTitle, setMainTitle] = useState('');
  const [description, setDescription] = useState('');
  const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

  useEffect(() => {
    if (globalData && section && section.sec_id) {
      // 1. Get SubTypes (scholarships categories)
      if (globalData.subTypes) {
        const items = (globalData.subTypes || []).filter(
          (item) => item.stse_sec === section.sec_id && item.lang === currentLang
        );
        setScholarships(items || []);
      }

      // 2. Get Types (main title and description)
      if (globalData.types) {
        const mainData = (globalData.types || []).find(
          (item) => item.sec_id === section.sec_id && item.lang === currentLang
        );
        
        if (mainData) {
          setMainTitle(mainData?.text?.title || 'Default Title');
          setDescription(mainData?.text?.desc || 'No description available.');
        } else {
          setMainTitle('Scholarship Programs');
          setDescription('');
        }
      }
    }
  }, [section, currentLang, globalData]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  if (isLoading) return null;

  return (
    <div className="my-16">
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
      >
        <div className="mb-8 flex flex-col xl:flex-row xl:justify-between xl:items-start gap-6">
          {/* Title */}
          <h2 className="text-3xl font-bold">{mainTitle}</h2>

          {/* Description */}
          <p className="text-gray-800 max-w-2xl">{description}</p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4"
          variants={containerVariants}
        >
          {scholarships.length > 0 ? (
            scholarships.map((scholarship, index) => (
              <motion.div
                key={index}
                className={`rounded-lg p-6 shadow-lg border ${index % 2 === 1 ? 'bg-red-800 text-white' : 'bg-white text-gray-800'}`}
                variants={itemVariants}
              >
                {/* Title */}
                <h3 className="text-xl font-semibold">{scholarship.stse_title}</h3>

                {/* Content Section */}
                <div className="space-y-4">
                  <div className="flex items-start gap-2 mb-4">
                    <p className="text-lg" dangerouslySetInnerHTML={{ __html: scholarship.stse_detail }} />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-lg">No scholarships available at the moment.</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TypeScholar;