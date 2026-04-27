import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt } from 'react-icons/fa';
import { useData } from '../../Context/DataContext';
import { API } from '../../Service/APIconfig';

const ScholarshipBanner = ({ scholarshipId }) => {
  const { globalData, isLoading } = useData();
  const [bannerSection, setBannerSection] = useState(null);
  const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

  useEffect(() => {
    if (globalData?.scholarship && scholarshipId) {
      const allScholarships = globalData.scholarship || [];
      const selectedItem = allScholarships.find(item =>
        item.ref_id === Number(scholarshipId) && item.lang === currentLang
      );
      if (selectedItem) {
        setBannerSection({
          title: selectedItem.sc_title,
          postDate: new Date(selectedItem.sc_postdate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          image: selectedItem.image?.img
            ? `${API}/storage/uploads/${selectedItem.image.img}`
            : '/placeholder-image.jpg',
        });
      }
    }
  }, [scholarshipId, currentLang, globalData]);

  if (isLoading || !bannerSection) return null;

  return (
    <motion.div
      className="relative w-full h-[600px] text-white bg-cover bg-center flex items-end"
      style={{ backgroundImage: `url(${bannerSection.image})` }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.5 }}
    >
      {/* Fixed Overlay using RGBA */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      ></div>

      <div className="ml-6">
        {/* Content Positioned at Bottom */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.5 }}
          className="relative z-10 max-w-xl px-6 pb-8 space-y-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, amount: 0.5 }}
            className={`text-3xl sm:text-4xl font-bold drop-shadow-md ${currentLang === 2 ? 'font-khmer' : 'font-semibold'}`}
          >
            {bannerSection.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-md flex items-center text-gray-50 drop-shadow-md"
          >
            <FaCalendarAlt className={`mr-2 text-lg ${currentLang === 2 ? 'fonts-khmer' : 'font-sans'}`} />
            {currentLang === 1 ? "Post on" : "បង្ហោះនៅថ្ងៃ"}: {bannerSection.postDate}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ScholarshipBanner;