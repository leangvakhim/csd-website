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

// Animation variants for individual elements
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Introduction = ({ section, menuLang}) => {
  const { globalData, isLoading } = useData();
  const [introduction, setIntroduction] = useState(null);

  // Fetch introduction data based on section.sec_id
  useEffect(() => {
    if (globalData?.intros) {
        const filteredData = globalData.intros.find(
            (item) =>
              item.in_sec === section.sec_id &&
              item.section?.sec_type === "Introduction" &&
              item.section?.display === 1 &&
              item.section?.active === 1
        );

        if (filteredData) {
          setIntroduction({
            title: filteredData.in_title,
            detail: filteredData.in_detail || "",
            image: filteredData.image?.img ? `${API}/storage/uploads/${filteredData.image.img}` : null,
            established: filteredData.inadd_title,
            subtitle: filteredData.in_addsubtitle,
          });
        }
    }
  }, [section.sec_id, globalData]);


  if (isLoading || !introduction) return null;


  return (
    <div className="my-8 sm:my-12 lg:my-16">
      <motion.section
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row justify-center items-center gap-6 sm:gap-8 lg:gap-10">
          {/* Image Section with Fixed Text Box */}
          <motion.div
            className="relative w-full max-w-[350px] sm:max-w-[450px] lg:max-w-lg mx-auto aspect-[4/3]"
            variants={cardVariants}
            transition={{ duration: 0.6 }}
          >
            {introduction.image && (
              <img
                src={introduction.image}
                alt={introduction.title}
                className="w-full h-full object-cover rounded-3xl"
              />
            )}

            {/* Fixed Text Box */}
            <motion.div
              className="absolute w-[80%] sm:w-[280px] lg:w-[300px] bg-white shadow-lg hover:shadow-xl transition-shadow duration-300
                         bottom-4 sm:bottom-6 lg:bottom-10 right-0 sm:right-[-40px] lg:right-[-50px]
                         border-t-4 sm:border-t-6 lg:border-t-8 border-t-red-700 p-3 sm:p-4 flex flex-col justify-end
                         sm:transform sm:translate-x-0 mx-auto sm:mx-0"
              variants={cardVariants}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className={`text-[13px] sm:text-[16px] lg:text-[18px] mb-2 sm:mb-4 text-black font-semibold ${menuLang === 2 ? "fonts-khmer text-[20px]" : "font-sans-serif"}`}>
                {introduction.established}
              </h1>
              <p className={`text-[11px] sm:text-[13px] lg:text-[14px] text-black ${menuLang === 2 ? "fonts-khmer" : "font-sans-serif"}`}>
                {introduction.subtitle}
              </p>
            </motion.div>
          </motion.div>

          {/* Text Section */}
          <motion.div
            className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg w-full lg:max-w-8xl mx-auto p-4 sm:p-6 lg:p-8"
            variants={cardVariants}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.h1
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-gray-800 ${menuLang === 2 ? "font-khmer" : "font-semibold"}`}
              variants={cardVariants}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {introduction.title}
            </motion.h1>
            <div className="space-y-3 sm:space-y-4 text-[12px] sm:text-[14px] lg:text-[16px] font-normal leading-relaxed">
              {introduction.detail.split("\n\n").map((paragraph, index) => (
                <motion.p
                  key={index}
                  className={`text-gray-700 sm:text-justify ${menuLang === 2 ? "fonts-khmer" : "font-sans-serif"}`}
                  variants={cardVariants}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Introduction;