import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";
import axios from "axios";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";

const CriteriaSection = ({section}) => {
    const [criteriaData, setCriteriaData] = useState(null);

    useEffect(() => {
      const fetchCriteriaData = async () => {
        if (!section?.sec_id) return;
        try {
            const res = await axios.get(API_ENDPOINTS.getCriteria);
            const data = res.data.data;
            const filtered = data.find(
            (item) =>
                item.gc_sec === section?.sec_id &&
                item.section?.sec_type === "Criteria" &&
                item.section?.display === 1 &&
                item.section?.active === 1
            );
            setCriteriaData(filtered);
        } catch (error) {
            console.error("Failed to fetch criteria data:", error);
        }
    };

      fetchCriteriaData();
    }, [section]);

    if (!criteriaData) {
        return (
            <div className="w-full text-center py-10 text-gray-500">
                Loading criteria information...
            </div>
        );
    }

    return (
       <div className="my-16">
         <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.5 }}
          className="container mx-auto px-4 "
        >
          <div className="xl:h-[479px] h-full flex flex-col xl:flex-row items-center gap-8 py-8 xl:py-0">
            {/* Left Column - Text Content */}
            <motion.div
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true, amount: 0.5 }}
              className="w-full xl:w-1/2 px-4 xl:px-0"
            >
                <h2 className="text-2xl xl:text-3xl font-bold mb-4">
                    {criteriaData.gc_title}
                </h2>

              <div className="grid grid-cols-1">
                {/* Added grid for responsiveness */}
                <div
                  className="text-sm xl:text-lg"
                  dangerouslySetInnerHTML={{ __html: criteriaData?.gc_detail }}
                />
              </div>

            </motion.div>

            {/* Right Column - Image Content */}
            <motion.div
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true, amount: 0.5 }}
              className="w-full xl:w-1/2 lg:h-[479px] mx-auto h-[360px]"
            >
              <div className="relative flex flex-col items-center justify-center ">
                <div className="flex items-center justify-center gap-4 xl:gap-6 w-full">
                  {/* Left Image */}
                  <div className="h-[200px] w-[150px] lg:h-[347px] lg:w-[265px] transition transform -translate-y-2">
                    <img
                      src={`${API}/storage/uploads/${criteriaData?.image1?.img}`}
                      alt=""
                      className="w-full h-full rounded-tl-[100px] object-cover"
                    />
                  </div>
                  {/* Right Image */}
                  <div className="h-[250px] w-[150px] lg:w-[254px] lg:h-[381px] transition transform translate-y-22">
                    <img
                      src={`${API}/storage/uploads/${criteriaData?.image2?.img}`}
                      alt=""
                      className="w-full h-full object-cover rounded-tr-[100px]"
                    />
                  </div>
                </div>

                {/* SVG Circle */}
                <div className="uppercase absolute -bottom-8 xl:-bottom-8 w-[150px] h-[150px] xl:w-[200px] xl:h-[200px]">
                  <svg width="100%" height="100%" viewBox="0 0 400 400">
                    <defs>
                      <path
                        id="halfCirclePath"
                        d="M 50,200 a 150,150 0 0,1 300,0"
                      />
                    </defs>
                    <circle cx="200" cy="200" r="180" fill="#A52A2A" />
                    <text
                      font-size="26"
                      fill="white"
                      text-anchor="middle"
                      dy={10}
                      letterSpacing={6}
                    >
                      <textPath href="#halfCirclePath" startOffset="50%">
                        {criteriaData.gc_tag}
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
       </div>
    );
}

export default CriteriaSection