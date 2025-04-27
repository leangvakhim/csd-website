import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaCheck } from "react-icons/fa";
import { SlPeople } from "react-icons/sl";
import { PiGraduationCapDuotone } from "react-icons/pi";
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

const InnovationSection = ({ section }) => {
  const [innovation, setInnovation] = useState(null);

  // Fetch specialization data based on section.sec_id
  useEffect(() => {
    if (section?.sec_id) {
      axios
        .get(`${API_ENDPOINTS.getSpecialization}?section_id=${section.sec_id}`)
        .then((res) => {
          const data = res.data?.data[0] || null;
          if (data) {
            // Extract list items from desc by removing HTML/SVG tags
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.text.desc, "text/html");
            const listItems = Array.from(doc.querySelectorAll("span")).map(
              (span) => span.textContent
            );
            const paragraphs = doc
              .querySelectorAll("p")
              .item(0)
              .textContent.split("\n\n")
              .filter((p) => p.trim());

            setInnovation({
              title: data.text.title,
              paragraphs,
              listItems,
              image: data.image1?.img
                ? `${API}/storage/uploads/${data.image1.img}`
                : null,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching specialization data:", error);
        });
    } else {
      console.log(
        "InnovationSection: No section.sec_id provided, skipping API call"
      );
    }
  }, [section]);

  if (!innovation) {
    return (
      <div className="text-center py-8 text-gray-600">
        No specialization data available for this section.
      </div>
    );
  }

  return (
    <div className="my-8 sm:my-12 lg:my-16">
      <motion.section
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 sm:gap-8 lg:gap-10">
          {/* Left Section with Text and Icons */}
          <motion.div
            className="w-full lg:max-w-[600px] order-2 lg:order-1"
            variants={cardVariants}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-gray-800"
              variants={cardVariants}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {innovation.title}
            </motion.h1>
            {innovation.paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                className="text-gray-700 mb-4 text-[12px] sm:text-[14px] lg:text-[16px] sm:text-justify leading-relaxed"
                variants={cardVariants}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
              >
                {paragraph}
              </motion.p>
            ))}
            <motion.ul
              className="space-y-3 sm:space-y-4 text-gray-700 mb-6 text-[12px] sm:text-[14px] lg:text-[16px] sm:text-justify"
              variants={cardVariants}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {innovation.listItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="border border-red-800 p-2 rounded-full mr-2 sm:mr-3 mt-1">
                    <FaCheck className="text-red-800 text-sm sm:text-base" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>

            <div className="grid grid-cols-1 sm:grid-cols-2 justify-center gap-4 sm:gap-6 mb-6 text-[12px] sm:text-[14px] lg:text-[16px]">
              <motion.div
                className="flex gap-3 sm:gap-4 border border-red-800 p-3 sm:p-4 rounded-xl items-center hover:shadow-lg transition-shadow duration-300"
                variants={cardVariants}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="border border-red-800 rounded-full p-2">
                  <PiGraduationCapDuotone
                    size={20}
                    className="text-red-800 sm:w-6 sm:h-6"
                  />
                </div>
                <p>
                  We strive to enhance teaching and learning while fostering
                  research and innovation to drive technological advancement.
                </p>
              </motion.div>
              <motion.div
                className="flex gap-3 sm:gap-4 border border-red-800 p-3 sm:p-4 rounded-xl items-center hover:shadow-lg transition-shadow duration-300"
                variants={cardVariants}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="border border-red-800 rounded-full p-2">
                  <SlPeople
                    size={20}
                    className="text-red-800 sm:w-6 sm:h-6"
                  />
                </div>
                <p>
                  Beyond academics, we develop leaders, uphold sustainability,
                  preserve heritage, and expand social engagement.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Section with Image */}
          <motion.div
            className="w-full max-w-[350px] sm:max-w-[450px] lg:max-w-[600px] aspect-[4/3] order-1 lg:order-2 mx-auto"
            variants={cardVariants}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {innovation.image && (
              <img
                src={innovation.image}
                alt={innovation.title}
                className="w-full h-full object-cover rounded-3xl"
              />
            )}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default InnovationSection;