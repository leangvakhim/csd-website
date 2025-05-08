import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdExplore, MdComputer } from 'react-icons/md';
import { AiOutlineRobot } from 'react-icons/ai';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';

const RecentResearch = () => {
  const navigate = useNavigate();
  const [researchData, setResearchData] = useState([]);
  const [headerData, setHeaderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
  const currentLang = location.pathname.startsWith('/km') ? 2 : 1;
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const researchResponse = await axios.get(API_ENDPOINTS.getResearchlab);
        const researchData = researchResponse.data?.data || [];

        const formattedResearchData = researchData
          .filter((item) => {
            if (item.display !== 1 || item.active !== 1) return false;
            if (item.lang !== currentLang) return false;

            const itemDate = item.created_at
              ? new Date(item.created_at)
              : item.published_date
              ? new Date(item.published_date)
              : null;

            return itemDate ? itemDate >= thirtyDaysAgo : true;
          })
          .map((item) => ({
            id: item.rsdl_id,
            ref_id: item.ref_id,
            title: item.rsdl_title || 'Untitled Research',
            description: item.rsdl_subtitle || 'No description available',
            image: item.img?.img
              ? `${API}/storage/uploads/${item.img?.img}`
              : '/placeholder-image.jpg',
            lead: item.rsdl_lead || 'Unknown Lead',
            created_at: new Date(item.created_at),
          }))
          .sort((a, b) => {
            const dateA = a.created_at || 0;
            const dateB = b.created_at || 0;
            return dateB - dateA || b.id - a.id;
          })

          setResearchData(formattedResearchData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [currentLang]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagRes = await axios.get(API_ENDPOINTS.getResearchlabTag);
        const allTags = tagRes.data?.data || [];

        const rsdlId = researchData[0]?.id;
        if (!rsdlId) return;

        const filteredTags = allTags
          .filter(tag => tag.rsdlt_rsdl === rsdlId && tag.active === 1)
          .map(tag => ({
            title: tag.rsdlt_title,
            image: tag.img?.img
              ? `${API}/storage/uploads/${tag.img.img}`
              : '/placeholder-image.jpg',
          }));

        setTags(filteredTags);
      } catch (err) {
        console.error('Failed to fetch research tags:', err);
      }
    };

    if (researchData.length > 0) {
      fetchTags();
    }
  }, [researchData]);

  // Navigation for carousel
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? researchData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === researchData.length - 1 ? 0 : prev + 1));
  };

  const buttons = tags;

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
          <div className="mb-4 sm:mb-0">
            <h2 className={`${currentLang === 2 ? 'font-khmer' : 'font-semibold'} text-2xl sm:text-3xl font-semibold mb-2`}>{currentLang === 1 ? "Student Research" : "កិច្ចការស្រាវជ្រាវរបស់និស្សិត"}</h2>

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
                key={section.ref_id}
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
                        <img
                          src={button.image}
                          alt={button.title}
                          className="w-4 h-4 mr-2 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                        <span className={`${currentLang === 2 ? 'fonts-khmer' : 'font-sans-serif'} text-[10px] md:text-sm`}>
                          {button.title}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div>
                    <h3 className={`xl:text-xl text-lg font-semibold mb-2 line-clamp-1  ${currentLang === 2 ? 'fonts-khmer leading-8' : 'font-sans-serif'}`}>
                      {section.title}
                    </h3>

                    <button
                      onClick={() => {
                        const prefix = window.location.pathname.startsWith('/km') ? '/km' : '';
                        navigate(`${prefix}/researchlab/${section.ref_id}`);
                      }}
                      className={`${currentLang === 2 ? 'fonts-khmer' : 'font-sans-serif'} bg-red-900 hover:bg-red-800 xl:text-[14px] text-[12px] text-white py-2 px-6 rounded-4xl flex items-center`}
                    >
                      <MdExplore className="mr-2" />
                       {currentLang === 1 ? "Explore" : "មើលបន្ថែម"}
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