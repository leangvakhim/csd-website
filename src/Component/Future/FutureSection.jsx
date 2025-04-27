import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaCheck } from "react-icons/fa";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";

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

// Animation variants for individual elements
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FutureSection = ({ section }) => {
  const [future, setFuture] = useState(null);
  const [benefits, setBenefits] = useState([]);
  const [selectedBenefitIndex, setSelectedBenefitIndex] = useState(0);

  // Fetch future and subfuture data based on section.sec_id
  useEffect(() => {
    if (section?.sec_id) {
      // Fetch main future data
      axios
        .get(`${API_ENDPOINTS.getFuture}?section_id=${section.sec_id}`)
        .then((res) => {
          const data = res.data?.data[0] || null;
          if (data) {
            setFuture({
              title: data.uf_title,
              subtitle: data.uf_subtitle,
              image: data.image?.img
                ? `${API}/storage/uploads/${data.image.img}`
                : null,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching future data:", error);
        });

      // Fetch subfuture data (benefits)
      axios
        .get(`${API_ENDPOINTS.getSubFuture}?section_id=${section.sec_id}`)
        .then((res) => {
          const data = res.data?.data || [];
          const formattedBenefits = data
            .filter((item) => item.display === 1 && item.ufa_subtitle) // Only include benefits with valid descriptions
            .map((item) => ({
              title: item.ufa_title,
              description: item.ufa_subtitle,
            }));
          setBenefits(formattedBenefits);
        })
        .catch((error) => {
          console.error("Error fetching subfuture data:", error);
          setBenefits([]); // Set empty array on error
        });
    } else {
      console.log(
        "ComputerScienceDegreeBenefits: No section.sec_id provided, skipping API call"
      );
    }
  }, [section]);

  const handleBenefitClick = (index) => {
    setSelectedBenefitIndex(index);
    console.log("Benefit clicked:", index);
  };

  if (!future) {
    return (
      <div className="text-center py-8 text-gray-600">
        No future data available for this section.
      </div>
    );
  }

  return (
    <div className="my-8 sm:my-12 lg:my-16 bg-white">
      <motion.section
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row justify-center gap-6 sm:gap-8 lg:gap-10">
          {/* Left Section - Text and Image */}
          <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-6 sm:gap-8">
            {/* Text */}
            <motion.div
              className="w-full sm:w-1/2 text-center sm:text-left"
              variants={cardVariants}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-red-900"
                variants={cardVariants}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {future.title}
              </motion.h2>
              <motion.p
                className="text-[12px] sm:text-[14px] lg:text-[16px] text-gray-700 sm:text-justify leading-relaxed"
                variants={cardVariants}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {future.subtitle}
              </motion.p>
            </motion.div>
            {/* Image */}
            <motion.div
              className="w-full h-full sm:w-1/2 max-w-[300px] sm:max-w-[350px] lg:max-w-[400px] aspect-[4/3] mx-auto"
              variants={cardVariants}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {future.image && (
                <img
                  src={future.image}
                  alt={future.title}
                  className="w-full h-full object-cover rounded-3xl"
                />
              )}
            </motion.div>
          </div>

          {/* Right Section - Benefits */}
          <motion.div
            className="w-full lg:w-1/2"
            variants={cardVariants}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {benefits.length > 0 ? (
              benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className={`text-left mb-4 p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 ${
                    selectedBenefitIndex === index
                      ? "bg-red-900 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => handleBenefitClick(index)}
                  variants={cardVariants}
                  transition={{ duration: 0.6, delay: 1.0 + index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div
                    className={`p-3 sm:p-4 rounded-full flex items-center justify-center border ${
                      selectedBenefitIndex === index ? "border-white" : "border-red-900"
                    }`}
                  >
                    <FaCheck
                      className={`text-sm sm:text-lg ${
                        selectedBenefitIndex === index ? "text-white" : "text-red-900"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold">{benefit.title}</h3>
                    <p className="text-[12px] sm:text-[14px] lg:text-[16px]">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-600">
                No benefits available for this section.
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default FutureSection;