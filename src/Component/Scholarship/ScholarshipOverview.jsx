import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaListUl } from 'react-icons/fa';
import { useData } from '../../Context/DataContext';

const ScholarshipOverview = ({ scholarshipId }) => {
  const { globalData, isLoading } = useData();
  const [scholarshipDetails, setScholarshipDetails] = useState({
    title: '',
    deadline: '',
    subjects: '',
    description: '',
  });

  // Determine currentLang based on pathname
  const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

  useEffect(() => {
    if (globalData?.scholarship && scholarshipId) {
      const allScholarships = globalData.scholarship || [];
      const data = allScholarships.find(item =>
        item.ref_id === Number(scholarshipId) && item.lang === currentLang
      );

      if (data) {
        setScholarshipDetails({
          title: data?.sc_title || '',
          deadline: data?.sc_deadline
            ? new Date(data.sc_deadline).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })
            : 'N/A',
          subjects: data?.sc_subjects || '',
          description: data?.sc_shortdesc || '',
        });
      }
    }
  }, [scholarshipId, currentLang, globalData]);

  if (isLoading) return null;

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-start">
        {/* Left Side: Title and Details */}
        <div className="md:w-1/3 mb-8 md:mb-0">
          <h2 className={`text-xl font-semibold mb-6 ${currentLang === 2 ? 'font-khmer' : 'font-semibold'}`}>{scholarshipDetails.title}</h2>
          <div className="space-y-4">
            <div className="flex items-center bg-gray-100 p-4 rounded-lg">
              <FaCalendarAlt className="text-xl mr-3" />
              <div>
                <p className={`font-semibold ${currentLang === 2 ? 'fonts-khmer' : 'font-sans'}`}>{currentLang === 1 ? "Deadline" : "ថ្ងៃផុតកំណត់"}: {scholarshipDetails.deadline}</p>
              </div>
            </div>
            <div className="flex items-center bg-gray-100 p-4 rounded-lg">
              <FaListUl className="text-xl mr-3" />
              <div>
                <p className={`font-semibold ${currentLang === 2 ? 'fonts-khmer' : 'font-sans'}`}>{currentLang === 1 ? "Given Subjects" : "មុខវិជ្ចាដែលផ្ដល់ជូន"} {scholarshipDetails.subjects}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Description */}
        <div className="md:w-2/3 md:pl-8">
          <p className={`text-lg text-gray-700 ${currentLang === 2 ? 'fonts-khmer' : 'font-sans'}`}>{scholarshipDetails.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipOverview;