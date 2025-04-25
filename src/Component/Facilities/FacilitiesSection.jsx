import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";

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

const FacilitiesSection = ({ section }) => {
  const [facilityData, setFacilityData] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!section?.sec_page) {
      setError("Missing page ID");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    axios
      .get(`${API_ENDPOINTS.getFacilitie}?page_id=${section.sec_page}`)
      .then((res) => {
        const data = res.data?.data || [];

        const validItems = data.filter(
          (item) =>
            item.section?.sec_page === section.sec_page &&
            item.section?.display === 1 &&
            item.section?.active === 1 &&
            item.section?.sec_type === "Facilities"
        );

        if (validItems.length === 0) {
          setError("No facilities found for this page.");
          setIsLoading(false);
          return;
        }

        const facilitiesItem = validItems[0];

        const imagePath = facilitiesItem.image?.img
          ? `${API}/storage/uploads/${facilitiesItem.image.img}`
          : "";

        setFacilityData({
          title: facilitiesItem.text?.title || "Facilities",
          description: facilitiesItem.text?.desc || "",
          image: imagePath,
        });

        // If you want multiple items in future, adjust this accordingly.
        setFacilities([
          {
            title: facilitiesItem.text?.title || "Facility Title",
            description: facilitiesItem.text?.desc || "Facility Description",
            image: imagePath,
          },
        ]);

        setIsLoading(false);
      })
      .catch((err) => {
        console.error("FacilitiesSection API error:", err);
        setError("Failed to load facilities");
        setIsLoading(false);
      });
  }, [section]);

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading facilities...</div>;
  }

  if (error || !facilityData.image || facilities.length === 0) {
    return <div className="text-center py-8 text-gray-600">{error || "No facilities available"}</div>;
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
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Image */}
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.6 }}
            className="w-full xl:w-[651px] h-full xl:h-[615px] flex justify-center lg:justify-start"
          >
            <img
              src={facilityData.image}
              alt={facilityData.title}
              className="w-full h-full object-contain"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.6 }}
            className="w-full xl:w-[878px] h-full xl:h-[432px]"
          >
            <h2 className="text-3xl xl:text-4xl font-extrabold text-gray-900 text-center xl:text-left">
              {facilityData.title}
            </h2>
            <p className="text-gray-600 text-center xl:text-left mt-4 mb-8 text-lg">
              {facilityData.description}
            </p>

            {/* Facilities List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {facilities.map((facility, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-lg flex items-center gap-4 hover:shadow-xl hover:scale-105 transition duration-300"
                >
                  {facility.image && (
                    <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-gray-100">
                      <img
                        src={facility.image}
                        alt={facility.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{facility.title}</h3>
                    <p className="text-gray-600">{facility.description}</p>
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

export default FacilitiesSection;
