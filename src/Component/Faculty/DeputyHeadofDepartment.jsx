import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RiDoubleQuotesR } from "react-icons/ri";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";

const DeputyHeadofDepartment = ({ language = "en" }) => {
  const [deputyData, setDeputyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${API_ENDPOINTS.getFaculty}`)
      .then((res) => {
        const data = res.data?.data || [];
        const filteredData = data
          .filter(
            (faculty) =>
              (language === "km"
                ? faculty.f_position === "អនុប្រធានដេប៉ាតឺម៉ង់"
                : faculty.f_position.toLowerCase() === "deputy head of department") &&
              faculty.f_order > 0 &&
              faculty.display === 1 &&
              faculty.active === 1 &&
              faculty.lang === (language === "km" ? 2 : 1)
          )
          .sort((a, b) => a.f_order - b.f_order)
          .map((faculty) => ({
            id: faculty.f_id,
            name: faculty.f_name,
            image: faculty.img?.img ? `${API}/storage/uploads/${faculty.img.img}` : "",
            bio: faculty.f_portfolio || "No biography available.",
            facebook: faculty.facebook || "#",
            telegram: faculty.telegram || "#",
            facebook_image: faculty.facebook_image
              ? `${API}/storage/uploads/${faculty.facebook_image}`
              : "https://via.placeholder.com/24?text=FB",
            telegram_image: faculty.telegram_image
              ? `${API}/storage/uploads/${faculty.telegram_image}`
              : "https://via.placeholder.com/24?text=TG",
          }));
        setDeputyData(filteredData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching faculty data:", error);
        setError("Failed to load deputy head data.");
        setIsLoading(false);
      });
  }, [language]);

  if (isLoading) {
    return (
      <div className="my-16 text-center">
        <p>{language === "km" ? "កំពុងផ្ទុកព័ត៌មានអនុប្រធានដេប៉ាតឺម៉ង់..." : "Loading deputy head information..."}</p>
      </div>
    );
  }

  if (error || deputyData.length === 0) {
    return (
      <div className="my-16 text-center">
        <p>{language === "km" ? "មិនមានព័ត៌មានអនុប្រធានដេប៉ាតឺម៉ង់ទេ។" : "No deputy head information available."}</p>
      </div>
    );
  }

  return (
    <div className="my-16">
      <div className="container mx-auto px-4">
        <div className="space-y-10">
          <div>
            <h1 className="text-2xl font-semibold mb-4">
              {language === "km" ? "អនុប្រធានដេប៉ាតឺម៉ង់" : "Deputy Head of Department"}
            </h1>
          </div>
          <div className="flex flex-col xl:flex-row xl:flex-wrap gap-8 justify-center">
            {deputyData.map((deputy, index) => (
              <div
                key={deputy.id}
                className={`
                  shadow-lg rounded-2xl p-4 
                  xl:w-[calc(50%-1rem)]
                  ${
                    index === deputyData.length - 1 && deputyData.length % 2 !== 0
                      ? "xl:mx-auto"
                      : ""
                  }
                `}
              >
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  {/* Image Container */}
                  <div className="relative w-full h-72 mb-4 group">
                    <img
                      src={deputy.image}
                      alt={deputy.name}
                      className="w-full h-full rounded-2xl object-cover group-hover:brightness-90 transition-all duration-300"
                    />

                    {/* Social Media Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center"
                    >
                      {/* Social Images Container */}
                      <div className="absolute top-4 right-4 group-hover:bg-black/10 p-2 transition-all duration-300 rounded-2xl">
                        <motion.div
                          initial={{ y: 20 }}
                          animate={{ y: 0 }}
                          className="space-y-2"
                        >
                          {/* Facebook Image */}
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="bg-white p-3 rounded-full shadow-lg"
                          >
                            <a
                              href={deputy.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-700 hover:text-red-600"
                            >
                              <img
                                src={deputy.facebook_image}
                                alt="Facebook"
                                className="w-6 h-6 object-contain"
                              />
                            </a>
                          </motion.div>

                          {/* Telegram Image */}
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="bg-white p-3 rounded-full shadow-lg"
                          >
                            <a
                              href={deputy.telegram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-700 hover:text-red-400"
                            >
                              <img
                                src={deputy.telegram_image}
                                alt="Telegram"
                                className="w-6 h-6 object-contain"
                              />
                            </a>
                          </motion.div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                  <div className="space-y-6 max-w-md relative">
                    <div className="flex justify-between items-center">
                      <h1 className="text-2xl font-semibold">{deputy.name}</h1>
                      <div className="text-right">
                        <RiDoubleQuotesR className="text-7xl text-red-900" />
                      </div>
                    </div>

                    <p className="text-left">{deputy.bio}</p>
                    <Link to={`/deputy/${deputy.id}`}>
                      <button className="bg-red-900 px-6 py-2 text-gray-50 rounded-2xl">
                        {language === "km" ? "មើល" : "View"}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeputyHeadofDepartment;