import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import CopyRight from './CopyRight';
import HeaderFooter from './HeaderFooter';

const Footer = () => {
    const location = useLocation();
    const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location]);

    return (
        <>
        <HeaderFooter/>
        <motion.footer className="bg-black text-white py-8">
            <div className="container mx-auto px-4 border-b mb-5 pb-20 border-gray-500/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Location Column with Motion */}
                    <motion.div>
                        <h3 className={`text-lg font-normal mb-4 pb-4 border-b border-gray-500/50 ${
                                currentLang === 2 ? "fonts-khmer" : "font-sans"
                            }`}>{currentLang === 1 ? "Our Location" : "ទីតាំងរបស់ពួកយើង"}</h3>
                        <div className='sm:h-full'>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1734.8315755259034!2d104.89042472626606!3d11.568792400061744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109519fe4077d69%3A0x20138e822e434660!2sRoyal%20University%20of%20Phnom%20Penh!5e0!3m2!1sen!2skh!4v1740962585390!5m2!1sen!2skh"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                title="RUPP Location"
                            ></iframe>
                        </div>
                    </motion.div>

                    {/* Pages Column with Motion */}
                    <motion.div>
                        <h3 className={`text-lg font-normal mb-4 pb-4 border-b border-gray-500/50 ${
                                currentLang === 2 ? "fonts-khmer" : "font-sans"
                            }`}>{currentLang === 1 ? "Our Pages" : "គេហទំព័ររបស់ពួកយើង"}</h3>
                        <ul className="xl:text-lg text-sm font-light text-gray-300">
                            {["/", "/research", "/program"].map((path, index) => (
                                <motion.li
                                    key={index}
                                    whileHover={{ x: 10 }}
                                    className={`mb-2 hover:text-red-900 ${
                                        currentLang === 2 ? "fonts-khmer" : "font-sans"
                                    }`}
                                >
                                    <Link
                                        to={currentLang === 2 ? `/km${path}` : path}
                                        className={`hover:text-red-900 ${location.pathname === path ? "text-red-900 font-semibold" : ""}`}
                                    >
                                        {currentLang === 1
                                            ? path === "/"
                                                ? "Home"
                                                : path === "/research"
                                                ? "Research"
                                                : path === "/program"
                                                ? "Programs"
                                                : path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)
                                            : path === "/"
                                            ? "ទំព័រដើម"
                                            : path === "/research"
                                            ? "ស្រាវជ្រាវ"
                                            : path === "/program"
                                            ? "កម្មវិធីសិក្សា"
                                            : path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Quick Links Column with Motion */}
                    <motion.div>
                        <h3 className={`text-lg font-normal mb-4 pb-4 border-b-2 border-gray-500/50 ${
                                currentLang === 2 ? "fonts-khmer" : "font-sans"
                            }`}>{currentLang === 1 ? "Quick Links" : "តំណរហ័ស"}</h3>
                        <ul className="xl:text-lg text-sm font-light text-gray-300">
                            {["/about", "/contact", "/news&events"].map((path, index) => (
                                <motion.li
                                    key={index}
                                    whileHover={{ x: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className={`mb-2 hover:text-red-900 ${
                                        currentLang === 2 ? "fonts-khmer" : "font-sans"
                                    }`}
                                >
                                    <Link
                                        to={currentLang === 2 ? `/km${path}` : path}
                                        className={`hover:text-red-900 ${location.pathname === path ? "text-red-900 font-semibold" : ""}`}
                                    >
                                        {currentLang === 1
                                            ? path === "/about"
                                                ? "About"
                                                : path === "/contact"
                                                ? "Contact"
                                                : "News & Events"
                                            : path === "/about"
                                            ? "អំពីដេប៉ាតឺម៉ង់"
                                            : path === "/contact"
                                            ? "ទំនាក់ទំនង"
                                            : "ព័ត៌មាន&ព្រឹត្តិការណ៍"}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
            <div>
                <CopyRight />
            </div>
        </motion.footer>
        </>
    );
};

export default Footer;