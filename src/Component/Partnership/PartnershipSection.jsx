import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';

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

const PartnershipSection = ({ section, headerTitle, menuLang }) => {
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_ENDPOINTS.getPartnership}?lang=${menuLang}`);
        const data = Array.isArray(res.data?.data) ? res.data.data : [];

        const formatted = data
          .filter(
            (partner) =>
              partner.active === 1 &&
              partner.ps_type === 1 &&
              String(partner.ps_sec) === String(section.sec_id) &&
              partner.lang === menuLang
          )
          .slice(0, 4)
          .map((partner) => ({
            src: partner.ps_img
              ? `${API}/storage/uploads/${partner.ps_img}`
              : null,
            alt: partner.ps_title || (menuLang === 2 ? 'រូបសញ្ញាដៃគូ' : 'Partner Logo'),
          }));

        setPartners(formatted);
        setIsLoading(false);
      } catch (error) {
        console.error('PartnershipSection: Error fetching partners:', error);
        setError(
          menuLang === 2
            ? 'បរាជ័យក្នុងការទាញយកទិន្នន័យដៃគូ'
            : 'Failed to load partner data'
        );
        setPartners([]);
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, [section.sec_id, menuLang]);

  if (isLoading) {
    return (
      <div
        lang={menuLang === 2 ? 'km' : 'en'}
        className={`text-center py-8 text-gray-600 ${
          menuLang === 2 ? 'lang-khmer font-khmer' : 'lang-english font-sans'
        }`}
      >
        {menuLang === 2 ? 'កំពុងផ្ទុក...' : 'Loading partners...'}
      </div>
    );
  }

  if (error || partners.length === 0) {
    return (
      <div
        lang={menuLang === 2 ? 'km' : 'en'}
        className={`text-center py-8 text-gray-600 ${
          menuLang === 2 ? 'lang-khmer font-khmer' : 'lang-english font-sans'
        }`}
        role="region"
        aria-label={menuLang === 2 ? 'ផ្នែកដៃគូ' : 'Partnership section'}
      >
        {error || (menuLang === 2 ? 'គ្មានដៃគូសម្រាប់បង្ហាញ' : 'No partners to display')}
        {error && (
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
          >
            {menuLang === 2 ? 'សាកល្បងម្តងទៀត' : 'Retry'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      lang={menuLang === 2 ? 'km' : 'en'}
      className={`my-16 ${menuLang === 2 ? 'lang-khmer' : 'lang-english'}`}
      role="region"
      aria-label={menuLang === 2 ? 'ផ្នែកដៃគូ' : 'Partnership section'}
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
                menuLang === 2 ? 'font-moul' : 'font-sans'
              }`}
            >
              {headerTitle || (menuLang === 2 ? 'ដៃគូរបស់យើង' : 'Our Partners')}
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
                      menuLang === 2 ? 'font-khmer' : 'font-sans'
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