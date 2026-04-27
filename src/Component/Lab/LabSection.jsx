import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import { MdExplore } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../Context/DataContext';
import { API } from '../../Service/APIconfig';

const LabSection = ({section, researchlabDetailPage}) => {
    const navigate = useNavigate();
    const { globalData, isLoading } = useData();
    const [researchData, setResearchData] = useState([]);
    const [headerData, setHeaderData] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;
    const [tags, setTags] = useState([]);

    useEffect(() => {
        if (globalData && section && section.sec_id) {
            // 1. Process Research Data
            const researchDataList = globalData.researchlab || [];
            const formattedResearchData = researchDataList
                .filter((item) =>
                    item.display === 1 &&
                    item.active === 1 &&
                    item.lang === currentLang
                )
                .sort((a, b) => b.rsdl_order - a.rsdl_order)
                .map((item) => ({
                    id: item.rsdl_id,
                    ref_id: item.ref_id,
                    title: item.rsdl_title || 'Untitled Research',
                    description: item.rsdl_detail || 'No description available',
                    image: item.img?.img
                    ? `${API}/storage/uploads/${item.img?.img}`
                    : '/placeholder-image.jpg',
                }));

            // 2. Process Header Data
            const headerList = globalData.headers || [];
            const matchedHeader = headerList.find(
                (item) =>
                item.hsec_sec === section.sec_id &&
                item.section?.sec_type === "Lab" &&
                item.section?.display === 1 &&
                item.section?.active === 1
            );

            if (matchedHeader) {
                const pages = globalData.pages || [];
                const matchedPage = pages.find((page) => page.p_title === matchedHeader.hsec_routepage);
                
                setHeaderData({
                    title: matchedHeader.hsec_title || '',
                    subtitle: matchedHeader.hsec_subtitle || '',
                    routepage: matchedPage?.p_alias || "",
                    btntitle: matchedHeader.hsec_btntitle || '',
                    amount: matchedHeader.hsec_amount || '',
                });
            }

            setResearchData(formattedResearchData);
        }
    }, [currentLang, section, globalData]);

    useEffect(() => {
        if (globalData?.researchlabTags && researchData.length > 0) {
            const allTags = globalData.researchlabTags || [];
            const rsdlId = researchData[currentIndex]?.id;
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
        }
    }, [globalData?.researchlabTags, researchData, currentIndex]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? researchData.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === researchData.length - 1 ? 0 : prev + 1));
    };

    if (isLoading) return null;

    if (researchData.length === 0) return null;

    const getDetailPath = (alias, refId) => {
        const prefix = window.location.pathname.startsWith('/km') ? '/km' : '';
        if (!alias) return '#';
        const path = alias.startsWith('/') ? alias : `/${alias}`;
        const fullPath = (prefix && path.startsWith(prefix)) ? path : `${prefix}${path}`;
        return `${fullPath}/${refId}`;
    };

    return (
        <div className="my-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col xl:flex-row justify-between items-center mb-6 sm:mb-8">
            <div className="mb-4 sm:mb-6 xl:mb-0">
                <div className='flex justify-between'>
                <h2 className={`text-2xl sm:text-3xl font-semibold mb-2 ${currentLang === 2 ? 'font-khmer' : 'font-semibold'}`}>
                    {headerData?.title || 'Students Research'}
                </h2>
                <div className='block xl:hidden'>
                    {headerData?.btntitle ? (
                    <button
                        onClick={() => navigate(headerData.routepage)}
                        className={`flex text-red-800 hover:text-red-900 items-center border-b border-red-800 pb-1 mr-8`}
                        >
                        <span className={`mr-2 lg:text-sm text-[12px] ${currentLang === 2 ? "fonts-khmer" : "font-sans"
                            }`}>{headerData.btntitle}</span>
                        <FaArrowRight className="text-red-800" />
                    </button>
                    ) : (
                    <div className=" flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto">
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
                    )}
                </div>
                </div>
                <p className={`text-gray-600 mt-4 sm:mt-6 text-sm sm:text-base max-w-2xl ${currentLang === 2 ? 'fonts-khmer' : 'font-sans-serif'}`}>
                {headerData?.subtitle ||
                    'A Deep Dive into Computer Science Research: From Fundamentals to Future Innovations'}
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center lg:mt-0 ">
                {headerData?.btntitle ? (
                <button
                    onClick={() => navigate(headerData.routepage)}
                    className={`flex text-red-800 hover:text-red-900 items-center border-b border-red-800 pb-1 mr-8`}
                    >
                    <span className={`hidden xl:block mr-2 lg:text-sm text-[12px] ${currentLang === 2 ? "fonts-khmer" : "font-sans"
                        }`}>{headerData.btntitle}</span>
                    <FaArrowRight className="text-red-800 hidden xl:block" />
                </button>
                ) : (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto">
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
                )}
            </div>
            </div>

            {/* Research Sections */}
            <div className="overflow-x-auto mt-4 scrollbar-hide">
            <div className="flex space-x-8">
                {researchData.map((sectionItem, index) => (
                <div
                    key={sectionItem.ref_id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden relative group flex-shrink-0 sm:w-96 w-70 transition-transform duration-300 ${
                    index === currentIndex ? 'scale-100' : 'scale-95 opacity-80'
                    }`}
                >
                    <img
                    src={sectionItem.image}
                    alt={sectionItem.title}
                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.jpg';
                    }}
                    />
                    <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    <div className="flex flex-col justify-center items-end py-4">
                        {tags.map((tag, tagIndex) => (
                        <button
                            key={tagIndex}
                            className="text-black xl:text-[12px] text-[10px] bg-gray-300/50 py-2 px-4 shadow-md rounded-4xl flex items-center mb-2"
                        >
                            <img
                                src={tag.image}
                                alt={tag.title}
                                className="w-4 h-4 mr-2 object-contain"
                                onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder-image.jpg';
                                }}
                            />
                            <span className={`${currentLang === 2 ? 'fonts-khmer' : 'font-sans-serif'} text-[10px] md:text-sm`}>
                            {tag.title}
                            </span>
                        </button>
                        ))}
                    </div>
                    <div>
                        <h3 className={`xl:text-xl text-lg font-semibold mb-2 line-clamp-1  ${currentLang === 2 ? 'fonts-khmer leading-8' : 'font-sans-serif'}`}>
                        {sectionItem.title}
                        </h3>

                        <button
                        onClick={() => {
                            navigate(getDetailPath(researchlabDetailPage?.p_alias, sectionItem.ref_id));
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
}

export default LabSection;