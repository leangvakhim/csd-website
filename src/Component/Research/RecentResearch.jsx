import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdExplore, MdComputer } from 'react-icons/md';
import { AiOutlineRobot } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';

const RecentResearch = () => {
  const navigate = useNavigate();
  const [researchData, setResearchData] = useState([]);
  const [headerData, setHeaderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const researchResponse = await axios.get(API_ENDPOINTS.getResearchlab);
        const researchData = researchResponse.data?.data || [];

        // Filter for recent data (within the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const formattedResearchData = researchData
          .filter((item) => {
            // Ensure item is active and displayed
            if (item.display !== 1 || item.active !== 1) return false;
            if (item.lang !== currentLang) return false;
            // Check if the item is recent based on created_at or published_date
            const itemDate = item.created_at
              ? new Date(item.created_at)
              : item.published_date
              ? new Date(item.published_date)
              : null;

            // If no date is available, fallback to including all active/displayed items
            return itemDate ? itemDate >= thirtyDaysAgo : true;
          })
          .map((item) => ({
            id: item.rsdl_id,
            title: item.rsdl_title || 'Untitled Research',
          
            image: item.img?.img
              ? `${API}/storage/uploads/${item.img?.img}`
              : '/placeholder-image.jpg',
            lead: item.rsdl_lead || 'Unknown Lead',
          }))
          // Sort by date (most recent first) or rsdl_id if no date is available
          .sort((a, b) => {
            const dateA = a.created_at || a.published_date || 0;
            const dateB = b.created_at || b.published_date || 0;
            return dateB - dateA || b.id - a.id; // Fallback to rsdl_id if dates are equal or missing
          })
          // Limit to the top 5 recent items
          .slice(0, 5);

        setResearchData(formattedResearchData);

        const headerResponse = await axios.get(API_ENDPOINTS.getHeaderSection);
        const header = headerResponse.data?.data || {};

        if (header.display === 1 && header.active === 1) {
          setHeaderData({
            title: header.title || ' Recent Research Projects & Publications',
            subtitle: header.subtitle || 'Explore the latest advancements in computer science research',
          });
        } else {
          setHeaderData({
            title: 'Recent Research Projects & Publications',
            subtitle: 'Explore the latest advancements in computer science research',
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Navigation for carousel
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? researchData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === researchData.length - 1 ? 0 : prev + 1));
  };

  // Buttons for display
  const buttons = [
    { icon: <MdComputer className="mr-1 text-xs sm:text-sm" />, label: 'Computational Advancements' },
    { icon: <AiOutlineRobot className="mr-1 text-xs sm:text-sm" />, label: 'AI & Systems Optimization' },
  ];

  if (loading) {
    return (
      <div className="my-16 text-center text-gray-600">
        Loading research data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-16 text-center text-gray-600">
        {error}
      </div>
    );
  }

  if (researchData.length === 0) {
    return (
      <div className="my-16 text-center text-gray-600">
        No recent research found.
      </div>
    );
  }

  return (
    <div className="my-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-6 sm:mb-0">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-2">{headerData?.title}</h2>
          
          </div>
          <div className="flex gap-3 sm:gap-4 items-center">
            <button
              onClick={handlePrev}
              className="p-2 bg-pink-100 text-red-900 rounded-full hover:bg-gray-300"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={handleNext}
              className="p-2 bg-pink-100 text-red-900 rounded-full hover:bg-gray-300"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Research Sections */}
        <div className="overflow-x-auto mt-4 scrollbar-hide">
          <div className="flex space-x-8">
            {researchData.map((section, index) => (
              <div
                key={section.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden relative group flex-shrink-0 sm:w-96 w-70 transition-transform duration-300 ${
                  index === currentIndex ? 'scale-100' : 'scale-95 opacity-80'
                }`}
              >
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                  <div className="flex flex-col justify-center items-end py-4">
                    {buttons.map((button, buttonIndex) => (
                      <button
                        key={buttonIndex}
                        className="text-black xl:text-[12px] text-[10px] bg-gray-300/50 py-2 px-4 shadow-md rounded-4xl flex items-center mb-2"
                      >
                        {button.icon}
                        {button.label}
                      </button>
                    ))}
                  </div>
                  <div>
                    <h3 className="xl:text-xl text-lg font-semibold mb-2 line-clamp-2">
                      {section.title}
                    </h3>
                    <p className="mb-4 xl:text-[16px] text-[12px] line-clamp-3">
                      {section.description}
                    </p>
                    <button
                      onClick={() => navigate(`/researchlab/${section.id}`)}
                      className="bg-red-900 hover:bg-red-800 xl:text-[14px] text-[12px] text-white py-2 px-6 rounded-4xl flex items-center"
                    >
                      <MdExplore className="mr-2" />
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentResearch;