import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../service/APIConfig';
import { motion } from 'framer-motion';

const AnnouncementDetails = ({ announcementId }) => {
  const [announcement, setAnnouncement] = useState(null);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Calculate pagination
  const totalPages = Math.ceil(students.length / rowsPerPage);
  const indexOfLastStudent = currentPage * rowsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - rowsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  // Fetch announcement and student results
  useEffect(() => {
    if (!announcementId) {
      setError('No announcement ID provided.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch announcement details
        const announcementResponse = await axios.get(API_ENDPOINTS.getAnnouncement);
        const announcements = announcementResponse.data?.data || [];
        const targetAnnouncement = announcements.find(
          (ann) => ann.am_id === parseInt(announcementId)
        );
        if (targetAnnouncement) {
          setAnnouncement({
            title: targetAnnouncement.am_title || 'Untitled Announcement',
            description: targetAnnouncement.am_shortdesc || 'No description available.',
            date: targetAnnouncement.am_postdate
              ? new Date(targetAnnouncement.am_postdate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'TBD',
          });
        } else {
          setError('Announcement not found.');
        }

        // Fetch student results
        const studentResponse = await axios.get(
          `${API_ENDPOINTS.getAnnouncementStudent}?announcement_id=${announcementId}`
        );
        const studentData = studentResponse.data?.data || [];
        setStudents(studentData);

        // Extract dynamic subject keys
        if (studentData.length > 0) {
          const subjectKeys = Object.keys(studentData[0]).filter(
            (key) =>
              !['student_id', 'student_identity', 'result', 'NO', 'announcement_id'].includes(key)
          );
          setSubjects(subjectKeys);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load announcement or student data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [announcementId]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <motion.div
      className="my-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex flex-col items-center">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-gray-500">Loading announcement details...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 flex-col">
            <p className="text-lg text-red-500">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : announcement || students.length > 0 ? (
          <div className="w-full max-w-6xl">
            {announcement && (
              <>
                <h1 className="text-2xl font-bold mb-4 text-center">{announcement.title}</h1>
                <p className="text-gray-600 mb-6 text-center">{announcement.description}</p>
              </>
            )}
            {students.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-lg text-gray-500">No student results available.</p>
              </div>
            ) : (
              <div className="relative overflow-x-auto">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <label htmlFor="rowsPerPage" className="mr-2">
                      Rows per page:
                    </label>
                    <select
                      id="rowsPerPage"
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="border rounded px-2 py-1 border-gray-300"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
                <table className="w-full text-sm text-left text-gray-500 border">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3">NO.</th>
                      <th className="px-6 py-3">Student ID</th>
                      {subjects.map((subject, idx) => (
                        <th key={idx} className="px-6 py-3">
                          {subject}
                        </th>
                      ))}
                      <th className="px-6 py-3">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudents.map((student, index) => (
                      <tr key={index} className="bg-white border-b border-gray-200">
                        <td className="px-6 py-4">{student.NO}</td>
                        <td className="px-6 py-4">{student.student_identity}</td>
                        {subjects.map((subject, idx) => (
                          <td key={idx} className="px-6 py-4">
                            {student[subject] ?? '-'}
                          </td>
                        ))}
                        <td className="px-6 py-4">
                          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                            {student.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="py-2 px-4 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="py-2 px-4 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-gray-500">No announcement or student data available.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AnnouncementDetails;