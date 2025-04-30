import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios'; // Import axios to make the API call
import { API_ENDPOINTS } from '../../Service/APIconfig'; // Import the API endpoint

const ResearchOverview = () => {
  const [overviewContent, setOverviewContent] = useState({
    title: 'About The Project',
    description: 'Loading description...',
  });

  // Fetching data on component mount
  useEffect(() => {
    const fetchOverviewContent = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.getRsdDescription);
        const data = response.data?.data || [];

        // Assuming you want to get the first entry
        const description = data.find(item => item.rsdd_rsdtile === 1); // You can modify this as needed

        if (description && description.rsdd_details) {
          setOverviewContent({
            title: 'About The Project', // Static title
            description: description.rsdd_details, // Description fetched from API
          });
        } else {
          setOverviewContent({
            title: 'About The Project',
            description: 'No description available',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setOverviewContent({
          title: 'About The Project',
          description: 'Failed to load description. Please try again later.',
        });
      }
    };

    fetchOverviewContent();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className="my-16 py-4">
      <div className="container mx-auto px-4">
        <div className="space-y-4 flex flex-col xl:flex-row gap-10">
          <div className="w-full mx-auto">
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="xl:text-3xl w-full text-2xl font-extrabold text-gray-900"
            >
              {overviewContent.title}
            </motion.h2>
          </div>
          <div className="w-full mx-auto">
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-sm w-full xl:text-lg text-gray-800"
              dangerouslySetInnerHTML={{
                __html: overviewContent.description, // This allows HTML content in the description
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchOverview;
