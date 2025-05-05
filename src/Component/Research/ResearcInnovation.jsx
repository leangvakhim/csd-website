import React, { useEffect, useState } from "react";
import { MdComputer, MdExplore } from "react-icons/md";
import { AiOutlineRobot } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";

const ResearchInnovations = ({section}) => {
  const navigate = useNavigate();
  const [researchData, setResearchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const currentLang = location.pathname.includes('/km') ? 2 : 1;

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.getResearch);
        const data = res.data?.data || [];

        const filtered = data
          .filter((item) => item.display === 1 &&
                            item.active === 1 &&
                            item.lang === currentLang
                          )
          .map((item) => ({
            id: item.rsd_id,
            title: item.rsd_title,
            subtitle: item.rsd_subtitle,
            description: item.rsd_description,
            image: item.image?.img
              ? `${API}/storage/uploads/${item.image.img}`
              : "/placeholder-image.jpg",
            exploreText: "Explore",
            buttons: [
              { icon: <MdComputer className="mr-1" />, text: "Computational Advancements" },
              { icon: <AiOutlineRobot className="mr-1" />, text: "AI & Systems Optimization" },
            ],
          }));

        setResearchData(filtered);
        setLoading(false);
      } catch (err) {
        setError("Failed to load research data.");
        setLoading(false);
      }
    };

    fetchResearch();
  }, []);

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="my-6 sm:my-8 lg:my-12">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 lg:mb-8 text-center sm:text-left">
          {currentLang === 1 ? "Research & Innovations" : "កិច្ចការស្រាវជ្រាវ & នវានុវត្តន៍"}
        </h1>

        {/* Featured Research Section */}
        {researchData.slice(0, 1).map((item) => (
          <motion.div
            key={item.id}
            className="bg-black rounded-2xl w-full flex flex-col sm:flex-row items-center mx-auto overflow-hidden mb-6 sm:mb-8 lg:mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 w-full items-center justify-between">
              <div className="w-full sm:w-1/2 flex items-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto object-cover rounded-lg shadow-md aspect-[4/3] sm:aspect-[16/9]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
              </div>

              <div className="w-full sm:w-1/2 text-left text-white">
                <motion.h1
                  className="text-xl font-semibold mb-2 sm:mb-3 uppercase"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {item.title}
                </motion.h1>
                <motion.h3
                  className="text-lg font-semibold mb-2 sm:mb-3"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {item.subtitle}
                </motion.h3>
                <motion.p
                  className="text-xs sm:text-sm lg:text-base font-normal mb-3 sm:mb-4 text-justify line-clamp-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {item.description}
                </motion.p>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {item.buttons.map((btn, btnIndex) => (
                    <motion.button
                      key={btnIndex}
                      className="text-xs sm:text-sm flex items-center bg-gray-900/50 px-2 sm:px-3 py-1 sm:py-2 rounded-2xl gap-1 font-normal"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 * btnIndex }}
                      viewport={{ once: true, amount: 0.3 }}
                    >
                      {btn.icon}
                      {btn.text}
                    </motion.button>
                  ))}
                </div>

                <div className="mt-3 sm:mt-4">
                  <motion.button
                    className="text-xs sm:text-sm bg-red-900 hover:bg-red-800 text-white py-1 sm:py-2 px-3 sm:px-4 rounded-2xl flex items-center font-normal"
                    onClick={() =>
                      navigate(`/research/${item.id}`, { replace: true })
                    }
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <MdExplore className="mr-1" />
                    {item.exploreText}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Research Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {researchData.map((section, index) => (
            <motion.div
              key={section.id}
              className="relative bg-white rounded-lg shadow-md overflow-hidden group min-h-[300px] sm:min-h-[350px]"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 * index }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
              <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              <div className="absolute inset-0 p-3 sm:p-4 lg:p-6 flex flex-col justify-between text-white">
                <div className="flex flex-col gap-2 items-end">
                  {section.buttons.map((button, btnIndex) => (
                    <motion.button
                      key={btnIndex}
                      className="text-xs sm:text-sm flex items-center bg-gray-900/50 px-2 sm:px-3 py-1 sm:py-2 rounded-2xl gap-1 font-normal"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 * btnIndex }}
                      viewport={{ once: true, amount: 0.3 }}
                    >
                      {button.icon}
                      {button.text}
                    </motion.button>
                  ))}
                </div>
                <div>
                  <motion.h3
                    className="text-xl font-normal mb-2 sm:mb-3"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    {section.title}
                  </motion.h3>
                  <motion.p
                    className="text-sm mb-3 sm:mb-4 line-clamp-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    {section.subtitle}
                  </motion.p>
                  <motion.button
                    onClick={() =>
                      navigate(`/research/${section.id}`, { replace: true })
                    }
                    className="text-xs sm:text-sm bg-red-900 hover:bg-red-800 text-white py-1 sm:py-2 px-3 sm:px-4 rounded-2xl flex items-center font-normal"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <MdExplore className="mr-1" />
                    {currentLang === 1 ? "Explore" : "មើលបន្ថែម"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchInnovations;