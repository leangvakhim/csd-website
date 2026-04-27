import { useState, useEffect, createContext, useContext } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { API_ENDPOINTS, API, axiosInstance, API_BASEURL } from './Service/APIconfig';
import axios from 'axios';
import PageRenderer from './Component/PageRenderer';
import Faculty from './Component/Faculty/FacultyDepartment';
import NotFound from './Component/404';

import { DataContext } from './Context/DataContext';

function AppRoutes() {
  const location = useLocation();
  const [pages, setPages] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [menus, setMenus] = useState([]);
  const [allSearchData, setAllSearchData] = useState([]);
  const [settings, setSettings] = useState(null);
  const [currentLang, setCurrentLang] = useState(location.pathname.includes('/km') ? 2 : 1);
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenFetched, setIsTokenFetched] = useState(false);
  
  // Data storage for sections
  const [globalData, setGlobalData] = useState({
    faculty: [],
    events: [],
    news: [],
    announcements: [],
    scholarships: [],
    careers: [],
    research: [],
    researchlab: []
  });

  const [facultyDetailPage, setFacultyDetailPage] = useState(null);
  const [researchDetailPage, setResearchDetailPage] = useState(null);
  const [researchlabDetailPage, setResearchlabDetailPage] = useState(null);
  const [scholarshipDetailPage, setScholarshipDetailPage] = useState(null);
  const [newDetailPage, setNewDetailPage] = useState(null);
  const [eventDetailPage, setEventDetailPage] = useState(null);
  const [announcementDetailPage, setAnnouncementDetailPage] = useState(null);
  const [careerDetailPage, setCareerDetailPage] = useState(null);

  const findPageBySectionType = (sections, pages, secType, currentLang) => {
    const section = sections.find(sec => {
      const page = pages.find(p => p.p_id === sec.sec_page);
      return sec.sec_type === secType && page?.menu?.lang === currentLang;
    });
    return section ? pages.find(p => p.p_id === section.sec_page) : null;
  };

  // Initial data fetch - only once on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const success = await requestGuestToken();
        if (success) setIsTokenFetched(true);
        
        if (!success) {
          console.warn("Skipping data fetch because guest token failed.");
          setIsLoading(false);
          return;
        }

        // Helper to prevent a single endpoint failure (e.g. 500 error) from crashing the whole app
        const safeGet = (endpoint) => axiosInstance.get(endpoint).catch(err => {
          console.warn(`Failed to fetch ${endpoint}:`, err.message);
          return { data: { data: [] } };
        });

        // 1. Critical path data (blocking UI render)
        const [
          pageRes, sectionRes, menuRes, settingRes, headerRes, 
          socialRes, socialSettingRes, slideshowRes, bannerRes
        ] = await Promise.all([
          safeGet(API_ENDPOINTS.getPage),
          safeGet(API_ENDPOINTS.getSection),
          safeGet(API_ENDPOINTS.getMenu),
          safeGet(API_ENDPOINTS.getSetting),
          safeGet(API_ENDPOINTS.getHeaderSection),
          safeGet(API_ENDPOINTS.getSocial),
          safeGet(API_ENDPOINTS.getSocialSetting),
          safeGet(API_ENDPOINTS.getSlideshow),
          safeGet(API_ENDPOINTS.getBanner),
        ]);

        const allPages = pageRes.data?.data || [];
        const sections = sectionRes.data?.data || [];
        const menuData = menuRes.data?.data || [];
        const settingsData = settingRes.data?.data || [];
        const headerData = headerRes.data?.data || [];
        const socialData = socialRes.data?.data || [];
        const socialSettingData = socialSettingRes.data?.data || socialSettingRes.data || [];
        const slideshowData = slideshowRes.data?.data || [];
        const bannerData = bannerRes.data?.data || [];

        setPages(allPages);
        setAllSections(sections);
        setMenus(menuData);
        
        // Initial critical global data
        setGlobalData(prev => ({
          ...prev,
          pages: allPages,
          settings: settingsData,
          headers: headerData,
          socials: socialData,
          socialSettings: socialSettingData,
          slideshow: slideshowData,
          banners: bannerData
        }));

        // Update detail pages based on initial language
        updateDetailPages(sections, allPages, currentLang);
        
        // UNBLOCK THE UI HERE!
        setIsLoading(false);

        // 2. Deferred data (fetched in background after yielding to browser render loop)
        setTimeout(async () => {
          try {
            const [
              facultyRes, eventRes, newsRes, announcementRes, scholarshipRes, careerRes, 
              researchRes, researchlabRes, partnerRes, testimonialRes, textRes, faqRes,
              subFaqRes, serviceRes, academicRes, introRes, importantRes, availableRes,
              applyRes, futureRes, unlockRes, feeRes, studyRes, criteriaRes, addOnCSDRes, galleryRes,
              subRequirementRes, facilitiesRes, specializationRes, typeRes, subTypeRes, subImportantRes,
              subApplyRes, subFutureRes, subAvailableRes, subStudyDegreeRes, contactRes, developerRes,
              devSocialRes, feedbackRes, subContactRes, researchTitleRes, researchDescRes, researchProjectRes,
              researchMeetingRes, departmentRes, subServiceRes, imageRes, facultyInfoRes, facultyContactRes,
              facultyBGRes, researchlabTagRes
            ] = await Promise.all([
              safeGet(API_ENDPOINTS.getFaculty),
              safeGet(API_ENDPOINTS.getEvent),
              safeGet(API_ENDPOINTS.getNews),
              safeGet(API_ENDPOINTS.getAnnouncement),
              safeGet(API_ENDPOINTS.getScholarship),
              safeGet(API_ENDPOINTS.getCareer),
              safeGet(API_ENDPOINTS.getResearch),
              safeGet(API_ENDPOINTS.getResearchlab),
              safeGet(API_ENDPOINTS.getPartnership),
              safeGet(API_ENDPOINTS.getTestimonial),
              safeGet(API_ENDPOINTS.getText),
              safeGet(API_ENDPOINTS.getFAQ),
              safeGet(API_ENDPOINTS.getSubFAQ),
              safeGet(API_ENDPOINTS.getService),
              safeGet(API_ENDPOINTS.getAcademic),
              safeGet(API_ENDPOINTS.getIntroduction),
              safeGet(API_ENDPOINTS.getImportant),
              safeGet(API_ENDPOINTS.getAvailable),
              safeGet(API_ENDPOINTS.getApply),
              safeGet(API_ENDPOINTS.getFuture),
              safeGet(API_ENDPOINTS.getUnlock),
              safeGet(API_ENDPOINTS.getFee),
              safeGet(API_ENDPOINTS.getStudy),
              safeGet(API_ENDPOINTS.getCriteria),
              safeGet(API_ENDPOINTS.getAddOnCSD),
              safeGet(API_ENDPOINTS.getGallery),
              safeGet(API_ENDPOINTS.getSubRequirement),
              safeGet(API_ENDPOINTS.getAcadFacilities),
              safeGet(API_ENDPOINTS.getSpecialization),
              safeGet(API_ENDPOINTS.getType),
              safeGet(API_ENDPOINTS.getSubType),
              safeGet(API_ENDPOINTS.getSubImportant),
              safeGet(API_ENDPOINTS.getSubApply),
              safeGet(API_ENDPOINTS.getSubFuture),
              safeGet(API_ENDPOINTS.getSubAvailable),
              safeGet(API_ENDPOINTS.getSubStudyDegree),
              safeGet(API_ENDPOINTS.getContact),
              safeGet(API_ENDPOINTS.getDevelopers),
              safeGet(API_ENDPOINTS.getSocialDeveloper),
              safeGet(API_ENDPOINTS.getFeedback),
              safeGet(API_ENDPOINTS.getSubContact),
              safeGet(API_ENDPOINTS.getResearchTitle),
              safeGet(API_ENDPOINTS.getRsdDescription),
              safeGet(API_ENDPOINTS.getRsdProject),
              safeGet(API_ENDPOINTS.getRsdMeeting),
              safeGet(API_ENDPOINTS.getDepartment),
              safeGet(API_ENDPOINTS.getSubserviceAF),
              safeGet(API_ENDPOINTS.getImages),
              safeGet(API_ENDPOINTS.getFacultyInfo),
              safeGet(API_ENDPOINTS.getFacultyContact),
              safeGet(API_ENDPOINTS.getFacultyBG),
              safeGet(API_ENDPOINTS.getResearchlabTag),
            ]);

            const facultyData = facultyRes.data?.data || [];
            const eventData = eventRes.data?.data || [];
            const newsData = newsRes.data?.data || [];
            const announcementData = announcementRes.data?.data || [];
            const scholarshipData = scholarshipRes.data?.data || [];
            const careerData = careerRes.data?.data || [];
            const researchData = researchRes.data?.data || [];
            const researchlabData = researchlabRes.data?.data || [];
            const partnerData = partnerRes.data?.data || [];
            const testimonialData = testimonialRes.data?.data || [];
            const textData = textRes.data?.data || [];
            const faqData = faqRes.data?.data || [];
            const subFaqData = subFaqRes.data?.data || [];
            const serviceData = serviceRes.data?.data || [];
            const academicData = academicRes.data?.data || [];
            const introData = introRes.data?.data || [];
            const importantData = importantRes.data?.data || [];
            const availableData = availableRes.data?.data || [];
            const applyData = applyRes.data?.data || [];
            const futureData = futureRes.data?.data || [];
            const unlockData = unlockRes.data?.data || [];
            const feeData = feeRes.data?.data || [];
            const studyData = studyRes.data?.data || [];
            const criteriaData = criteriaRes.data?.data || [];
            const addOnCSDData = addOnCSDRes.data?.data || [];
            const galleryData = galleryRes.data?.data || [];
            const subRequirementData = subRequirementRes.data?.data || [];
            const facilitiesData = facilitiesRes.data?.data || [];
            const specializationData = specializationRes.data?.data || [];
            const typeData = typeRes.data?.data || [];
            const subTypeData = subTypeRes.data?.data || [];
            const subImportantData = subImportantRes.data?.data || [];
            const subApplyData = subApplyRes.data?.data || [];
            const subFutureData = subFutureRes.data?.data || [];
            const subAvailableData = subAvailableRes.data?.data || [];
            const subStudyDegreeData = subStudyDegreeRes.data?.data || [];
            const contactData = contactRes.data?.data || [];
            const developerData = developerRes.data?.data || [];
            const devSocialData = devSocialRes.data?.data || [];
            const feedbackData = feedbackRes.data?.data || [];
            const subContactData = subContactRes.data?.data || [];
            const researchTitleData = researchTitleRes.data?.data || [];
            const researchDescData = researchDescRes.data?.data || [];
            const researchProjectData = researchProjectRes.data?.data || [];
            const researchMeetingData = researchMeetingRes.data?.data || [];
            const departmentData = departmentRes.data?.data || [];
            const subServiceData = subServiceRes.data?.data || [];
            const imagesData = imageRes.data?.data || [];
            const facultyInfoData = facultyInfoRes.data?.data || [];
            const facultyContactData = facultyContactRes.data?.data || [];
            const facultyBGData = facultyBGRes.data?.data || [];
            const researchlabTagData = researchlabTagRes.data?.data || [];

            setGlobalData(prev => ({
              ...prev,
              faculty: facultyData,
              events: eventData,
              news: newsData,
              announcements: announcementData,
              scholarships: scholarshipData,
              careers: careerData,
              research: researchData,
              researchlab: researchlabData,
              partners: partnerData,
              testimonials: testimonialData,
              texts: textData,
              faqs: faqData,
              subfaqs: subFaqData,
              services: serviceData,
              academics: academicData,
              intros: introData,
              importants: importantData,
              availables: availableData,
              applies: applyData,
              futures: futureData,
              unlocks: unlockData,
              fees: feeData,
              studies: studyData,
              criterias: criteriaData,
              addOnCSD: addOnCSDData,
              galleries: galleryData,
              subRequirements: subRequirementData,
              facilities: facilitiesData,
              specializations: specializationData,
              types: typeData,
              subTypes: subTypeData,
              subImportants: subImportantData,
              subApplies: subApplyData,
              subfutures: subFutureData,
              subAvailables: subAvailableData,
              subStudyDegrees: subStudyDegreeData,
              contacts: contactData,
              developers: developerData,
              devSocials: devSocialData,
              feedbacks: feedbackData,
              subContacts: subContactData,
              researchTitles: researchTitleData,
              researchDescs: researchDescData,
              researchProjects: researchProjectData,
              researchMeetings: researchMeetingData,
              departments: departmentData,
              subServices: subServiceData,
              images: imagesData,
              facultyInfo: facultyInfoData,
              facultyContacts: facultyContactData,
              facultyBackgrounds: facultyBGData,
              researchlabTags: researchlabTagData
            }));

            const searchData = [
              ...allPages,
              ...facultyData,
              ...eventData,
              ...newsData,
              ...announcementData,
              ...scholarshipData,
              ...careerData,
              ...researchData,
              ...researchlabData
            ];
            setAllSearchData(searchData);
          } catch (err) {
            console.error('Error during deferred data fetch:', err);
          }
        }, 500);

      } catch (err) {
        console.error('Error during initial data fetch:', err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  const updateDetailPages = (sections, pages, lang) => {
    setFacultyDetailPage(findPageBySectionType(sections, pages, "FacultyDetail", lang));
    setResearchDetailPage(findPageBySectionType(sections, pages, "ResearchDetail", lang));
    setResearchlabDetailPage(findPageBySectionType(sections, pages, "ResearchlabDetail", lang));
    setScholarshipDetailPage(findPageBySectionType(sections, pages, "ScholarshipDetail", lang));
    setNewDetailPage(findPageBySectionType(sections, pages, "NewDetail", lang));
    setEventDetailPage(findPageBySectionType(sections, pages, "EventDetail", lang));
    setAnnouncementDetailPage(findPageBySectionType(sections, pages, "AnnouncementDetail", lang));
    setCareerDetailPage(findPageBySectionType(sections, pages, "CareerDetail", lang));
  };

  // Sync currentLang with URL changes
  useEffect(() => {
    const langFromUrl = location.pathname.includes('/km') ? 2 : 1;
    if (langFromUrl !== currentLang) {
      setCurrentLang(langFromUrl);
    }
  }, [location.pathname]);

  // Fetch settings and update detail pages when language changes
  useEffect(() => {
    if (isTokenFetched) {
      fetchSettings(currentLang);
      if (allSections.length > 0 && pages.length > 0) {
        updateDetailPages(allSections, pages, currentLang);
      }
    }
  }, [currentLang, isTokenFetched, allSections, pages]);

  const fetchSettings = async (lang) => {
    try {
      const res = await axiosInstance.get(`${API_ENDPOINTS.getSetting}/lang/${lang}`);
      const settingData = res.data?.data || [];
      
      // Store raw settings in globalData for sections to use
      setGlobalData(prev => ({ ...prev, settings: settingData }));

      const langSetting = Array.isArray(settingData)
        ? settingData.find(item => item.lang === lang)
        : settingData;

      if (langSetting) {
        setSettings({
          facultyTitle: langSetting.set_facultytitle || "",
          departmentTitle: langSetting.set_facultydep || "",
          baseUrl: langSetting.set_baseurl || "",
          logoUrl: langSetting.logo?.img
            ? `${API}/storage/uploads/${langSetting.logo.img}`
            : "/placeholder-icon.png"
        });

        if (langSetting.logo?.img) {
          const favicon = document.querySelector("link[rel='icon']");
          if (favicon) {
            favicon.href = `${API}/storage/uploads/${langSetting.logo.img}`;
          }
        }
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  async function requestGuestToken() {
    try {
      const response = await axiosInstance.post(`${API_BASEURL}/guest-token`);
      const token = response.data?.token;
      if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to get guest token:', error);
      return false;
    }
  }

  return (
    <DataContext.Provider value={{ 
      pages, allSections, menus, allSearchData, settings, currentLang, globalData, isLoading 
    }}>
      <Routes>
        {settings && <Route path="/" element={<Navigate to={settings.baseUrl} replace />} />}
        {settings && <Route path="/km" element={<Navigate to={`${settings.baseUrl}`} replace />} />}
        {pages.map(page => (
          <Route
            key={page.p_id}
            path={`/:lang(km)?/${page.p_alias}/*`}
            element={
              <PageRenderer
                page={page}
                pages={pages}
                allSections={allSections}
                menus={menus}
                allSearchData={allSearchData}
                currentLang={currentLang}
                setCurrentLang={setCurrentLang}
                settings={settings}
                setSettings={setSettings}
                facultyDetailPage={facultyDetailPage}
                researchDetailPage={researchDetailPage}
                researchlabDetailPage={researchlabDetailPage}
                scholarshipDetailPage={scholarshipDetailPage}
                newDetailPage={newDetailPage}
                eventDetailPage={eventDetailPage}
                announcementDetailPage={announcementDetailPage}
                careerDetailPage={careerDetailPage}
              />
            }
          />
        ))}
        {!isLoading && <Route path="*" element={<NotFound />} />}
      </Routes>
    </DataContext.Provider>
  );
}


function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

