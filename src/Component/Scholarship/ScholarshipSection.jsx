import React, { useState, useEffect } from 'react';
import FourColScholarshipSection from './FourColScholarshipSection';
import OverFlowScholarshipSection from './OverFlowScholarshipSection';
import { useData } from '../../Context/DataContext';

const ScholarshipSection = ({ section, scholarshipDetailPage }) => {
  const { globalData, isLoading } = useData();
  const [sectionData, setSectionData] = useState(null);

  useEffect(() => {
    if (globalData?.headers) {
      const data = globalData.headers || [];

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
    }
  }, [section, globalData]);

  if (isLoading) return null;

  if (!sectionData) {
    return null;
  }

  const { hsec_amount } = sectionData;

  return (
    <div>
      {hsec_amount === 4 && <FourColScholarshipSection sectionData={sectionData} scholarshipDetailPage={scholarshipDetailPage}/>}
      {( hsec_amount === 5) && (
        <OverFlowScholarshipSection sectionData={sectionData} scholarshipDetailPage={scholarshipDetailPage}/>
      )}
    </div>
  );
};

export default ScholarshipSection;
