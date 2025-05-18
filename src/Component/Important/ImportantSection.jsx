import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { API_ENDPOINTS, API, axiosInstance } from "../../Service/APIconfig";

const ImportantSection = ({ section, menuLang }) => {
  const [importantData, setImportantData] = useState(null);
  const [subDates, setSubDates] = useState([]);

  useEffect(() => {
    const fetchImportantData = async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.getImportant);
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        const filtered = data.filter(item =>
          item.section?.sec_id === section?.sec_id &&
          item.section?.sec_type === "Important"
        );
        if (filtered && filtered.length > 0) {
          setImportantData(filtered[0]);
        }
      } catch (error) {
        console.error("Failed to fetch important data:", error);
      }
    };
    fetchImportantData();
  }, [section]);

  useEffect(() => {
    const fetchSubDates = async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.getSubImportant);
        const data = Array.isArray(res.data?.data) ? res.data.data : [];

        const filtered = data
          .filter(
            (item) =>
              item.display === 1 &&
              item.active === 1 &&
              item.idd?.idd_sec === section?.sec_id
          )
          .sort((a, b) => a.sidd_order - b.sidd_order);

        setSubDates(filtered);
      } catch (error) {
        console.error("Failed to fetch sub important dates:", error);
      }
    };

    fetchSubDates();
  }, [section]);

  return (
    <div className="my-16">
        <div className="container mx-auto px-4">
            <div className='flex flex-col lg:flex-row   gap-6'>
                {/* Left Side: Title and Description */}
                <motion.div
                    initial={{ opacity: 0}}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.5 }} // Trigger when 50% of the element is in view
                    className=""
                >
                    <motion.h2
                        initial={{ opacity: 0, }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true, amount: 0.5 }}
                        className={`text-3xl font-semibold mb-4 ${menuLang === 2 ? 'font-khmer' : 'font-semibold'}`}
                    >
                        {importantData?.idd_title || ""}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true, amount: 0.5 }}
                        className={`text-gray-800 ${menuLang === 2 ? 'fonts-khmer' : 'font-sans-serif'} text-lg leading-relaxed`}
                    >
                        {importantData?.idd_subtitle || ""}
                    </motion.p>
                </motion.div>

                {/* Right Side: Dates and Details */}
                <motion.div
                    initial={{ opacity: 0}}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="space-y-4"
                >
                    {subDates.map((item, index) => {
                      const formattedDate = new Date(item.sidd_date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      });
                      const day = new Date(item.sidd_date).getDate();
                      const suffix = (d) => {
                        if (d > 3 && d < 21) return "th";
                        switch (d % 10) {
                          case 1: return "st";
                          case 2: return "nd";
                          case 3: return "rd";
                          default: return "th";
                        }
                      };
                      const finalDate = `${day}${suffix(day)} ${formattedDate.split(' ')[1]}`;

                      return (
                        <motion.div
                          key={item.sidd_id}
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: index * 0.2 }}
                          viewport={{ once: true, amount: 0.5 }}
                          className="bg-white rounded-lg shadow-md p-6"
                        >
                          <div className="grid xl:grid-cols-12 grid-rowsitems-center gap-4 justify-center">
                            <div className="bg-pink-100 px-4 py-2 flex flex-col items-center lg:col-span-4 col-span-12">
                              <h3 className={`text-lg font-normal mb-2 ${menuLang === 2 ? "fonts-khmer text-[20px]" : "font-semibold"}`}>{item.sidd_tag}</h3>
                              <span className={`text-pink-700 text-lg text-center rounded-md font-semibold ${menuLang === 2 ? "fonts-khmer text-[18px]" : "font-semibold"}`}>
                                {finalDate}
                              </span>
                            </div>
                            <div className='xl:col-span-8 col-span-12'>
                              <h1 className={`text-xl font-semibold mt-2 ${menuLang === 2 ? "fonts-khmer text-[20px]" : "font-semibold"}`}>{item.sidd_title}</h1>
                              <p className={`text-gray-800 ${menuLang === 2 ? "fonts-khmer text-[18px]" : "font-semibold"}`}>{item.sidd_subtitle}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                </motion.div>
            </div>
        </div>
    </div>
  );
};

export default ImportantSection;