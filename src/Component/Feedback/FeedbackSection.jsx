import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaArrowRight,
  FaCalendarAlt,
} from "react-icons/fa";

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

const ApplySection = ({ section, menuLang }) => {
  const [sectionData, setSectionData] = useState({});
  const [contactInfo, setContactInfo] = useState({
    contactDetails: {
      phone: "",
      email: "",
    },
  });
  const [socialData, setSocialData] = useState({
    contactDetails: {
      socialLinks: [],
    },
  });
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackContactInfo = {
    contactDetails: {
      phone: "885 234 876 987",
      email: "rupp@email.edu.kh",
      socialLinks: [
        {
          title: "telegram",
          link: "https://t.me/university_channel",
          image: "telegram-university.png",
        },
      ],
    },
  };

  const fallbackSectionData = {
    ha_title: "Step By Step: How to Apply to Computer Science Department",
    ha_tagtitle: "",
    ha_subtitletag: "",
    ha_date: "",
    image: null,
    ha_id: null,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch main section data
        const sectionResponse = await axios.get(
          `${API_ENDPOINTS.getApply}?section_id=${section.sec_id}`
        );
        const sectionDataRaw = sectionResponse.data?.data || [];

        // Filter by language and format section data
        const filteredSectionData = sectionDataRaw
          .filter((item) => item.lang === menuLang)
          .map((item) => ({
            ha_title: item.ha_title || "Default Title",
            ha_tagtitle: item.ha_tagtitle || "",
            ha_subtitletag: item.ha_subtitletag || "",
            ha_date: item.ha_date || "",
            image: item.image?.img
              ? `${API}/storage/uploads/${item.image.img}`
              : null,
            ha_id: item.ha_id || null,
          }));

        if (filteredSectionData.length > 0) {
          setSectionData(filteredSectionData[0]);

          // Fetch social settings
          const socialResponse = await axios.get(
            `${API_ENDPOINTS.getSocialSetting}?section_id=${section.sec_id}`
          );
          const socialDataRaw = socialResponse.data?.data || [];
          const filteredSocialData = socialDataRaw
            .filter((item) => item.lang === menuLang)
            .map((item) => ({
              title: item.setsoc_title || "",
              link: item.setsoc_link || "",
              image: item.img?.img
                ? `${API}/storage/uploads/${item.img.img}`
                : "",
            }));
          setSocialData({
            contactDetails: { socialLinks: filteredSocialData },
          });

          // Fetch contact info
          const contactResponse = await axios.get(
            `${API_ENDPOINTS.getContact}?section_id=${section.sec_id}`
          );
          const contactDataRaw = contactResponse.data?.data || [];
          const filteredContactData = contactDataRaw.filter(
            (item) => item.lang === menuLang
          );
          const contactDetails = filteredContactData.length > 0
            ? {
                phone: filteredContactData[0].contact_phone || "",
                email: filteredContactData[0].contact_email || "",
              }
            : fallbackContactInfo.contactDetails;
          setContactInfo({ contactDetails });

          // Fetch steps
          const stepsResponse = await axios.get(
            `${API_ENDPOINTS.getSubApply}?ha_id=${filteredSectionData[0].ha_id}`
          );
          const stepsDataRaw = stepsResponse.data?.data || [];
          const filteredSteps = stepsDataRaw
            .filter((step) => step.display === 1 && step.lang === menuLang)
            .map((step) => step.sha_title);
          setSteps(filteredSteps);
        } else {
          setSectionData(fallbackSectionData);
          setContactInfo(fallbackContactInfo);
          setSocialData(fallbackContactInfo);
          setSteps([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching apply section data:", err);
        setError("Failed to load application data. Please try again later.");
        setSectionData(fallbackSectionData);
        setContactInfo(fallbackContactInfo);
        setSocialData(fallbackContactInfo);
        setSteps([]);
        setLoading(false);
      }
    };

    if (section?.sec_id && menuLang) {
      fetchData();
    } else {
      console.log(
        "ApplySection: No section.sec_id or menuLang provided, using fallback data"
      );
      setSectionData(fallbackSectionData);
      setContactInfo(fallbackContactInfo);
      setSocialData(fallbackContactInfo);
      setSteps([]);
      setLoading(false);
    }
  }, [section?.sec_id, menuLang]);

  if (loading) {
    return (
      <div className="my-16 text-center text-gray-600">
        Loading application data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-16 text-center text-gray-600">
        {error}
      </div>
    );
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
        <div className="flex flex-col xl:flex-row gap-8 items-center justify Built by xAI-between">
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
              {sectionData.ha_title}
            </motion.h2>
            <div className="space-y-4">
              {steps.length > 0 ? (
                steps.map((step, index) => (
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
                ))
              ) : (
                <p className="text-gray-600">No steps available.</p>
              )}
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
                  <h3 className="text-xl font-semibold mb-4">
                    {sectionData.ha_tagtitle || "Admission Details"}
                  </h3>
                  <p className="mb-4">
                    {sectionData.ha_subtitletag || "No additional details provided."}
                  </p>
                  <p className="text-center text-lg xl:text-xl">
                    <FaCalendarAlt className="inline-block mr-2" />
                    {sectionData.ha_date || "Date not specified"}
                  </p>
                </div>
                <div className="py-6 px-4 bg-red-900 text-white shadow-lg rounded-lg">
                  <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
                  <p className="flex items-center mb-2">
                    <FaPhoneAlt className="mr-2" />
                    {contactInfo.contactDetails.phone || "No phone number provided"}
                  </p>
                  <p className="flex items-center mb-4">
                    <FaEnvelope className="mr-2" />
                    {contactInfo.contactDetails.email || "No email provided"}
                  </p>
                  <div className="flex space-x-4">
                    {socialData.contactDetails.socialLinks.length > 0 ? (
                      socialData.contactDetails.socialLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-50 p-2 rounded-lg"
                        >
                          {link.image && (
                            <img
                              src={link.image}
                              alt={link.title}
                              className="w-6 h-6 object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder-image.jpg";
                              }}
                            />
                          )}
                        </a>
                      ))
                    ) : (
                      <p className="text-gray-200">No social links available.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
            {sectionData.image && (
              <motion.div
                className="lg:w-1/2 order-2 lg:order-1 shadow-sm bg-white"
                variants={cardVariants}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={sectionData.image}
                  alt="Admission Image"
                  className="rounded-lg w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.jpg";
                  }}
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