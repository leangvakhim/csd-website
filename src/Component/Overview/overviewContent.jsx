import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import axios from "axios";
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



const Overview = ({section}) => {
  const { degree } = useParams();
  const [content, setContent] = useState({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    axios.get(API_ENDPOINTS.getText)
      .then((res) => {
        if (!res.data?.data) {
          throw new Error("Invalid API response structure");
        }

        const data = res.data.data;
        
        // Find items for the specific page
        const pageItems = data.filter(item => 
          item.text_sec?.sec_page === section.sec_page
        );
        
        // Find the information section (sec_type === "Information")
        const infoItem = pageItems.find(item => 
          item.text_sec?.sec_type === "Information"
        );

        if (infoItem) {
          setContent({
            title: infoItem.title,
            description: infoItem.desc,
          });
        } else {
          // Fallback to first item on the page if no information section found
          const fallbackItem = pageItems[0];
          if (fallbackItem) {
            setContent({
              title: fallbackItem.title,
              description: fallbackItem.desc,
            });
          } else {
            setError("No content found for this degree");
          }
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setError("Failed to load content");
        setIsLoading(false);
      });
  }, [degree]);

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
        <div className="space-y-4 flex flex-col xl:flex-row gap-10">
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="xl:max-w-[462px] w-full mx-auto"
          >
            <h2 className="w-full text-3xl font-extrabold text-gray-900">
              {content.title}
            </h2>
          </motion.div>
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="lg:max-w-[769px] w-full mx-auto sm:text-justify"
          >
            <p className="text-sm xl:text-lg text-gray-800">{content.description}</p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Overview;