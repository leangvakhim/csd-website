import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useData } from '../../Context/DataContext';
import { API } from '../../Service/APIconfig';

const OverFlowScholarshipSection = ({sectionData, scholarshipDetailPage}) => {
  const { globalData, isLoading } = useData();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [scholarships, setScholarships] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const BASE_IMAGE_URL = `${API}/storage/uploads`;
  const DEFAULT_IMAGE = '/placeholder-image.jpg';
  const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;
  const [resolvedAlias, setResolvedAlias] = useState(null);

  useEffect(() => {
    if (globalData?.pages && sectionData?.hsec_routepage) {
      const pages = globalData.pages || [];
      const matched = pages.find((page) => page.p_title === sectionData.hsec_routepage);
      setResolvedAlias(matched?.p_alias || null);
    }
  }, [sectionData?.hsec_routepage, globalData]);

  // Fetch header data
  useEffect(() => {
    if (globalData?.headers) {
      const headerList = globalData.headers || [];

      const matchedHeader = headerList.find(
        (item) =>
          item.hsec_sec === sectionData.sec_id &&
          item.section?.sec_type === "Scholarship" &&
          item.section?.display === 1 &&
          item.section?.active === 1
      );

      if (matchedHeader) {
        setHeaderData({
          hsec_title: matchedHeader.hsec_title || "Scholarship",
          hsec_amount: matchedHeader.hsec_amount,
          hsec_subtitle: matchedHeader.hsec_subtitle || "",
          hsec_btntitle: matchedHeader.hsec_btntitle || "",
          hsec_routepage: matchedHeader.hsec_routepage || "",
        });
      }
    }
  }, [globalData, sectionData]);

  // Fetch scholarship data
  useEffect(() => {
    if (globalData?.scholarship) {
      const formattedScholarships = (globalData.scholarship || [])
        .filter((item) => {
          if (!item) return false;
          return (
            item.lang === currentLang &&
            item.display === 1 &&
            item.active === 1
          );
        })
        .sort((a, b) => (a.sc_orders ?? 0) - (b.sc_orders ?? 0))
        .map((item) => {
          let formattedDeadline = 'TBD';
          try {
            if (item.sc_deadline) {
              formattedDeadline = new Date(item.sc_deadline).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
            }
          } catch (error) {
            console.warn(`Invalid deadline for scholarship ${item.sc_id}:`, error);
          }

          return {
            id: item.sc_id ?? null,
            ref_id: item.ref_id ,
            tag: item.sc_sponsor ?? '',
            title: item.sc_title ?? '',
            description: item.sc_shortdesc ?? '',
            deadline: formattedDeadline,
            imageUrl: item.image?.img ? `${BASE_IMAGE_URL}/${item.image.img}` : DEFAULT_IMAGE,
          };
        });

      setScholarships(formattedScholarships);
    }
  }, [currentLang, globalData, headerData.hsec_amount]);

  // Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !scholarships.length) return;

    let currentScroll = 0;
    const scrollSpeed = 1.5;
    let scrollInterval;

    const autoScroll = () => {
      currentScroll += scrollSpeed;
      if (currentScroll >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        currentScroll = 0;
      }
      scrollContainer.scrollTo({ left: currentScroll, behavior: 'smooth' });
    };

    scrollInterval = setInterval(autoScroll, 30);

    const handleMouseEnter = () => clearInterval(scrollInterval);
    const handleMouseLeave = () => {
      scrollInterval = setInterval(autoScroll, 30);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(scrollInterval);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [scholarships]);

  if (isLoading) return null;

  const getDetailPath = (alias, refId) => {
    const prefix = window.location.pathname.startsWith('/km') ? '/km' : '';
    if (!alias) return '#';
    const path = alias.startsWith('/') ? alias : `/${alias}`;
    const fullPath = (prefix && path.startsWith(prefix)) ? path : `${prefix}${path}`;
    return `${fullPath}/${refId}`;
  };

  return (
    <div className="py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className={`text-2xl md:text-3xl font-semibold text-gray-900 mb-3 md:mb-0 ${currentLang === 2 ? 'font-khmer' : 'font-semibold'}`}
          >
            {sectionData.hsec_title || 'Check Out Scholarship Opportunities'}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {sectionData.hsec_btntitle && (
              <Link to={resolvedAlias} className={`flex text-red-800 hover:text-red-900 items-center border-b border-red-800 pb-1 ${currentLang === 2 ? 'fonts-khmer' : 'font-sans'}`}>
                <span className={`mr-2 text-sm ${currentLang === 2 ? "fonts-khmer" : "font-sans"
                        }`}>{sectionData.hsec_btntitle}</span>
                <FaArrowRight className="text-red-800" />
              </Link>
            )}
          </motion.div>
        </motion.div>

        {/* Horizontal scroll container */}
        <div className="w-full overflow-x-auto pb-4 no-scrollbar">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 pb-4 min-w-min"
          >
            {scholarships.map((scholarship, index) => (
              <motion.div
                key={scholarship.ref_id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex-shrink-0 bg-white rounded-2xl shadow-md w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px]"
              >
                <div className="h-48 overflow-hidden rounded-t-2xl">
                  <img
                    src={scholarship.imageUrl}
                    alt={scholarship.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = DEFAULT_IMAGE;
                    }}
                  />
                </div>

                <div className="p-4">
                  {scholarship.tag && (
                    <span className={`inline-block text-xs font-semibold text-red-600 uppercase bg-indigo-100 px-2 py-1 rounded-full mb-2 ${currentLang === 2 ? 'fonts-khmer' : 'font-sans'}`}>
                      {scholarship.tag}
                    </span>
                  )}

                  <h2 className={`text-lg font-semibold text-gray-900 line-clamp-2 h-14 ${currentLang === 2 ? 'fonts-khmer text-[20px]' : "font-semibold"}`}>{scholarship.title}</h2>

                  <p className={`${currentLang === 2 ? "fonts-khmer" : "font-sans"
                      } mt-2 text-sm text-gray-700 line-clamp-3 h-14 mb-2`}>{scholarship.description}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3">
                    <span className={`text-sm text-gray-800 mb-3 sm:mb-0 ${currentLang === 2 ? "fonts-khmer" : "font-sans"}`}>
                      <span className={`${currentLang === 2 ? "fonts-khmer" : "font-sans"
                      } font-medium`}>{currentLang === 1 ? "Deadline:" : "ថ្ងៃផុតកំណត់ៈ"}</span> {scholarship.deadline}
                    </span>

                    <button
                      className={`bg-red-800 hover:bg-red-900 text-white py-2 px-4 rounded-xl text-sm w-full sm:w-auto text-center transition-colors duration-200 ${currentLang === 2 ? "fonts-khmer" : "font-sans"}`}
                      onClick={() => {
                        navigate(getDetailPath(scholarshipDetailPage?.p_alias, scholarship.ref_id));
                      }}
                    >
                      {currentLang === 1 ? "View Detail" : "មើលលម្អិត"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverFlowScholarshipSection;