import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageHeader from './PageHeader';
import { API_ENDPOINTS } from '../Service/APIconfig';
import Slideshow from './Slideshow/Slideshow';
import ServiceSection from './Services/ServiceSection';
import ProgramSection from './Program/ProgramSection';
import AcademicSection from './Academic/AcademicSection';
import PartnershipSection from './Partnership/PartnershipSection';
import AdmissionBanner from './Banner/AdmissionBannerSection';
import BasicRequirements from './Requirement/BasicRequirements';
import ApplySection from './ApplySection/ApplySection';
import ImportantSection from './Important/ImportantSection';

const PageRenderer = ({ page }) => {
    const [sections, setSections] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (page?.p_id) {
            console.log("PageRenderer: Fetching sections for page_id:", page.p_id);
            axios
                .get(`${API_ENDPOINTS.getSection}?page_id=${page.p_id}`)
                .then((res) => {
                    console.log("PageRenderer: Sections API response:", res.data);
                    const pageSections = res.data.data
                        .filter((section) => section.sec_page === page.p_id && section.display === 1)
                        .sort((a, b) => a.sec_order - b.sec_order);
                    console.log("PageRenderer: Filtered and sorted sections:", pageSections);
                    setSections(pageSections);
                    setError(null);
                })
                .catch((err) => {
                    console.error('PageRenderer: Error fetching sections:', err);
                    setError('Failed to load page sections. Please try again later.');
                });
        } else {
            console.log("PageRenderer: No page.p_id provided, skipping API call");
        }
    }, [page]);

    if (error) {
        console.log("PageRenderer: Rendering error state:", error);
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    if (sections.length === 0) {
        console.log("PageRenderer: No sections to render");
        return (
            <>
                <PageHeader />
                <div className="text-center py-8 text-gray-600">No sections available for this page.</div>
            </>
        );
    }

    console.log("PageRenderer: Rendering sections:", sections);
    return (
        <>
            <PageHeader />
            {sections.map((section) => {
                switch (section.sec_type) {
                    case 'Slideshow':
                        return <Slideshow key={section.sec_id} section={section} />;
                    case 'Service':
                        return <ServiceSection key={section.sec_id} section={section} />;
                    case 'Programs':
                        return <ProgramSection key={section.sec_id} section={section} />;
                    case 'Academic':
                        return <AcademicSection key={section.sec_id} section={section} />;
                    case 'Partner':
                        return <PartnershipSection key={section.sec_id} section={section} />;
                    case 'Banner':
                        return <AdmissionBanner key={section.sec_id} section={section} />;
                    case 'Requirement':
                        return <BasicRequirements key={section.sec_id} section={section} />;
                    case 'Apply':
                        return <ApplySection key={section.sec_id} section={section} />;
                    case 'Important':
                        return <ImportantSection key={section.sec_id} section={section} />;
                    default:
                        console.log("PageRenderer: Unknown section type:", section.sec_type);
                        return (
                            <div key={section.sec_id} className="text-center py-4">
                                Unknown section type: {section.sec_type}
                            </div>
                        );
                }
            })}
        </>
    );
};

export default PageRenderer;