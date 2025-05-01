import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaCalendarAlt } from 'react-icons/fa';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';

const ScholarshipBanner = ({ scholarshipId }) => {
  const [bannerSection, setBannerSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (scholarshipId) {
      const fetchBanner = async () => {
        try {
          const response = await axios.get(`${API_ENDPOINTS.getScholarship}/${scholarshipId}`);
          const data = response.data?.data;
          setBannerSection({
            title: data.sc_title,
            postDate: new Date(data.sc_postdate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }), // Format: "22 Aug 2025"
            image: data.image?.img
              ? `${API}/storage/uploads/${data.image.img}`
              : '/placeholder-image.jpg',
          });
          setLoading(false);
        } catch (err) {
          setError('Failed to load scholarship banner.');
          console.error('Error fetching scholarship details:', err);
          setLoading(false);
        }
      };
      fetchBanner();
    }
  }, [scholarshipId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] px-4 text-center">
        <p className="text-base text-gray-500 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px] px-4 text-center">
        <p className="text-base text-red-500">{error}</p>
      </div>
    );
  }

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
            className="text-3xl sm:text-4xl font-bold drop-shadow-md"
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
            <FaCalendarAlt className="mr-2 text-lg" />
            Post on: {bannerSection.postDate}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ScholarshipBanner;