import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaCheck } from "react-icons/fa";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";

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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
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
            (item) =>
              item.section?.sec_page === section.sec_page &&
              item.section.display === 1 &&
              item.section.active === 1
          );

          if (filteredSpecData.length > 0) {
            const item = filteredSpecData[0];

            // Extract key metrics from add-on data
            const keyMetrics = addOnData.length > 0
              ? {
                  count: addOnData[0].rason_amount || "2000+",
                  description: addOnData[0].rason_subtitle || "Student Enrollments",
                  title: addOnData[0].rason_title || "Program Impact",
                }
              : {
                  count: "2000+",
                  description: "Student Enrollments",
                  title: "Program Impact",
                };

            // Fetch subservice data
            const subserviceRes = await axios.get(
              `${API_ENDPOINTS.getSubserviceAF}?af_id=${item.af_id}`
            );

            const subserviceData = (subserviceRes.data?.data || []).filter(
              (s) => s.ras?.ras_sec === item.ras_sec
            );

            setSubservices(
              subserviceData.map((s) => ({
                ss_id: s.ss_id,
                title: s.ss_title || "Untitled Subservice",
                description: s.ss_subtitle || "No description available",
                icon: s.image?.img ? `${API}/storage/uploads/${s.image.img}` : "",
              }))
            );

            // Parse description for paragraphs
            const parser = new DOMParser();
            const rawDesc = item?.text?.desc || '';
            const doc = parser.parseFromString(rawDesc, "text/html");
            const paragraphs = Array.from(doc.querySelectorAll("p"))
              .map((p) => p.textContent?.trim?.())
              .filter((p) => p);

            // Set program data
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
                icon: FaCheck,
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
    <div className="my-8 sm:my-12 lg:my-16">
      <motion.section
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 sm:gap-8 lg:gap-10">
          {/* Left: Text Content */}
          <motion.div
            className="w-full lg:max-w-[679px] order-2 lg:order-1"
            variants={cardVariants}
          >
            <motion.h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-gray-800"
              variants={cardVariants}
              transition={{ delay: 0.2 }}
            >
              {programTitle}
            </motion.h1>
            <p
              className="text-gray-800 text-[12px] sm:text-[14px] lg:text-[16px] mb-4 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 text-[12px] sm:text-[14px] lg:text-[16px]">
              {subservices.map((s, i) => (
                <motion.div
                  key={s.ss_id}
                  className="flex gap-3 sm:gap-4 border border-red-800 p-3 sm:p-4 rounded-xl items-center hover:shadow-lg transition-shadow duration-300"
                  variants={cardVariants}
                  transition={{ delay: i * 0.2 }}
                >
                  <div className="border border-red-800 rounded-full p-2 min-w-[40px] min-h-[40px] flex items-center justify-center">
                    {s.icon ? (
                      <img
                        src={s.icon}
                        alt={s.title}
                        className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-icon.png";
                        }}
                      />
                    ) : (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 rounded-full" />
                    )}
                  </div>
                  <p className="text-gray-800">{s.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Images and Key Metrics */}
          <motion.div
            className="w-full lg:w-[600px] h-auto lg:h-[510px] order-1 lg:order-2"
            variants={cardVariants}
          >
            {images[0].src && (
              <img
                src={images[0].src}
                alt={images[0].alt}
                className="w-full h-full object-cover rounded-3xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-image.png";
                }}
              />
            )}
            <motion.div
              className="relative -top-16 z-10 bg-white p-4 rounded-lg shadow-md w-11/12 sm:w-52 text-center mx-auto"
              variants={cardVariants}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-md sm:text-lg font-bold flex items-center justify-center mb-4">
                <FaCheck className="mr-2 text-xl sm:text-2xl text-red-700" />
                {keyMetrics.title}
              </h2>
              <div className="text-lg sm:text-xl font-bold text-red-700">
                {keyMetrics.count}
              </div>
              <p className="text-sm sm:text-md mt-2">{keyMetrics.description}</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default CSDSection;