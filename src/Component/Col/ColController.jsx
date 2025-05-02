import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS } from '../../Service/APIconfig';
import OneCol from './OneCol';
import TwoCol from './TwoCol';
import FourCol from './FourCol';

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, when: 'beforeChildren', staggerChildren: 0.2 },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const DATA_ENDPOINTS = {
  Partner: `${API_ENDPOINTS.getPartnership}?section_id=`,
  Research: `${API_ENDPOINTS.getResearch}?section_id=`,
  Faculty: `${API_ENDPOINTS.getFaculty}?section_id=`,
  Scholarship: `${API_ENDPOINTS.getScholarship}?section_id=`,
  Lab: `${API_ENDPOINTS.getLab}?section_id=`,
  Announcement: `${API_ENDPOINTS.getAnnouncement}?section_id=`,
  Career: `${API_ENDPOINTS.getCareer}?section_id=`,
  Event: `${API_ENDPOINTS.getEvent}?section_id=`,
  New: `${API_ENDPOINTS.getNews}?section_id=`,
};

const ColController = ({ sections = [] }) => {
  const [sectionsData, setSectionsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllSections = async () => {
      try {
        const headerRes = await axios.get(API_ENDPOINTS.getHeaderSection);
        const headers = headerRes.data?.data || [];

        const results = await Promise.all(
          sections.map(async (section) => {
            const header = headers.find(h => h.hsec_sec === section.sec_id) || {};
            const hsecAmount = header.hsec_amount ?? 4;

            const endpoint = DATA_ENDPOINTS[section.sec_type] || `${API_ENDPOINTS.getHeaderSection}?section_id=`;
            const res = await axios.get(`${endpoint}${section.sec_id}`);
            const rawData = res.data?.data?.sections || res.data?.data || [];

            const items = Array.isArray(rawData)
              ? rawData
              : rawData.sections
              ? rawData.sections
              : [rawData];

            const transformedData = items.map(item => ({
              id: item.id || item.e_id || item.sec_id || Math.random().toString(),
              image: item.image || item.e_img || item.img || null,
              title: item.title || item.e_title || item.hsec_title || 'Untitled',
              description: item.description || item.e_shorttitle || item.subtitle || 'No description',
              tag: item.tag || item.e_tags || item.category || null,
              buttons: item.buttons || [],
              exploreText: 'Explore more',
            }));

            return {
              id: section.sec_id,
              sec_type: section.sec_type,
              headerData: {
                hsec_title: header.hsec_title || section.sec_type || 'Section',
                hsec_subtitle: header.hsec_subtitle || '',
                hsec_amount: hsecAmount,
              },
              data: transformedData.slice(0, hsecAmount),
            };
          })
        );

        setSectionsData(results);
      } catch (err) {
        console.error('ColController: Failed to fetch sections', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSections();
  }, [sections]);

  const renderSection = (sectionData) => {
    const { headerData, data, sec_type } = sectionData;
    const amount = headerData.hsec_amount || 4;
    const props = { researchData: data, headerData, baseRoute: sec_type.toLowerCase() };

    if (amount === 1) return <OneCol key={sectionData.id} {...props} />;
    if (amount === 2) return <TwoCol key={sectionData.id} {...props} />;
    return <FourCol key={sectionData.id} {...props} />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-16"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {sectionsData.map(sectionData => (
        <motion.div key={sectionData.id} variants={contentVariants}>
          {renderSection(sectionData)}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ColController;
