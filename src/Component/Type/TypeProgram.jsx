import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RiDoubleQuotesR } from 'react-icons/ri';
import { API_ENDPOINTS } from '../../Service/APIconfig';

const TypeProgram = ({ section }) => {
  const [reasons, setReasons] = useState([]);
  const [mainTitle, setMainTitle] = useState('');
  const [description, setDescription] = useState('');
  const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

  useEffect(() => {
    if (section && section.sec_id) {
      // Fetch child items (reasons)
      fetch(`${API_ENDPOINTS.getSubType}?section_id=${section.sec_id}`)
        .then((res) => res.json())
        .then((data) => {
          const items = data?.data?.filter((item) => item.lang === section.lang);
          setReasons(items || []);
        })
        .catch((err) => console.error('Error fetching reasons:', err));

      // Fetch section title and description
      fetch(`${API_ENDPOINTS.getType}?section_id=${section.sec_id}`)
        .then((res) => res.json())
        .then((data) => {
          const mainData = data?.data?.find((item) => item.lang === currentLang) || data?.data?.[0];
          setMainTitle(mainData?.text?.title || 'Why Choose Us');
          setDescription(mainData?.text?.desc || '');
        })
        .catch((err) => console.error('Error fetching main section:', err));
    }
  }, [section, currentLang]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

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
