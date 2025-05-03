import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaArrowRight,
  FaCalendarAlt,
} from 'react-icons/fa';
import axios from 'axios';
import { API_ENDPOINTS, API } from "../../Service/APIconfig";
import { useLocation } from 'react-router-dom';

const ApplySection = ({key, section, menuLang}) => {
  const location = useLocation();
  const [applyInfo, setApplyInfo] = useState(null);
  const [steps, setSteps] = useState([]);
  const [contactDetails, setContactDetails] = useState({ phone: '', email: '' });
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    const fetchApplyInfo = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.getApply);
        const data = res.data?.data || [];

        const filtered = data.find(item =>
          item.section?.sec_type === 'Apply' &&
          item.ha_sec === section?.sec_id
        );

        setApplyInfo(filtered);
      } catch (err) {
        console.error('Failed to fetch Apply Info:', err);
      }
    };

    fetchApplyInfo();

    // Fetch steps from subha endpoint
    const fetchSteps = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.getSubApply);
        const subhaData = res.data?.data || [];

        const filteredSteps = subhaData
          .filter(
            (item) =>
              item.ha?.ha_sec === section?.sec_id &&
              item.display === 1 &&
              item.active === 1
          )
          .sort((a, b) => a.sha_order - b.sha_order);
        setSteps(filteredSteps.map(item => item.sha_title));
      } catch (error) {
        console.error("Failed to fetch steps from subha:", error);
      }
    };

    fetchSteps();

    const fetchContactInfo = async () => {
      try {
        const langId = window.location.pathname.includes('/km') ? 2 : 1;
        const res = await axios.get(`${API_ENDPOINTS.getContactByLang}/${langId}`);
        const data = res.data?.data || {};
        const subcontact2 = data.subcontact2;
        const subcontact3 = data.subcontact3;
        setContactDetails({
          phone: subcontact2?.scon_detail || '',
          email: subcontact3?.scon_detail || '',
        });
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
      }
    };

    fetchContactInfo();

    const fetchSocialLinks = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.getSocialSetting);
        const data = Array.isArray(res.data?.data) ? res.data.data : [];

        const filtered = data
          .filter(item => item.display === 1 && item.active === 1)
          .sort((a, b) => a.setsoc_order - b.setsoc_order);
        setSocialLinks(filtered);
      } catch (error) {
        console.error("Failed to fetch social links:", error);
      }
    };

    fetchSocialLinks();
  }, [section]);

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
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Side: Steps and Text */}
         
          {/* Right Side: New Semester and Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
            className="flex flex-col lg:flex-row gap-6 w-full justify-center  items-center"
          >
             <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }} // Trigger when 50% of the element is in view
            className="lg:w-1/2  lg:mb-0"
          >
            <motion.h2
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, amount: 0.5 }}
              className="text-3xl font-semibold mb-6"
            >
              Step By Step: How to Apply to Computer Science Department
            </motion.h2>
            <ul className="list-none space-y-4">
              {steps.map((step, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true, amount: 0.5 }}
                >
                  <div className="p-6 border rounded-2xl flex items-center justify-between">
                    <span className="lg:text-xl text-md">{step}</span>
                    <FaArrowRight className="ml-2" />
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true, amount: 0.5 }}
              className="bg-white  rounded-md space-y-4 lg:w-1/2 lg:order-2 order-1"
            >
              {applyInfo && (
                <div className="bg-white p-6 rounded-md shadow-md">
                  <h2 className="text-xl font-semibold mb-4">{applyInfo.ha_tagtitle}</h2>
                  <p className="mb-4">{applyInfo.ha_subtitletag}</p>
                  <p className="mb-4 text-center text-lg xl:text-xl">
                    <FaCalendarAlt className="inline-block mr-2" />
                    {formatDate(applyInfo.ha_date)}
                  </p>
                </div>
              )}

              <div className="py-6 w-full px-4 bg-red-900 text-white shadow-lg rounded-2xl flex justify-center">
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold">Contact Info</h3>
                  <p className="flex items-center">
                    <FaPhoneAlt className="mr-2" />
                    {contactDetails.phone}
                  </p>
                  <p className="flex items-center">
                    <FaEnvelope className="mr-2" />
                    {contactDetails.email}
                  </p>
                  <div className="flex space-x-3">
                    {socialLinks.map((link, index) => (
                      <a key={index} href={link.setsoc_link || "#"} target="_blank" rel="noopener noreferrer">
                        <div className="bg-gray-50 p-2 rounded-lg text-red-700">
                          <img
                            src={`${API}/storage/uploads/${link.img?.img}`}
                            alt={link.setsoc_title}
                            className="w-5 h-5 object-contain"
                          />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true, amount: 0.5 }}
              className="lg:w-1/3 h-full lg:order-1 order-2"
            >
              <img src={`${API}/storage/uploads/${applyInfo?.image?.img}`} alt="Admission Image" className="rounded-2xl w-full h-full object-cover" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ApplySection