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
import FacultyCarouselSection from './Carousel/FacultyCarouselSection';
import { useLocation } from 'react-router-dom';
import SpecializationSection from './Spacialization/SpecializationSection';
import FeedbackSection from './Feedback/FeedbackSection';
import ResearchSection from './Research/ResearchSection';
import ScholarshipSection from './Scholarship/ScholarshipSection';
import CareerSection from './Career/CareerSection';
import PotentialSection from './Potential/PotentialSection';
import AnnouncementSection from './Announcement/AnnouncementSection';
import EventSection from './Event/EventSection';


const PageRenderer = ({ page, currentLang, setCurrentLang, settings, setSettings }) => {
    const [sections, setSections] = useState([]);
    const [error, setError] = useState(null);
    const [onlyContentMode, setOnlyContentMode] = useState(false);
    const location = useLocation();
    const isKhmer = location.pathname.startsWith("/km");
    const menuLang = isKhmer ? 2 : 1;

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
                <PageHeader currentLang={currentLang} setCurrentLang={setCurrentLang} settings={settings} setSettings={setSettings} />
                <div className="text-center py-8 text-gray-600">No sections available for this page.</div>
            </>
        );
    }

    // console.log("PageRenderer: Rendering sections:", sections);
    return (
        <>

            <div className="sticky top-0 z-50">
                <PageHeader currentLang={currentLang} setCurrentLang={setCurrentLang} settings={settings} setSettings={setSettings} />
            </div>

            {!onlyContentMode && (
                <>
                    {sections.map((section) => {
                        switch (section.sec_type) {
                            case 'Slideshow':
                                return <Slideshow key={section.sec_id} section={section} menuLang={menuLang}/>;
                            case 'Service':
                                return <ServiceSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Programs':
                                return <ProgramSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Academic':
                                return <AcademicSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            // case 'Partner':
                            //     return <PartnerControllSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Banner':
                                return <BannerSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Requirement':
                                return <BasicRequirements key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Apply':
                                return <ApplySection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Important':
                                return <ImportantSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Gallery':
                                return <GallerySection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Information':
                                return <Overview key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Facilities':
                                return <FacilitiesSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Study':
                                return <StudySection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Introduction':
                                return <Introduction key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Innovation':
                                return <InnovationSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Fee':
                                return <FeeSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Future':
                                return <FutureSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Testimonial':
                                return <TestimonialSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Type':
                                return <TypeSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Criteria':
                                return <BasicRequirements key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Question':
                                return <QuestionSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'About':
                                return <AboutSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Contact':
                                return <ContactSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'FAQ':
                                return <FAQSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Faculty':
                                return <FacultyCarouselSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Research':
                                return <ResearchSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Scholarship':
                                return <ScholarshipSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Career':
                                return <CareerSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Specialization':
                                return <SpecializationSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Feedback':
                                return <FeedbackSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Partner':
                                return <PartnershipSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Potential':
                                return <PotentialSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Announcement':
                                return <AnnouncementSection key={section.sec_id} section={section} menuLang={menuLang} />;
                            case 'Event':
                                return <EventSection key={section.sec_id} section={section} menuLang={menuLang} />;

                           
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
            )}

            {page?.p_alias === '/faculty' && (
                <SectionInjector alias={page?.p_alias} setOnlyContentMode={setOnlyContentMode} />
            )}
            {page?.p_alias === '/developer' && (
                <SectionInjector alias={page?.p_alias} setOnlyContentMode={setOnlyContentMode} />
            )}
            {page?.p_alias === '/research' && (
                <SectionInjector alias={page?.p_alias} setOnlyContentMode={setOnlyContentMode} />
            )}
            <div>
                <Footer />
            </div>
        </>
    );
};

export default PageRenderer;