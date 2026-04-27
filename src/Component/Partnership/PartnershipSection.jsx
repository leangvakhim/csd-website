import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useData } from "../../Context/DataContext";
import { API } from '../../Service/APIconfig';

// Animation variants for the section
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: 'beforeChildren',
      staggerChildren: 0.2,
    },
  },
};

// Animation variants for individual partner logos
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const PartnershipSection = ({ section, headerTitle }) => {
  const { globalData, isLoading } = useData();
  const [partners, setPartners] = useState([]);
  const location = useLocation();
  const currentLang = location.pathname.startsWith('/km') ? 2 : 1;

  useEffect(() => {
    if (globalData?.partners) {
        const data = globalData.partners;
        const formatted = data
          .filter(
            (partner) =>
              partner.active === 1 &&
              partner.ps_type === 1 &&
              partner.ps_sec === section.sec_id
            )
          .map((partner) => ({
            src: partner.img?.img
              ? `${API}/storage/uploads/${partner.img.img}`
              : null,
            alt: partner.ps_title || (currentLang === 2 ? 'រូបសញ្ញាដៃគូ' : 'Partner Logo'),
          }));

        setPartners(formatted);
    }
  }, [currentLang, globalData?.partners, section.sec_id]);


  if (isLoading || partners.length === 0) {
    return null;
  }


  return (
    <div
      lang={currentLang === 2 ? 'km' : 'en'}
      className={`my-16 ${currentLang === 2 ? 'lang-khmer' : 'lang-english'}`}
      role="region"
      aria-label={currentLang === 2 ? 'ផ្នែកដៃគូ' : 'Partnership section'}
    >
      <motion.section
        className="container mx-auto px-8"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          {/* Title */}
          <div className="text-center md:text-left">
            <h2
              className={`text-3xl font-semibold mb-4 ${
                currentLang === 2 ? 'font-khmer' : 'font-semibold'
              }`}
            >
              {headerTitle}
            </h2>
          </div>

          {/* Vertical Divider */}
          <span className="border-r border-gray-300 h-10 hidden lg:block" aria-hidden="true"></span>

          {/* Partner Logos */}
          <motion.div
            className="flex flex-wrap justify-center xl:justify-start items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-center"
                variants={cardVariants}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {partner.src ? (
                  <img
                    src={partner.src}
                    alt={partner.alt}
                    className="max-h-16 w-auto"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/images/fallback-logo.png';
                    }}
                  />
                ) : (
                  <p
                    className={`text-gray-600 ${
                      currentLang === 2 ? 'font-khmer' : 'font-sans'
                    }`}
                    aria-label={partner.alt}
                  >
                    {partner.alt}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default PartnershipSection;