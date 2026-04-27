import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../Context/DataContext';
import ResearchSection from './ResearchSection';

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
  const { globalData, isLoading } = useData();
  const [researchData, setResearchData] = useState(null);

  useEffect(() => {
    if (section) {
      setResearchData(section);
    }
  }, [section]);

  const renderResearchContent = () => {
    if (!section?.page?.p_alias) {
      return (
        <div className="text-center py-8 text-gray-600">
          Research section not available for this page type.
        </div>
      );
    }

    if (section.page.p_alias === '/research' || section.page.p_alias === "/km/research") {
      return <ResearchSection section={section} />;
    }

    return (
      <div className="text-center py-8 text-gray-600">
        No specific research content available for this page.
      </div>
    );
  };

  if (isLoading) return null;

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