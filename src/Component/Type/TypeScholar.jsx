import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from "../../Service/APIconfig";

const TypeScholar = ({ section }) => {
  const [scholarships, setScholarships] = useState([]);
  const [mainTitle, setMainTitle] = useState('');
  const [description, setDescription] = useState('');
  const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

  // Fetching Scholarship Types (Full-Funded, Merit-Based, etc.)
  useEffect(() => {
    if (section && section.sec_id) {
      // Fetch data for both API endpoints
      fetch(`${API_ENDPOINTS.getSubType}?section_id=${section.sec_id}`)
        .then((response) => response.json())
        .then((data) => {
          const scholarshipData = data?.data;
          if (scholarshipData) {
            // Filter scholarships by currentLang
            const filteredScholarships = scholarshipData.filter(
              (scholarship) => scholarship.lang === section.lang
            );
            setScholarships(filteredScholarships);
          }
        })
        .catch((error) => console.error("Error fetching scholarships from getSubType:", error));

      fetch(`${API_ENDPOINTS.getType}?section_id=${section.sec_id}`)
        .then((response) => response.json())
        .then((data) => {
          const scholarshipData = data?.data;
          if (scholarshipData && scholarshipData.length > 0) {
            // Filter by currentLang or pick the first matching language
            const mainData = scholarshipData.find(
              (item) => item.lang === currentLang
            ) || scholarshipData[0]; // Fallback to first item if no match
            setMainTitle(mainData?.text?.title || 'Default Title');
            setDescription(mainData?.text?.desc || 'No description available.');
          }
        })
        .catch((error) => console.error("Error fetching scholarships from getType:", error));
    }
  }, [section, currentLang]); // Add currentLang to dependency array

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="my-16">
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
      >
        <div className="mb-8 flex flex-col xl:flex-row xl:justify-between xl:items-start gap-6">
          {/* Title */}
          <h2 className="text-3xl font-bold">{mainTitle}</h2>

          {/* Description */}
          <p className="text-gray-800 max-w-2xl">{description}</p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4"
          variants={containerVariants}
        >
          {scholarships.length > 0 ? (
            scholarships.map((scholarship, index) => (
              <motion.div
                key={index}
                className={`rounded-lg p-6 shadow-lg border ${index % 2 === 1 ? 'bg-red-800 text-white' : 'bg-white text-gray-800'}`}
                variants={itemVariants}
              >
                {/* Title */}
                <h3 className="text-xl font-semibold">{scholarship.stse_title}</h3>

                {/* Content Section */}
                <div className="space-y-4">
                  <div className="flex items-start gap-2 mb-4">
                    <p className="text-lg" dangerouslySetInnerHTML={{ __html: scholarship.stse_detail }} />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-lg">No scholarships available at the moment.</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TypeScholar;