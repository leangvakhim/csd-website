import React, { useState, useEffect } from 'react';
import FourColScholarshipSection from './FourColScholarshipSection';
import OverFlowScholarshipSection from './OverFlowScholarshipSection';
import { API_ENDPOINTS, axiosInstance } from '../../Service/APIconfig';

const ScholarshipSection = ({ section }) => {
  const [sectionData, setSectionData] = useState(null);

  useEffect(() => {
    const fetchHeaderSection = async () => {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.getHeaderSection);
        const data = response.data.data || [];

        const matched = data.find(
          (item) =>
            item.hsec_sec === section.sec_id &&
            item.section?.sec_type === "Scholarship" &&
            item.section?.display === 1 &&
            item.section?.active === 1
        );

        if (matched) {
          setSectionData(matched);
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
      {hsec_amount === 4 && <FourColScholarshipSection sectionData={sectionData} />}
      {( hsec_amount === 5) && (
        <OverFlowScholarshipSection sectionData={sectionData} />
      )}
    </div>
  );
};

export default ScholarshipSection;
