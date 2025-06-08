import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { API_ENDPOINTS, API, axiosInstance, API_BASEURL } from './Service/APIconfig';
import axios from 'axios';
import PageRenderer from './Component/PageRenderer';
import Faculty from './Component/Faculty/FacultyDepartment';

function AppRoutes() {
  const location = useLocation();
  const [pages, setPages] = useState([]);
  const [settings, setSettings] = useState(null);
  const [currentLang, setCurrentLang] = useState(1);
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

  useEffect(() => {
    const fetchData = async () => {
      await requestGuestToken();
      localStorage.removeItem('token');
      try {
        const pageRes = await axiosInstance.get(API_ENDPOINTS.getPage);
        const allPages = pageRes.data?.data || [];
        setPages(allPages);

        const sectionRes = await axiosInstance.get(API_ENDPOINTS.getSection);
        const allSections = sectionRes.data?.data || [];

        const facultyPage = findPageBySectionType(allSections, allPages, "FacultyDetail", currentLang);
        if (facultyPage) setFacultyDetailPage(facultyPage);

        const researchPage = findPageBySectionType(allSections, allPages, "ResearchDetail", currentLang);
        if (researchPage) setResearchDetailPage(researchPage);

        const researchlabPage = findPageBySectionType(allSections, allPages, "ResearchlabDetail", currentLang);
        if (researchlabPage) setResearchlabDetailPage(researchlabPage);

        const scholarshipPage = findPageBySectionType(allSections, allPages, "ScholarshipDetail", currentLang);
        if (scholarshipPage) setScholarshipDetailPage(scholarshipPage);

        const newPage = findPageBySectionType(allSections, allPages, "NewDetail", currentLang);
        if (newPage) setNewDetailPage(newPage);

        const eventPage = findPageBySectionType(allSections, allPages, "EventDetail", currentLang);
        if (eventPage) setEventDetailPage(eventPage);

        const announcementPage = findPageBySectionType(allSections, allPages, "AnnouncementDetail", currentLang);
        if (announcementPage) setAnnouncementDetailPage(announcementPage);

        const careerPage = findPageBySectionType(allSections, allPages, "CareerDetail", currentLang);
        if (careerPage) setCareerDetailPage(careerPage);

      } catch (err) {
        console.error('Error fetching pages or sections:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      const langFromUrl = location.pathname.includes('/km') ? 2 : 1;
      setCurrentLang(langFromUrl);
      localStorage.removeItem('token');
      await requestGuestToken();

      // let token = localStorage.getItem('token');
      // if (!token) {
      //   await requestGuestToken();
      //   token = localStorage.getItem('token');
      // }

      // if (token) {
      //   axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // }

      try {
        const res = await axiosInstance.get(`${API_ENDPOINTS.getSetting}/lang/${langFromUrl}`);
        const settingData = res.data?.data || [];
        const langSetting = Array.isArray(settingData)
          ? settingData.find(item => item.lang === langFromUrl)
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

    fetchSettings();
  }, [location.pathname]);

  async function requestGuestToken() {
    try {
      const response = await axiosInstance.post(`${API_BASEURL}/guest-token`);
      const token = response.data?.token;

      if (token) {
        // localStorage.setItem('token', token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Failed to get guest token:', error);
    }
  }

  return settings ? (
    <Routes>
      <Route path="/" element={<Navigate to={settings.baseUrl} replace />} />
      <Route path="/km" element={<Navigate to={`${settings.baseUrl}`} replace />} />
      {pages.map(page => (
        <Route
          key={page.p_id}
          path={`/:lang(km)?/${page.p_alias}/*`}
          element={
            <PageRenderer
              page={page}
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
    </Routes>
  ) : (
    <div className="text-center py-8">Loading...</div>
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
