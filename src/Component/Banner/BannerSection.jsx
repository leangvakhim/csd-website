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

const BannerSection = ({ section }) => {
  const [bannerData, setBannerData] = useState({});

  // Fetch banner data from API
  useEffect(() => {
    if (section?.sec_id) {
      axios
        .get(`${API_ENDPOINTS.getBanner}?section_id=${section.sec_id}`)
        .then((res) => {
          const banners = res.data?.data || [];
          // Filter banners for the given section and display: 1
          const filteredBanners = banners
            .filter(
              (banner) =>
                banner.ban_sec === section.sec_id &&
                banner.section?.display === 1 &&
                banner.image?.img
            )
            .map((banner) => ({
              title: banner.ban_title,
              subtitle: banner.ban_subtitle,
              image: banner.image?.img
                ? `${API}/storage/uploads/${banner.image.img}`
                : null,
            }));

          // Select the first valid banner or retain fallback data
          if (filteredBanners.length > 0) {
            setBannerData(filteredBanners[0]);
          } else {
            console.log(
              "Banner: No valid banners found for section_id",
              section.sec_id
            );
          }
        })
        .catch((err) => {
          console.error("Banner: Error fetching banner data", err);
        });
    } else {
      console.log("Banner: No section.sec_id provided, using fallback data");
    }
  }, [section]);

  if (!bannerData.image) {
    console.log("Banner: No banner image available, using fallback");
  }

  return (
    <motion.div
      className="relative w-full h-[600px] flex items-center justify-center text-center text-white bg-cover bg-center z-0"
      style={{
        backgroundImage: bannerData.image
          ? `url(${bannerData.image})`
          : ``, // Use imported fallback image
      }}
      variants={bannerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      {/* Fixed Overlay using RGBA */}
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
          className="text-3xl sm:text-4xl font-bold drop-shadow-md"
          variants={childVariants}
        >
          {bannerData.title}
        </motion.h1>
        <motion.p
          className="mt-4 text-[12px] sm:text-xl text-gray-50 drop-shadow-md"
          variants={childVariants}
        >
          {bannerData.subtitle}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default BannerSection;