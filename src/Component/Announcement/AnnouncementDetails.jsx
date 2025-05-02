import React, { useState, useEffect } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import axios from "axios";
import Papa from "papaparse";
import { API_ENDPOINTS, API } from "../../Service/APIconfig";

const AnnouncementDetails = ({ announcementId }) => {
  const [data, setData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileError, setFileError] = useState(null);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data from API for specific announcementId
  useEffect(() => {
    if (!announcementId) {
      setError("No announcement ID provided.");
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`${API_ENDPOINTS.getAnnouncementStudent}?announcement_id=${announcementId}`)
      .then((res) => {
        const apiData = res.data?.data || [];
        console.log("AnnouncementDetails: API response:", apiData);

        // Map API data to required structure
        const formattedData = apiData.map((item) => {
          const subjectFields = Object.keys(item).filter(
            (key) =>
              ![
                "student_id",
                "student_identity",
                "result",
                "NO",
                "STUDENT_IDENTITY",
                "announcement_id",
              ].includes(key)
          );
          const subjectsObj = subjectFields.reduce((acc, key) => {
            acc[key] = item[key];
            return acc;
          }, {});
          return {
            id: item.NO,
            studentId: item.student_identity,
            subjects: subjectsObj,
            result: item.result,
          };
        });

        // Extract subjects from the first item
        if (apiData.length > 0) {
          const subjectKeys = Object.keys(apiData[0]).filter(
            (key) =>
              ![
                "student_id",
                "student_identity",
                "result",
                "NO",
                "STUDENT_IDENTITY",
                "announcement_id",
              ].includes(key)
          );
          setSubjects(subjectKeys);
        }

        setData(formattedData);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("AnnouncementDetails: Failed to fetch data:", err);
        setError("Failed to load results for this announcement. Please try again later.");
        setLoading(false);
      });
  }, [announcementId]);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileError(null);

    // Handle CSV files
    if (file.type === "text/csv" || file.name.endsWith(".csv")) {
      Papa.parse(file, {
        complete: (result) => {
          const fileData = result.data;
          console.log("AnnouncementDetails: Parsed CSV data:", fileData);

          try {
            // Filter data by announcementId if present
            const filteredData = fileData.filter(
              (row) => !row.announcement_id || row.announcement_id == announcementId
            );

            if (filteredData.length === 0) {
              setFileError("No data in the file matches the current announcement ID.");
              return;
            }

            // Map CSV data to required structure
            const formattedData = filteredData
              .filter((row) => row.NO && row.student_identity)
              .map((row) => {
                const subjectFields = Object.keys(row).filter(
                  (key) =>
                    ![
                      "student_id",
                      "student_identity",
                      "result",
                      "NO",
                      "STUDENT_IDENTITY",
                      "announcement_id",
                    ].includes(key)
                );
                const subjectsObj = subjectFields.reduce((acc, key) => {
                  acc[key] = parseFloat(row[key]) || row[key] || "-";
                  return acc;
                }, {});
                return {
                  id: parseInt(row.NO),
                  studentId: row.student_identity,
                  subjects: subjectsObj,
                  result: row.result || "pass",
                };
              });

            // Update subjects
            if (filteredData.length > 0) {
              const subjectKeys = Object.keys(filteredData[0]).filter(
                (key) =>
                  ![
                    "student_id",
                    "student_identity",
                    "result",
                    "NO",
                    "STUDENT_IDENTITY",
                    "announcement_id",
                  ].includes(key)
              );
              setSubjects(subjectKeys);
            }

            setData(formattedData);
            setCurrentPage(1);
          } catch (err) {
            console.error("AnnouncementDetails: Error parsing CSV:", err);
            setFileError("Failed to parse CSV file. Please ensure it has the correct format.");
          }
        },
        header: true,
        skipEmptyLines: true,
      });
    }
    // Handle JSON files
    else if (file.type === "application/json" || file.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          console.log("AnnouncementDetails: Parsed JSON data:", jsonData);

          // Filter data by announcementId if present
          const filteredData = jsonData.filter(
            (item) => !item.announcement_id || item.announcement_id == announcementId
          );

          if (filteredData.length === 0) {
            setFileError("No data in the file matches the current announcement ID.");
            return;
          }

          // Map JSON data to required structure
          const formattedData = filteredData
            .filter((item) => item.NO && item.student_identity)
            .map((item) => {
              const subjectFields = Object.keys(item).filter(
                (key) =>
                  ![
                    "student_id",
                    "student_identity",
                    "result",
                    "NO",
                    "STUDENT_IDENTITY",
                    "announcement_id",
                  ].includes(key)
              );
              const subjectsObj = subjectFields.reduce((acc, key) => {
                acc[key] = item[key] || "-";
                return acc;
              }, {});
              return {
                id: item.NO,
                studentId: item.student_identity,
                subjects: subjectsObj,
                result: item.result || "pass",
              };
            });

          // Update subjects
          if (filteredData.length > 0) {
            const subjectKeys = Object.keys(filteredData[0]).filter(
              (key) =>
                ![
                  "student_id",
                  "student_identity",
                  "result",
                  "NO",
                  "STUDENT_IDENTITY",
                  "announcement_id",
                ].includes(key)
            );
            setSubjects(subjectKeys);
          }

          setData(formattedData);
          setCurrentPage(1);
        } catch (err) {
          console.error("AnnouncementDetails: Error parsing JSON:", err);
          setFileError("Failed to parse JSON file. Please ensure it has the correct format.");
        }
      };
      reader.readAsText(file);
    } else {
      setFileError("Unsupported file type. Please upload a CSV or JSON file.");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const displayedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const paginationRange = () => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 2) return [1, 2, 3];
    if (currentPage >= totalPages - 1) return [totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 1, currentPage, currentPage + 1];
  };

  // Loading state
  if (loading) {
    return (
      <div className="my-10 text-center">
        <div className="container mx-auto px-4">
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="my-10 text-center">
        <div className="container mx-auto px-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="my-10 text-center">
        <div className="container mx-auto px-4">
          <p className="text-gray-600">No results available for this announcement.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Announcement Results</h1>
        <p className="text-gray-600 mb-4">
          View student results for this announcement. Upload a CSV or JSON file to update results.
        </p>

        {/* File Upload Input */}
        <div className="mb-6">
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Upload Student Results (CSV or JSON)
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".csv,.json"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-800 file:text-white hover:file:bg-red-900"
          />
          {fileError && (
            <p className="mt-2 text-sm text-red-600">{fileError}</p>
          )}
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-red-800 text-white text-left">
                <th className="p-3 text-sm md:text-base">NO.</th>
                <th className="p-3 text-sm md:text-base">Student ID</th>
                {subjects.map((subject) => (
                  <th key={subject} className="p-3 text-sm md:text-base">
                    {subject}
                  </th>
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
                    <td key={subject} className="p-3 text-sm">
                      {item.subjects[subject] || "-"}
                    </td>
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
            className={`sm:px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-200 ${
              currentPage === 1 && "opacity-50 cursor-not-allowed"
            }`}
          >
            <HiChevronLeft size={18} />
          </button>

          {paginationRange().map((page, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === page ? "bg-red-800 text-white" : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}

          {totalPages > 3 && currentPage < totalPages - 1 && (
            <span className="px-3 py-1 text-gray-700">...</span>
          )}

          {totalPages > 3 && currentPage < totalPages - 1 && (
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === totalPages ? "bg-red-800 text-white" : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {totalPages}
            </button>
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className={`sm:px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-200 ${
              currentPage === totalPages && "opacity-50 cursor-not-allowed"
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