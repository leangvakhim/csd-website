import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MdVerified } from 'react-icons/md';
import { BsPeople } from "react-icons/bs";
import { PiGraduationCapDuotone } from "react-icons/pi";
import { API } from '../../Service/APIconfig';
import { useData } from "../../Context/DataContext";


const CSDSection = ({key, section, menuLang}) => {
  const { globalData } = useData();
  const [keyMetrics, setKeyMetrics] = useState({title: '', count: '', description: '' });
  const [programData, setProgramData] = useState(null);
  const [objectives, setObjectives] = useState([]);

  useEffect(() => {
    if (globalData?.addOnCSD && globalData?.specializations && section?.sec_id) {
        // Key Metrics
        const itemMetrics = globalData.addOnCSD.find(item => item.ras?.ras_sec === section?.sec_id);
        if (itemMetrics) {
          setKeyMetrics({
            title: itemMetrics.rason_title,
            count: itemMetrics.rason_amount,
            description: itemMetrics.rason_subtitle
          });
        }

        // Program Data
        const itemProgram = globalData.specializations.find(item => item.section?.sec_id === section?.sec_id && item.text?.text_sec === section?.sec_id);
        if (itemProgram) {
          setProgramData({
            programTitle: itemProgram.text.title,
            description: itemProgram.text.desc,
            images: [
              { src: `${API}/storage/uploads/${itemProgram.image1?.img}`, alt: "Image 1" },
              { src: `${API}/storage/uploads/${itemProgram.image2?.img}`, alt: "Image 2" }
            ]
          });

          // Objectives (Subservices)
          if (globalData?.subServices) {
              const filteredObjectives = globalData.subServices
                .filter(obj => obj.ras?.ras_sec === section?.sec_id && obj.ss_ras === itemProgram.ras_id && obj.display === 1)
                .sort((a, b) => a.ss_order - b.ss_order)
                .map(obj => ({
                  title: obj.ss_title,
                  description: obj.ss_subtitle,
                  icon: () => <img src={`${API}/storage/uploads/${obj.image?.img}`} />
                }));
              setObjectives(filteredObjectives);
          }
        }
    }
  }, [section?.sec_id, globalData]);


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
                                  <h2 className={`text-lg sm:text-lg mb-2 ${menuLang === 2 ? 'font-khmer' : 'font-semibold'} `}>{objective.title}</h2>
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