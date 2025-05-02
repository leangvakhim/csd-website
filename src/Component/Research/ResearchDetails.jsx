import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';
import { motion } from 'framer-motion';
import ResearchDescription from './ResearchDescription';
import ResearchMeeting from './ResearchMeeting';
import ResearchProject from './ResearchProject';
import ResearchBanner from './ResearchBanner';
import RecentResearch from './RecentResearch';
import StudentResearch from './StudentResearch';
import ResearchInnovations from './ResearcInnovation';


const ResearchDetails = ({ researchId }) => {
    const [sections, setSections] = useState([]);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.getResearchTitle);
                const sorted = response.data.data
                    .filter(item => item.display === 1 && item.active === 1 && item.rsdt_text === parseInt(researchId))
                    .sort((a, b) => a.rsdt_order - b.rsdt_order);
                setSections(sorted);
            } catch (error) {
                console.error('Failed to fetch research sections:', error);
            }
        };
        fetchSections();
    }, [researchId]);

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
            <ResearchBanner researchId={researchId} />
            {sections.map(section => (
                <div key={section.rsdt_id}>
                    {renderSection(section)}
                </div>
            ))}
            <StudentResearch />
            <ResearchInnovations />
            <RecentResearch />
        </div>
    );
}

export default ResearchDetails;