import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
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
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};



const Overview = ({section, menuLang}) => {
  const { globalData } = useData();
  const { degree } = useParams();
  const [content, setContent] = useState({
    title: "",
    description: "",
    type: null,
  });
  const [isLoading, setIsLoading] = useState(!globalData?.texts);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!globalData?.texts) {
      setIsLoading(true);
      return;
    }

    try {
      const data = globalData.texts;

      // Find items for the specific page
      const pageItems = data.filter(item =>
        item.text_sec?.sec_page === section.sec_page
      );

      // Find the information section (sec_type === "Information") with preference for text_type 1, fallback to 2
      const infoItem =
        pageItems.find(item =>
          item.text_sec?.sec_type === "Information" && item.text_type === 1
        ) ||
        pageItems.find(item =>
          item.text_sec?.sec_type === "Information" && item.text_type === 2
        );

      if (infoItem) {
        setContent({
          title: infoItem.title,
          description: infoItem.desc,
          type: infoItem.text_type,
        });
      } else {
        // Fallback to first item on the page if no information section found
        const fallbackItem = pageItems[0];
        if (fallbackItem) {
          setContent({
            title: fallbackItem.title,
            description: fallbackItem.desc,
            type: null,
          });
        } else {
          setError("No content found for this degree");
        }
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Data processing error:", err);
      setError("Failed to process content");
      setIsLoading(false);
    }
  }, [degree, globalData?.texts, section.sec_page]);


  if (isLoading) {
    return null;
  }

  if (error) {
    return <div className="text-center py-8 text-gray-600">{error}</div>;
  }

  return (
    <div className="my-4 py-4">
      {content.type === 2 && (
        <div className="my-8 px-6">
          <div className="container mx-auto">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between space-y-6 xl:space-y-0 xl:space-x-12">
              <motion.h2
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className={`text-3xl font-extrabold text-gray-900 border-l-4 border-red-700 pl-4 ${menuLang === 2 ? 'font-khmer' : 'font-semibold'}`}
              >
                {content.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className={`text-sm xl:text-lg text-gray-800 leading-relaxed max-w-2xl ${menuLang === 2 ? 'fonts-khmer' : 'font-sans-serif'}`}
              >
                {content.description}
              </motion.p>
            </div>
          </div>
        </div>
      )}

      {content.type === 1 && (
        <div className="my-8">
          <div className='container mx-auto px-4'>
            <div className='space-y-4'>
              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className={`text-3xl font-extrabold text-gray-900 ${menuLang === 2 ? 'font-khmer' : 'font-semibold'}`}
              >
                {content.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className={`text-[12px] xl:text-[20px] text-gray-900 leading-relaxed ${menuLang === 2 ? 'fonts-khmer' : 'font-sans-serif'}`}
              >
                {content.description}
              </motion.p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;