import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API } from "../../Service/APIconfig";
import { useData } from "../../Context/DataContext";

const ContactSection = ({ section, menuLang }) => {
  const { globalData, isLoading } = useData();
  const [contactData, setContactData] = useState(null); 


  useEffect(() => {
    if (!globalData?.contacts) {
      return;
    }

    try {
      const data = globalData.contacts.find(c => c.con_lang === menuLang);
      if (!data) {
        setContactData(null);
        return;
      }

      const formattedContactData = {
        heading: data.con_title || "",
        description: data.con_subtitle || "",
        image: data.image?.img ? `${API}/storage/uploads/${data.image.img}` : "",
        contactDetails: [
          {
            id: data.subcontact1?.scon_id || 1,
            title: data.subcontact1?.scon_title || "",
            content: data.subcontact1?.scon_detail || "",
            image: data.subcontact1?.image?.img
              ? `${API}/storage/uploads/${data.subcontact1.image.img}`
              : "",
          },
          {
            id: data.subcontact2?.scon_id || 2,
            title: data.subcontact2?.scon_title || "",
            content: data.subcontact2?.scon_detail || "",
            image: data.subcontact2?.image?.img
              ? `${API}/storage/uploads/${data.subcontact2.image.img}`
              : "",
          },
          {
            id: data.subcontact3?.scon_id || 3,
            title: data.subcontact3?.scon_title || "",
            content: data.subcontact3?.scon_detail || "",
            image: data.subcontact3?.image?.img
              ? `${API}/storage/uploads/${data.subcontact3.image.img}`
              : "",
          },
        ],
      };

      setContactData(formattedContactData);
    } catch (error) {
      console.error("Contact processing error:", error);
    }
  }, [menuLang, globalData?.contacts]);


  if (isLoading || !contactData) {
    return null;
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
                className={`text-3xl sm:text-4xl font-bold text-gray-50 mb-6 ${
                  menuLang === 2 ? "font-khmer" : "font-semibold"
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                {contactData.heading}
              </motion.h2>

              {/* Description */}
              <motion.p
                className={` text-gray-50 mb-12 ${
                  menuLang === 2 ? "fonts-khmer font-[20px]" : "font-sans"
                }`}
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
                          className={`w-18 h-18 object-contain `}
                        />
                      )}
                    </div>
                    {/* Title and Content */}
                    <h3 className={`mt-4 text-xl font-semibold text-gray-50 ${menuLang === 2 ? 'fonts-khmer text-[20px]' : 'font-sans'}`}>{contact.title}</h3>
                    <p className={`mt-2 text-gray-50 ${menuLang === 2 ? 'fonts-khmer text-[18px]' : 'font-sans'}`}>{contact.content}</p>
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