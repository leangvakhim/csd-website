import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';
import 'swiper/css';
import 'swiper/css/autoplay';

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

const UniPartnerships = ({ section, headerTitle }) => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await axios.get(`${API_ENDPOINTS.getPartnership}?section_id=${section.sec_id}`);
        let data = res.data?.data ?? [];

        // Ensure data is an array
        if (data && !Array.isArray(data)) {
          data = [data];
        }

        const formatted = data
          .filter((partner) => partner.active === 1 && partner.ps_type === 2) // Filter active partners
          .map((partner) => ({
            src: partner.img?.img
              ? `${API}/storage/uploads/${partner.img.img}` // Use img.img for image file name
              : null,
            alt: partner.ps_title || 'Partner Logo', // Use title or fallback
          }));

        // Only update state if data has changed to prevent unnecessary re-renders
        setPartners((prevPartners) => {
          if (JSON.stringify(prevPartners) !== JSON.stringify(formatted)) {
            return formatted;
          }
          return prevPartners;
        });
      } catch (error) {
        console.error('UniPartnerships: Error fetching partners:', error);
        setPartners([]); // Reset state on error
      }
    };

    fetchPartners();
  }, [section.sec_id]); // Use specific property to avoid unnecessary re-runs

  if (partners.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No Partnerships With Universities to display.
      </div>
    );
  }

  return (
    <div className="bg-white my-16">
      <motion.section
        className="container mx-auto px-4 text-center"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <h2 className="text-3xl font-semibold mb-8">
          {headerTitle}
        </h2>

        {/* Swiper Slider */}
        <Swiper
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          className="w-full"
        >
          {partners.map((partner, index) => (
            <SwiperSlide key={index} className="flex justify-center">
              <motion.div
                className="flex flex-col items-center gap-6"
                variants={cardVariants}
                transition={{ duration: 0.6 }}
              >
                {partner.src ? (
                  <img
                    src={partner.src}
                    alt={partner.alt}
                    className="h-20"
                    aria-label={partner.alt}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = '/fallback-logo.png')}
                  />
                ) : (
                  <p className="text-gray-600">{partner.alt}</p>
                )}
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.section>
    </div>
  );
};

export default UniPartnerships;