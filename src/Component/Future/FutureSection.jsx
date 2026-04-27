import React from 'react'
import { API } from "../../Service/APIconfig";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck } from "react-icons/fa";
import { useData } from "../../Context/DataContext";


const FutureSection = ({key, section, menuLang}) => {
  const { globalData } = useData();
  const [selectedBenefitIndex, setSelectedBenefitIndex] = useState(1);
  const [currentLang, setCurrentLang] = useState(window.location.pathname.startsWith('/km') ? 2 : 1);

  const [futureData, setFutureData] = useState(null);
  const [benefitsData, setBenefitsData] = useState([]);

  useEffect(() => {
    if (globalData?.futures) {
      const data = globalData.futures;
      const filtered = data.find(
        (item) =>
          item.section?.sec_type === "Future" &&
          item.uf_sec === section?.sec_id &&
          item.section.display === 1 &&
          item.section.active === 1
      );

      if (filtered) {
        setFutureData({
          title: filtered.uf_title,
          subtitle: filtered.uf_subtitle,
          img: filtered.image?.img,
        });
      }
    }

    if (globalData?.subfutures) {
      const data = globalData.subfutures;
      const filtered = data
        .filter(
          (item) =>
            item.uf?.uf_sec === section?.sec_id &&
            item.display === 1 &&
            item.active === 1
        )
        .sort((a, b) => a.ufa_order - b.ufa_order)
        .map((item) => ({
          title: item.ufa_title,
          description: item.ufa_subtitle,
        }));

      setBenefitsData(filtered);
    }
  }, [section?.sec_id, globalData?.futures, globalData?.subfutures]);



  if (!futureData) return null;

  const containerVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.2 } },
  };

  return (
      <div className="my-12 bg-white">
          <div className="container mx-auto py-12 px-6 xl:px-12">
              <div className="flex flex-col lg:flex-row justify-center lg:justify-between gap-8">
                  {/* Left Section - Text */}
                  <motion.div
                    className="w-full p-2 xl:w-1/2 text-start"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                  >
                    <motion.h2
                      className={`text-3xl xl:text-4xl font-semibold mb-6 text-red-900 ${
                        currentLang === 2 ? 'font-khmer leading-12' : 'font-semibold'
                      }`}
                      variants={itemVariants}
                    >
                      {futureData?.title}
                    </motion.h2>
                    <motion.p
                      className={`text-md xl:text-lg text-gray-700 sm:text-justify ${
                      currentLang === 2 ? 'fonts-khmer leading-8' : 'font-sans'
                    }`}
                      variants={itemVariants}
                    >
                      {futureData?.subtitle}
                    </motion.p>
                  </motion.div>

                  {/* Middle Section - Image */}
                  <motion.div
                    className="w-full mx-auto p-2 xl:w-1/2 flex"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                  >
                    {futureData?.img && (
                      <motion.img
                        src={`${API}/storage/uploads/${futureData.img}`}
                        alt="Computer Science"
                        className="w-full h-full mx-auto object-contain"
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      />
                    )}
                  </motion.div>

                  {/* Right Section - Benefits */}
                  <motion.div
                      className="w-full xl:w-1/2 p-2"
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                  >
                      {benefitsData.map((benefit, index) => (
                          <motion.div
                              key={index}
                              onClick={() => setSelectedBenefitIndex(index)}
                              className={`text-left mb-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col xl:flex-row items-center gap-6 ${
                                  selectedBenefitIndex === index
                                      ? "bg-red-900 text-white"
                                      : "bg-gray-100 hover:bg-gray-200"
                              }`}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              whileHover={{ scale: 1.02 }}
                          >
                              <div
                                  className={`p-4 rounded-full flex items-center justify-center border ${
                                      selectedBenefitIndex === index ? "border-white" : "border-red-900"
                                  }`}
                              >
                                  <FaCheck
                                      className={`text-lg ${
                                          selectedBenefitIndex === index ? "text-white" : "text-red-900"
                                      }`}
                                  />
                              </div>

                              <div>
                                  <h3 className={`text-xl  ${
                                    currentLang === 2 ? 'fonts-khmer !font-bold' : 'font-sans'
                                  }`}>{benefit.title}</h3>
                                  <p className={`text-md ${
                                    currentLang === 2 ? 'fonts-khmer leading-7' : 'font-sans'
                                  }`}>{benefit.description}</p>
                              </div>
                          </motion.div>
                      ))}
                  </motion.div>
              </div>
          </div>
      </div>
  );
}

export default FutureSection