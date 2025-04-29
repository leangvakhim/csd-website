import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import PartnershipSection from './PartnershipSection';
import UniPartnerships from './UniPartnershipSection';
import { API_ENDPOINTS } from '../../Service/APIconfig';

const PartnerControllSection = ({ section }) => {
    const [sectionData, setSectionData] = useState(section || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPartnerSection = useCallback(async (sectionId, pageId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `${API_ENDPOINTS.getPage}?section_id=${sectionId}_`
            );
            const sections = response.data?.data?.sections || [];
            const partnerSection = sections.find(
                (sec) => sec.sec_type.toLowerCase() === 'partner' && sec.sec_page === pageId
            );
            setSectionData(partnerSection || null);
        } catch (err) {
            console.error('Error fetching partner section:', err);
            setError('Failed to load partner section. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (section?.sec_id) {
            setSectionData(section);
        } else if (section?.sec_page) {
            fetchPartnerSection('partner', section.sec_page);
        } else {
            setSectionData(null);
        }
    }, [section, fetchPartnerSection]);

    if (loading) return <p>Loading partnership section...</p>;
    if (error) return <p>{error}</p>;
    if (!sectionData) return null;

    // Render based on sec_page
    const renderSection = () => {
        if (sectionData.sec_page === 1) {
            return <PartnershipSection section={sectionData} />;
        } else if (sectionData.sec_page === 9) {
            return <UniPartnerships section={sectionData} />;
        }
        return null; // fallback if neither matches
    };

    return <div>{renderSection()}</div>;
};

export default PartnerControllSection;
