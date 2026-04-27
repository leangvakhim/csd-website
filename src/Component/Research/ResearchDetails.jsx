import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ResearchDescription from './ResearchDescription';
import ResearchMeeting from './ResearchMeeting';
import ResearchProject from './ResearchProject';
import ResearchBanner from './ResearchBanner';
import StudentResearch from './StudentResearch';
import { useData } from '../../Context/DataContext';

const ResearchDetails = ({ refId, researchlabDetailPage }) => {
    const { globalData, isLoading } = useData();
    const [sections, setSections] = useState([]);
    const [researchs, setResearchs] = useState([]);
    const currentResearch = researchs.length > 0 ? researchs[0] : null;
    const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

    useEffect(() => {
        if (globalData?.research) {
            const filtered = globalData.research
                .filter(item =>
                    item.ref_id === Number(refId) &&
                    item.lang === currentLang &&
                    item.display === 1 &&
                    item.active === 1
                )
                .sort((a, b) => a.rsd_order - b.rsd_order);
            setResearchs(filtered);
        }
    }, [refId, currentLang, globalData?.research]);

    useEffect(() => {
        if (researchs.length && researchs[0].rsd_id && globalData?.researchTitles) {
            const sorted = globalData.researchTitles
                .filter(item =>
                    item.display === 1 &&
                    item.active === 1 &&
                    item.rsdt_text === parseInt(researchs[0].rsd_id)
                )
                .sort((a, b) => a.rsdt_order - b.rsdt_order);

            setSections(sorted);
        }
    }, [researchs, globalData?.researchTitles]);

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

    if (isLoading) return null;

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
            <StudentResearch researchlabDetailPage={researchlabDetailPage}/>
        </div>
    );
}

export default ResearchDetails;