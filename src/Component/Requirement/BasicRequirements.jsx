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

// Animation variants for individual requirement cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const BasicRequirements = ({ section }) => {
  const [detailHtml, setDetailHtml] = useState("");
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("Basic Requirements");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map sec_page to fallback titles
  const pageToBannerTitle = {
    9: "Bachelor’s Degree Admission Requirements",
    11: "Master’s Degree Admission Requirements",
    13: "Doctoral Degree Admission Requirements",
    15: "Diploma Degree Admission Requirements",
    3: "Admission Requirements",
  };

  useEffect(() => {
    if (!section?.sec_page) {
      setError("Missing page ID");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    axios
      .get(API_ENDPOINTS.getCriteria)
      .then((res) => {
        console.log("BasicRequirements API Response:", res.data); // Debug: Log full response
        const data = res.data?.data || [];

        // Find items for the specific page
        const pageItems = data.filter(
          (item) => item.section?.sec_page === section.sec_page
        );

        // Find the criteria section (sec_type === "Criteria")
        const criteriaItem = pageItems.find(
          (item) => item.section?.sec_type === "Criteria"
        );

        if (criteriaItem) {
          setDetailHtml(criteriaItem.gc_detail || "");
          const imgs = [];
          if (criteriaItem.image1?.img)
            imgs.push(`${API}/storage/uploads/${criteriaItem.image1.img}`);
          if (criteriaItem.image2?.img)
            imgs.push(`${API}/storage/uploads/${criteriaItem.image2.img}`);
          setImages(imgs);

          // Set dynamic title: prefer gc_title, fallback to pageToBannerTitle
          const pageTitle =
            criteriaItem.gc_title ||
            pageToBannerTitle[section.sec_page] ||
            "Basic Requirements";
          setTitle(pageTitle);
        } else {
          // Fallback to first item on the page if no criteria section found
          const fallbackItem = pageItems[0];
          if (fallbackItem) {
            setDetailHtml(fallbackItem.gc_detail || "");
            const imgs = [];
            if (fallbackItem.image1?.img)
              imgs.push(`${API}/storage/uploads/${fallbackItem.image1.img}`);
            if (fallbackItem.image2?.img)
              imgs.push(`${API}/storage/uploads/${fallbackItem.image2.img}`);
            setImages(imgs);
            const pageTitle =
              fallbackItem.gc_title ||
              pageToBannerTitle[section.sec_page] ||
              "Basic Requirements";
            setTitle(pageTitle);
          } else {
            setError("No requirements found for this page");
          }
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("BasicRequirements API error:", err);
        setError("Failed to load requirements");
        setIsLoading(false);
      });
  }, [section]);

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading requirements...</div>;
  }

  if (error || !detailHtml) {
    console.log("BasicRequirements: Render error or no content", { error, detailHtml });
    return <div className="text-center py-8 text-gray-600">{error || "No requirements available"}</div>;
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
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8 py-8 lg:py-0">
          {/* Left Column - Requirements List */}
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 px-4 lg:px-0 order-1 lg:order-2 space-y-4"
          >
            <h1 className="text-2xl lg:text-4xl mb-6 font-semibold">{title}</h1>
            <div
              className="space-y-4 text-gray-600"
              dangerouslySetInnerHTML={{ __html: detailHtml }}
            />
          </motion.div>

          {/* Right Column - Images */}
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 order-2 lg:order-1 flex justify-center"
          >
            <div className="relative flex flex-col items-center justify-center">
              <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-6 w-full">
                {images.map((src, i) => (
                  <div
                    key={i}
                    className={`transition transform ${i === 0 ? "-translate-y-2" : "translate-y-2"}`}
                  >
                    <img
                      src={src}
                      alt={`Requirement image ${i + 1}`}
                      className={`object-cover ${
                        i === 0
                          ? "rounded-tl-[50px] lg:rounded-tl-[100px]"
                          : "rounded-tr-[50px] lg:rounded-tr-[100px]"
                      } ${
                        i === 0
                          ? "h-[150px] w-[120px] sm:h-[200px] sm:w-[150px] lg:h-[347px] lg:w-[265px]"
                          : "h-[180px] w-[120px] sm:h-[250px] sm:w-[150px] lg:h-[381px] lg:w-[254px]"
                      }`}
                    />
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-8 lg:-bottom-8 w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] lg:w-[200px] lg:h-[200px]">
                <svg width="100%" height="100%" viewBox="0 0 400 400">
                  <defs>
                    <path id="halfCirclePath" d="M 50,200 a 150,150 0 0,1 300,0" />
                  </defs>
                  <circle cx="200" cy="200" r="180" fill="#A52A2A" />
                  <text
                    className="text-[20px] sm:text-[24px] fill-white text-center"
                    textAnchor="middle"
                    dy={10}
                    letterSpacing={4}
                  >
                    <textPath href="#halfCirclePath" startOffset="50%">
                      {title}
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default BasicRequirements;