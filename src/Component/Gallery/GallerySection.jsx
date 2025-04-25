import React, { useState, useEffect } from "react";
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

// Animation variants for individual image cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const GallerySection = ({ section }) => {
  const [galleryData, setGalleryData] = useState({
    title: "",
    description: "",
    images: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch gallery data based on section.sec_id
  useEffect(() => {
    if (!section?.sec_id) {
      console.log("GallerySection: No section.sec_id provided, skipping API call");
      setIsLoading(false);
      setError("Missing section ID");
      return;
    }

    setIsLoading(true);
    axios
      .get(`${API_ENDPOINTS.getGallery}?section_id=${section.sec_id}`)
      .then((res) => {
        console.log("API Response:", res.data); // Debug: Log full response
        // Check if response has data array
        if (!res.data?.data || !Array.isArray(res.data.data)) {
          console.log("GallerySection: Invalid or empty data array");
          setError("No gallery data found");
          setIsLoading(false);
          return;
        }

        const data = res.data.data.length > 0 ? res.data.data[0] : {};
        console.log("Selected Data:", data); // Debug: Log selected gallery object

        const formatted = {
          title: data.text?.title || "",
          description:
            data.text?.desc ||
            "",
          images: [
            data.image1?.img ? `${API}/storage/uploads/${data.image1.img}` : null,
            data.image2?.img ? `${API}/storage/uploads/${data.image2.img}` : null,
            data.image3?.img ? `${API}/storage/uploads/${data.image3.img}` : null,
            data.image4?.img ? `${API}/storage/uploads/${data.image4.img}` : null,
            data.image5?.img ? `${API}/storage/uploads/${data.image5.img}` : null,
          ].filter(Boolean),
        };
        console.log("Formatted Data:", formatted); // Debug: Log formatted data


        if (formatted.images.length === 0) {
          console.log("GallerySection: No images to render (formatted.images is empty)");
          setError("No images available for this gallery");
        }

        setGalleryData(formatted);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("GallerySection: Error fetching gallery data:", error);
        setError("Failed to load gallery data");
        setIsLoading(false);
      });
  }, [section]);

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading gallery...</div>;
  }

  if (error || !galleryData.images || galleryData.images.length === 0) {
    console.log("GallerySection: Render error or no images", { error, images: galleryData.images });
    return (
      <div className="text-center py-8 text-gray-600">
        {error || "No gallery content available"}
      </div>
    );
  }

  console.log("GallerySection: Rendering data:", galleryData);

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
          <h2 className="text-3xl font-semibold mb-4">{galleryData.title}</h2>
          <p className="text-lg text-gray-800">{galleryData.description}</p>
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