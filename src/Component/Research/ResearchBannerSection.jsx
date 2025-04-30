import React from 'react';
import { motion } from 'framer-motion';
import { MdComputer } from 'react-icons/md';

const ResearchBannerSection = ({ researchData }) => {
  if (!researchData) {
    return (
      <div className="my-8 text-center text-gray-600">
        No research data available to display.
      </div>
    );
  }

  const bannerData = [researchData];
  const buttons = [
    {
      icon: <MdComputer className="mr-2" />,
      label: researchData.lead || 'Unknown Lead',
    },
  ];

  return (
    <div>
      <div>
        {bannerData.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
            className="h-full overflow-hidden relative group"
          >
            <div className="h-[400px] sm:h-[500px] lg:h-[600px]">
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </div>

            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="container mx-auto absolute inset-0 p-4 sm:p-6 flex flex-col justify-between text-white">
              <div className="flex flex-col justify-center items-end py-3 sm:py-4">
                {buttons.map((button, btnIndex) => (
                  <motion.button
                    key={btnIndex}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: btnIndex * 0.2 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="text-black text-[10px] sm:text-[12px] lg:text-[16px] bg-gray-400 py-1.5 sm:py-2 px-3 sm:px-4 shadow-md rounded-full flex items-center mb-2"
                  >
                    {button.icon}
                    <span className="truncate max-w-[150px] sm:max-w-[200px]">
                      {button.label}
                    </span>
                  </motion.button>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true, amount: 0.5 }}
                className="max-w-md sm:max-w-lg lg:max-w-xl *:mb-4 sm:*:mb-6"
              >
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2">
                  {section.title}
                </h3>
                <motion.p
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true, amount: 0.5 }}
                  className="text-[12px] sm:text-[14px] lg:text-[16px] text-gray-50 line-clamp-3 sm:line-clamp-4"
                >
                  {section.description}
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResearchBannerSection;