import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';
import ResearchBannerSection from './ResearchBannerSection';


const ResearchDetails = () => {
    const { id } = useParams();
    const [research, setResearch] = useState(null);
    const [researchProjects, setResearchProjects] = useState([]);
    const [researchOverview, setResearchOverview] = useState(null);
    const [requirements, setRequirements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResearchDetail = async () => {
            try {
                const researchRes = await axios.get(API_ENDPOINTS.getResearch);
                const allResearch = researchRes.data?.data || [];
                
                const selectedResearch = allResearch.find(
                    (item) => item.rsd_id === id && item.display === 1 && item.active === 1
                );
                
                if (selectedResearch) {
                    setResearch({
                        id: selectedResearch.rsd_id,
                        title: selectedResearch.rsd_title || 'Untitled Research',
                        description: selectedResearch.rsd_subtitle || 'No description available',
                        image: selectedResearch.image?.img
                            ? `${API}/storage/uploads/${selectedResearch.image.img}`
                            : '/placeholder-image.jpg',
                        lead: selectedResearch.rsd_lead || 'Unknown Lead',
                    });
                } else {
                    setError('Research not found or not available.');
                }
            } catch (error) {
                console.error('Error fetching research detail:', error);
                setError('Failed to load research details. Please try again later.');
            }
        };

        const fetchResearchOverview = async () => {
            try {
                const overviewRes = await axios.get(API_ENDPOINTS.getRsdDescription);
                const allOverviews = overviewRes.data?.data || [];
                
                const selectedOverview = allOverviews.find(
                    info => info.rsinfo_rsd === id && 
                    info.display === 1 && 
                    info.active === 1 &&
                    info.rsinfo_order === 1
                );

                if (selectedOverview) {
                    setResearchOverview(selectedOverview);
                }
            } catch (error) {
                console.error("Error fetching research overview:", error);
            }
        };

        const fetchResearchProjects = async () => {
            try {
                const projectRes = await axios.get(API_ENDPOINTS.getRsdProject);
                const allProjects = projectRes.data?.data || [];
                
                const filteredProjects = allProjects.filter(
                    project => project.rsinfo_rsd === id &&
                    Number(project.rsinfo_order) >= 2 &&
                    project.display === 1 &&
                    project.active === 1
                );
                
                setResearchProjects(filteredProjects);
            } catch (error) {
                console.error("Error fetching research projects:", error);
            }
        };

        const fetchRequirements = async () => {
            try {
                const reqRes = await axios.get(API_ENDPOINTS.getRsdMeeting);
                const allRequirements = reqRes.data?.data || [];
                
                const filteredRequirements = allRequirements.filter(
                    req => req.rsreq_rsd === id &&
                    req.display === 1 &&
                    req.active === 1
                );
                
                setRequirements(filteredRequirements);
            } catch (error) {
                console.error("Error fetching research requirements:", error);
            }
        };

        

        const fetchAllData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchResearchDetail(),
                    fetchResearchOverview(),
                    fetchResearchProjects(),
                    fetchRequirements(),
                ]);
            } catch (err) {
                console.error("Error fetching all research data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading research details...</p>
                </div>
            </div>
        );
    }

    if (error || !research) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
                    <div className="text-red-600 mb-4 text-5xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Not Available</h2>
                    <p className="text-gray-600 mb-4">{error || 'No research details available for this ID.'}</p>
                    <button 
                        onClick={() => window.history.back()} 
                        className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Research Banner Section */}
            <ResearchBannerSection 
                researchData={research}
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 py-8">
                {/* Main Section */}
                <div className="flex-1">
                    {/* Overview Section */}
                    <section className="my-8 sm:my-12">
                        <div className="max-w-3xl mx-auto space-y-6 px-4 sm:px-0">
                            {researchOverview && (
                                <section className="space-y-4">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                        {researchOverview.rsinfo_title || "Research Overview"}
                                    </h2>
                                    <div
                                        className="space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base"
                                        dangerouslySetInnerHTML={{ __html: researchOverview.rsinfo_detail }}
                                    ></div>
                                </section>
                            )}

                            <div className="border-t border-gray-200 my-6"></div>

                            {/* Requirements Section */}
                            {requirements.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                                        Project Requirements
                                    </h3>
                                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                                        {requirements.map(requirement => (
                                            <p
                                                key={requirement.rsreq_id}
                                                className="text-red-700 hover:text-red-600 px-4 py-2 bg-pink-100 rounded-full transition-colors text-sm sm:text-base"
                                            >
                                                <span className="font-normal">{requirement.rsreq_name}</span>
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Research Projects Section */}
                    <section className="my-8 sm:my-12">
                        <div className="bg-white rounded-xl shadow-md">
                            <div className="max-w-3xl mx-auto p-4 sm:p-6">
                                {researchProjects.length > 0 ? (
                                    researchProjects.map((project) => (
                                        <div key={project.rsinfo_id || `${project.rsinfo_rsd}-${project.rsinfo_order}`} className="py-4">
                                            <section className="space-y-4">
                                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                                    {project.rsinfo_title}
                                                </h2>
                                                <div
                                                    className="space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base"
                                                    dangerouslySetInnerHTML={{ __html: project.rsinfo_detail }}
                                                ></div>
                                            </section>
                                            {project !== researchProjects[researchProjects.length - 1] && (
                                                <div className="border-t border-gray-200 my-6"></div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-8">No research projects available.</p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

              
            </div>
        </div>
    );
};

export default ResearchDetails;