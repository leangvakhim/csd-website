import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageHeader from './PageHeader';
import Footer from '../Component/footer/Footer'
import { API_ENDPOINTS } from '../Service/APIconfig';
import Slideshow from './Slideshow/Slideshow';
import ServiceSection from './Services/ServiceSection';
import ProgramSection from './Program/ProgramSection';
import AcademicSection from './Academic/AcademicSection';
import PartnershipSection from './Partnership/PartnershipSection';
import AdmissionBanner from './Banner/BannerSection';
import BasicRequirements from './Requirement/BasicRequirements';
import ApplySection from './ApplySection/ApplySection';
import ImportantSection from './Important/ImportantSection';
import BannerSection from './Banner/BannerSection';
import GallerySection from './Gallery/GallerySection';
import Overview from './Overview/overviewContent';
import FacilitiesSection from './Facilities/FacilitiesSection';
import StudySection from './Study/StudySection';
import FAQSection from './FAQ/FAQSection';
import Introduction from './Introduction/IntroductionSection';
import InnovationSection from './Innovation/InnovationSection';
import FeeSection from './Fee/FeeSection';
import FutureSection from './Future/FutureSection';
import TestimonialSection from './Testimonial/TestimonialSection';
import TypeSection from './Type/TypeSection';
import AboutSection from './About/AboutSection';
import QuestionSection from './Question/QuestionSection';
import ContactSection from './Contact/ContactSection';
import Faculty from './Faculty/Faculty';
import PartnerControllSection from './Partnership/PartnerControllSection';
import SectionInjector from './SectionInjector';

const PageRenderer = ({ page, currentLang, setCurrentLang, settings, setSettings }) => {
    const [sections, setSections] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (page?.p_id) {
            console.log("PageRenderer: Fetching sections for page_id:", page);
            axios
                .get(`${API_ENDPOINTS.getSection}?page_id=${page.p_id}`)
                .then((res) => {
                    // console.log("PageRenderer: Sections API response:", res.data);
                    const pageSections = res.data.data
                        .filter((section) => section.sec_page === page.p_id && section.display === 1)
                        .sort((a, b) => a.sec_order - b.sec_order);
                    // console.log("PageRenderer: Filtered and sorted sections:", pageSections);
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
        // console.log("PageRenderer: No sections to render");
        return (
            <>
                <PageHeader currentLang={currentLang} setCurrentLang={setCurrentLang} settings={settings} setSettings={setSettings}/>
                <div className="text-center py-8 text-gray-600">No sections available for this page.</div>
            </>
        );
    }

    // console.log("PageRenderer: Rendering sections:", sections);
    return (
        <>
            <div className="sticky top-0 z-50">
                <PageHeader currentLang={currentLang} setCurrentLang={setCurrentLang} settings={settings} setSettings={setSettings}/>
            </div>
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
                        return <PartnerControllSection key={section.sec_id} section={section} />;
                    case 'Banner':
                        return <BannerSection key={section.sec_id} section={section} />;
                    case 'Requirement':
                        return <BasicRequirements key={section.sec_id} section={section} />;
                    case 'Apply':
                        return <ApplySection key={section.sec_id} section={section} />;
                    case 'Important':
                        return <ImportantSection key={section.sec_id} section={section} />;
                    case 'Gallery':
                        return <GallerySection key={section.sec_id} section={section} />;
                    case 'Information':
                        return <Overview key={section.sec_id} section={section} />;
                    case 'Facilities':
                        return <FacilitiesSection key={section.sec_id} section={section} />;
                    case 'Study':
                        return <StudySection key={section.sec_id} section={section} />;
                    case 'Introduction':
                        return <Introduction key={section.sec_id} section={section} />;
                    case 'Innovation':
                        return <InnovationSection key={section.sec_id} section={section} />;
                    case 'Fee':
                        return <FeeSection key={section.sec_id} section={section} />;
                    case 'Future':
                        return <FutureSection key={section.sec_id} section={section} />;
                    case 'Testimonial':
                        return <TestimonialSection key={section.sec_id} section={section} />;
                    case 'Type':
                        return <TypeSection key={section.sec_id} section={section} />;
                    case 'Criteria':
                        return <BasicRequirements key={section.sec_id} section={section} />;
                    case 'Question':
                        return <QuestionSection key={section.sec_id} section={section} />;
                    case 'About':
                        return <AboutSection key={section.sec_id} section={section} />;
                    case 'Contact':
                        return <ContactSection key={section.sec_id} section={section} />;
                    case 'FAQ':
                        return <FAQSection key={section.sec_id} section={section} />;
                    case 'Faculty':
                        return <Faculty key={section.sec_id} section={section} />;

                    default:
                        console.log("PageRenderer: Unknown section type:", section.sec_type);
                        return (
                            <div key={section.sec_id} className="text-center py-4">
                                Unknown section type: {section.sec_type}
                            </div>
                        );
                }
            })}

            <SectionInjector alias={page?.p_alias} />

            <div>
                <Footer />
            </div>
        </>
    );
};

export default PageRenderer;