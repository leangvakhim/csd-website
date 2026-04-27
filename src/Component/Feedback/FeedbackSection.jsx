import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { API } from '../../Service/APIconfig';
import { useData } from "../../Context/DataContext";

const FeedbackSection = ({ menuLang }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedbackData, setFeedbackData] = useState([]);
  const [isNavigating, setIsNavigating] = useState(false);


  const { globalData } = useData();

  useEffect(() => {
    if (!globalData?.feedbacks) return;

    const data = Array.isArray(globalData.feedbacks) ? globalData.feedbacks : [];

    const formattedData = data
      .filter(
        (item) =>
          item.display === 1 &&
          item.active === 1 &&
          item.lang === menuLang
      )
      .map((item) => ({
        id: item.fb_id || item.fb_title || `feedback-${Math.random()}`,
        title: item.fb_writer || (menuLang === 2 ? 'អនាមិក' : 'Anonymous'),
        name: item.fb_title || (menuLang === 2 ? 'អនាមិក' : 'Anonymous'),
        text: item.fb_subtitle || (menuLang === 2 ? 'គ្មានមតិយោបល់' : 'No feedback provided'),
        image: item.image?.img
          ? `${API}/storage/uploads/${item.image.img}`
          : '/images/placeholder-image.jpg',
      }));

    setFeedbackData(formattedData);
  }, [menuLang, globalData?.feedbacks]);


  const nextFeedback = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === feedbackData.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsNavigating(false), 500);
  };

  const prevFeedback = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? feedbackData.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsNavigating(false), 500);
  };

  const goToSlide = (index) => {
    if (isNavigating || index === currentIndex) return;
    setIsNavigating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsNavigating(false), 500);
  };

  if (feedbackData.length === 0) {
    return null;
  }


  const { id, title, name, text, image } = feedbackData[currentIndex];

  return (
    <div
      lang={menuLang === 2 ? 'km' : 'en'}
      className={`my-8 sm:my-12 lg:my-16 ${menuLang === 2 ? 'lang-khmer' : 'lang-english'}`}
      role="region"
      aria-label={menuLang === 2 ? 'ផ្នែកមតិយោបល់' : 'Feedback section'}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-red-900 text-gray-50 rounded-3xl min-h-max">
        <div className="py-8 sm:py-12 lg:py-16 relative">
          <div
            className="flex flex-col lg:flex-row items-center w-full h-full overflow-hidden"
            role="region"
            aria-label={menuLang === 2 ? 'រូបភាពមតិយោបល់' : 'Student feedback carousel'}
          >
            {/* Navigation Buttons */}
            <button
              onClick={prevFeedback}
              className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 rounded-full p-2 sm:p-3 bg-white text-gray-700 hover:bg-gray-200 shadow-md z-10 disabled:opacity-50"
              aria-label={menuLang === 2 ? 'រូបភាពមុន' : 'Previous slide'}
              disabled={isNavigating}
            >
              <FaChevronLeft className="text-sm sm:text-base" aria-hidden="true" />
            </button>
            <button
              onClick={nextFeedback}
              className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 rounded-full p-2 sm:p-3 bg-white text-gray-700 hover:bg-gray-200 shadow-md z-10 disabled:opacity-50"
              aria-label={menuLang === 2 ? 'រូបភាពបន្ទាប់' : 'Next slide'}
              disabled={isNavigating}
            >
              <FaChevronRight className="text-sm sm:text-base" aria-hidden="true" />
            </button>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={id}
                className="flex flex-col lg:flex-row items-center w-full"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                role="article"
                aria-label={`${title} - ${name}`}
              >
                {/* Left - Text Content */}
                <div className="w-full ml-0 sm:ml-20 lg:w-1/2 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col justify-center order-2 lg:order-1">
                  <h2
                    className={`text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 ${
                      menuLang === 2 ? 'font-khmer' : 'font-semibold'
                    }`}
                  >
                    {title}
                  </h2>
                  <p
                    className={`mb-3 sm:mb-4 text-xs sm:text-sm lg:text-base text-gray-200 leading-relaxed line-clamp-6 sm:line-clamp-none ${
                      menuLang === 2 ? 'fonts-khmer' : 'font-sans'
                    }`}
                  >
                    {`"${text}"`}
                  </p>
                  <h2
                    className={`text-sm sm:text-base lg:text-xl font-semibold mt-4 ${
                      menuLang === 2 ? 'font-khmer' : 'font-semibold'
                    }`}
                  >
                    {name}
                  </h2>
                </div>

                {/* Right - Image */}
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-end order-1 lg:order-2 relative px-4 sm:px-10">
                  <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[450px] aspect-[4/3] rounded-3xl overflow-hidden">
                    <img
                      src={image}
                      alt={`${name} feedback image`}
                      className="relative w-full max-h-[28rem] sm:max-h-[32rem] object-contain rounded-2xl shadow-lg z-10"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/placeholder-image.jpg';
                      }}
                    />
                    {/* Slide Indicators */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                      {feedbackData.map((item, index) => (
                        <button
                          key={item.id}
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mx-1 sm:mx-2 ${
                            currentIndex === index ? 'bg-white' : 'bg-gray-400'
                          } shadow-md`}
                          onClick={() => goToSlide(index)}
                          aria-label={
                            menuLang === 2
                              ? `ទៅកាន់រូបភាព ${index + 1}`
                              : `Go to slide ${index + 1}`
                          }
                          aria-current={currentIndex === index}
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