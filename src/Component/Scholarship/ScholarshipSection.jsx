import React, { useState, useEffect } from 'react';
import FourColScholarshipSection from './FourColScholarshipSection';
import OverFlowScholarshipSection from './OverFlowScholarshipSection';
import axios from 'axios';
import { API_ENDPOINTS } from '../../Service/APIconfig';

const ScholarshipSection = ({ section }) => {
  const [sectionData, setSectionData] = useState(null);

  useEffect(() => {
    const fetchHeaderSection = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.getHeaderSection);  
        const data = response.data.data;

        // Filter data by sec_page
        const filteredData = data.find(item => item.section?.sec_page === section.sec_page);

        if (filteredData) {
          setSectionData(filteredData);
        }
      } catch (err) {
        console.error("Error fetching header section:", err);
      }
    };

    fetchHeaderSection();
  }, [section.sec_page]); // Dependency to re-run if section prop changes

  if (!sectionData) {
    return <div>Loading...</div>;
  }

  const { hsec_amount } = sectionData;

  return (
    <div>
      {hsec_amount === 4 && <FourColScholarshipSection />}
      {( hsec_amount === 5) && (
        <OverFlowScholarshipSection  />
      )}
    </div>
  );
};

export default ScholarshipSection;
