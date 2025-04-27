import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaChevronDown } from "react-icons/fa";
import { API_ENDPOINTS } from "../../Service/APIconfig";

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
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const TypeSection = ({ section }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [typeItems, setTypeItems] = useState([]);
  const [content, setContent] = useState({
    title: "Type Section Title",
    description: "Description related to the type section.",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleType = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Fetch the type data from the respective API endpoint
    Promise.all([axios.get(API_ENDPOINTS.getType), axios.get(API_ENDPOINTS.getSubType)])
      .then(([typeRes, subTypeRes]) => {
        console.log("getTypeSection response:", typeRes.data);
        console.log("getSubTypeSection response:", subTypeRes.data);

        if (!typeRes.data?.data || !subTypeRes.data?.data) {
          throw new Error("Invalid API response structure");
        }

        const typeData = typeRes.data.data;
        const subTypeData = subTypeRes.data.data;

        // Find the section based on the 'section' prop
        const typeSection = typeData.find((item) => item.section?.sec_type === "Type");

        // Set title and description for the type section
        if (typeSection) {
          setContent({
            title: typeSection.type_title || content.title,
            description: typeSection.type_subtitle || content.description,
          });
        } else {
          setContent({
            title: content.title,
            description: content.description,
          });
        }

        // Filter sub-type items based on the section id if needed, or simply display all active ones
        const subTypeItems = subTypeData
          .filter((item) => item.display === 1 && item.active === 1)
          .map((item) => ({
            question: item.type_question,
            answer: item.type_answer,
            order: item.type_order,
          }))
          .sort((a, b) => a.order - b.order);

        console.log("subTypeItems:", subTypeItems);

        if (subTypeItems.length === 0) {
          setError("No type items found");
        } else {
          setTypeItems(subTypeItems);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setError("Failed to load type content");
        setIsLoading(false);
      });
  }, [section]);

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-gray-600">{error}</div>;
  }

  return (
    <div className="my-16 py-4">
      <motion.section
        className="container mx-auto px-4"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Title and Description */}
          <div className="text-start">
            <motion.h1
              variants={cardVariants}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold text-gray-800 mb-6 text-start"
            >
              {content.title}
            </motion.h1>
            <motion.p
              variants={cardVariants}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-gray-800 xl:text-lg text-[12px] mb-12 text-start"
            >
              {content.description}
            </motion.p>
          </div>

          {/* Right Column: Type Accordion */}
          <div className="max-w-full">
            {typeItems.length > 0 ? (
              typeItems.map((type, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white p-6 rounded-lg shadow-md cursor-pointer mb-4"
                  onClick={() => toggleType(index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg lg:text-2xl font-bold text-gray-800">
                      {type.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaChevronDown className="text-gray-600" />
                    </motion.div>
                  </div>
                  {openIndex === index && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-800 text-sm lg:text-lg mt-4 text-justify"
                    >
                      {type.answer}
                    </motion.p>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={cardVariants}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <p className="text-gray-800">
                  No type items available for this degree.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default TypeSection;
