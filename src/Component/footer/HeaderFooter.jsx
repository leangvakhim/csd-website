import React, {useState, useEffect} from 'react';
import { motion } from 'framer-motion';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const HeaderFooter = () => {
    const [settings, setSettings] = useState(null);
    const location = useLocation();
    const [currentLang, setCurrentLang] = useState(1);
    const [socialLinks, setSocialLinks] = useState([]);

    useEffect(() => {
    const langFromUrl = location.pathname.includes('/km') ? 2 : 1;
    setCurrentLang(langFromUrl);

    axios.get(`${API_ENDPOINTS.getSetting}/lang/${langFromUrl}`)
        .then(res => {
            const settingData = res.data?.data || [];
            const langSetting = Array.isArray(settingData)
            ? settingData.find(item => item.lang === langFromUrl)
            : settingData;

            if (langSetting) {
                setSettings({
                    facultyTitle: langSetting.set_facultytitle || "",
                    departmentTitle: langSetting.set_facultydep || "",
                    logoUrl: langSetting.logo?.img
                    ? `${API}/storage/uploads/${langSetting.logo.img}`
                    : "/placeholder-icon.png"
                });
            }
        })
        .catch(err => console.error("Error fetching settings:", err));
    }, [location.pathname]);

    useEffect(() => {
      axios.get(API_ENDPOINTS.getSocialSetting)
        .then(res => {
          const socialData = res.data?.data || res.data || [];
          const filtered = Array.isArray(socialData)
            ? socialData.filter(item => item.active === 1 && item.display === 1)
            : [];
          const sorted = filtered.sort((a, b) => a.setsoc_order - b.setsoc_order);
          setSocialLinks(sorted);
        })
        .catch(err => console.error("Failed to fetch social links:", err));
    }, []);

    if (!settings) return null;

    return (
        <motion.div
          className="bg-red-900 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto flex flex-col sm:flex-row px-4 py-8 items-center justify-between ">
            {/* Left Section with Logo and Text */}
            <Link to='' className=' cursor-pointer'>
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >

                <motion.img
                  src={settings.logoUrl}
                  alt="Department Logo"
                  className="h-16 w-16 mr-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                />
                <motion.h2
                  className={`text-lg font-normal uppercase text-white ${
                    currentLang === 2 ? "font-khmer" : "font-bold"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                 {settings.facultyTitle} <br className='' /> {settings.departmentTitle}
                </motion.h2>

              </motion.div>
            </Link>

            {/* Right Section with Social Media Icons */}
            <div className='flex justify-end sm:mt-0 mt-4'>
              <motion.div
                className="flex  space-x-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
                }}
              >
                {socialLinks.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="bg-white p-2 rounded-xl shadow-md cursor-pointer"
                    aria-label={`Social Media Icon ${index + 1}`}
                  >
                    <Link
                      to={item.setsoc_link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={`${API}/storage/uploads/${item.img?.img}`}
                        alt={item.setsoc_title}
                        className="h-6 w-6 object-contain"
                      />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
    );
}

export default HeaderFooter