import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaCheck } from "react-icons/fa";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";

// Placeholder image for fallback
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.2 } },
};

const FutureSection = ({ section , menuLang}) => {
  const [future, setFuture] = useState(null);
  const [benefits, setBenefits] = useState([]);
  const [selectedBenefitIndex, setSelectedBenefitIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch future and subfuture data
  useEffect(() => {
    const fetchData = async () => {
      if (!section?.sec_id) {
        setError("Invalid section data provided.");
        setLoading(false);
        console.log("FutureSection: No section.sec_id provided, skipping API call.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch future and subfuture data in parallel
        const [futureRes, subFutureRes] = await Promise.all([
          axios.get(`${API_ENDPOINTS.getFuture}?section_id=${section.sec_id}`),
          axios.get(`${API_ENDPOINTS.getSubFuture}?section_id=${section.sec_id}`),
        ]);

        // Process future data
        const futureData = futureRes.data?.data[0] || null;
        if (futureData) {
          setFuture({
            title: futureData.uf_title || "Untitled Future",
            subtitle: futureData.uf_subtitle || "No description available",
            image: futureData.image?.img
              ? `${API}/storage/uploads/${futureData.image.img}`
              : PLACEHOLDER_IMAGE,
          });
        } else {
          setError("No future data found for this section.");
        }

        // Process subfuture data (benefits)
        const subFutureData = subFutureRes.data?.data || [];
        const formattedBenefits = subFutureData
          .filter((item) => item.display === 1 && item.ufa_subtitle)
          .map((item) => ({
            title: item.ufa_title || "Untitled Benefit",
            description: item.ufa_subtitle || "No description available",
          }));

        setBenefits(formattedBenefits);
        setLoading(false);
      } catch (error) {
        console.error("FutureSection: Error fetching data:", error);
        setError("Failed to load future data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [section]);

  const handleBenefitClick = (index) => {
    setSelectedBenefitIndex(index);
    console.log("FutureSection: Benefit clicked:", index);
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12 text-gray-600">
        Loading future data...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        {error}
      </div>
    );
  }

  // No future data
  if (!future) {
    return (
      <div className="text-center py-12 text-gray-600">
        No future data available for this section.
      </div>
    );
  }

  return (
    <div className="my-12 bg-white">
      <div className="container mx-auto py-12 px-6 xl:px-12">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* Left Section - Text and Image */}
          <motion.div
            className="w-full xl:w-1/2 flex flex-col sm:flex-row gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            {/* Text */}
            <motion.div
              className="w-full sm:w-1/2 text-start"
              variants={itemVariants}
            >
              <motion.h2
                className="text-3xl xl:text-4xl font-semibold mb-6 text-red-900"
                variants={itemVariants}
              >
                {future.title}
              </motion.h2>
              <motion.p
                className="text-md xl:text-lg text-gray-700 sm:text-justify"
                variants={itemVariants}
              >
                {future.subtitle}
              </motion.p>
            </motion.div>
            {/* Image */}
            <motion.div
              className="w-full sm:w-1/2 flex"
              variants={itemVariants}
            >
              <img
                src={future.image}
                alt={future.title}
                className="w-full h-full mx-auto object-contain"
                onError={(e) => {
                  e.target.src = PLACEHOLDER_IMAGE;
                }}
              />
            </motion.div>
          </motion.div>

          {/* Right Section - Benefits */}
          <motion.div
            className="w-full xl:w-1/2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            {benefits.length > 0 ? (
              benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className={`text-left mb-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col xl:flex-row items-center gap-6 ${
                    selectedBenefitIndex === index
                      ? "bg-red-900 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => handleBenefitClick(index)}
                  variants={itemVariants}
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
                    <h3 className="text-xl font-semibold">{benefit.title}</h3>
                    <p className="text-md">{benefit.description}</p>
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
      </div>
    </div>
  );
};

export default FutureSection;