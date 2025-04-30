import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";
import { API, API_ENDPOINTS } from "../../Service/APIconfig";

const ProjectReq = () => {
  const [requirements, setRequirements] = useState([]);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        // Fetch the data from the API (replace with your actual API endpoint)
        const response = await fetch(API_ENDPOINTS.getProjectReq);
        const data = await response.json();

        if (data.status === 200 && data.data.length > 0) {
          // Extract project details (rsdp_detail)
          const projectDetails = data?.data.rsdp_detail;
          
          // Parse the HTML content into a list of requirements
          const parsedContent = parseRequirements(projectDetails);
          
          setRequirements(parsedContent);
        }
      } catch (error) {
        console.error("Error fetching project requirements:", error);
      }
    };

    fetchRequirements();
  }, []);

  // Helper function to parse the HTML content
  const parseRequirements = (htmlContent) => {
    const divs = htmlContent.split('<div style="display: flex; "');
    const requirementsList = divs
      .filter((item) => item.includes('<span style="margin: auto 0px;">'))
      .map((item) => {
        const match = item.match(/<span style="margin: auto 0px;">(.*?)<\/span>/);
        return match ? match[1] : "";
      });
    
    return requirementsList;
  };

  return (
    <div className="my-16">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.5 }}
        className="container mx-auto px-4"
      >
        <div className="xl:h-[479px] h-full flex flex-col xl:flex-row items-center gap-8 py-8 xl:py-0">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
            className="w-full px-4 xl:px-0"
          >
            <h2 className="text-2xl xl:text-3xl font-bold mb-4">Project Requirements</h2>

            <div className="grid grid-cols-1">
              {/* Added grid for responsiveness */}
              {requirements.length > 0 ? (
                requirements.map((requirement, index) => (
                  <div key={index} className="mb-4 flex gap-4">
                    <div>
                      <p className="text-sm xl:text-lg">{requirement}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Loading requirements...</p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectReq;
