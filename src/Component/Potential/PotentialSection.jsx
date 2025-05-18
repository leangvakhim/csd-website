import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaDollarSign, FaUserGraduate, FaCheck } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
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

const PotentialSection = ({ section, menuLang }) => {
  const [researchData, setResearchData] = useState(null);
  const [subservices, setSubservices] = useState([]);

  // Default icons for subservices (in case API doesn't provide them)
  const defaultIcons = [
    <MdSchool className="text-red-800 text-xl" />,
    <FaUsers className="text-red-800 text-xl" />,
    <FaDollarSign className="text-red-800 text-xl" />,
    <FaUserGraduate className="text-red-800 text-xl" />,
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (section?.sec_id) {
        try {
          // Fetch specialization data
          const res = await axiosInstance.get(
            `${API_ENDPOINTS.getSpecialization}?section_id=${section.sec_id}`
          );
          const data = res.data?.data || [];

          const filteredData = data.filter(
            (item) =>
              item.section?.sec_page === section.sec_page &&
              item.section.display === 1 &&
              item.section.active === 1 &&
              item.section.sec_id === section.sec_id
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

            setResearchData({
              title: item.text.title || "Research & Labs: Unlock Your Potential in Research & Technology",
              description: item.text.desc || "",
              paragraphs,
              listItems,
              imageLeft: item.image1?.img
                ? `${API}/storage/uploads/${item.image1.img}`
                : null,
              hasRas: !!item.ras,
            });

            // Fetch subservices
            const subserviceRes = await axiosInstance.get(
              `${API_ENDPOINTS.getSubserviceAF}?af_id=${item.af_id}`
            );

            const subserviceData = (subserviceRes.data?.data || []).filter(
              (s) => s.ras?.ras_sec === item.ras_sec
            );

            setSubservices(
              subserviceData.map((s, index) => ({
                ss_id: s.ss_id,
                title: s.ss_title || "Untitled Subservice",
                description: s.ss_subtitle || "No description available",
                icon: s.image?.img
                  ? `${API}/storage/uploads/${s.image.img}`
                  : defaultIcons[index % defaultIcons.length], // Fallback to default icons
              }))
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        console.log("ResearchLabsSection: No section.sec_id provided, skipping API call.");
      }
    };

    fetchData();
  }, [section, menuLang]);

  if (!researchData) {
    return (
      <div className="text-center py-8 text-gray-600">
        No research lab data available for this section.
      </div>
    );
  }

  return (
    <div className="my-8 sm:my-12 lg:my-16">
      <motion.section
        className="container mx-auto px-4 sm:px-6 lg:px-8 bg-white py-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-10">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.5 }}
            className="lg:w-[500px] w-auto h-[552px] mb-8 md:mb-0 order-1 lg:order-1"
            whileHover={{ scale: 1.05 }}
          >
            {researchData.imageLeft ? (
              <img
                src={researchData.imageLeft}
                alt={`${researchData.title} Image`}
                className="rounded-lg object-cover shadow-lg h-full w-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-image.png";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg" />
            )}
          </motion.div>

          {/* Text and Features Section */}
          <motion.div
            className="w-full xl:w-[950px] md:pl-8 order-2 lg:order-2"
            variants={cardVariants}
          >
            <motion.h2
              className={`text-3xl font-normal mb-8 text-gray-800 ${
                menuLang === 2 ? "font-khmer" : "font-semibold"
              }`}
              variants={cardVariants}
              transition={{ delay: 0.2 }}
            >
              {researchData.title}
            </motion.h2>

            <p
              className={`text-gray-800 text-[14px] lg:text-[16px] mb-6 leading-relaxed ${
                menuLang === 2 ? "fonts-khmer" : "font-semibold"
              }`}
              dangerouslySetInnerHTML={{ __html: researchData.description }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
              {subservices.map((s, i) => (
                <motion.div
                  key={s.ss_id}
                  className="flex items-start"
                  variants={cardVariants}
                  transition={{ delay: i * 0.2 }}
                >
                  <div className="p-1.5 min-w-[60px] min-h-[60px] flex items-center justify-center">
                    {typeof s.icon === "string" ? (
                      <img
                        src={s.icon}
                        alt={s.title}
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-icon.png";
                        }}
                      />
                    ) : (
                      s.icon || <FaCheck className="text-red-800 text-sm" />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-lg lg:text-xl !font-semibold mb-1 text-gray-800 ${menuLang === 2 ? 'fonts-khmer text-[20px]' : 'font-sans'}`}>
                      {s.title}
                    </h3>
                    <p className={`text-gray-800 lg:text-lg ${menuLang === 2 ? 'fonts-khmer text-[20]' : 'font-sans'}`}>{s.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default PotentialSection;