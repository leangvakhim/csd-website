import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { API_ENDPOINTS, API, axiosInstance } from "../../Service/APIconfig";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useLocation } from "react-router-dom";

const AnnouncementDetails = ({announcementID, menuLang}) => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [announcement, setAnnouncement] = useState({ title: '', detail: '' });
  const itemsPerPage = 10;
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const location = useLocation();
  const [currentLang, setCurrentLang] = useState(window.location.pathname.startsWith('/km') ? 2 : 1);

  useEffect(() => {
    setCurrentLang(location.pathname.startsWith('/km') ? 1 : 2);
  }, [location.pathname]);

  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const displayedData = students.slice(indexOfFirstStudent, indexOfLastStudent);

  useEffect(() => {
    axiosInstance.get(API_ENDPOINTS.getAnnouncementStudent)
      .then(response => {
        const rawData = Array.isArray(response.data) ? response.data : [];
        const formatted = rawData.map((item, index) => {
          const subjects = {};
          Object.keys(item).forEach(key => {
            if (!["student_id", "student_identity", "result", "NO", "STUDENT_IDENTITY"].includes(key)) {
              subjects[key] = item[key];
            }
          });
          return {
            id: item.NO || index + 1,
            studentId: item.student_identity || item.STUDENT_IDENTITY || "",
            subjects: subjects,
            result: item.result || ""
          };
        });
        setStudents(formatted);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });

    axiosInstance.get(API_ENDPOINTS.getAnnouncement)
      .then(response => {
        const allAnnouncements = response.data?.data || [];
        const matched = allAnnouncements.find(
          item => item.ref_id ===  Number(announcementID) && item.lang === currentLang
        );

        if (matched && matched.am_title && matched.am_detail) {
          setAnnouncement({ title: matched.am_title, detail: matched.am_detail });
        }
      })
      .catch(error => {
        console.error("Error fetching announcement detail:", error);
      });
  }, [announcementID, location.pathname]);

  const subjects = students.length > 0 ? Object.keys(students[0].subjects) : [];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Calculate page range for pagination
  const paginationRange = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const range = [];

    if (currentPage <= 3) {
      range.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      range.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      range.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }

    return range;
  };

  return (
    <div className="my-10">
      <div className="container mx-auto px-4">
        <h1 className={`${menuLang === 2 ? "font-khmer" : "font-sans"
          } text-2xl font-bold mb-4`}>{announcement.title}</h1>
        <p className={`${menuLang === 2 ? "fonts-khmer text-[18px]" : "font-sans"
          } text-gray-600 mb-6`}>{announcement.detail}</p>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-red-800 text-white text-left">
                <th className="p-3 text-sm md:text-base">NO.</th>
                <th className="p-3 text-sm md:text-base">Student ID</th>
                {subjects.map((subject) => (
                  <th key={subject} className="p-3 text-sm md:text-base">{subject}</th>
                ))}
                <th className="p-3 text-sm md:text-base">Result</th>
              </tr>
            </thead>
            <tbody>
              {displayedData.map((item, index) => (
                <tr key={index} className="odd:bg-white even:bg-red-50 text-gray-700">
                  <td className="p-3 text-sm">{item.id}</td>
                  <td className="p-3 text-sm">{item.studentId}</td>
                  {subjects.map((subject) => (
                    <td key={subject} className="p-3 text-sm">{item.subjects[subject]}</td>
                  ))}
                  <td className="p-3 text-sm">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                      {item.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className={`sm:px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-200 ${currentPage === 1 && "opacity-50 cursor-not-allowed"
              }`}
          >
            <HiChevronLeft size={18} />
          </button>

          {paginationRange().map((page, index) =>
            page === '...' ? (
              <span key={index} className="px-3 py-1 text-gray-700">...</span>
            ) : (
              <button
                key={index}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border rounded-md ${currentPage === page ? "bg-red-800 text-white" : "text-gray-700 hover:bg-gray-200"}`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className={`sm:px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-200 ${currentPage === totalPages && "opacity-50 cursor-not-allowed"
              }`}
          >
            <HiChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );

};

export default AnnouncementDetails;