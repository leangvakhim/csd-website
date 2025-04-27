import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { API_ENDPOINTS } from "../../Service/APIconfig";

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

const TestimonialSection = ({ section }) => {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    if (section?.sec_id) {
      // Fetch testimonial based on section.sec_id
      fetch(`${API_ENDPOINTS.getTestimonial}?section_id=${section.sec_id}`)
        .then((response) => response.json())
        .then((data) => {
          const testimonial = data?.data?.[0];
          if (testimonial) {
            setQuote(testimonial.t_title);
          }
        })
        .catch((error) => {
          console.error("Error fetching testimonial:", error);
        });
    } else {
      console.log("QuoteSection: No section.sec_id provided, skipping API call");
    }
  }, [section]);

  if (!quote) {
    return (
      <div className="text-center py-8 text-gray-600">
        No testimonial available for this section.
      </div>
    );
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
            className="text-lg sm:text-2xl md:text-3xl font-semibold leading-relaxed text-gray-800 px-6"
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
