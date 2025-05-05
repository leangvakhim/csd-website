import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';
import { motion } from 'framer-motion';
import { MdComputer } from 'react-icons/md';

const ResearchBanner = ({ researchId, menuLang }) => {
  const [bannerSection, setBannerSection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!researchId) {
      console.log('ResearchBanner: No researchId provided');
      setError(
        menuLang === 2
          ? 'គ្មានលេខសម្គាល់ការស្រាវជ្រាវ'
          : 'No research ID provided'
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    axios
      .get(`${API_ENDPOINTS.getResearch}/${researchId}?lang=${menuLang}`)
      .then((res) => {
        const data = res.data?.data;
        if (data && data.rsd_title && data.image?.img) {
          setBannerSection({
            title: data.rsd_title,
            description: data.rsd_subtitle || '',
            image: `${API}/storage/uploads/${data.image.img}`,
            lead: data.rsd_lead || (menuLang === 2 ? 'ការស្រាវជ្រាវ' : 'Research'),
          });
        } else {
          console.log('ResearchBanner: Invalid or incomplete research data');
          setError(
            menuLang === 2
              ? 'ទិន្នន័យការស្រាវជ្រាវមិនត្រឹមត្រូវ'
              : 'Invalid research data'
          );
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching research details:', err);
        setError(
          menuLang === 2
            ? 'បរាជ័យក្នុងការទាញយកទិន្នន័យការស្រាវជ្រាវ'
            : 'Failed to load research data'
        );
        setIsLoading(false);
      });
  }, [researchId, menuLang]);

  if (isLoading) {
    return (
      <section
        lang={menuLang === 2 ? 'km' : 'en'}
        className={`text-center py-8 text-gray-600 ${
          menuLang === 2 ? 'lang-khmer font-khmer' : 'lang-english font-sans'
        }`}
      >
        {menuLang === 2 ? 'កំពុងផ្ទុក...' : 'Loading research banner...'}
      </section>
    );
  }

  if (error || !bannerSection) {
    return (
      <section
        lang={menuLang === 2 ? 'km' : 'en'}
        className={`text-center py-8 text-red-600 ${
          menuLang === 2 ? 'lang-khmer font-khmer' : 'lang-english font-sans'
        }`}
        role="banner"
        aria-label={menuLang === 2 ? 'ផ្នែកបដាស្រាវជ្រាវ' : 'Research banner section'}
      >
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
        >
          {menuLang === 2 ? 'សាកល្បងម្តងទៀត' : 'Retry'}
        </button>
      </section>
    );
  }

  return (
    <section
      lang={menuLang === 2 ? 'km' : 'en'}
      className={`relative ${
        menuLang === 2 ? 'lang-khmer' : 'lang-english'
      }`}
      role="banner"
      aria-label={menuLang === 2 ? 'ផ្នែកបដាស្រាវជ្រាវ' : 'Research banner section'}
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
                menuLang === 2 ? 'font-khmer' : 'font-sans'
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
            className="max-w-xl"
          >
            <h2
              className={`lg:text-4xl text-3xl font-semibold mb-4 ${
                menuLang === 2 ? 'font-moul' : 'font-sans'
              }`}
            >
              {bannerSection.title}
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true, amount: 0.5 }}
              className={`mb-4 xl:text-base text-sm text-gray-50 ${
                menuLang === 2 ? 'font-khmer' : 'font-sans'
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