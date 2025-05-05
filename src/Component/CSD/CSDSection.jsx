import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MdVerified } from 'react-icons/md';
import { BsPeople } from "react-icons/bs";
import { PiGraduationCapDuotone } from "react-icons/pi";
import { API_ENDPOINTS, API } from '../../Service/APIconfig';

const CSDSection = ({key, section, menuLang}) => {
  const [keyMetrics, setKeyMetrics] = useState({title: '', count: '', description: '' });
  const [programData, setProgramData] = useState(null);
  const [objectives, setObjectives] = useState([]);

  useEffect(() => {

    const fetchKeyMetrics = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.getAddOnCSD);
        const dataList = Array.isArray(res.data?.data) ? res.data.data : [];
        const item = dataList.find(item => item.ras?.ras_sec === section?.sec_id);
        if (item) {
          setKeyMetrics({
            title: item.rason_title,
            count: item.rason_amount,
            description: item.rason_subtitle
          });
        }
      } catch (error) {
        console.error("Failed to fetch key metrics:", error);
      }
    };

    const fetchProgramData = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.getSpecialization);
        const dataList = Array.isArray(res.data?.data) ? res.data.data : [];
        const item = dataList.find(item => item.section?.sec_id === section?.sec_id && item.text?.text_sec === section?.sec_id);
        if (item) {
          setProgramData({
            programTitle: item.text.title,
            description: item.text.desc,
            images: [
              { src: `${API}/storage/uploads/${item.image1?.img}`, alt: "Image 1" },
              { src: `${API}/storage/uploads/${item.image2?.img}`, alt: "Image 2" }
            ]
          });

          const resSub = await axios.get(API_ENDPOINTS.getSubserviceAF);
          const subItems = Array.isArray(resSub.data?.data) ? resSub.data.data : [];
          const filteredObjectives = subItems
            .filter(obj => obj.ras?.ras_sec === section?.sec_id && obj.ss_ras === item.ras_id && obj.display === 1)
            .sort((a, b) => a.ss_order - b.ss_order)
            .map(obj => ({
              title: obj.ss_title,
              description: obj.ss_subtitle,
              icon: () => <img src={`${API}/storage/uploads/${obj.image?.img}`} />
            }));
          setObjectives(filteredObjectives);
        }
      } catch (error) {
        console.error("Failed to fetch section program data:", error);
      }
    };

    fetchKeyMetrics();
    fetchProgramData();
  }, []);

  const { programTitle, description, images } = programData || {};

  if (!programData) return null;

  return (
    <div className="my-16">

          <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto px-4"
      >
          <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Right Column - Key Metrics (Image First in Mobile) */}
              <motion.div
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="xl:w-1/2 w-full flex flex-col items-center relative order-1 xl:order-2"
              >
                  {/* Image Flex Layout */}
              <div className='flex flex-col lg:flex-row  justify-center items-center gap-4'>
                  {images.map((image, index) => (
                      <div
                          key={index}
                          className={`w-full sm:w-auto ${index === 0 ? 'w-[325px] h-[211px] rounded-tl-[50px] sm:rounded-tl-[100px]' : index === 1 ? 'w-[309px] h-[418px] rounded-tr-[50px] sm:rounded-tr-[100px]' : 'w-[309px] h-[418px]'} overflow-hidden rounded-xl shadow-lg`}
                      >
                          <img
                              src={image.src}
                              alt={image.alt}
                              className='w-full h-full object-cover'
                          />
                      </div>
                  ))}
              </div>


                  <div className='absolute bottom-4 sm:bottom-0 z-10 bg-white p-4 rounded-lg shadow-md w-11/12 sm:w-52 sm:h-42 text-center'>
                      <h2 className="text-md sm:text-lg font-bold flex items-center justify-center mb-4">
                          <MdVerified className="mr-2 text-xl sm:text-2xl text-red-700" />
                          {keyMetrics.title}
                      </h2>
                      <div className="text-lg sm:text-xl font-bold text-red-700">{keyMetrics.count}</div>
                      <p className="text-sm sm:text-md mt-2">{keyMetrics.description}</p>
                  </div>
              </motion.div>

              {/* Left Column - Text Content */}
              <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="xl:w-1/2 w-full order-2 xl:order-1"
              >
                  <h2 className={`text-3xl font-bold mb-4 ${menuLang === 2 ? 'font-khmer' : 'font-semibold'}`}>{programTitle}</h2>
                  <p className={`text-base sm:text-lg mb-6 ${menuLang === 2 ? 'fonts-khmer' : 'font-sans'}`}>{description}</p>
                  <div className="space-y-6">
                      {objectives.map((objective, index) => (
                          <div key={index} className="flex items-start gap-3">
                              <div className="w-24 h-24 p-2.5 ">
                                  <objective.icon />
                              </div>
                              <div>
                                  <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${menuLang === 2 ? 'fonts-khmer' : 'font-sans'}`}>{objective.title}</h3>
                                  <p className={`text-sm sm:text-base ${menuLang === 2 ? 'fonts-khmer' : 'font-sans'}`}>{objective.description}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </motion.div>
          </div>


      </motion.div>
    </div>
  );
}

export default CSDSection