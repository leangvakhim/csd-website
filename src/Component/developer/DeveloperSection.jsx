import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiDoubleQuotesR } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';

const DeveloperSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [socials, setSocials] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        // Fetch developer data
        const devRes = await axios.get(API_ENDPOINTS.getDevelopers);
        const allDevelopers = devRes.data?.data || [];

        // Filter for lang: 1, display: 1, active: 1
        const filteredDevelopers = allDevelopers.filter(
          item =>
            item.display === 1 &&
            item.active === 1 &&
            item.lang === 1 &&
            // Ensure name is in Latin script (English)
            /^[A-Za-z\s.]+$/.test(item.d_name)
        );

        // Remove duplicates based on image (d_img) and normalize names
        const uniqueDevelopers = [];
        const seenImages = new Set();
        const seenNames = new Set();

        filteredDevelopers.filter(dev => dev.display === 1 && dev.active === 1)
        .sort((a, b) => b.d_order - a.d_order)
        .forEach(dev => {
          const normalizedName = dev.d_name.toLowerCase().replace(/\s+/g, '');
          const imageId = dev.d_img;
      
          if (
            !seenImages.has(imageId) &&
            !seenNames.has(normalizedName) &&
            (dev.d_name.includes('Mr.') || dev.d_name.includes('Ms.'))
          ) {
            uniqueDevelopers.push({
              id: dev.d_id,
              name: dev.d_name,
              position: dev.d_position,
              bio: dev.d_write || 'No bio available.',
              image: dev.img?.img
                ? `${API}/storage/uploads/${dev.img.img}`
                : '/placeholder-icon.png',
            });
            seenImages.add(imageId);
            seenNames.add(normalizedName);
          }
        });

        setDevelopers(uniqueDevelopers);

        // Fetch social media data
        const socialRes = await axios.get(API_ENDPOINTS.getSocialDeveloper);
        const allSocials = socialRes.data?.data || [];
        const socialsByDeveloper = {};

        uniqueDevelopers.forEach(dev => {
          socialsByDeveloper[dev.id] = allSocials.filter(
            social =>
              social.ds_developer === dev.id &&
              social.display === 1 &&
              social.active === 1
          );
        });

        setSocials(socialsByDeveloper);
      } catch (error) {
        console.error('Error fetching developers or socials:', error);
      }
    };

    fetchDevelopers();
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="my-16">
      <div className="container mx-auto px-4">
        <div className="space-y-10">
          <h1 className="text-3xl font-semibold">Project Teams</h1>

          {developers.length === 0 ? (
            <div className="text-center text-gray-500">No developers found.</div>
          ) : (
            <div className="flex flex-col lg:flex-row flex-wrap gap-8 justify-center">
              {developers.map(developer => (
                <div
                  key={developer.id}
                  className="shadow-lg rounded-2xl p-4 xl:w-[calc(50%-1rem)]"
                >
                  <div className="flex flex-col lg:flex-row gap-6 items-center">
                    <div className="relative w-full mx-auto h-96 mb-4 group">
                      <img
                        src={developer.image}
                        alt={developer.name}
                        className="w-full h-full rounded-2xl object-cover transition-all duration-300 group-hover:brightness-90"
                        onError={e => {
                          e.target.src = '/placeholder-icon.png';
                        }}
                      />
                      {/* Social Media Overlay */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center"
                      >
                        <div className="absolute top-4 right-4 group-hover:bg-black/10 p-2 transition-all duration-300 rounded-2xl">
                          <motion.div
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            className="space-y-2"
                          >
                            {socials[developer.id]?.length > 0 ? (
                              socials[developer.id].map(social => (
                                <motion.div
                                  key={social.ds_id}
                                  whileHover={{ scale: 1.1 }}
                                  className="bg-white p-3 rounded-full shadow-lg"
                                >
                                  <Link
                                    to={social.ds_link || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-700 hover:text-red-600"
                                  >
                                    <img
                                      src={
                                        social.ds_img && social.img?.img
                                          ? `${API}/storage/uploads/${social.img.img}`
                                          : '/placeholder-icon.png'
                                      }
                                      alt={social.ds_title || 'Social Icon'}
                                      className="w-6 h-6 rounded-full object-cover"
                                      onError={e => {
                                        e.target.src = '/placeholder-icon.png';
                                      }}
                                    />
                                  </Link>
                                </motion.div>
                              ))
                            ) : (
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="bg-white p-3 rounded-full shadow-lg"
                              >
                                <Link
                                  to="#"
                                  className="text-gray-700 hover:text-red-600"
                                >
                                  <img
                                    src="/placeholder-icon.png"
                                    alt="Default Social Icon"
                                    className="w-6 h-6 rounded-full object-cover"
                                  />
                                </Link>
                              </motion.div>
                            )}
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="space-y-6 max-w-md">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h1 className="text-2xl text-left font-semibold">
                            {developer.name}
                          </h1>
                          <RiDoubleQuotesR className="text-7xl text-red-900" />
                        </div>
                        <p>{developer.position}</p>
                      </div>

                      <p className="text-left">{developer.bio}</p>
                      <button
                        onClick={() => {
                          setIsOpen(true);
                          setSelectedDeveloper(developer);
                        }}
                        className="bg-red-900 px-6 py-2 text-gray-50 rounded-2xl"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isOpen && selectedDeveloper && (
        <div className="modal-overlay fixed inset-0 bg-gray-900/75 flex justify-center items-start z-50 overflow-y-auto">
          <div className="container mx-auto px-4 flex justify-center items-center min-h-screen">
            <div
              ref={modalRef}
              className="bg-white w-full mx-auto max-w-lg sm:container flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl shadow-lg"
            >
              <div className="w-full sm:w-80 flex justify-center">
                <img
                  src={selectedDeveloper.image}
                  alt={selectedDeveloper.name}
                  className="w-full h-52 sm:w-96 sm:h-96 rounded-2xl object-contain"
                  onError={e => {
                    e.target.src = '/placeholder-icon.png';
                  }}
                />
              </div>

              <div className="w-full sm:w-1/3">
                <h2 className="text-2xl font-semibold mb-2">
                  {selectedDeveloper.name}
                </h2>
                <p className="mb-4">{selectedDeveloper.bio}</p>
                <div className="text-start flex gap-3">
                  {socials[selectedDeveloper.id]?.length > 0 ? (
                    socials[selectedDeveloper.id].map(social => (
                      <motion.div
                        key={social.ds_id}
                        whileHover={{ scale: 1.1 }}
                        className="bg-white p-3 rounded-full shadow-lg"
                      >
                        <Link
                          to={social.ds_link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-red-600"
                        >
                          <img
                            src={
                              social.ds_img && social.img?.img
                                ? `${API}/storage/uploads/${social.img.img}`
                                : '/placeholder-icon.png'
                            }
                            alt={social.ds_title || 'Social Icon'}
                            className="w-6 h-6 rounded-full object-cover"
                            onError={e => {
                              e.target.src = '/placeholder-icon.png';
                            }}
                          />
                        </Link>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="bg-white p-3 rounded-full shadow-lg"
                    >
                      <Link
                        to="#"
                        className="text-gray-700 hover:text-red-600"
                      >
                        <img
                          src="/placeholder-icon.png"
                          alt="Default Social Icon"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperSection;