import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowRight,
  FaCalendarAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

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

// Animation variants for individual cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ApplySection = ({ section }) => {
  const [sectionData, setSectionData] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    semesterInfo: { title: "", text: "", date: "" },
    contactDetails: { phone: "", email: "", socialLinks: [] },
  });
  const [steps, setSteps] = useState([]);  // Added state for steps

  const fallbackContactInfo = {
    contactDetails: {
      phone: "885 234 876 987",
      email: "rupp@email.edu.kh",
      socialLinks: [
        { icon: <FaFacebookF />, link: "https://www.facebook.com/your-page" },
        { icon: <FaTwitter />, link: "https://twitter.com/your-profile" },
        { icon: <FaInstagram />, link: "https://www.instagram.com/your-profile" },
        { icon: <FaLinkedin />, link: "https://www.linkedin.com/in/your-profile" },
      ],
    },
  };

  // Fetch data based on section.sec_id
  useEffect(() => {
    if (section?.sec_id) {
      axios
        .get(`${API_ENDPOINTS.getApply}?section_id=${section.sec_id}`)
        .then((res) => {
          const data = res.data?.data || [];
          console.log("Fetched section data:", data);  // Check the data structure

          if (data.length > 0) {
            const sectionData = data[0];  // Assuming you want the first section

            // Format section data
            const formattedSection = {
              ha_title: sectionData.ha_title || "Default Title",
              ha_tagtitle: sectionData.ha_tagtitle || "",
              ha_subtitletag: sectionData.ha_subtitletag || "",
              ha_date: sectionData.ha_date || "",
              image: sectionData.image?.img ? `${API}/storage/uploads/${sectionData.image.img}` : null,
              ha_id: sectionData.ha_id || null,
            };

            console.log("Formatted Section:", formattedSection);  // Check formatted section data
            setSectionData(formattedSection); // This updates the sectionData state
          }


          // Fetch steps (assuming a separate endpoint)
          axios
            .get(`${API_ENDPOINTS.getSubApply}?ha_id=${data.ha_id}`)
            .then((stepRes) => {
              const stepsData = stepRes.data?.data || [];
              const formattedSteps = stepsData
                .filter((step) => step.display === 1)
                .map((step) => step.sha_title) || [];
              setSteps(formattedSteps);  // Set the fetched steps
            })
            .catch((error) => {
              console.error("Error fetching steps:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching apply section data:", error);
          setSectionData({
            title: "Step By Step: How to Apply to Computer Science Department",
            image: null,
            ha_id: null,
          });
          setContactInfo(fallbackContactInfo);
        });
    } else {
      console.log("ApplySection: No section.sec_id provided, skipping API call");
      setSectionData({
        title: "Step By Step: How to Apply to Computer Science Department",
        image: null,
        ha_id: null,
      });
      setContactInfo(fallbackContactInfo);
    }
  }, [section]);

  return (
    <div className="my-16">
      <motion.section
        className="container mx-auto px-4"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="flex flex-col xl:flex-row gap-8 items-center justify-between">
          {/* Left Side: Steps */}
          <motion.div
            className="lg:w-1/2 mb-8 xl:mb-0"
            variants={cardVariants}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-3xl font-semibold mb-6"
              variants={cardVariants}
              transition={{ duration: 0.6 }}
            >
              {sectionData.ha_title} {/* Displaying title here */}
            </motion.h2>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  variants={cardVariants}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="lg:text-xl text-md">{step}</span>
                    <FaArrowRight className="ml-2" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Semester and Contact Info */}
          <motion.div
            className="xl:w-1/2 flex flex-col xl:flex-row justify-center items-center gap-6"
            variants={cardVariants}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg xl:w-1/2 order-1 xl:order-2"
              variants={cardVariants}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">{sectionData.ha_tagtitle}</h3>
                  <p className="mb-4">{sectionData.ha_subtitletag}</p>
                  <p className="text-center text-lg xl:text-xl">
                    <FaCalendarAlt className="inline-block mr-2" />
                    {sectionData.ha_date}
                  </p>
                </div>
                <div className="py-6 px-4 bg-red-900 text-white shadow-lg rounded-lg">
                  <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
                  <p className="flex items-center mb-2">
                    <FaPhoneAlt className="mr-2" />
                    {contactInfo.contactDetails.phone}
                  </p>
                  <p className="flex items-center mb-4">
                    <FaEnvelope className="mr-2" />
                    {contactInfo.contactDetails.email}
                  </p>
                  <div className="flex space-x-4">
                    {contactInfo.contactDetails.socialLinks.map((link, index) => (
                      <Link
                        key={index}
                        to={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-50 p-2 rounded-lg text-red-700"
                      >
                        {link.icon}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            {sectionData.image && (
              <motion.div
                className="lg:w-1/2 order-2 lg:order-1 shadow-2xs bg-white"
                variants={cardVariants}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={sectionData.image}
                  alt="Admission Image"
                  className="rounded-lg w-full h-full object-cover"
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default ApplySection;
