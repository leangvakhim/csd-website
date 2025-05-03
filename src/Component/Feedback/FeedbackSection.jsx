import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";

const FeedbackSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.getFeedback);
        const data = response.data?.data || [];

        // Map API data to component structure
        const formattedData = data
          .filter((item) => item.display === 1 && item.active === 1)
          .map((item) => ({
            name: item.fb_writer || "Anonymous",
            text: [item.fb_subtitle || "No feedback provided"],
            image: item.image?.img
              ? `${API}/storage/uploads/${item.image.img}`
              : "/placeholder-image.jpg",
          }));

        setFeedbackData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Failed to load feedback. Please try again later.");
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const nextFeedback = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === feedbackData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevFeedback = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? feedbackData.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="my-8 sm:my-12 lg:my-16 text-center text-gray-600">
        Loading feedback...
      </div>
    );
  }

  if (error || feedbackData.length === 0) {
    return (
      <div className="my-8 sm:my-12 lg:my-16 text-center text-gray-600">
        {error || "No feedback available at this time."}
      </div>
    );
  }

  const { name, text, image } = feedbackData[currentIndex];

  return (
    <div className="my-8 sm:my-12 lg:my-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-red-900 text-gray-50 rounded-3xl">
        <div className="py-8 sm:py-12 lg:py-16 relative">
          <div
            className="flex flex-col lg:flex-row items-center w-full h-full overflow-hidden"
            role="region"
            aria-label="Student feedback carousel"
          >
            {/* Navigation Buttons */}
            <button
              onClick={prevFeedback}
              className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 rounded-full p-2 sm:p-3 bg-white text-gray-700 hover:bg-gray-200 shadow-md z-10"
              aria-label="Previous slide"
            >
              <FaChevronLeft className="text-sm sm:text-base" />
            </button>
            <button
              onClick={nextFeedback}
              className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 rounded-full p-2 sm:p-3 bg-white text-gray-700 hover:bg-gray-200 shadow-md z-10"
              aria-label="Next slide"
            >
              <FaChevronRight className="text-sm sm:text-base" />
            </button>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="flex flex-col lg:flex-row items-center w-full"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                {/* Left - Text Content */}
                <div className="w-full lg:w-1/2 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 flex flex-col justify-center order-2 lg:order-1">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6">
                    Student Feedback on Research Experience
                  </h2>
                  {text.map((paragraph, index) => (
                    <p
                      key={index}
                      className="mb-3 sm:mb-4 text-xs sm:text-sm lg:text-base text-gray-200 leading-relaxed line-clamp-6 sm:line-clamp-none"
                    >
                      {`"${paragraph}"`}
                    </p>
                  ))}
                  <h2 className="text-sm sm:text-base lg:text-lg font-semibold mt-4">
                    {name}
                  </h2>
                </div>

                {/* Right - Image */}
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-end order-1 lg:order-2 relative px-4 sm:px-6">
                  <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[450px] aspect-[4/3] rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-pink-100 transform -translate-x-3 -translate-y-3 rounded-3xl z-0"></div>
                    <img
                      src={image}
                      alt={name}
                      className="relative w-full h-full object-cover rounded-lg shadow-md z-10"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    {/* Slide Indicators */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                      {feedbackData.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mx-1 sm:mx-2 ${
                            currentIndex === index ? "bg-white" : "bg-gray-400"
                          } shadow-md`}
                          onClick={() => goToSlide(index)}
                          aria-label={`Go to slide ${index + 1}`}
                          aria-current={currentIndex === index ? "true" : "false"}
                        ></button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection;