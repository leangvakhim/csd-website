import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaArrowRight,
  FaCalendarAlt,
} from 'react-icons/fa';
import { API } from "../../Service/APIconfig";

import { useLocation } from 'react-router-dom';
import { useData } from "../../Context/DataContext";

const ApplySection = ({ section, menuLang}) => {
  const { globalData } = useData();
  const location = useLocation();
  const [applyInfo, setApplyInfo] = useState(null);
  const [steps, setSteps] = useState([]);
  const [contactDetails, setContactDetails] = useState({ phone: '', email: '' });
  const [socialLinks, setSocialLinks] = useState([]);
  const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

  useEffect(() => {
    if (globalData?.applies) {
      const filtered = globalData.applies.find(item =>
        item.section?.sec_type === 'Apply' &&
        item.ha_sec === section?.sec_id
      );
      setApplyInfo(filtered);
    }

    if (globalData?.subApplies) {
      const filteredSteps = globalData.subApplies
        .filter(
          (item) =>
            item.ha?.ha_sec === section?.sec_id &&
            item.display === 1 &&
            item.active === 1
        )
        .sort((a, b) => a.sha_order - b.sha_order);
      setSteps(filteredSteps.map(item => item.sha_title));
    }

    if (globalData?.contacts) {
      const langId = window.location.pathname.includes('/km') ? 2 : 1;
      const data = globalData.contacts.find(c => c.con_lang === langId);
      if (data) {
        setContactDetails({
          phone: data.subcontact2?.scon_detail || '',
          email: data.subcontact3?.scon_detail || '',
        });
      }
    }

    if (globalData?.socialSettings) {
      const socialData = globalData.socialSettings || [];
      const filtered = Array.isArray(socialData)
          ? socialData.filter(item => item.active === 1 && item.display === 1)
          : [];
      const sorted = filtered.sort((a, b) => a.setsoc_order - b.setsoc_order);
      setSocialLinks(sorted);
    }
  }, [section?.sec_id, globalData?.applies, globalData?.subApplies, globalData?.contacts, globalData?.socialSettings]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const daySuffix = (d) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    const month = date.toLocaleString('default', { month: 'long' });
    return `${day}${daySuffix(day)} ${month}`;
  };

  return (
    <div className="my-16">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-col lg:flex-row gap-8 w-full justify-between items-stretch"
        >
          {/* Column 1: Steps and Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
            className="w-full lg:w-5/12 flex flex-col justify-center"
          >
            {applyInfo && (
              <h2 className={`text-3xl lg:text-4xl mb-8 text-gray-900 ${menuLang === 2 ? "font-khmer leading-tight" : "font-bold"}`}>
                {applyInfo.ha_title}
              </h2>
            )}
            <ul className="list-none space-y-4">
              {steps.map((step, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <div className="p-5 lg:p-6 border border-gray-200 shadow-sm rounded-2xl flex items-center justify-between bg-white hover:shadow-md transition-shadow">
                    <span className={`text-base lg:text-lg text-gray-800 ${menuLang === 2 ? "fonts-khmer text-[18px]" : "font-medium"}`}>
                      {step}
                    </span>
                    <FaArrowRight className="text-red-800 ml-4 flex-shrink-0" />
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 2: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, amount: 0.2 }}
            className="w-full lg:w-4/12 flex flex-col items-center justify-center h-[350px] lg:h-auto"
          >
             {applyInfo?.image?.img ? (
                <img 
                  src={`${API}/storage/uploads/${applyInfo.image.img}`} 
                  alt="Admission Image" 
                  className="rounded-3xl w-full h-full object-cover shadow-lg" 
                />
             ) : (
                <div className="rounded-3xl w-full h-full bg-gray-200 flex items-center justify-center shadow-lg">
                   <span className="text-gray-400">Image not found</span>
                </div>
             )}
          </motion.div>

          {/* Column 3: Contact Info & Semester */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="w-full lg:w-3/12 flex flex-col gap-6 justify-center"
          >
            {/* Semester Box */}
            {applyInfo && (
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center">
                <h2 className={`text-xl text-gray-900 mb-2 ${menuLang === 2 ? "font-khmer" : "font-bold"}`}>
                  {applyInfo.ha_tagtitle}
                </h2>
                <p className={`text-gray-600 mb-5 ${menuLang === 2 ? "fonts-khmer text-[16px]" : "font-medium"} `}>
                  {applyInfo.ha_subtitletag}
                </p>
                <div className="bg-red-50 text-red-800 px-5 py-2.5 rounded-full flex items-center gap-3 w-full justify-center shadow-sm border border-red-100">
                  <FaCalendarAlt className="text-lg flex-shrink-0" />
                  <span className={`text-lg lg:text-xl font-semibold whitespace-nowrap ${menuLang === 2 ? "fonts-khmer text-[18px]" : "font-sans"}`}>
                    {formatDate(applyInfo.ha_date)}
                  </span>
                </div>
              </div>
            )}

            {/* Contact Box */}
            <div className="p-6 bg-red-900 text-white shadow-xl rounded-3xl flex flex-col justify-center relative overflow-hidden">
              {/* Subtle background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
              
              <h2 className={`text-xl mb-6 text-center z-10 ${menuLang === 2 ? "font-khmer" : "font-bold"}`}>
                {currentLang === 1 ? "Contact Info" : "ព័ត៌មានទំនាក់ទំនង"}
              </h2>
              
              <div className="space-y-4 z-10">
                <div className="flex items-center bg-red-800/60 p-3 rounded-xl border border-red-800/50">
                  <div className="bg-white/10 p-2.5 rounded-full mr-4 flex-shrink-0">
                    <FaPhoneAlt className="text-white text-sm" />
                  </div>
                  <p className={`text-sm lg:text-base ${menuLang === 2 ? "fonts-khmer" : "font-medium tracking-wide"}`}>
                    {contactDetails.phone || "N/A"}
                  </p>
                </div>
                
                <div className="flex items-center bg-red-800/60 p-3 rounded-xl border border-red-800/50">
                  <div className="bg-white/10 p-2.5 rounded-full mr-4 flex-shrink-0">
                    <FaEnvelope className="text-white text-sm" />
                  </div>
                  <p className={`text-sm lg:text-base break-all ${menuLang === 2 ? "fonts-khmer" : "font-medium"}`}>
                    {contactDetails.email || "N/A"}
                  </p>
                </div>
              </div>

              {/* Socials */}
              {socialLinks.length > 0 && (
                <div className="mt-6 flex justify-center gap-3 z-10">
                  {socialLinks.map((link, index) => (
                    <a 
                      key={index} 
                      href={link.setsoc_link || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white p-2.5 rounded-full hover:bg-gray-100 hover:scale-110 transition-all duration-300 shadow-sm flex items-center justify-center group"
                    >
                      <img
                        src={`${API}/storage/uploads/${link.img?.img}`}
                        alt={link.setsoc_title}
                        className="w-5 h-5 object-contain opacity-80 group-hover:opacity-100"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}

export default ApplySection