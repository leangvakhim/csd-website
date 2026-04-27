import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../Context/DataContext';
import { API } from '../../Service/APIconfig';
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


const ColController = ({ sections = [] }) => {
  const { globalData } = useData();
  const [sectionsData, setSectionsData] = useState([]);

  useEffect(() => {
    if (!globalData?.headers) return;

    const results = sections.map((section) => {
      const header = globalData.headers.find(h => h.hsec_sec === section.sec_id) || {};
      const hsecAmount = header.hsec_amount ?? 4;

      let rawData = [];
      const secType = section.sec_type;

      if (secType === 'Partner') rawData = globalData.partners || [];
      else if (secType === 'Research') rawData = globalData.research || [];
      else if (secType === 'Faculty') rawData = globalData.faculty || [];
      else if (secType === 'Scholarship') rawData = globalData.scholarships || [];
      else if (secType === 'Lab') rawData = globalData.labs || [];
      else if (secType === 'Announcement') rawData = globalData.announcements || [];
      else if (secType === 'Career') rawData = globalData.careers || [];
      else if (secType === 'Event') rawData = globalData.events || [];
      else if (secType === 'New') rawData = globalData.news || [];

      const items = Array.isArray(rawData) ? rawData : [];

      const transformedData = items.map(item => ({
        id: item.id || item.e_id || item.f_id || item.ref_id || item.sec_id || Math.random().toString(),
        image: (() => {
          const rawImg = item.image || item.e_img || item.img || item.p_img || item.f_img || item.logo;
          if (!rawImg) return null;
          if (typeof rawImg === 'string') return rawImg.startsWith('http') ? rawImg : `${API}/storage/uploads/${rawImg}`;
          if (rawImg.img) return `${API}/storage/uploads/${rawImg.img}`;
          return null;
        })(),
        title: item.title || item.e_title || item.f_name || item.hsec_title || 'Untitled',
        description: item.description || item.e_shorttitle || item.f_position || item.subtitle || 'No description',
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
    });

    setSectionsData(results);
  }, [sections, globalData]);


  const renderSection = (sectionData) => {
    const { headerData, data, sec_type } = sectionData;
    const amount = headerData.hsec_amount || 4;
    const props = { researchData: data, headerData, baseRoute: sec_type.toLowerCase() };

    if (amount === 1) return <OneCol key={sectionData.id} {...props} />;
    if (amount === 2) return <TwoCol key={sectionData.id} {...props} />;
    return <FourCol key={sectionData.id} {...props} />;
  };

  if (!sectionsData || sectionsData.length === 0) {
    return null;
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
