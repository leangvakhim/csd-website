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

const SpecializationSection = ({ section }) => {
  const [innovation, setInnovation] = useState(null);
  const [subservices, setSubservices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!section?.sec_id) {
        console.log("No section.sec_id provided.");
        return;
      }

      try {
        const res = await axios.get(
          `${API_ENDPOINTS.getSpecialization}?section_id=${section.sec_id}`
        );
        const data = res.data?.data || [];

        const filteredData = data.filter(
          (item) =>
            item.section?.sec_page === section.sec_page &&
            item.section.display === 1 &&
            item.section.active === 1
        );

        if (filteredData.length === 0) return;

        const item = filteredData[0];
        const parser = new DOMParser();
        const doc = parser.parseFromString(item.text.desc, "text/html");

        const listItems = Array.from(doc.querySelectorAll("span")).map((span) =>
          span.textContent.trim()
        );

        const paragraphs = Array.from(doc.querySelectorAll("p"))
          .map((p) => p.textContent.trim())
          .filter(Boolean);

        setInnovation({
          title: item.text.title,
          description: item.text.desc,
          paragraphs,
          listItems,
          imageLeft: item.image1?.img ? `${API}/storage/uploads/${item.image1.img}` : null,
          imageRight: item.image2?.img ? `${API}/storage/uploads/${item.image2.img}` : null,
          hasRas: !!item.ras,
        });

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
      } catch (error) {
        console.error("Error fetching data:", error);
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
          {/* Left: Text */}
          <motion.div className="w-full lg:max-w-[600px] order-2 lg:order-1" variants={cardVariants}>
            <motion.h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-gray-800"
              variants={cardVariants}
              transition={{ delay: 0.2 }}
            >
              {innovation.title}
            </motion.h1>

            <p className="text-gray-800 text-[12px] sm:text-[14px] lg:text-[16px] mb-4 leading-relaxed">
                {innovation.description}
              </p>

        

              <div className="grid grid-cols-1 mt-6">
  {subservices.map((s, i) => (
    <motion.div
      key={s.ss_id}
      initial={{ opacity: 0, x: 0 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay: i * 0.2 }}
      className="mb-6 flex gap-4 items-start"
    >
      <div className="flex items-center justify-center">
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
      </div>
      <div>
        <h6 className="text-lg font-bold">{s.title}</h6>
        <p className="text-sm xl:text-lg">{s.description}</p>
      </div>
    </motion.div>
  ))}
</div>

          </motion.div>

          {/* Right: Image Section */}
          <motion.div
            className="w-full lg:w-1/2 sm:h-[540px] h-[400px] mx-auto order-1 lg:order-2"
            variants={cardVariants}
            transition={{ delay: 0.2 }}
          >
            <div className="relative flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-4 lg:gap-6 w-full">
                <div className="h-full w-full md:h-[347px] md:w-[265px] transform -translate-y-2">
                  {innovation.imageLeft && (
                    <img
                      src={innovation.imageLeft}
                      alt={`${innovation.title} Left`}
                      className="w-full h-full rounded-tl-[100px] object-cover"
                    />
                  )}
                </div>
                <div className="h-full w-full md:w-[254px] md:h-[381px] transform translate-y-22">
                  {innovation.imageRight && (
                    <img
                      src={innovation.imageRight}
                      alt={`${innovation.title} Right`}
                      className="w-full h-full object-cover rounded-tr-[100px]"
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default SpecializationSection;
