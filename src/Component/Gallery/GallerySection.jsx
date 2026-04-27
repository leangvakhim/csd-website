import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API } from "../../Service/APIconfig";
import { useData } from "../../Context/DataContext";

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

// Animation variants for individual image cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const GallerySection = ({ section, menuLang }) => {
  const { globalData, isLoading } = useData();
  const [galleryData, setGalleryData] = useState({
    title: "",
    description: "",
    images: [],
  });


  // Process gallery data from globalData
  useEffect(() => {
    if (!globalData?.galleries) {
      return;
    }

    try {
      const data = globalData.galleries;

      // Filter gallery item matching section ID and type
      const matchedGallery = data.find(
        (item) =>
          item.gal_sec === section.sec_id &&
          section.sec_type === "Gallery"
      );

      if (!matchedGallery) {
        return;
      }

      const formatted = {
        title: matchedGallery.text?.title || "",
        description: matchedGallery.text?.desc || "",
        images: [
          matchedGallery.image1?.img ? `${API}/storage/uploads/${matchedGallery.image1.img}` : null,
          matchedGallery.image2?.img ? `${API}/storage/uploads/${matchedGallery.image2.img}` : null,
          matchedGallery.image3?.img ? `${API}/storage/uploads/${matchedGallery.image3.img}` : null,
          matchedGallery.image4?.img ? `${API}/storage/uploads/${matchedGallery.image4.img}` : null,
          matchedGallery.image5?.img ? `${API}/storage/uploads/${matchedGallery.image5.img}` : null,
        ].filter(Boolean),
      };

      setGalleryData(formatted);
    } catch (error) {
      console.error("Gallery processing error:", error);
    }
  }, [section.sec_id, globalData]);


  if (isLoading || !galleryData.images || galleryData.images.length === 0) {
    return null;
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
        {/* Title & Description */}
        <motion.div
          className="mb-10"
          variants={cardVariants}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-3xl font-semibold mb-4 ${menuLang === 2 ? 'font-khmer' : 'font-semibold'}`}>{galleryData.title}</h2>
          <p className={`text-lg text-gray-800 ${menuLang === 2 ? 'fonts-khmer ' : 'font-sans'}`}>{galleryData.description}</p>
        </motion.div>

        {/* Image Grid - First row (3 images) */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          variants={sectionVariants}
        >
          {galleryData.images.slice(0, 3).map((img, index) => (
            <motion.div
              key={`gallery-img-${index}`}
              className="overflow-hidden rounded-xl shadow-lg"
              variants={cardVariants}
              transition={{ duration: 0.6 }}
            >
              <img
                src={img}
                alt={`${galleryData.title} image ${index + 1}`}
                className="w-full h-full object-cover rounded-xl"
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Image Grid - Second row (2 images) */}
        {galleryData.images.length > 3 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6"
            variants={sectionVariants}
          >
            {galleryData.images.slice(3, 5).map((img, index) => (
              <motion.div
                key={`gallery-img-${index + 3}`}
                className="overflow-hidden rounded-xl shadow-lg"
                variants={cardVariants}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={img}
                  alt={`${galleryData.title} image ${index + 4}`}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>
    </div>
  );
};

export default GallerySection;