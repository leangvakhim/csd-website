import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RiDoubleQuotesR } from 'react-icons/ri';
import { useData } from '../../Context/DataContext';

const TypeProgram = ({ section }) => {
  const { globalData, isLoading } = useData();
  const [reasons, setReasons] = useState([]);
  const [mainTitle, setMainTitle] = useState('');
  const [description, setDescription] = useState('');
  const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

  useEffect(() => {
    if (globalData && section && section.sec_id) {
      // 1. Get SubTypes (reasons)
      if (globalData.subTypes) {
        const items = (globalData.subTypes || []).filter(
          (item) => item.stse_sec === section.sec_id && item.lang === currentLang
        );
        setReasons(items || []);
      }

      // 2. Get Types (main title and description)
      if (globalData.types) {
        const mainData = (globalData.types || []).find(
          (item) => item.sec_id === section.sec_id && item.lang === currentLang
        );
        
        if (mainData) {
          setMainTitle(mainData?.text?.title || 'Why Choose Us');
          setDescription(mainData?.text?.desc || '');
        } else {
          // Fallback to searching by ref_id or section if needed, 
          // but usually globalData should have it filtered correctly.
          setMainTitle('Why Choose Us');
          setDescription('');
        }
      }
    }
  }, [section, currentLang, globalData]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (isLoading) return null;

  return (
    <motion.section
      className="my-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col xl:flex-row xl:justify-between xl:items-start gap-6">
          <motion.h2 className="text-3xl font-bold" variants={itemVariants}>
            {mainTitle}
          </motion.h2>
          <motion.p className="text-gray-800 max-w-2xl" variants={itemVariants}>
            {description}
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
        >
          {reasons.length > 0 ? (
            reasons.map((reason, index) => (
              <motion.div
                key={index}
                className={`rounded-lg p-6 shadow-lg relative border ${
                  index % 2 === 0 ? 'bg-red-800 text-white' : 'bg-white text-gray-800'
                }`}
                variants={itemVariants}
              >
                <div className="absolute top-[-40px] right-4 text-7xl opacity-90 text-red-700">
                  <RiDoubleQuotesR />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${index % 2 === 0 ? '' : 'text-red-800'}`}>
                  {reason.stse_title}
                </h3>
                <p
                  className={`${index % 2 === 0 ? 'text-white' : 'text-gray-700'}`}
                  dangerouslySetInnerHTML={{ __html: reason.stse_detail }}
                />
              </motion.div>
            ))
          ) : (
            <p className="text-lg">No reasons available at the moment.</p>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TypeProgram;
