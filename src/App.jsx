import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { API_ENDPOINTS, API } from './Service/APIconfig';
import axios from 'axios';
import PageRenderer from './Component/PageRenderer';
import Faculty from './Component/Faculty/FacultyDepartment';

function AppRoutes() {
  const location = useLocation();
  const [pages, setPages] = useState([]);
  const [settings, setSettings] = useState(null);
  const [currentLang, setCurrentLang] = useState(1);

  useEffect(() => {
    axios.get(API_ENDPOINTS.getPage)
      .then(res => {
        const pageData = res.data?.data || [];
        setPages(pageData);
      })
      .catch(err => console.error('Error fetching pages:', err));
  }, []);

  useEffect(() => {
    const langFromUrl = location.pathname.includes('/km') ? 2 : 1;
    setCurrentLang(langFromUrl);

    axios.get(`${API_ENDPOINTS.getSetting}/lang/${langFromUrl}`)
      .then(res => {
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
      })
      .catch(err => console.error("Error fetching settings:", err));
  }, [location.pathname]);

  return settings ? (
    <Routes>
      <Route path="/" element={<Navigate to={settings.baseUrl} replace />} />
      {pages.map(page => (
        <Route
          key={page.p_id}
          path={
            page.p_alias === '/faculty'
              ? '/faculty/*'
              : page.p_alias === '/research'
                ? '/research/*'
                : page.p_alias === '/scholarship'
                  ? '/scholarship/*'
                  : page.p_alias === '/researchlab'
                    ? '/researchlab/*'
                    : page.p_alias === '/events'
                      ? '/events/*'
                        : page.p_alias === '/news'
                          ? '/news/*'
                          : page.p_alias === '/career'
                            ? '/career/*'
                            : page.p_alias === '/announcement'
                              ? '/announcement/*'
                              : page.p_alias
          }
          element={
            <PageRenderer
              page={page}
              currentLang={currentLang}
              setCurrentLang={setCurrentLang}
              settings={settings}
              setSettings={setSettings}
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
