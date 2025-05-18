import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, API, axiosInstance } from '../../Service/APIconfig';
import { motion } from 'framer-motion';
import { MdComputer } from 'react-icons/md';
import { useLocation } from 'react-router-dom';

const ResearchBanner = ({ researchId }) => {
  const [bannerSection, setBannerSection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const currentLang = location.pathname.startsWith('/km') ? 2 : 1;

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get(`${API_ENDPOINTS.getResearch}/${researchId}`)
      .then((res) => {
        const data = res.data?.data;
        if (data && data.rsd_title && data.image?.img) {
          setBannerSection({
            title: data.rsd_title,
            description: data.rsd_subtitle || '',
            image: `${API}/storage/uploads/${data.image.img}`,
            lead: data.rsd_lead || (currentLang === 2 ? 'ការស្រាវជ្រាវ' : 'Research'),
          });
        } else {
          console.log('ResearchBanner: Invalid or incomplete research data');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching research details:', err);
        setIsLoading(false);
      });
  }, [researchId, currentLang]);

  if (isLoading) {
    return (
      <section
        lang={currentLang === 2 ? 'km' : 'en'}
        className={`text-center py-8 text-gray-600 ${
          currentLang === 2 ? 'lang-khmer font-khmer' : 'lang-english font-sans'
        }`}
      >
        {currentLang === 2 ? 'កំពុងផ្ទុក...' : 'Loading research banner...'}
      </section>
    );
  }

  return (
    <section
      lang={currentLang === 2 ? 'km' : 'en'}
      className={`relative ${
        currentLang === 2 ? 'lang-khmer' : 'lang-english'
      }`}
      role="banner"
      aria-label={currentLang === 2 ? 'ផ្នែកបដាស្រាវជ្រាវ' : 'Research banner section'}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.5 }}
        className="h-[600px] overflow-hidden relative group"
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${bannerSection.image})` }}
        >
          <img
            src={bannerSection.image}
            alt={bannerSection.title}
            className="w-full h-full object-cover opacity-0"
            onError={(e) => {
              e.target.src = '/images/fallback-banner.jpg';
            }}
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-50" aria-hidden="true"></div>
        <div className="container mx-auto absolute inset-0 p-6 flex flex-col justify-between text-white">
          <div className="flex flex-col justify-center items-end py-4">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.5 }}
              className={`text-black lg:text-base text-sm bg-gray-400 py-2 px-4 shadow-md rounded-full flex items-center mb-2 ${
                currentLang === 2 ? 'font-khmer' : 'font-sans'
              }`}
              aria-label={bannerSection.lead}
            >
              <MdComputer className="mr-2" aria-hidden="true" />
              {bannerSection.lead}
            </motion.button>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, amount: 0.5 }}
            className={`max-w-xl `}
          >
            <h2
              className={`lg:text-4xl text-3xl font-semibold mb-4 ${currentLang === 2 ? 'font-khmer' : 'font-semibold'}`}
            >
              {bannerSection.title}
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true, amount: 0.5 }}
              className={`mb-4 xl:text-base text-sm text-gray-50 ${
                currentLang === 2 ? 'fonts-khmer' : 'font-sans'
              }`}
            >
              {bannerSection.description}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default ResearchBanner;