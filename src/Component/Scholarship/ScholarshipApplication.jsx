import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useData } from "../../Context/DataContext";
import { API } from "../../Service/APIconfig";

// Animation variants
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

const ScholarshipApplication = ({ scholarshipId }) => {
  const { globalData, isLoading } = useData();
  const [applicationData, setApplicationData] = useState({
    bannerImage: "",
    details: [],
  });
  const currentLang = window.location.pathname.startsWith("/km") ? 2 : 1;

  useEffect(() => {
    if (globalData?.scholarship && scholarshipId) {
      const allScholarships = globalData.scholarship || [];

      const data = allScholarships.find(
        item => item.ref_id === Number(scholarshipId) && item.lang === currentLang
      );

      if (data) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.sc_detail || "<div></div>", "text/html");
        const detailDivs = doc.querySelectorAll('div[style*="display: flex"]');

        const details = Array.from(detailDivs).map((div, index) => {
          const svgElement = div.querySelector("svg");
          const linkElement = div.querySelector("a");

          return {
            id: index,
            title: div.querySelector("h3")?.textContent?.trim() || ``,
            description: div.querySelector("p")?.textContent?.trim() || "",
            svgIcon: svgElement ? svgElement.outerHTML : "",
            link: {
              url: linkElement?.href || "",
              text: linkElement?.textContent?.trim() || "",
            },
          };
        });

        setApplicationData({
          bannerImage: data.letter?.img
            ? `${API}/storage/uploads/${data.letter.img}`
            : "/placeholder-image.jpg",
          details,
        });
      }
    }
  }, [scholarshipId, currentLang, globalData]);

  if (isLoading) return null;

  return (
    <div className="my-12">
      <motion.section
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          {/* Image Section */}
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            {applicationData.bannerImage ? (
              <a href={applicationData.bannerImage} download target="_blank" rel="noopener noreferrer">
                <img
                  src={applicationData.bannerImage}
                  alt="Scholarship Application"
                  className="w-full h-auto max-h-[575px] object-contain rounded-lg shadow-md hover:opacity-90 transition"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
              </a>

            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg" aria-hidden="true"></div>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <h2 className={`${currentLang === 2 ? 'font-khmer' : 'font-semibold'} text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6`}>
              {currentLang === 1 ? "Application Details" : "ព័ត៌មានលម្អិតអំពីការដាក់ពាក្យ"}
            </h2>
            {applicationData.details.length > 0 ? (
              <div role="list" className={`space-y-6 ${currentLang === 2 ? 'fonts-khmer' : 'font-sans'}`}>
                {applicationData.details.map((detail) => (
                  <motion.div
                    key={detail.id}
                    variants={cardVariants}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white rounded-lg p-2 shadow-lg hover:shadow-xl hover:scale-105 transition duration-300"
                    role="listitem"
                  >
                    {/* Icon */}
                    <div className="p-2 flex items-center justify-center rounded-lg bg-red-800 w-12 h-12">
                      {detail.svgIcon ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: detail.svgIcon }}
                          className=" text-white"
                          aria-hidden="true"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-white rounded" aria-hidden="true"></div>
                      )}
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-700">{detail.title}</h3>
                      <p className="text-gray-600">
                        {detail.description}
                        {detail.link?.url && (
                          <Link
                            to={detail.link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline ml-1"
                            aria-label={`Visit ${detail.link.text}`}
                          >
                            {detail.link.text}
                          </Link>
                        )}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No application details available
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default ScholarshipApplication;