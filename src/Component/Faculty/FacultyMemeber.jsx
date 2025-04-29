import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SlSocialFacebook } from 'react-icons/sl';
import { PiTelegramLogoDuotone } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';

const FacultyMembers = () => {
  const [facultyData, setFacultyData] = useState([]);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.getFaculty);
        const allFaculty = res.data?.data || [];
        const faculty = allFaculty
          .filter(
            (item) =>
              item.display === 1 &&
              item.active === 1 &&
              item.f_order >= 4 &&
              item.lang === 1 // Assuming 1 is the language ID
          )
          .sort((a, b) => a.f_order - b.f_order);

        const formattedFaculty = faculty.map((member) => ({
          id: member.f_id,
          name: member.f_name,
          bio: member.f_portfolio || 'No bio available.',
          position: member.f_position || 'Faculty Member',
          image: member.img?.img
            ? `${API}/storage/uploads/${member.img.img}`
            : '/placeholder-icon.png',
          facebook: member.facebook || '#',
          telegram: member.telegram || '#',
        }));

        setFacultyData(formattedFaculty);
      } catch (error) {
        console.error('Error fetching faculty members:', error);
      }
    };

    fetchFaculty();
  }, []);

  return (
    <div className="my-16">
      <div className="container mx-auto px-4">
        <div className="space-y-10">
          <h1 className="text-2xl font-semibold mb-4">Faculty Members</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facultyData.map((faculty) => (
              <div key={faculty.id} className="shadow-lg rounded-2xl p-4">
                <div className="gap-6 items-center">
                  {/* Image Container */}
                  <div className="relative w-full h-96 mb-4 group">
                    <img
                      src={faculty.image}
                      alt={faculty.name}
                      className="w-full h-full rounded-2xl object-cover group-hover:brightness-90 transition-all duration-300"
                    />

                    {/* Social Media Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center"
                    >
                      {/* Social Icons Container */}
                      <div className="absolute top-4 right-4 group-hover:bg-black/10 p-2 transition-all duration-300 rounded-2xl">
                        <motion.div
                          initial={{ y: 20 }}
                          animate={{ y: 0 }}
                          className="space-y-2"
                        >
                          {/* Facebook Link */}
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="bg-white p-3 rounded-full shadow-lg"
                          >
                            <Link to={faculty.facebook} className="text-gray-700 hover:text-red-600">
                              <SlSocialFacebook className="text-xl" />
                            </Link>
                          </motion.div>

                          {/* Telegram Link */}
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="bg-white p-3 rounded-full shadow-lg"
                          >
                            <Link to={faculty.telegram} className="text-gray-700 hover:text-red-400">
                              <PiTelegramLogoDuotone className="text-xl" />
                            </Link>
                          </motion.div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                  <div className="space-y-6 max-w-md relative text-center">
                    <div className="space-y-2">
                      <h1 className="text-2xl font-semibold">{faculty.name}</h1>
                      <p>{faculty.position}</p>
                    </div>
                    <Link
                      to={`/faculty/${faculty.id}`}
                      className="bg-red-900 px-6 py-2 text-gray-50 rounded-2xl"
                    >
                      View
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

export default FacultyMembers;