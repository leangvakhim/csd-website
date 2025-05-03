import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";

const BasicRequirements = ({ key, section, menuLang}) => {
  const [gcAddon, setGcAddon] = useState(null);
  const [gcData, setGcData] = useState(null);

  useEffect(() => {
    const fetchGcAddon = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.getSubRequirement);
        console.log("res.data is; ",res.data?.data);
        const data = res.data?.data;
        const filtered = data.find(
          (item) =>
            item.gc?.gc_sec === section.sec_id
        );
        setGcAddon(filtered || null);
      } catch (error) {
        console.error("Failed to fetch gcaddon:", error);
      }
    };


    const fetchGcData = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.getCriteria);
        const data = res.data?.data || [];
        const filtered = data.find(
          (item) =>
            item.gc_sec === section.sec_id &&
            item.section?.sec_type === "Requirement" &&
            item.section?.display === 1 &&
            item.section?.active === 1
        );
        setGcData(filtered || null);
      } catch (error) {
        console.error("Failed to fetch requirement:", error);
      }
    };

    fetchGcAddon();
    fetchGcData();
  }, [section.sec_id]);

  return (
    <div className="my-16">
      {gcData && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.5 }}
          className="container mx-auto px-4 "
        >
          <div className="xl:h-[479px] h-full flex flex-col xl:flex-row items-center gap-8 py-8 xl:py-0">
            {/* Left Column - Image Content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.5 }}
              className="w-full xl:w-1/2 lg:h-[479px] mx-auto h-[360px]"
            >
              <div className="relative flex flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-4 xl:gap-6 w-full">
                  {/* Left Image */}
                  <div className="h-[200px] w-[150px] lg:h-[347px] lg:w-[265px] transition transform -translate-y-2">
                    <img
                      src={`${API}/storage/uploads/${gcData.image1?.img}`}
                      alt=""
                      className="w-full h-full rounded-tl-[100px] object-cover"
                    />
                  </div>
                  {/* Right Image */}
                  <div className="h-[250px] w-[150px] lg:w-[254px] lg:h-[381px] transition transform translate-y-22">
                    <img
                      src={`${API}/storage/uploads/${gcData.image2?.img}`}
                      alt=""
                      className="w-full h-full object-cover rounded-tr-[100px]"
                    />
                  </div>
                </div>

                {/* SVG Circle */}
                <div className="absolute -bottom-8 xl:-bottom-8 w-[150px] h-[150px] xl:w-[200px] xl:h-[200px]">
                  <svg width="100%" height="100%" viewBox="0 0 400 400">
                    <defs>
                      <path
                        id="halfCirclePath"
                        d="M 50,200 a 150,150 0 0,1 300,0"
                      />
                    </defs>
                    <circle cx="200" cy="200" r="180" fill="#A52A2A" />
                    <text
                      className="uppercase"
                      fontSize="26"
                      fill="white"
                      textAnchor="middle"
                      dy={10}
                      letterSpacing={6}
                    >
                      <textPath href="#halfCirclePath" startOffset="50%">
                        {gcData.gc_tag}
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.5 }}
              className="w-full xl:w-1/2 px-4 xl:px-0"
            >
              {gcAddon && (
                <>
                  <p className="mb-2 text-sm xl:text-lg">{gcAddon.gca_tag}</p>
                </>
              )}
              <h2 className="text-3xl font-normal mb-4 py-2">
                {gcData.gc_title}
              </h2>
              <div
                className="grid grid-cols-1 text-sm xl:text-lg space-y-3"
                dangerouslySetInnerHTML={{ __html: gcData.gc_detail }}
              />
              {gcAddon && (
                <>
                  <div className="">
                    <a href={gcAddon.gca_btnlink} target="_blank" rel="noopener noreferrer">
                      <button className="bg-red-800 p-2 rounded-3xl px-6 text-white">
                        {gcAddon.gca_btntitle}
                      </button>
                    </a>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BasicRequirements;