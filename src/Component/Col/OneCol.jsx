import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const OneCol = ({ researchData = [], headerData = {}, baseRoute = '' }) => {
  // Rename prop internally for clarity since this component handles any type of data
  const sectionData = researchData;
  
  // Handle case when no data is available
  if (!sectionData || sectionData.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">{headerData.hsec_title || 'Section'}</h2>
        <p className="text-gray-500">No content available.</p>
      </div>
    );
  }

  // Since this is a OneCol component, we'll focus on the first item in the array
  const item = sectionData[0];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-primary">{headerData.hsec_title || 'Section'}</h2>
        {headerData.hsec_subtitle && (
          <p className="text-lg text-gray-600 mt-2">{headerData.hsec_subtitle}</p>
        )}
      </div>

      {/* Main Content - Single Column Layout */}
      <motion.div
        className="max-w-4xl mx-auto"
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {item.image && (
            <div className="relative w-full h-96">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
              {item.tag && (
                <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
                  {item.tag}
                </span>
              )}
            </div>
          )}
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
            <p className="text-gray-700 mb-4">{item.description}</p>
            
            {/* Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              {item.buttons && item.buttons.map((button, idx) => (
                <a 
                  key={idx}
                  href={button.url || '#'} 
                  className="inline-block bg-secondary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-all"
                  target={button.external ? "_blank" : "_self"}
                  rel={button.external ? "noopener noreferrer" : ""}
                >
                  {button.text || 'Learn More'}
                </a>
              ))}
              
              {/* Default explore button linking to detail page */}
              {baseRoute && (
                <Link
                  to={`/${baseRoute}/${item.id}`}
                  className="inline-block border border-primary text-primary px-4 py-2 rounded hover:bg-primary hover:text-white transition-all"
                >
                  {item.exploreText || 'Explore more'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OneCol;