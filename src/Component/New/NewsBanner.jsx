import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';

const NewsBanner = () => {
  const [bannerSection, setBannerSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
   
    const fetchBanner = async () => {
      try {
          const response = await axios.get(`${API_ENDPOINTS.getNews}`);
          const data = response.data?.data || [];
          // Select the first item with display: 1 and lang: 1 (or user’s preferred language)
          const selectedItem = data.find(item => item.display === 1 && item.lang === 1) || data[0];
          if (selectedItem) {
              setBannerSection({
                  title: selectedItem.n_title,
                  postDate: selectedItem.n_date
                      ? new Date(selectedItem.n_date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        })
                      : 'TBD',
                  image: selectedItem.img?.img
                      ? `${API}/storage/uploads/${selectedItem.img.img}`
                      : '/placeholder-image.jpg',
              });
          } else {
              setError('No relevant news found.');
          }
          setLoading(false);
      } catch (err) {
          setError(err.response?.status === 404 ? 'News not found.' : 'Failed to load news banner.');
          console.error('Error fetching news details:', err);
          setLoading(false);
      }
  };
        fetchBanner();
  
}, []);

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
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      ></div>
      <div className="ml-6">
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
            className="mt-2 text-md flex items-center text-gray-50 drop-shadow-md"
          >
            <FaCalendarAlt className="mr-2 text-lg" />
            Post on: {bannerSection.postDate}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NewsBanner;