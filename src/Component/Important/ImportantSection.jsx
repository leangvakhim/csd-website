import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";
import { FaCalendarAlt } from "react-icons/fa";

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

// Animation variants for individual date cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ImportantSection = ({ section, menuLang }) => {
  const [sectionData, setSectionData] = useState({});
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackSectionData = {
    idd_title: "Important Dates",
    idd_subtitle: "Key dates for your application process",
  };

  const fallbackDates = [];

  useEffect(() => {
    if (section?.sec_id && menuLang) {
      setLoading(true);
      setError(null);

      // Fetch main section data with language filter
      axios
        .get(`${API_ENDPOINTS.getImportant}?section_id=${section.sec_id}&lang=${menuLang}`)
        .then((res) => {
          const data = res.data?.data || [];
          if (data.length > 0) {
            const sectionData = data[0];
            const formattedSection = {
              idd_title: sectionData.idd_title || fallbackSectionData.idd_title,
              idd_subtitle: sectionData.idd_subtitle || fallbackSectionData.idd_subtitle,
              idd_id: sectionData.idd_id || null,
            };
            setSectionData(formattedSection);

            // Fetch dates with language filter
            axios
              .get(`${API_ENDPOINTS.getSubImportant}?section_id=${section.sec_id}&lang=${menuLang}`)
              .then((datesRes) => {
                const datesData = datesRes.data?.data || [];
                const formattedDates = datesData
                  .filter((date) => date.display === 1 && date.idd.idd_sec === sectionData.idd_id)
                  .map((date) => ({
                    sidd_tag: date.sidd_tag || "",
                    sidd_date: date.sidd_date || "",
                    sidd_title: date.sidd_title || "",
                    sidd_subtitle: date.sidd_subtitle || "",
                  }));
                setDates(formattedDates);
              })
              .catch((error) => {
                console.error("Error fetching dates:", error);
                setDates(fallbackDates);
              });
          } else {
            setSectionData(fallbackSectionData);
            setDates(fallbackDates);
          }
        })
        .catch((error) => {
          console.error("Error fetching important section data:", error);
          setSectionData(fallbackSectionData);
          setDates(fallbackDates);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log("ImportantSection: No section.sec_id or menuLang provided, using fallback data");
      setSectionData(fallbackSectionData);
      setDates(fallbackDates);
      setLoading(false);
    }
  }, [section?.sec_id, menuLang]);

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading important dates...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!sectionData.idd_title && !dates.length) {
    return <div className="text-center py-8 text-gray-600">No important dates available.</div>;
  }

  return (
    <div className="my-16">
      <motion.section
        className="container mx-auto px-4"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Side: Section Title and Subtitle */}
          {sectionData.idd_title && (
            <motion.div
              className="xl:w-1/2 mb-8 xl:mb-0"
              variants={cardVariants}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                className="text-3xl font-semibold mb-6"
                variants={cardVariants}
                transition={{ duration: 0.6 }}
              >
                {sectionData.idd_title}
              </motion.h2>
              <motion.p
                className="text-gray-800"
                variants={cardVariants}
                transition={{ duration: 0.6 }}
              >
                {sectionData.idd_subtitle}
              </motion.p>
            </motion.div>
          )}

          {/* Right Side: Dates */}
          {dates.length > 0 && (
            <motion.div
              className="xl:w-1/2 space-y-4"
              variants={cardVariants}
              transition={{ duration: 0.6 }}
            >
              {dates.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  variants={cardVariants}
                  transition={{ duration: 0.6 }}
                >
                  <div className="grid lg:grid-cols-12 items-center gap-4">
                    <div className="bg-pink-100 px-4 py-2 flex flex-col items-center xl:col-span-4 col-span-12 rounded-lg">
                      <h3 className="text-lg font-normal mb-2">{item.sidd_tag}</h3>
                      <p className="text-pink-700 text-lg text-center font-semibold">
                        <FaCalendarAlt className="inline-block mr-2" />
                        {item.sidd_date
                          ? new Date(item.sidd_date).toLocaleDateString(undefined, {
                              day: "numeric",
                              month: "short",
                            })
                          : "Date not specified"}
                      </p>
                    </div>
                    <div className="lg:col-span-8 col-span-12">
                      <h6 className="text-lg font-semibold mt-2">{item.sidd_title}</h6>
                      <p className="text-gray-800">{item.sidd_subtitle}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default ImportantSection;