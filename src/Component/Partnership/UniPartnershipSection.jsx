import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useData } from '../../Context/DataContext';
import { API } from '../../Service/APIconfig';
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
  const { globalData, isLoading } = useData();
  const [partners, setPartners] = useState([]);
  const currentLng = window.location.pathname.startsWith('/km') ? 2 : 1;

  useEffect(() => {
    if (globalData?.partners) {
      const data = globalData.partners;

      const formatted = data
        .filter((partner) => 
          partner.active === 1 && 
          partner.ps_type === 2 && 
          partner.ps_sec === section.sec_id
        )
        .map((partner) => ({
          src: partner.img?.img
            ? `${API}/storage/uploads/${partner.img.img}`
            : null,
          alt: partner.ps_title || 'Partner Logo',
        }));

      setPartners(formatted);
    }
  }, [section.sec_id, globalData]);

  if (isLoading) return null;

  if (partners.length === 0) return null;

  return (
    <div className="bg-white my-16">
      <motion.section
        className="container mx-auto px-4 text-center"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <h2 className={`text-3xl font-semibold mb-8 ${currentLng === 2 ? 'font-khmer' : 'font-semibold'}`}>
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