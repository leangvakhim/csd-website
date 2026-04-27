import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API } from "../../Service/APIconfig";

import { useData } from "../../Context/DataContext";

// Animation variants for the section
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

// Animation variants for individual service cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ServiceSection = ({ section, menuLang }) => {
  const { globalData } = useData();
  const [services, setServices] = useState([]);


  // Process services data from globalData
  useEffect(() => {
    if (globalData?.services) {
      const data = globalData.services;
      const formatted = data
        .filter((service) => service.display === 1 &&
          service.active === 1 &&
          service.section?.sec_id === section.sec_id
        )
        .map((service) => ({
          title: service.s_title,
          description: service.s_subtitle,
          image: service.image?.img ? `${API}/storage/uploads/${service.image.img}` : null,
        }));
      setServices(formatted);
    }
  }, [section.sec_id, globalData?.services]);



  if (services.length === 0) {
    return null;
  }


  // console.log("ServiceSection: Rendering services:", services);
  return (
    <div className="my-16">
      <motion.section
        className="container mx-auto px-4"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div
          className="grid gap-8 justify-items-center"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-full"
              variants={cardVariants}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                {/* Image Container */}
                {service.image && (
                  <div
                    className="min-w-[64px] flex-shrink-0 p-3 w-16 h-16 flex items-center justify-center rounded-full border-2 border-red-900/20 overflow-hidden"
                    aria-label={service.title}
                  >
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Title and Description */}
                <div className="text-center md:text-left">
                  <h2 className={`text-lg font-semibold mb-4 ${
              menuLang === 2 ? "font-khmer font-semibold" : "font-sans"
            }`}>{service.title}</h2>
                  <p className={`md:text-base text-gray-600 ${
              menuLang === 2 ? "fonts-khmer" : "font-sans"
            }`}>{service.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default ServiceSection;