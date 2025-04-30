import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';
import { FaSpinner } from 'react-icons/fa';

const OverFlowScholarshipSection = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [headerData, setHeaderData] = useState({
    hsec_title: 'Check Out Scholarship Opportunities',
    hsec_amount: 5
  });

  const BASE_IMAGE_URL = `${API}/storage/uploads`;
  const DEFAULT_IMAGE = '/placeholder-image.jpg';

  useEffect(() => {
    const fetchHeaderAndScholarships = async () => {
      try {
        const headerRes = await axios.get(API_ENDPOINTS.getHeaderSection);
        if (headerRes.data?.hsec_title) {
          setHeaderData({
            hsec_title: headerRes.data.hsec_title,
            hsec_amount: headerRes.data.hsec_amount || 5
          });
        }

        const scRes = await axios.get(API_ENDPOINTS.getScholarship);
        const formatted = scRes.data.data
          .map(item => ({
            id: item.sc_id,
            tag: item.sc_sponsor,
            title: item.sc_title,
            description: item.sc_shortdesc,
            deadline: new Date(item.sc_deadline).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            imageUrl: item.image?.img ? `${BASE_IMAGE_URL}/${item.image.img}` : DEFAULT_IMAGE
          }))
          .slice(0, headerData.hsec_amount);

        setScholarships(formatted);
      } catch (err) {
        console.error('Error fetching scholarships:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeaderAndScholarships();
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let currentScroll = 0;
    const scrollSpeed = 1.5;
    let scrollInterval;

    const autoScroll = () => {
      currentScroll += scrollSpeed;
      if (currentScroll > scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        currentScroll = 0;
      }
      scrollContainer.scrollTo({ left: currentScroll, behavior: 'smooth' });
    };

    scrollInterval = setInterval(autoScroll, 30);

    scrollContainer.addEventListener('mouseenter', () => clearInterval(scrollInterval));
    scrollContainer.addEventListener('mouseleave', () => {
      scrollInterval = setInterval(autoScroll, 30);
    });

    return () => clearInterval(scrollInterval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-red-800" />
      </div>
    );
  }

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
            className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3 md:mb-0"
          >
            {headerData.hsec_title}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/scholarship" className="flex text-red-800 hover:text-red-900 items-center border-b border-red-800 pb-1">
              <span className="mr-2 text-sm">View All</span>
              <FaArrowRight className="text-red-800" />
            </Link>
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
                key={scholarship.id}
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
                    <span className="inline-block text-xs font-semibold text-red-600 uppercase bg-indigo-100 px-2 py-1 rounded-full mb-2">
                      {scholarship.tag}
                    </span>
                  )}
                  
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 h-14">{scholarship.title}</h3>
                  
                  <p className="mt-2 text-sm text-gray-700 line-clamp-3 h-14 mb-2">{scholarship.description}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3">
                    <span className="text-sm text-gray-800 mb-3 sm:mb-0">
                      <span className="font-medium">Deadline:</span> {scholarship.deadline}
                    </span>
                    
                    <button
                      className="bg-red-800 hover:bg-red-900 text-white py-2 px-4 rounded-xl text-sm w-full sm:w-auto text-center transition-colors duration-200"
                      onClick={() => navigate(`/scholarship/${scholarship.id}`)}
                    >
                      View Detail
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