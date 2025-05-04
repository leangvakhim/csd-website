import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS } from '../../Service/APIconfig';
import ResearchInnovations from './ResearcInnovation';
import ResearchSection from './ResearchSection';
import ColController from '../Col/FourCol';

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: 'beforeChildren',
      staggerChildren: 0.2,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ResearchController = ({ section }) => {
  const [researchData, setResearchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResearchData = async () => {
      if (!section?.sec_id) {
        setError('Invalid section data');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_ENDPOINTS.getPage}?section_id=${section.sec_id}`);
        const fetchedSections = res.data?.data?.sections || [];

        const matchedSection = fetchedSections.find(sec => sec.page?.p_alias === section.page?.p_alias);
        setResearchData(matchedSection || section);
      } catch (err) {
        console.error('ResearchController: Failed to fetch data', err);
        setError('Failed to load research data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResearchData();
  }, [section]);

  const renderResearchContent = () => {
    if (!section?.page?.p_alias) {
      return (
        <div className="text-center py-8 text-gray-600">
          Research section not available for this page type.
        </div>
      );
    }

    // Render based on page alias
    if (section.page.p_alias === '/home' || section.page.p_alias === "/km/home") {
      return <ResearchInnovations section={researchData} />;
    }
    if (section.page.p_alias === '/research' || section.page.p_alias === "/km/research") {
      return <ResearchSection section={researchData} />;
    }

    // Fallback for other page types
    return (
      <div className="text-center py-8 text-gray-600">
        No specific research content available for this page.
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (!researchData) {
    return (
      <div className="text-center py-8 text-gray-600">
        No research data to display.
      </div>
    );
  }

  return (
    <motion.section
      className="container mx-auto px-4 my-16"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div variants={contentVariants} transition={{ duration: 0.6 }}>
        {renderResearchContent()}
      </motion.div>
    </motion.section>
  );
};

export default ResearchController;