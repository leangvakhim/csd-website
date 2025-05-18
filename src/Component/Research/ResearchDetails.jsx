import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, API, axiosInstance } from '../../Service/APIconfig';
import { motion } from 'framer-motion';
import ResearchDescription from './ResearchDescription';
import ResearchMeeting from './ResearchMeeting';
import ResearchProject from './ResearchProject';
import ResearchBanner from './ResearchBanner';
import RecentResearch from './RecentResearch';
import StudentResearch from './StudentResearch';
import ResearchInnovations from './ResearcInnovation';


const ResearchDetails = ({ refId }) => {
    const [sections, setSections] = useState([]);
    const [researchs, setResearchs] = useState([]);
    const currentResearch = researchs.length > 0 ? researchs[0] : null;
    const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

    useEffect(() => {
        const fetchResearchs = async () => {
            try {
                const response = await axiosInstance.get(API_ENDPOINTS.getResearch);

                const filtered = response.data.data
                    .filter(item =>
                        item.ref_id === Number(refId) &&
                        item.lang === currentLang &&
                        item.display === 1 &&
                        item.active === 1
                    )
                    .sort((a, b) => a.rsd_order - b.rsd_order);
                setResearchs(filtered);
            } catch (error) {
                console.error('Failed to fetch researchs:', error);
            }
        };

        fetchResearchs();
    }, [refId, currentLang]);

    useEffect(() => {
        const fetchSections = async () => {
            if (!researchs.length || !researchs[0].rsd_id) return;

            try {
                const response = await axiosInstance.get(API_ENDPOINTS.getResearchTitle);
                const sorted = response.data.data
                    .filter(item =>
                        item.display === 1 &&
                        item.active === 1 &&
                        item.rsdt_text === parseInt(researchs[0].rsd_id)
                    )
                    .sort((a, b) => a.rsdt_order - b.rsdt_order);

                setSections(sorted);
            } catch (error) {
                console.error('Failed to fetch research sections:', error);
            }
        };

        fetchSections();
    }, [researchs]);

    const renderSection = (section) => {

        switch (section.rsdt_type) {
            case 'Description':
                return <ResearchDescription rsdtId={section.rsdt_id} />;
            case 'Project':
                return <ResearchProject rsdtId={section.rsdt_id} />;
            case 'Meeting':
                return <ResearchMeeting rsdtId={section.rsdt_id} />;

            default:
                return null;
        }
    };

    return (
        <div>
            {currentResearch && (
                <ResearchBanner researchId={currentResearch.rsd_id} />
            )}
            {sections.map(section => (
                <div key={section.rsdt_id}>
                    {renderSection(section)}
                </div>
            ))}
            <StudentResearch />
            <RecentResearch />
        </div>
    );
}

export default ResearchDetails;