import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { MdExplore } from 'react-icons/md';

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const TwoCol = ({ researchData = [], headerData = {}, baseRoute = '' }) => {
  const navigate = useNavigate();
  const DEFAULT_IMAGE = '/placeholder-image.jpg';

  if (!Array.isArray(researchData) || researchData.length === 0) {
    return null;
  }

  return (
    <div className="my-12 lg:my-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center mb-10"
        >
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {headerData?.hsec_title || 'Section'}
            </h2>
            {headerData?.hsec_subtitle && (
              <p className="text-lg text-gray-500 max-w-2xl">
                {headerData.hsec_subtitle}
              </p>
            )}
          </div>
          
          {baseRoute && (
            <motion.button
              onClick={() => navigate(`/${baseRoute}`)}
              className="mt-6 md:mt-0 flex items-center text-primary font-semibold hover:text-primary-dark group"
              whileHover={{ x: 5 }}
            >
              <span className="border-b-2 border-primary mr-2">View All</span>
              <MdExplore className="text-xl" />
            </motion.button>
          )}
        </motion.div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {researchData.map((item, index) => (
            <motion.div
              key={item.id || index}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col sm:flex-row h-full border border-gray-100">
                {/* Image Section */}
                <div className="w-full sm:w-2/5 relative overflow-hidden h-64 sm:h-auto">
                  <img
                    src={item.image || DEFAULT_IMAGE}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                  />
                  {item.tag && (
                    <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                      {item.tag}
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="w-full sm:w-3/5 p-6 lg:p-8 flex flex-col justify-center">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm lg:text-base line-clamp-3 mb-6 flex-grow">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    {baseRoute && (
                      <Link
                        to={`/${baseRoute}/${item.id}`}
                        className="flex items-center text-sm font-bold text-primary hover:gap-2 transition-all"
                      >
                        {item.exploreText || 'Explore more'}
                        <motion.span
                          className="ml-2"
                          initial={{ x: 0 }}
                          whileHover={{ x: 5 }}
                        >
                          →
                        </motion.span>
                      </Link>
                    )}
                    
                    {item.buttons && item.buttons.length > 0 && (
                      <div className="flex gap-2">
                        {item.buttons.slice(0, 1).map((btn, idx) => (
                          <a
                            key={idx}
                            href={btn.url}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {btn.text}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TwoCol;
