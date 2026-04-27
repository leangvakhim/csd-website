import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { useData } from "../../Context/DataContext";


// Animation variants
const quoteVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const TestimonialSection = ({ section, menuLang }) => {
  const [quote, setQuote] = useState(null);

  const { globalData } = useData();

  useEffect(() => {
    if (section?.sec_id && globalData?.testimonials) {
      const data = Array.isArray(globalData.testimonials) ? globalData.testimonials : [];
      const filtered = data.find(item =>
        item.t_sec === section?.sec_id &&
        section.sec_type === "Testimonial" &&
        section.display === 1 &&
        section.active === 1
      );
      if (filtered) {
        setQuote(filtered.t_title);
      }
    }
  }, [section, globalData?.testimonials]);


  if (!quote) {
    return null;
  }


  return (
    <div className="my-12 sm:my-16 bg-white">
      <motion.section
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={quoteVariants}
      >
        <div className="max-w-4xl text-center relative">
          {/* Top Quote Icon */}
          <motion.div
            className="absolute -top-8 left-4 text-red-800"
            variants={quoteVariants}
            transition={{ delay: 0.2 }}
          >
            <FaQuoteLeft className="text-3xl sm:text-4xl md:text-5xl" />
          </motion.div>

          {/* Quote Text */}
          <motion.h1
            className={`text-lg sm:text-2xl md:text-3xl font-semibold leading-relaxed text-gray-800 px-20 ${
              menuLang === 2 ? "font-khmer" : "font-semibold"
            }`}
            variants={quoteVariants}
            transition={{ delay: 0.4 }}
          >
            {quote}
          </motion.h1>

          {/* Bottom Quote Icon */}
          <motion.div
            className="absolute -bottom-8 right-4 text-red-800"
            variants={quoteVariants}
            transition={{ delay: 0.6 }}
          >
            <FaQuoteRight className="text-3xl sm:text-4xl md:text-5xl" />
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default TestimonialSection;
