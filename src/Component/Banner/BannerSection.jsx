import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API } from "../../Service/APIconfig";
import { useData } from "../../Context/DataContext";


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
  const { globalData } = useData();
  const [bannerData, setBannerData] = useState({
    title: "",
    subtitle: "",
    image: null,
  });

  // Fetch banner data from globalData
  useEffect(() => {
    if (globalData?.banners && section?.sec_id) {
        const banners = globalData.banners;
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
        }
    }
  }, [section.sec_id, globalData?.banners]);


  if (!bannerData.image) {
    return null;
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
            menuLang === 2 ? "fonts-khmer" : "font-sans"
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