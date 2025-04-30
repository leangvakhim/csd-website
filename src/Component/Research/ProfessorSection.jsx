import React, { useState, useEffect } from "react";
import axios from "axios";
import { API, API_ENDPOINTS } from "../../Service/APIconfig";

const ProfessorSection = () => {
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.getRsdMeeting);
        const data = response.data?.data || [];

        if (data.length > 0) {
          setProfessor(data[0]); // Display only the first professor
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching professor data:", err);
        setError("Failed to load professor information.");
        setLoading(false);
      }
    };

    fetchProfessorData();
  }, []);

  if (loading) {
    return (
      <div className="my-8 sm:my-12 lg:my-16 text-center text-gray-600">
        Loading professor information...
      </div>
    );
  }

  if (error || !professor) {
    return (
      <div className="my-8 sm:my-12 lg:my-16 text-center text-gray-600">
        {error || "No professor data available."}
      </div>
    );
  }

  const { rsdm_title, rsdm_detail, img } = professor;
  const imageUrl = img?.img ? `${API}/storage/uploads/${img.img}` : "/placeholder-image.jpg";

  return (
    <div className="my-8 sm:my-12 lg:my-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-gray-100 text-gray-900 rounded-3xl">
        <div className="py-8 sm:py-12 lg:py-16 flex flex-col lg:flex-row items-center gap-10">
          {/* Image Section */}
          <div className="w-full max-w-md lg:max-w-[476px] aspect-[4/3] relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-red-200 transform -translate-x-3 -translate-y-3 rounded-3xl z-0"></div>
            <img
              src={imageUrl}
              alt={rsdm_title}
              className="relative w-full h-full object-cover rounded-2xl shadow-md z-10"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-image.jpg";
              }}
            />
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-2/3 px-4 sm:px-6 lg:px-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6">
              {rsdm_title}
            </h2>
            <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 whitespace-pre-line">
              {rsdm_detail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorSection;
