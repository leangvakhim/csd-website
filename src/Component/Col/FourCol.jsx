// FourCol.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { MdExplore } from 'react-icons/md';

const FourCol = ({ researchData, headerData }) => {
  const navigate = useNavigate();
  const DEFAULT_IMAGE = '/placeholder-image.jpg';

  // Ensure researchData is an array and has at least one item
  if (!Array.isArray(researchData) || researchData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No research data available.
      </div>
    );
  }

  return (
    <div className="my-8 sm:my-12 lg:my-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row justify-between items-center mb-6 sm:mb-8"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3 sm:mb-4">
              {headerData?.hsec_title || 'Research'}
            </h1>
            {headerData?.hsec_subtitle && (
              <p className="text-xs sm:text-sm text-gray-500">
                {headerData.hsec_subtitle}
              </p>
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="w-full md:w-auto mt-4 md:mt-0"
          >
            <button
              onClick={() => navigate('/research')}
              className="flex text-red-800 hover:text-red-900 items-center border-b border-red-800 pb-1"
            >
              <span className="mr-2 xl:text-sm text-[12px]">View All</span>
              <MdExplore className="text-red-800" />
            </button>
          </motion.div>
        </motion.div>

        {/* Research Cards Grid */}
        <div className="py-4">
          {researchData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {researchData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <Link
                    to={`/research/${item.id}`}
                    className="block group"
                    aria-label={item.title}
                  >
                    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                      <div className="w-full flex justify-center items-center mb-4">
                        <img
                          src={item.image || DEFAULT_IMAGE}
                          alt={item.title}
                          className="w-full h-[180px] sm:h-[200px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={e => (e.target.src = DEFAULT_IMAGE)}
                        />
                      </div>
                      <div className="flex-1 p-2 sm:p-3">
                        {item.tag && (
                          <span className="text-xs font-semibold text-red-600 uppercase bg-red-100 px-2 py-1 rounded-full">
                            {item.tag}
                          </span>
                        )}
                        <h5 className="text-base sm:text-lg lg:text-xl font-semibold mt-2 mb-3 sm:mb-4">
                          {item.title || 'Untitled Research'}
                        </h5>
                        <p className="text-xs sm:text-sm text-gray-700 line-clamp-3">
                          {item.description || 'No description available'}
                        </p>
                        <motion.button
                          onClick={() => navigate(`/research/${item.id}`)}
                          className="text-xs sm:text-sm bg-red-900 hover:bg-red-800 text-white py-1 sm:py-2 px-3 sm:px-4 rounded-2xl flex items-center font-normal mt-4"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.8, delay: 0.8 }}
                          viewport={{ once: true, amount: 0.3 }}
                        >
                          <MdExplore className="mr-1" />
                          Explore
                        </motion.button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No research items found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FourCol;