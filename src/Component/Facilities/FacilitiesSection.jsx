import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API } from "../../Service/APIconfig";

import { useData } from "../../Context/DataContext";

// Animation variants
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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FacilitiesSection = ({ section, menuLang }) => {
  const { globalData } = useData();
  const [facilityData, setFacilityData] = useState({
    title: "",
    description: "",
    image: "",
    id: null,
  });
  const [subservices, setSubservices] = useState([]);


  useEffect(() => {
    if (!globalData?.facilities || !globalData?.subServices) {
      return;
    }

    try {
      const data = globalData.facilities;
      const validItems = data.filter(
        (item) =>
          item.section?.sec_page === section.sec_page &&
          item.section?.display === 1 &&
          item.section?.active === 1 &&
          item.section?.sec_type === "Facilities"
      );

      if (validItems.length === 0) {
        setFacilityData({ title: "", description: "", image: "", id: null });
        return;
      }

      const facilityItem = validItems[0];
      const imagePath = facilityItem.image?.img
        ? `${API}/storage/uploads/${facilityItem.image.img}`
        : "";

      setFacilityData({
        title: facilityItem.text?.title || "Facilities",
        description: facilityItem.text?.desc || "",
        image: imagePath,
        id: facilityItem.af_id || null,
      });

      const subserviceData = (globalData.subServices || []).filter(
        (subservice) => subservice.ss_af === facilityItem.af_id
      );

      setSubservices(
        subserviceData.map((subservice) => ({
          ss_id: subservice.ss_id,
          title: subservice.ss_title || "Untitled Subservice",
          description: subservice.ss_subtitle || "No description available",
          icon: subservice.image?.img
            ? `${API}/storage/uploads/${subservice.image.img}`
            : "",
        }))
      );
    } catch (err) {
      console.error("Facilities processing error:", err);
    }
  }, [section.sec_page, globalData?.facilities, globalData?.subServices]);



  if (!facilityData.id) {
    return null;
  }


  return (
    <div className="my-16">
      <motion.section
        className="container mx-auto px-4"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Image Section */}
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.6 }}
            className="w-full xl:w-[651px] h-full xl:h-[615px] flex justify-center lg:justify-start"
          >
            <div className="relative w-full h-full">
              {facilityData.image ? (
                <img
                  src={facilityData.image}
                  alt={facilityData.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-facility.jpg";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded"></div>
              )}
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.6 }}
            className="w-full xl:w-[878px] h-full xl:h-[432px]"
          >
            <h2 className={`text-3xl  font-extrabold text-gray-900 text-center lg:text-left ${menuLang === 2 ? 'font-khmer' : 'font-semibold'}`}>
              {facilityData.title}
            </h2>
            <p className={`text-gray-600 text-center xl:text-left mt-4 mb-8 text-lg ${menuLang === 2 ? 'fonts-khmer' : 'font-sans' }`}>
              {facilityData.description}
            </p>

            {/* Subservices List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subservices.length > 0 ? (
                subservices.map((subservice) => (
                  <motion.div
                    key={subservice.ss_id} // Use ss_id for unique key
                    variants={cardVariants}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-lg p-6 shadow-lg flex items-center gap-4 hover:shadow-xl hover:scale-105 transition duration-300"
                  >
                    {/* Icon Section */}
                    <div className="p-2 flex items-center justify-center rounded-lg bg-red-800 min-w-[50px]">
                      {subservice.icon ? (
                        <img
                          src={subservice.icon}
                          alt={subservice.title}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder-icon.png";
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 bg-white rounded"></div>
                      )}
                    </div>

                    {/* Text Section */}
                    <div>
                      <h3 className={`text-xl font-semibold text-gray-800 ${menuLang === 2 ? 'fonts-khmer' : 'font-sans'}`}>
                        {subservice.title}
                      </h3>
                      <p className={`text-gray-600 ${menuLang === 2 ? 'fonts-khmer' : 'font-sans'}`}>{subservice.description}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center text-gray-500 py-4">
                  No subservices available for this facility
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default FacilitiesSection;