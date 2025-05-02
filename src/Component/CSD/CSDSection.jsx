import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaCheck } from "react-icons/fa";
import { PiGraduationCapDuotone } from "react-icons/pi";
import { BsPeople } from "react-icons/bs";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

const imageVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.4 } },
};

const CSDSection = ({ section }) => {
  const [programData, setProgramData] = useState(null);
  const [subservices, setSubservices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (section?.sec_id) {
        try {
          // Fetch specialization data
          const specRes = await axios.get(
            `${API_ENDPOINTS.getSpecialization}?section_id=${section.sec_id}`
          );
          const specData = specRes.data?.data || [];

          // Fetch key metrics data
          const addOnRes = await axios.get(`${API_ENDPOINTS.getAddOnCSD}`);
          const addOnData = addOnRes.data?.data || [];

          const filteredSpecData = specData.filter(
            (item) => item.section.display === 1 && item.section.active === 1
          );

          if (filteredSpecData.length > 0) {
            const item = filteredSpecData[0];

            // Extract key metrics from add-on data
            const keyMetrics = addOnData.length > 0
              ? {
                  count: addOnData[0].rason_amount,
                  description: addOnData[0].rason_subtitle,
                  title: addOnData[0].rason_title,
                }
              : {
                  count: "2000+",
                  description: "Student Enrollments",
                  title: "Key Metrics",
                };

            // Fetch subservice data
            const subserviceRes = await axios.get(
              `${API_ENDPOINTS.getSubserviceAF}?af_id=${item.af_id}`
            );

            const subserviceData = (subserviceRes.data?.data || []).filter(
              (s) => s.ras?.ras_sec === item.ras_sec && s.display === 1 && s.active === 1
            );

            setSubservices(
              subserviceData.map((s) => {
                let icon = s.image?.img ? `${API}/storage/uploads/${s.image.img}` : '';
                if (!icon && s.ras?.image1?.img) {
                  icon = `${API}/storage/uploads/${s.ras.image1.img}`;
                } else if (!icon && s.ras?.image2?.img) {
                  icon = `${API}/storage/uploads/${s.ras.image2.img}`;
                }
                return {
                  ss_id: s.ss_id,
                  title: s.ss_title || "Untitled Subservice",
                  description: s.ss_subtitle || "No description available",
                  icon,
                };
              })
            );

            // Parse description for paragraphs
            const parser = new DOMParser();
            const rawDesc = item?.text?.desc || '';
            const doc = parser.parseFromString(rawDesc, "text/html");
            const paragraphs = Array.from(doc.querySelectorAll("p"))
              .map((p) => p.textContent?.trim?.())
              .filter((p) => p);

            // Set program data with dynamic icons for objectives
            setProgramData({
              programTitle: item.text?.title || 'Untitled Program',
              description: item.text?.desc || '',
              paragraphs,
              keyMetrics,
              images: [
                {
                  src: item.image1?.img
                    ? `${API}/storage/uploads/${item.image1.img}`

                    : null,
                  alt: `${item.text?.title || 'Untitled Program'} Image 1`,

                  

                },
                {
                  src: item.image2?.img
                    ? `${API}/storage/uploads/${item.image2.img}`
                    : null,
                  alt: `${item.text?.title || 'Untitled Program'} Image 2`,
  

                },
              ],
              objectives: subserviceData.map((s) => ({
                title: s.ss_title || "Untitled Objective",
                description: s.ss_subtitle || "No description available",
                icon: s.image?.img ? `${API}/storage/uploads/${s.image.img}` : null,
                fallbackIcon: s.ss_title === "Robust Technical Foundation"
                  ? PiGraduationCapDuotone
                  : s.ss_title === "Professional and Ethical Growth"
                  ? BsPeople
                  : FaCheck,
              })),
            });
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        console.log("CSDSection: No section.sec_id provided, skipping API call.");
      }
    };

    fetchData();
  }, [section]);

  if (!programData) {
    return (
      <div className="text-center py-8 text-gray-600">
        No program data available for this section.
      </div>
    );
  }

  const { programTitle, description, keyMetrics, objectives, images } = programData;

  return (
    <div className="my-16">
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="container mx-auto px-4"
      >
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Right Column - Images and Key Metrics */}
          <motion.div
            variants={imageVariants}
            className="xl:w-1/2 w-full flex flex-col items-center relative order-1 lg:order-2"
          >
            {/* Image Flex Layout */}
            <div className="flex flex-col lg:flex-row justify-center items-center gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`w-full sm:w-auto ${
                    index === 0
                      ? "w-[325px] h-[211px] rounded-tl-[50px] sm:rounded-tl-[100px]"
                      : "w-[309px] h-[418px] rounded-tr-[50px] sm:rounded-tr-[100px]"
                  } overflow-hidden rounded-xl shadow-lg`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.png";
                    }}
                  />
                </div>
              ))}
            </div>
            <motion.div
              variants={cardVariants}
              className="absolute bottom-4 right-4 sm:bottom-0 sm:right-0 z-10 bg-white p-4 rounded-lg shadow-md w-11/12 sm:w-52 text-center"
            >
              <h2 className="text-md sm:text-lg font-bold flex items-center justify-center mb-2">
                <FaCheck className="mr-2 text-xl sm:text-2xl text-red-700" />
                {keyMetrics.title}
              </h2>
              <div className="text-lg sm:text-xl font-bold text-red-700">
                {keyMetrics.count}
              </div>
              <p className="text-sm sm:text-md mt-2">{keyMetrics.description}</p>
            </motion.div>
          </motion.div>

          {/* Left Column - Text Content */}
          <motion.div
            variants={cardVariants}
            className="xl:w-1/2 w-full order-2 lg:order-1"
          >
            <h2 className="text-3xl font-bold mb-4">{programTitle}</h2>
            <p
              className="text-base sm:text-lg mb-6">{description}</p>
            <div className="space-y-6">
              {objectives.map((objective, index) => (
                <motion.div
                  key={objective.title}
                  className="flex items-start gap-4"
                  variants={cardVariants}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="border border-red-800 rounded-full p-2 bg-white">
                    {objective.icon ? (
                      <img
                        src={objective.icon}
                        alt={objective.title}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-icon.png";
                        }}
                      />
                    ) : (
                      <objective.fallbackIcon size={24} className="text-red-800" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">
                      {objective.title}
                    </h3>
                    <p className="text-sm sm:text-base">{objective.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CSDSection;