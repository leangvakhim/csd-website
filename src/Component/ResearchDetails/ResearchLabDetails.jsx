import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';
import { motion } from 'framer-motion';
import ResearchDescription from '../Research/ResearchDescription';
import ResearchMeeting from '../Research/ResearchMeeting';
import ResearchProject from '../Research/ResearchProject';
import ResearchBanner from '../Research/ResearchBanner';
import RecentResearch from '../Research/RecentResearch';
import StudentResearch from '../Research/StudentResearch';



const ResearchLabDetails = ({ researchlabId }) => {
    const [sections, setSections] = useState([]);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.getResearchlab);
                const sorted = response.data.data
                    .filter(item => item.display === 1 && item.active === 1 && item.rsdl_id === parseInt(researchlabId))
                    .sort((a, b) => a.rsdl_order - b.rsdl_order);
                setSections(sorted);
            } catch (error) {
                console.error('Failed to fetch research sections:', error);
            }
        };
        fetchSections();
    }, [researchlabId]);

    const renderSection = (section) => {

        switch (section.rsdt_type) {
            case 'Description':
                return <ResearchDescription rsdtId={section.rsdl_id} />;
            case 'Project':
                return <ResearchProject rsdtId={section.rsdl_id} />;
            case 'Meeting':
                return <ResearchMeeting rsdtId={section.rsdl_id} />;
           
            default:
                return null;
        }
    };

    return (
        <div>
            <ResearchBanner researchId={researchlabId} />
            {sections.map(section => (
                <div key={section.rsdl_id}>
                    {renderSection(section)}
                </div>
            ))}
            <StudentResearch />
            <RecentResearch />
        </div>
    );
}

export default ResearchLabDetails;