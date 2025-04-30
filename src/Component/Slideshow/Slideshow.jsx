import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { MdExplore } from "react-icons/md";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";
import axios from 'axios';
// import { useTranslation } from "react-i18next";


const Slideshow = ({key, section, menuLang}) => {
    // const { t } = useTranslation();

    const [slides, setSlides] = useState([]);

    useEffect(() => {
        if (section?.sec_id) {
            axios.get(`${API_ENDPOINTS.getSlideshow}`)
                .then(res => {
                    const data = res.data?.data || [];
                    const formatted = data
                        .filter(slide =>
                            slide.display === 1 &&
                            slide.active === 1 &&
                            slide.slider_sec?.sec_id === section.sec_id
                        )
                        .map(slide => ({
                            image: `${API}/storage/uploads/${slide.img?.img}`,
                            title: slide.slider_title,
                            description: slide.slider_text,
                            buttonText1: slide.btn1?.bss_title || '',
                            buttonLink1: slide.btn1?.bss_routepage || '#',
                            buttonText2: slide.btn2?.bss_title || '',
                            buttonLink2: slide.btn2?.bss_routepage || '#',
                            buttonColor: 'bg-red-900',
                            linkIcon: <BsFillInfoCircleFill className="ml-2 text-white" />,
                            logo: `${API}/storage/uploads/${slide.logo?.img}`
                        }));
                    setSlides(formatted);
                })
                .catch(err => console.error("Failed to fetch slideshow:", err));
        }
    }, [section, menuLang]);

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
            className="xl:text-5xl text-4xl font-bold leading-tight mb-6 max-w-2xl"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            >
            {slides[currentSlide].title}
            </motion.h1>

            <motion.p
            className="xl:text-lg text-[12px] text-gray-100 mb-8 max-w-lg"
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
                className={`${slides[currentSlide].buttonColor} text-white px-8 py-2 xl:text-md text-[12px] xl:text-lg rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg flex items-center justify-center`}
            >
                {slides[currentSlide].buttonText1}
                {slides[currentSlide].linkIcon}
            </Link>

            {/* Explore Program Button */}
            <Link
                to={slides[currentSlide].buttonLink2}
                className={`border text-white px-8 py-2 xl:text-md text-[12px] xl:text-lg rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg flex items-center justify-center`}
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