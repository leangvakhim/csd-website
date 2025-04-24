import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MdExplore } from "react-icons/md";
import { PiGraduationCapDuotone } from "react-icons/pi";
import axios from "axios";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";

// Section animation
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, when: "beforeChildren", staggerChildren: 0.2 },
  },
};

// Card animation (for each program)
const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const AcademicSection = ({ section }) => {
  const navigate = useNavigate();
  const [academics, setAcademics] = useState(null);

  // Fetch academics info from API
  useEffect(() => {
    axios
      .get(`${API_ENDPOINTS.getAcademic}?section_id=${section.sec_id}`)
      .then((res) => {
        const item = res.data?.data?.[0];
        if (item) {
          // Split detail into paragraphs
          const details = item.acad_detail.split("\n\n");
          setAcademics({
            title: item.acad_title,
            description: details,
            image: item.image?.img ? `${API}/storage/uploads/${item.image.img}` : null,
            programs: [
              item.acad_btntext1,
              item.acad_btntext2,
            ],
            buttonText: item.acad_routetext,
            route: item.acad_routepage || "#",
          });
        } else {
          setAcademics(false);
        }
      })
      .catch((err) => {
        console.error("AcademicSection fetch error:", err);
        setAcademics(false);
      });
  }, [section]);

  if (!academics) {
    return <div className="text-center py-8 text-gray-600">No data available.</div>;
  }

  const { title, description, image, programs, buttonText, route } = academics;

  return (
    <motion.div
      className="my-12"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4">
        <section className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image */}
          {image && (
            <motion.div
              className="w-full lg:w-1/2 flex justify-center lg:justify-end order-1 lg:order-2"
              variants={cardVariants}
            >
              <img
                src={image}
                alt={title}
                className="w-[90%] max-w-[600px] h-full rounded-lg shadow-lg"
              />
            </motion.div>
          )}

          {/* Text */}
          <motion.div
            className="w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1"
            variants={cardVariants}
          >
            <h1 className="text-3xl font-semibold mb-4">{title}</h1>

            {description.map((line, idx) => (
              <p
                key={idx}
                className="text-sm md:text-base text-gray-800 mb-4 text-justify"
              >
                {line}
              </p>
            ))}

            {/* Programs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 text-base">
              {programs.map((prog, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 border border-red-800 p-4 rounded-xl"
                  variants={cardVariants}
                  transition={{ delay: 0.3 * i }}
                >
                  <div className="border border-red-800 rounded-full p-2">
                    <PiGraduationCapDuotone size={25} className="text-red-800" />
                  </div>
                  <p className="text-sm md:text-base text-red-800 font-medium">
                    {prog}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Explore button */}
            <motion.div variants={cardVariants} transition={{ delay: 0.6 }}>
              <button
                onClick={() => navigate(route)}
                className="bg-red-800 text-white rounded-4xl py-2 px-6 flex items-center hover:bg-red-600 transition duration-300"
              >
                {buttonText}
                <MdExplore className="ml-2" />
              </button>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
};

export default AcademicSection;