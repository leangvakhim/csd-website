import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";

const ContactSection = ({ section }) => {
  const [contactData, setContactData] = useState(null); // No static fallback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!section?.sec_id) {
      console.log("GetInTouchSection: No section.sec_id provided, skipping API call");
      setContactData(null); // No data to render
      return;
    }

    setIsLoading(true);
    axios
      .get(`${API_ENDPOINTS.getContact}?section_id=${section.sec_id}`)
      .then((res) => {
        const data = res.data?.data || {};
        const formattedContactData = {
          heading: data.heading || "", // Default if missing
          description:
            data.description ||
            "",
          contactDetails: (data.contactDetails || []).map((contact) => ({
            id: contact.id || Date.now() + Math.random(), // Ensure unique ID
            title: contact.title || "Unknown",
            content: contact.content || "",
            image: contact.image ? `${API}/storage/uploads/${contact.image}` : "",
          })),
        };
        setContactData(formattedContactData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contact data:", error);
        setError("Failed to load contact information.");
        setContactData(null);
        setIsLoading(false);
      });
  }, [section?.sec_id]);

  if (isLoading) {
    return (
      <div className="py-16 text-center text-gray-50 bg-red-900">
        <p>Loading contact information...</p>
      </div>
    );
  }

  if (error || !contactData) {
    return null; // Render nothing if there's an error or no data
  }

  return (
    <div className="py-16">
      <div className="bg-red-900">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Image Column */}
          <motion.div
            className="container mx-auto xl:h-[500px] h-full"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <img
              src={contactData.image}
              alt="World Map"
              className="w-full h-full mx-auto object-contain rounded-lg"
            />
          </motion.div>

          {/* Contact Section Column */}
          <motion.section
            className="px-4 xl:max-w-[634px] max-w-full py-10 mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <div className="text-center">
              {/* Heading */}
              <motion.h2
                className="text-3xl sm:text-4xl font-bold text-gray-50 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                {contactData.heading}
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-lg text-gray-50 mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                viewport={{ once: true }}
              >
                {contactData.description}
              </motion.p>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {contactData.contactDetails.map((contact, index) => (
                  <motion.div
                    key={contact.id}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.2, duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    {/* Image */}
                    <div className={` p-4 rounded-full`}>
                      {contact.image && (
                        <img
                          src={contact.image}
                          alt={contact.title}
                          className={`w-8 h-8 object-contain `}
                        />
                      )}
                    </div>
                    {/* Title and Content */}
                    <h3 className="mt-4 text-xl font-semibold text-gray-50">{contact.title}</h3>
                    <p className="mt-2 text-gray-50">{contact.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;