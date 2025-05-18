import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";
import { API_ENDPOINTS, API, axiosInstance } from "../../Service/APIconfig";

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

const InnovationSection = ({ section, menuLang }) => {
  const [innovation, setInnovation] = useState(null);
  const [subservices, setSubservices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (section?.sec_id) {
        try {
          const res = await axiosInstance.get(
            `${API_ENDPOINTS.getSpecialization}?section_id=${section.sec_id}`
          );
          const data = res.data?.data || [];

          const filteredData = data.filter(
            (item) =>
              item.section?.sec_page === section.sec_page &&
              item.section.display === 1 &&
              item.section.active === 1
          );

          if (filteredData.length > 0) {
            const item = filteredData[0];
            const parser = new DOMParser();
            const doc = parser.parseFromString(item.text.desc, "text/html");

            const listItems = Array.from(doc.querySelectorAll("span")).map(
              (span) => span.textContent
            );

            const paragraphs = Array.from(doc.querySelectorAll("p"))
              .map((p) => p.textContent.trim())
              .filter((p) => p);

            setInnovation({
              title: item.text.title,
              description: item.text.desc,
              paragraphs,
              listItems,
              imageLeft: item.image1?.img
                ? `${API}/storage/uploads/${item.image1.img}`
                : null,
              imageRight: item.image2?.img
                ? `${API}/storage/uploads/${item.image2.img}`
                : null,
              hasRas: !!item.ras, // ✅ Add this line
            });


            // Fetch subservices
            const subserviceRes = await axiosInstance.get(
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
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        console.log("InnovationSection: No section.sec_id provided, skipping API call.");
      }
    };

    fetchData();
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
          {/* Left: Text Content */}
          <motion.div
            className="w-full lg:max-w-[679px] order-2 lg:order-1"
            variants={cardVariants}
          >
            <motion.h1
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-gray-800 ${menuLang === 2 ? "font-khmer" : "font-semibold"}`}
              variants={cardVariants}
              transition={{ delay: 0.2 }}
            >
              {innovation.title}
            </motion.h1>


            <p
              className={`text-gray-800 text-[12px] sm:text-[14px] lg:text-[16px] mb-4 leading-relaxed ${menuLang === 2 ? "fonts-khmer" : "font-sans-serif"}`}
              dangerouslySetInnerHTML={{ __html: innovation.description }}
            />




            {/* <motion.ul
              className="space-y-3 sm:space-y-4 text-gray-700 mb-6 text-[12px] sm:text-[14px] lg:text-[16px] sm:text-justify"
              variants={cardVariants}
              transition={{ delay: 0.8 }}
            >
              {innovation.listItems.map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="border border-red-800 p-2 rounded-full mr-2 sm:mr-3 mt-1">
                    <FaCheck className="text-red-800 text-sm sm:text-base" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul> */}

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
                  <p className={`text-gray-800 ${menuLang === 2 ? "fonts-khmer" : "font-sans"}`}>{s.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.5 }}
            className='container mx-auto w-full lg:w-[600px] h-auto lg:h-[510px] md:h-[350px] order-1 lg:order-2'

          >
            {innovation.imageLeft && (
              <img
                src={innovation.imageLeft}
                alt={`${innovation.title} Image`}
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
