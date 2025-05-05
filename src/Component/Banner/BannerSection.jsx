import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";

// Animation variants for the banner section
const bannerVariants = {
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

// Animation variants for child elements (title and subtitle)
const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const BannerSection = ({ section, menuLang }) => {
  const [bannerData, setBannerData] = useState({
    title: "",
    subtitle: "",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch banner data from API
  useEffect(() => {
    if (!section?.sec_id) {
      console.log("BannerSection: No section.sec_id provided, using fallback data");
      setError("Missing section ID");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    axios
      .get(`${API_ENDPOINTS.getBanner}?section_id=${section.sec_id}&lang=${menuLang}`)
      .then((res) => {
        const banners = res.data?.data || [];
        const currentBanner = banners.find(
          (banner) => banner.ban_sec === section.sec_id
        );

        if (currentBanner) {
          setBannerData({
            title: currentBanner.ban_title || "",
            subtitle: currentBanner.ban_subtitle || "",
            image: currentBanner.image?.img
              ? `${API}/storage/uploads/${currentBanner.image.img}`
              : null,
          });
        } else {
          console.log(
            "BannerSection: No banner found for section_id",
            section.sec_id
          );
          setError("No banner found for this section");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("BannerSection: Error fetching banner data:", err);
        setError("Failed to load banner data");
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
        {menuLang === 2 ? "កំពុងផ្ទុក..." : "Loading banner..."}
      </div>
    );
  }

  if (error || !bannerData.image) {
    return (
      <motion.div
        lang={menuLang === 2 ? "km" : "en"}
        className={`relative w-full h-[600px] flex items-center justify-center text-center text-white object-contain sm:object-cover bg-cover bg-center z-0 ${
          menuLang === 2 ? "lang-khmer" : "lang-english"
        }`}
        style={{
          backgroundImage: `url(/images/fallback-banner.jpg)`, // Replace with actual fallback image
        }}
        variants={bannerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        role="banner"
        aria-label="Hero section"
      >
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        ></div>
        <motion.div
          className="relative z-10 max-w-5xl px-6"
          variants={childVariants}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className={`text-3xl sm:text-4xl font-bold drop-shadow-md ${
              menuLang === 2 ? "font-khmer" : "font-sans"
            }`}
            variants={childVariants}
          >
            {bannerData.title || (menuLang === 2 ? "សូមស្វាគមន៍" : "Welcome")}
          </motion.h1>
          <motion.p
            className={`mt-4  text-gray-50 drop-shadow-md ${
              menuLang === 2 ? "fonts-khmer text-[20px]" : "font-sans"
            }`}
            variants={childVariants}
          >
            {bannerData.subtitle ||
              (menuLang === 2 ? "ស្វែងរកសេវាកម្មរបស់យើង" : "Explore our offerings")}
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
    
      className={`relative w-full h-[600px] flex items-center justify-center text-center text-white bg-cover bg-center z-0 `}
      style={{
        backgroundImage: `url(${bannerData.image})`,
      }}
      variants={bannerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      role="banner"
      aria-label="Hero section"
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      ></div>
      <motion.div
        className="relative z-10 max-w-5xl px-6"
        variants={childVariants}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className={`text-4xl font-bold drop-shadow-md ${
            menuLang === 2 ? "font-khmer" : "font-semibold"
          }`}
          variants={childVariants}
        >
          {bannerData.title}
        </motion.h1>
        <motion.p
          className={`mt-4  text-gray-50 drop-shadow-md ${
            menuLang === 2 ? "font-khmer text-[20px]" : "font-sans"
          }`}
          variants={childVariants}
        >
          {bannerData.subtitle}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default BannerSection;