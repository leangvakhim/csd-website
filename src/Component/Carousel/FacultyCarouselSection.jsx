import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";
import { SlSocialFacebook } from "react-icons/sl";
import { PiTelegramLogoDuotone } from "react-icons/pi";

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

const FacultyCarouselSection = () => {
  const [headerSection, setHeaderSection] = useState({
    title: "",
    subtitle: "",
  });
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentLang = 1;
  const fetchFacultyData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch header section
      const headerRes = await axios.get(API_ENDPOINTS.getHeaderSection);
      const headerData = headerRes.data?.data;

      if (!headerData) {
        throw new Error("Invalid API response structure for header section");
      }

      setHeaderSection({
        title: headerData.hsec_title || "Our Faculty",
        subtitle: headerData.hsec_subtitle || "",
      });

      // Fetch faculty members
      const facultyRes = await axios.get(API_ENDPOINTS.getFaculty);
      const facultyData = facultyRes.data?.data || [];

      if (!facultyData.length) {
        throw new Error("No faculty members found");
      }

      setFacultyMembers(
        facultyData.filter((faculty) => faculty.lang === currentLang)
        .map((faculty) => ({
          id: faculty.f_id,
          name: faculty.f_name || "Unknown Faculty",
          position: faculty.f_position || "No position",
          image: faculty.img?.img
            ? `${API}/storage/uploads/${faculty.img.img}`
            : "/placeholder-faculty.jpg",
        }))
      );
    } catch (err) {
      console.error("API error:", err);
      setError(err.response?.data?.message || "Failed to load faculty data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacultyData();
  }, [fetchFacultyData]);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-600">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  if (!facultyMembers.length && !headerSection.title) {
    return (
      <div className="text-center py-8 text-gray-600">
        No faculty data available
      </div>
    );
  }

  return (
    <div className="my-16 bg-white">
      <motion.section
        className="container mx-auto px-4"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <motion.div
            variants={cardVariants}
            className="w-full md:w-2/3 text-center md:text-left"
          >
            <h2 className="text-3xl xl:text-4xl font-extrabold text-gray-900">
              {headerSection.title}
            </h2>
            {headerSection.subtitle && (
              <p className="text-gray-600 mt-4 text-lg">
                {headerSection.subtitle}
              </p>
            )}
          </motion.div>
          <motion.div
            variants={cardVariants}
            className="w-full md:w-auto mt-4 md:mt-0"
          >
            <Link
              to="/faculty"
              className="flex text-red-800 hover:text-red-900 items-center border-b border-red-800 pb-1"
            >
              <span className="mr-2 xl:text-sm text-[12px]">View All</span>
              <FaArrowRight className="text-red-800" />
            </Link>
          </motion.div>
        </div>

        {/* Faculty Cards */}
        <motion.div
          variants={sectionVariants}
          className="overflow-hidden"
        >
          <div className="flex snap-x snap-mandatory overflow-x-auto py-6 px-4 scroll-smooth gap-4 md:gap-8">
            {facultyMembers.map((faculty) => (
              <motion.div
                key={faculty.id}
                variants={cardVariants}
                className="min-w-[300px] sm:min-w-[250px] flex-shrink-0 snap-center mx-2 bg-white rounded-lg shadow-lg p-4 flex flex-col items-center justify-center hover:shadow-xl transition duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  to={`/faculty/${faculty.id}`}
                  className="relative w-48 h-48 md:w-64 md:h-64 mb-4 group"
                >
                  <img
                    src={faculty.image}
                    alt={faculty.name}
                    className="w-full h-full rounded-2xl object-cover group-hover:brightness-90 transition-all duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-faculty.jpg";
                    }}
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center"
                  >
                    <div className="absolute top-4 right-4 group-hover:bg-black/10 p-2 transition-all duration-300 rounded-2xl">
                      <motion.div
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        className="space-y-2"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="bg-white p-3 rounded-full shadow-lg"
                        >
                          <Link
                            to="#"
                            className="text-gray-700 hover:text-red-600"
                          >
                            <SlSocialFacebook className="text-xl" />
                          </Link>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="bg-white p-3 rounded-full shadow-lg"
                        >
                          <Link
                            to="#"
                            className="text-gray-700 hover:text-red-400"
                          >
                            <PiTelegramLogoDuotone className="text-xl" />
                          </Link>
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                </Link>
                <h3 className="text-xl font-semibold text-gray-800">
                  {faculty.name}
                </h3>
                <p className="text-sm text-gray-600 font-normal mb-4">
                  {faculty.position}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default FacultyCarouselSection;