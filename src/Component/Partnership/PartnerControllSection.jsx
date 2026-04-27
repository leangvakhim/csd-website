import React, { useEffect, useState } from 'react';
import PartnershipSection from './PartnershipSection';
import UniPartnerships from './UniPartnershipSection';
import { useData } from "../../Context/DataContext";


const PartnerControllSection = ({ section }) => {
    const [sectionData, setSectionData] = useState(section || null);


    const [headerAmount, setHeaderAmount] = useState(null);
    const [headerTitle, setHeaderTitle] = useState(null);
    const { globalData } = useData();

    useEffect(() => {
        if (!globalData) return;

        // Extract header data
        if (globalData.headers) {
            const filtered = globalData.headers.find(item => item.hsec_sec === section?.sec_id && item.section?.sec_type === "Partner");
            if (filtered) {
                setHeaderAmount(filtered.hsec_amount);
                setHeaderTitle(filtered.hsec_title);
            }
        }

        // Handle section data
        if (section?.sec_id) {
            setSectionData(section);
        } else if (section?.sec_page && globalData.pages) {
            const page = globalData.pages.find(p => p.p_id === section.sec_page);
            if (page && page.sections) {
                const partnerSection = page.sections.find(
                    (sec) => sec.sec_type.toLowerCase() === 'partner'
                );
                setSectionData(partnerSection || null);
            }
        }
    }, [section, globalData]);


    if (!sectionData || !globalData) return null;

    // Render based on sec_page
    const renderSection = () => {
        if (headerAmount === 1) {
            return <PartnershipSection section={sectionData} headerTitle={headerTitle} />;
        } else if (headerAmount === 2) {
            return <UniPartnerships section={sectionData} headerTitle={headerTitle} />;
        }
        return null; // fallback if neither matches
    };

    return (
        <div>
            {renderSection()}
        </div>
    );
};

export default PartnerControllSection;
