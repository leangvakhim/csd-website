import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import PartnershipSection from './PartnershipSection';
import UniPartnerships from './UniPartnershipSection';
import { API_ENDPOINTS } from '../../Service/APIconfig';

const PartnerControllSection = ({ section }) => {
    const [sectionData, setSectionData] = useState(section || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [headerAmount, setHeaderAmount] = useState(null);
    const [headerTitle, setHeaderTitle] = useState(null);
    const fetchHeaderSection = useCallback(async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.getHeaderSection);
            const data = response.data;
            if (Array.isArray(data.data)) {
                const filtered = data.data.find(item => item.hsec_sec === section?.sec_id && item.section?.sec_type === "Partner");
                if (filtered?.hsec_amount !== undefined) {
                    setHeaderAmount(filtered.hsec_amount);
                    setHeaderTitle(filtered.hsec_title);
                }
            }
        } catch (error) {
            console.error('Failed to fetch header section:', error);
        }
    }, []);

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
            fetchHeaderSection();
        } else if (section?.sec_page) {
            fetchPartnerSection('partner', section.sec_page);
            fetchHeaderSection();
        } else {
            setSectionData(null);
            fetchHeaderSection();
        }
    }, [section, fetchPartnerSection, fetchHeaderSection]);

    if (loading) return <p>Loading partnership section...</p>;
    if (error) return <p>{error}</p>;
    if (!sectionData) return null;

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
