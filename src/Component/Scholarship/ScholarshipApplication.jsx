import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
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

// Reusable Components
const LoadingSpinner = () => (
  <div className="text-center py-8 text-gray-600">
    <div className="animate-pulse flex space-x-4">
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="text-center py-8 text-red-600" role="alert">
    Error: {message}
  </div>
);

const ScholarshipApplication = ({ scholarshipId }) => {
  const [applicationData, setApplicationData] = useState({
    bannerImage: "",
    details: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplicationDetails = useCallback(async () => {
    if (!scholarshipId) {
      setError("Missing scholarship ID");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(`${API_ENDPOINTS.getScholarship}/${scholarshipId}`);
      const data = response.data?.data;

      if (!data) {
        setError("No scholarship data found.");
        setIsLoading(false);
        return;
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(data.sc_detail || "<div></div>", "text/html");
      const detailDivs = doc.querySelectorAll('div[style*="display: flex"]');

      const details = Array.from(detailDivs).map((div, index) => {
        const svgElement = div.querySelector("svg");
        const linkElement = div.querySelector("a");

        return {
          id: index,
          title: div.querySelector("h3")?.textContent?.trim() || `Detail ${index + 1}`,
          description: div.querySelector("p")?.textContent?.trim() || "No description available",
          svgIcon: svgElement ? svgElement.outerHTML : "",
          link: {
            url: linkElement?.href || "",
            text: linkElement?.textContent?.trim() || "",
          },
        };
      });

      setApplicationData({
        bannerImage: data.letter?.img
          ? `${API}/storage/uploads/${data.letter.img}`
          : "/placeholder-image.jpg",
        details,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load application details");
      console.error("Error fetching application details:", err);
    } finally {
      setIsLoading(false);
    }
  }, [scholarshipId]);

  useEffect(() => {
    fetchApplicationDetails();
  }, [fetchApplicationDetails]);

  const viewPdfFromAPI = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.getScholarship}/${scholarshipId}`);
      const data = response.data?.data;
  
      if (!data || !data.letter?.img) {
        alert("PDF not available");
        return;
      }
  
      // If the img is a real PDF file (not an image pretending to be one)
      const fileUrl = `${API}/storage/uploads/${data.letter.img}`;
      const extension = fileUrl.split('.').pop().toLowerCase();
  
      if (extension === 'pdf') {
        window.open(fileUrl, "_blank");
      } else {
        // If it's an image (like .jpg/.png), convert to PDF
        const img = new Image();
        img.crossOrigin = "Anonymous";
  
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
  
          const dataURL = canvas.toDataURL("image/png");
          const doc = new jsPDF({
            orientation: img.width > img.height ? "landscape" : "portrait",
            unit: "px",
            format: [img.width, img.height],
          });
  
          doc.addImage(dataURL, "PNG", 0, 0, img.width, img.height);
          const pdfBlob = doc.output("blob");
          const pdfUrl = URL.createObjectURL(pdfBlob);
          window.open(pdfUrl, "_blank");
        };
  
        img.onerror = () => {
          alert("Failed to load image for PDF.");
        };
  
        img.src = fileUrl;
      }
    } catch (error) {
      alert("Error loading PDF/image.");
      console.error("PDF Load Error:", error);
    }
  };
  
  

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="my-12">
      <motion.section
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          {/* Image Section */}
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            {applicationData.bannerImage ? (
              <img
                src={applicationData.bannerImage}
                alt="Scholarship Application"
                onClick={() => viewPdfFromAPI(applicationData.bannerImage)}
                className="w-full h-auto max-h-[575px] object-contain rounded-lg shadow-md cursor-pointer"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg" aria-hidden="true"></div>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div
            variants={cardVariants}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Application Details
            </h2>
            {applicationData.details.length > 0 ? (
              <div role="list" className="space-y-6">
                {applicationData.details.map((detail) => (
                  <motion.div
                    key={detail.id}
                    variants={cardVariants}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white rounded-lg p-2 shadow-lg hover:shadow-xl hover:scale-105 transition duration-300"
                    role="listitem"
                  >
                    {/* Icon */}
                    <div className="p-2 flex items-center justify-center rounded-lg bg-red-800 w-12 h-12">
                      {detail.svgIcon ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: detail.svgIcon }}
                          className=" text-white"
                          aria-hidden="true"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-white rounded" aria-hidden="true"></div>
                      )}
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-700">{detail.title}</h3>
                      <p className="text-gray-600">
                        {detail.description}
                        {detail.link?.url && (
                          <Link
                            to={detail.link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline ml-1"
                            aria-label={`Visit ${detail.link.text}`}
                          >
                            {detail.link.text}
                          </Link>
                        )}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No application details available
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default ScholarshipApplication;
