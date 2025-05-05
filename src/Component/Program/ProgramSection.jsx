import React, { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
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

const ProgramSection = ({ section, menuLang }) => {
  const [aboutData, setAboutData] = useState({
    title: "",
    description: "",
    features: [],
    images: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!section?.sec_id) {
      console.log("ProgramSection: No section.sec_id provided");
      setError("Missing section ID");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    axios
      .get(`${API_ENDPOINTS.getDepartment}?lang=${menuLang}`)
      .then((res) => {
        const data = res.data?.data || [];
        const filteredEntry = data.find(
          (entry) =>
            String(entry.dep_sec) === String(section.sec_id) &&
            entry.section?.sec_type === "Programs" &&
            entry.section?.display === 1 &&
            entry.section?.active === 1
        );

        if (filteredEntry && filteredEntry.section.display === 1) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(filteredEntry.dep_detail, "text/html");
          const descEl = doc.querySelector("p");
          const description = descEl ? descEl.textContent.trim() : "";
          const featureEls = [...doc.querySelectorAll("div > span")];
          const features = featureEls.map((el) => el.textContent.trim());
          const imgs = [];
          if (filteredEntry.image1?.img)
            imgs.push(`${API}/storage/uploads/${filteredEntry.image1.img}`);
          if (filteredEntry.image2?.img)
            imgs.push(`${API}/storage/uploads/${filteredEntry.image2.img}`);

          setAboutData({
            title: filteredEntry.dep_title || "",
            description,
            features,
            images: imgs,
          });
        } else {
          console.log(
            "ProgramSection: No matching department found for section_id",
            section.sec_id
          );
          setError("No program data found for this section");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("ProgramSection: Error fetching department data:", error);
        setError("Failed to load program data");
        setIsLoading(false);
      });
  }, [section, menuLang]);

  if (isLoading) {
    return (
      <div
        className={`text-center py-8 text-gray-600 ${
          menuLang === 2 ? "font-khmer" : "font-sans"
        }`}
      >
        {menuLang === 2 ? "កំពុងផ្ទុក..." : "Loading programs..."}
      </div>
    );
  }

  if (error || !aboutData.title) {
    return (
      <div
        lang={menuLang === 2 ? "km" : "en"}
        className={`text-center py-8 text-gray-600 ${
          menuLang === 2 ? "lang-khmer font-khmer" : "lang-english font-sans"
        }`}
      >
        {menuLang === 2 ? "គ្មានទិន្នន័យកម្មវិធី" : "No program data available"}
      </div>
    );
  }

  return (
    <div
      lang={menuLang === 2 ? "km" : "en"}
      className={`my-16 ${menuLang === 2 ? "lang-khmer" : "lang-english"}`}
      role="region"
      aria-label="Programs section"
    >
      <motion.section
        className="container mx-auto px-4"
        variants={sectionVariants}
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Image Section: mobile first */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-1/2 order-1 lg:order-1"
            variants={cardVariants}
          >
            {aboutData.images.map((image, index) => (
              <motion.div
                key={index}
                className={`p-4 mx-auto flex justify-center items-center ${
                  index === 0
                    ? "lg:w-[320px] h-full"
                    : "lg:w-[320px] lg:h-[655px] h-full"
                }`}
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 * index }}
                viewport={{ once: true, amount: 0.5 }}
              >
                <img
                  src={image}
                  alt={`${aboutData.title} image ${index + 1}`}
                  className={`w-full h-full shadow-lg object-cover ${
                    index % 2 === 0
                      ? "rounded-tl-[100px]"
                      : "rounded-tr-[100px]"
                  }`}
                  onError={(e) => {
                    e.target.src = "/images/fallback-image.jpg"; // Replace with actual fallback image
                  }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Text Section: mobile below images */}
          <motion.div
            className="text-base w-full lg:w-1/2 order-2 lg:order-2"
            variants={cardVariants}
          >
            <motion.h1
              className={`text-3xl font-semibold mb-4 ${
                menuLang === 2 ? "font-khmer" : "font-sans"
              }`}
              variants={cardVariants}
            >
              {aboutData.title}
            </motion.h1>
            <motion.p
              className={`text-gray-900 text-justify ${
                menuLang === 2 ? "fonts-khmer" : "font-sans"
              }`}
              variants={cardVariants}
            >
              {aboutData.description}
            </motion.p>
            <ul className="list-none space-y-4 mt-4">
              {aboutData.features.map((item, index) => (
                <motion.li
                  key={index}
                  className={`flex items-center ${
                    menuLang === 2 ? "fonts-khmer" : "font-sans"
                  }`}
                  variants={cardVariants}
                >
                  <div className="border border-red-800 p-2 rounded-full mr-2">
                    <FaCheck className="text-red-800" />
                  </div>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default ProgramSection;