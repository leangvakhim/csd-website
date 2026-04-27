import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { API } from "../../Service/APIconfig";

import { useLocation } from "react-router-dom";
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FacultyCarouselSection = ({ section, menuLang, facultyDetailPage }) => {
  const { globalData } = useData();
  const [headerSection, setHeaderSection] = useState({
    title: "",
    subtitle: "",
  });
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [socials, setSocials] = useState({});

  const location = useLocation();
  const currentLang = location.pathname.includes("/km") ? 2 : 1;
  const prefix = window.location.pathname.startsWith("/km") ? "/km" : "";
  const scrollContainerRef = useRef(null); // Reference to the scrollable container
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  const getAlias = (routePage) => {
    if (!globalData?.pages) return null;
    const matched = globalData.pages.find((p) => p.p_title === routePage);
    return matched?.p_alias || null;
  };

  useEffect(() => {
    if (!globalData?.faculty || !globalData?.headers) {
      return;
    }

    try {
      const headerData = globalData.headers || [];
      const matchedHeader = headerData.find(
        (item) =>
          item.hsec_sec === section.sec_id &&
          item.section?.sec_type === "Faculty" &&
          item.section?.display === 1 &&
          item.section?.active === 1
      );

      if (matchedHeader) {
        setHeaderSection({
            title: matchedHeader.hsec_title || "Our Faculty",
            subtitle: matchedHeader.hsec_subtitle || "",
            btntitle: matchedHeader.hsec_btntitle || "",
            amount: matchedHeader.hsec_amount || "",
            routepage: getAlias(matchedHeader.hsec_routepage),
        });
      }

      const facultyData = globalData.faculty || [];
      const filteredFaculty = facultyData
        .filter((faculty) => faculty.lang === currentLang)
        .map((faculty) => ({
          id: faculty.f_id,
          ref_id: faculty.ref_id,
          name: faculty.f_name || "Unknown Faculty",
          position: faculty.f_position || "No position",
          image: faculty.img?.img
            ? `${API}/storage/uploads/${faculty.img.img}`
            : "/placeholder-faculty.jpg",
        }));

      setFacultyMembers(filteredFaculty);

      const allSocials = globalData.socials || [];
      const socialsByFaculty = {};

      filteredFaculty.forEach((faculty) => {
        socialsByFaculty[faculty.id] = allSocials.filter(
          (social) =>
            social.social_faculty === faculty.id &&
            social.display === 1 &&
            social.active === 1
        );
      });

      setSocials(socialsByFaculty);
    } catch (err) {
      console.error("Data processing error:", err);
    }
  }, [section.sec_id, currentLang, globalData?.faculty, globalData?.headers, globalData?.socials, globalData?.pages]);



  // Auto-scroll logic
  useEffect(() => {
    if (!scrollContainerRef.current || isHovered) return;

    const scrollContainer = scrollContainerRef.current;
    const scrollWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const scrollStep = 300; // Adjust scroll distance per step
    const scrollInterval = 3000; // Time between scrolls (in milliseconds)

    const autoScroll = setInterval(() => {
      const currentScroll = scrollContainer.scrollLeft;

      if (currentScroll >= scrollWidth) {
        // Reset to start when reaching the end
        scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        // Scroll to the next step
        scrollContainer.scrollTo({
          left: currentScroll + scrollStep,
          behavior: "smooth",
        });
      }
    }, scrollInterval);

    return () => clearInterval(autoScroll); // Cleanup on unmount
  }, [isHovered]);

  if (!facultyMembers.length && !headerSection.title) {
    return null;
  }


  const getDetailPath = (alias, refId) => {
    if (!alias) return '#';
    const path = alias.startsWith('/') ? alias : `/${alias}`;
    const fullPath = (prefix && path.startsWith(prefix)) ? path : `${prefix}${path}`;
    return `${fullPath}/${refId}`;
  };

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
            <h2
              className={`text-3xl xl:text-4xl font-extrabold text-gray-900 ${
                currentLang === 2 ? "font-khmer" : "font-semibold"
              }`}
            >
              {headerSection.title}
            </h2>
            {headerSection.subtitle && (
              <p
                className={`text-gray-600 mt-4 text-lg ${
                  currentLang === 2 ? "fonts-khmer" : "font-sans"
                }`}
              >
                {headerSection.subtitle}
              </p>
            )}
          </motion.div>
          <motion.div
            variants={cardVariants}
            className="w-full md:w-auto mt-4 md:mt-0"
          >
            <Link
              to={headerSection.routepage}
              className={`flex text-red-800 hover:text-red-900 items-center border-b border-red-800 pb-1 ${
                currentLang === 2 ? "fonts-khmer" : "font-sans"
              }`}
            >
              <span
                className={`mr-2 lg:text-sm text-[12px] ${
                  menuLang === 2 ? "fonts-khmer" : "font-sans"
                }`}
              >
                {headerSection.btntitle}
              </span>
              <FaArrowRight className="text-red-800" />
            </Link>
          </motion.div>
        </div>

        {/* Faculty Cards */}
        <motion.div variants={sectionVariants} className="overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex snap-x snap-mandatory overflow-x-auto py-6 px-4 scroll-smooth gap-4 md:gap-8"
            onMouseEnter={() => setIsHovered(true)} // Pause on hover
            onMouseLeave={() => setIsHovered(false)} // Resume on leave
          >
            {facultyMembers.map((faculty) => (
              <motion.div
                key={faculty.ref_id}
                variants={cardVariants}
                className="min-w-[300px] sm:min-w-[250px] flex-shrink-0 snap-center mx-2 bg-white rounded-lg shadow-lg p-4 flex flex-col items-center justify-center hover:shadow-xl transition duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative w-48 h-48 md:w-64 md:h-64 mb-4 group">
                  <Link
                    to={getDetailPath(facultyDetailPage?.p_alias, faculty.ref_id)}
                    className="block w-full h-full"
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
                    <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </Link>

                  <div className="absolute top-4 right-4 z-10 pointer-events-none">
                    <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {socials[faculty.id]?.map((social) => (
                        <motion.div
                          key={social.social_id}
                          whileHover={{ scale: 1.1 }}
                          className="bg-white p-3 rounded-full shadow-lg pointer-events-auto"
                        >
                          <Link
                            to={social.social_link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 hover:text-red-600"
                          >
                            <img
                              src={
                                social.img?.img
                                  ? `${API}/storage/uploads/${social.img.img}`
                                  : "/placeholder-icon.png"
                              }
                              alt="Social Icon"
                              className="w-6 h-6"
                            />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
                <h3
                  className={`text-xl font-semibold text-gray-800 ${
                    currentLang === 2 ? "fonts-khmer" : "font-sans"
                  }`}
                >
                  {faculty.name}
                </h3>
                <p
                  className={`text-sm text-gray-600 font-normal mb-4 ${
                    currentLang === 2 ? "fonts-khmer" : "font-sans"
                  }`}
                >
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