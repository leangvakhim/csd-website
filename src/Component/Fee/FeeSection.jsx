import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { API_ENDPOINTS, API, axiosInstance } from "../../Service/APIconfig";

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

const FeeSection = ({ section,  }) => {
  const [tuition, setTuition] = useState(null);
  const [currentLang, setCurrentLang] = useState(window.location.pathname.startsWith('/km') ? 2 : 1);

  // Fetch fee data based on section.sec_id
  useEffect(() => {
    if (section?.sec_id) {
      axiosInstance
        .get(API_ENDPOINTS.getFee)
        .then((res) => {
          const data = res.data?.data?.find(
            (item) =>
              item.fe_sec === section.sec_id &&
              section.sec_type === "Fee" &&
              section.display === 1 &&
              section.active === 1
          );
          if (data) {
            setTuition({
              title: data.fe_title,
              description: data.fe_desc.split("\n\n"),
              price: data.fe_price,
              image: data.image?.img ? `${API}/storage/uploads/${data.image.img}` : null,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching fee data:", error);
        });
    } else {
      console.log("TuitionSection: No section.sec_id provided, skipping API call");
    }
  }, [section]);

  if (!tuition) {
    return (
      <div className="text-center py-8 text-gray-600">
        No fee data available for this section.
      </div>
    );
  }

  return (
    <div className="my-8 sm:my-12 lg:my-16">
      <motion.section
        className="container mx-auto px-4 sm:px-6 lg:px-8 "
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-10">
          {/* Image Section */}
          <motion.div
            className="w-full max-w-[350px] sm:max-w-[450px] lg:max-w-[600px] aspect-[4/3] order-1 lg:order-2 mx-auto"
            variants={cardVariants}
            transition={{ duration: 0.6 }}
          >
            {tuition.image && (
              <img
                src={tuition.image}
                alt={tuition.title}
                className="w-full h-full object-cover rounded-3xl"
              />
            )}
          </motion.div>

          {/* Text Section */}
          <motion.div
            className="w-full lg:max-w-[600px] order-2 lg:order-1 text-center lg:text-left"
            variants={cardVariants}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-gray-800 ${currentLang === 2 ? 'font-khmer' : 'font-semibold'}`}
              variants={cardVariants}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {tuition.title}
            </motion.h2>
            <div className="max-w-2xl mx-auto lg:mx-0 sm:text-justify">
              {tuition.description.map((paragraph, index) => (
                <motion.p
                  key={index}
                  className={`text-[12px] sm:text-[14px] lg:text-[16px] text-gray-700 mb-4 sm:mb-6 leading-relaxed ${currentLang === 2 ? 'fonts-khmer ' : 'font-sans'}`}
                  variants={cardVariants}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                >
                  {paragraph}
                </motion.p>
              ))}
              <motion.div
                className="flex flex-row items-center justify-center lg:justify-start font-bold text-red-800 mb-4 gap-3 sm:gap-5"
                variants={cardVariants}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <div className="p-2 sm:p-3 bg-red-900 rounded-2xl">
                  <HiOutlineCurrencyDollar
                    size={30}
                    className="text-white sm:w-10 sm:h-10"
                  />
                </div>
                {tuition.price ? (
                  <>
                    <span className={`text-2xl sm:text-3xl lg:text-4xl ${currentLang === 2 ? 'fonts-khmer ' : 'font-sans'}`}>
                      {tuition.price.split(" /")[0]}{" "}
                    </span>
                  </>
                ) : (
                  <span className="text-xl text-gray-500">No fee info</span>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default FeeSection;