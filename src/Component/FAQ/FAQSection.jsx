import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import { useData } from "../../Context/DataContext";

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
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};


const FAQSection = ({section}) => {
  const { globalData, isLoading } = useData();
  const [openIndex, setOpenIndex] = useState(null);
  const [faqItems, setFaqItems] = useState([]);
  const [content, setContent] = useState({
    title: "Frequently Asked Questions",
    description:
      "Professor: Inspiring Minds, Nurturing Curiosity, and Shaping the Future of Knowledge and Innovation",
  });

  const currentLang = window.location.pathname.includes('/km') ? 2 : 1;

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    if (!globalData?.faqs || !globalData?.subfaqs) {
      return;
    }

    try {
      const faqData = globalData.faqs;
      const subFaqData = globalData.subfaqs;

      // Find the FAQ section based on the 'section' prop
      const faqSection = faqData.find(
        (item) => item.section?.sec_type === "FAQ" &&
                  item.faq_sec === section.sec_id &&
                  item.section?.display === 1 &&
                  item.section?.active === 1
      );

      // Set title and description
      if (faqSection) {
        setContent({
          title: faqSection.faq_title || "Frequently Asked Questions",
          description: faqSection.faq_subtitle || "Professor: Inspiring Minds, Nurturing Curiosity, and Shaping the Future of Knowledge and Innovation",
        });
      }

      // Filter sub-FAQ items based on the section id
      const subFaqItems = subFaqData
        .filter((item) => item.display === 1 &&
                          item.active === 1 &&
                          item.faq?.faq_sec === section?.sec_id
                        )
        .map((item) => ({
          question: item.fa_question,
          answer: item.fa_answer,
          order: item.fa_order,
        }))
        .sort((a, b) => a.order - b.order);

      setFaqItems(subFaqItems);
    } catch (err) {
      console.error("Data processing error:", err);
    }
  }, [section, globalData]);


  if (isLoading) return null;

  if (!faqItems || faqItems.length === 0) {
    return null;
  }


  return (
    <div className="my-16 py-4">
      <motion.section
        className="container mx-auto px-4"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Title and Description */}
          <div className="text-start">
            <motion.h1
              variants={cardVariants}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`text-3xl font-bold text-gray-800 mb-6 text-start ${currentLang === 2 ? "font-khmer" : "font-semibold"}`}
            >
              {content.title}
            </motion.h1>
            <motion.p
              variants={cardVariants}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`text-gray-800 xl:text-lg text-[12px] mb-12 text-start ${currentLang === 2 ? "fonts-khmer" : "font-sans"}`}
            >
              {content.description}
            </motion.p>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div className="max-w-full">
            {faqItems.length > 0 ? (
              faqItems.map((faq, index) => (
                <motion.div

                  key={index}
                  variants={cardVariants}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white p-6 rounded-lg shadow-md cursor-pointer mb-4"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className={`text-lg lg:text-2xl font-bold text-gray-800 ${currentLang === 2 ? "fonts-khmer" : "font-sans"}`}>
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaChevronDown className="text-gray-600" />
                    </motion.div>
                  </div>
                  {openIndex === index && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`text-gray-800 text-sm lg:text-lg  mt-4 text-justify ${currentLang === 2 ? "fonts-khmer leading-8" : "font-sans"}`}
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={cardVariants}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <p className="text-gray-800">
                  No FAQ items available for this degree.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default FAQSection;