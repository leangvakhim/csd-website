import React from 'react'
import { API_ENDPOINTS, API } from "../../Service/APIconfig";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck } from "react-icons/fa";

const FutureSection = ({key, section, menuLang}) => {
  const [selectedBenefitIndex, setSelectedBenefitIndex] = useState(1);

  const [futureData, setFutureData] = useState(null);
  const [benefitsData, setBenefitsData] = useState([]);

  useEffect(() => {
    const fetchFutureData = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.getFuture);
        const data = Array.isArray(response.data?.data) ? response.data.data : [];

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
      } catch (error) {
        console.error("Failed to fetch UF data:", error);
      }
    };

    const fetchAddonData = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.getSubFuture);
        const data = Array.isArray(response.data?.data) ? response.data.data : [];

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
      } catch (error) {
        console.error("Failed to fetch UF Addon data:", error);
      }
    };

    fetchFutureData();
    fetchAddonData();
  }, []);

  // Animation variants
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
                      className="text-3xl xl:text-4xl font-semibold mb-6 text-red-900"
                      variants={itemVariants}
                    >
                      {futureData?.title}
                    </motion.h2>
                    <motion.p
                      className="text-md xl:text-lg text-gray-700 sm:text-justify"
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
                              className={`text-left mb-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col xl:flex-row items-center gap-6 ${
                                  selectedBenefitIndex === index
                                      ? "bg-red-900 text-white"
                                      : "bg-gray-100 hover:bg-gray-200"
                              }`}
                              variants={itemVariants}
                              whileHover={{ scale: 1.02 }} // Add hover effect
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
                                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                                  <p className="text-md ">{benefit.description}</p>
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