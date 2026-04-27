import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { MdExplore } from "react-icons/md";
import { API } from "../../Service/APIconfig";

import { useData } from "../../Context/DataContext";

const Slideshow = ({section, menuLang}) => {
    const { globalData } = useData();
    const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        const getAlias = (routePage) => {
            if (!globalData?.pages) return null;
            const matched = globalData.pages.find((p) => p.p_title === routePage);
            return matched?.p_alias || null;
        };

        if (section?.sec_id && globalData?.slideshow) {
            const filtered = globalData.slideshow.filter(slide =>
                slide.display === 1 &&
                slide.active === 1 &&
                slide.slider_sec?.sec_id === section.sec_id
            );

            const resolvedSlides = filtered.map((slide) => {
                const link1 = getAlias(slide.btn1?.bss_routepage);
                const link2 = getAlias(slide.btn2?.bss_routepage);
                
                let path1 = link1 || '#';
                let path2 = link2 || '#';

                // Handle language prefix for local links
                if (path1 !== '#' && currentLang === 2 && !path1.startsWith('/km')) path1 = `/km/${path1.replace(/^\//, '')}`;
                if (path2 !== '#' && currentLang === 2 && !path2.startsWith('/km')) path2 = `/km/${path2.replace(/^\//, '')}`;

                return {
                    image: `${API}/storage/uploads/${slide.img?.img}`,
                    title: slide.slider_title,
                    description: slide.slider_text,
                    buttonText1: slide.btn1?.bss_title || '',
                    buttonLink1: path1,
                    buttonText2: slide.btn2?.bss_title || '',
                    buttonLink2: path2,
                    buttonColor: 'bg-red-900',
                    linkIcon: <BsFillInfoCircleFill className="ml-2 text-white" />,
                    logo: `${API}/storage/uploads/${slide.logo?.img}`
                };
            });

            setSlides(resolvedSlides);
        }
    }, [section, globalData?.slideshow, globalData?.pages, currentLang]);


    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto slide every 5 seconds
    useEffect(() => {
        if (isPaused) return;
        if (slides.length === 0) return;

        const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [isPaused, slides.length]);

    // Resume auto-slide after 10 seconds
    const resumeAutoSlide = () => {
        setTimeout(() => setIsPaused(false), 10000);
    };

    // Handle previous slide
    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
        setIsPaused(true);
        resumeAutoSlide();
    };

    // Handle next slide
    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsPaused(true);
        resumeAutoSlide();
    };

    // Handle dot click
    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsPaused(true);
        resumeAutoSlide();
    };

    if (slides.length === 0) return null;

    return (
        <div className="relative h-[600px] text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
            <motion.img
            src={slides[currentSlide].image}
            alt="Background"
            className="object-cover object-center w-full h-full"
            key={currentSlide}
            whileInView={{ opacity: 1, x: 0 }}
            />
            <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6">
            <motion.img
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            src={slides[currentSlide]?.logo}
            alt="Logo"
            className="w-24 h-24"
            />
            <motion.h1
            className={`lg:text-5xl text-4xl font-bold leading-tight mb-6 max-w-2xl ${
                currentLang === 2 ? "font-khmer" : "font-sans"
              }`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            >
            {slides[currentSlide].title}
            </motion.h1>

            <motion.p
            className={`l:text-lg text-[12px] text-gray-100 mb-8 max-w-lg ${
                currentLang === 2 ? "fonts-khmer" : "font-sans"
              }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            >
            {slides[currentSlide].description}
            </motion.p>

            {/* Button Group */}
            <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
            >
            {/* About Button */}
            <Link
                to={slides[currentSlide].buttonLink1}
                className={`${slides[currentSlide].buttonColor} text-white px-8 py-2 lg:text-md text-[12px] xl:text-lg rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg flex items-center justify-center ${
                    currentLang === 2 ? "fonts-khmer" : "font-sans"
                  }`}
            >
                {slides[currentSlide].buttonText1}
                {slides[currentSlide].linkIcon}
            </Link>

            {/* Explore Program Button */}
            <Link
                to={slides[currentSlide].buttonLink2}
                className={`${
                    currentLang === 2 ? "fonts-khmer" : "font-sans"
                  } border text-white px-8 py-2 xl:text-md text-[12px] xl:text-lg rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg flex items-center justify-center`}
            >
                {slides[currentSlide].buttonText2}
                <MdExplore className="ml-2 items-center" />
            </Link>
            </motion.div>
        </div>

        {/* Navigation Arrows */}
        <button onClick={goToPrevious} className="absolute z-20 left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white xl:p-3 p-1 rounded-full hover:bg-opacity-75 cursor-pointer">
            <MdKeyboardArrowLeft />
        </button>
        <button onClick={goToNext} className="absolute z-20 right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white xl:p-3 p-1 rounded-full hover:bg-opacity-75 cursor-pointer">
            <MdKeyboardArrowRight />
        </button>

        {/* Navigation Dots */}
        <div className="absolute z-20 bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
            <button key={index} onClick={() => goToSlide(index)} className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-white scale-125" : "bg-gray-500"}`} aria-label={`Go to slide ${index + 1}`}></button>
            ))}
        </div>
        </div>
    );
};

export default Slideshow