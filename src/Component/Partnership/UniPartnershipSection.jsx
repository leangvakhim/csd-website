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

const UniPartnerships = ({ section }) => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_ENDPOINTS.getPartnership}?section_id=${section.sec_id}`)
      .then((res) => {
        let data = res.data?.data ?? [];

        // Ensure data is an array
        if (data && !Array.isArray(data)) {
          data = [data];
        }

        const formatted = data
          .filter((partner) => partner.active === 1) // Filter active partners
          .map((partner) => ({
            src: partner.ps_img
              ? `${API}/storage/uploads/${partner.ps_id}`
              : null, // Fallback to null if no image ID
            alt: partner.ps_title || 'Partner Logo', 
          }));
        console.log('Formatted partners:', formatted);

        setPartners(formatted);
      })
      .catch((error) => {
        console.error('PartnershipSection: Error fetching partners:', error);
        setPartners([]); // Reset state on error
      });
  }, [section]);

  if (partners.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No Partnerships With Universities to display.
      </div>
    );
  }

  return (
    <div className="my-16 bg-white">
      <motion.section
        className="container mx-auto px-4 text-center"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <h2 className="text-3xl font-semibold mb-8">
          Partnerships With Universities
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center"
              variants={cardVariants}
              transition={{ duration: 0.6 }}
            >
              {partner.src ? (
                <img
                  src={partner.src}
                  alt={partner.alt}
                  className="max-h-16 w-auto"
                  aria-label={partner.alt}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = '/fallback-logo.png')}
                />
              ) : (
                <p className="text-gray-600">{partner.alt}</p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default UniPartnerships;