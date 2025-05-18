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

  // useEffect(() => {

  //   axiosInstance.get(API_ENDPOINTS.getPage)
  //     .then(res => {
  //       const pageData = res.data?.data || [];
  //       setPages(pageData);
  //     })
  //     .catch(err => console.error('Error fetching pages:', err));
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      let token = localStorage.getItem('token');

      if (!token) {
        await requestGuestToken();
        token = localStorage.getItem('token');
      }

      if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      try {
        const pageRes = await axiosInstance.get(API_ENDPOINTS.getPage);
        setPages(pageRes.data?.data || []);
      } catch (err) {
        console.error('Error fetching pages:', err);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const langFromUrl = location.pathname.includes('/km') ? 2 : 1;
  //   setCurrentLang(langFromUrl);

  //   axiosInstance.get(`${API_ENDPOINTS.getSetting}/lang/${langFromUrl}`)
  //     .then(res => {
  //       const settingData = res.data?.data || [];
  //       const langSetting = Array.isArray(settingData)
  //         ? settingData.find(item => item.lang === langFromUrl)
  //         : settingData;

  //       if (langSetting) {
  //         setSettings({
  //           facultyTitle: langSetting.set_facultytitle || "",
  //           departmentTitle: langSetting.set_facultydep || "",
  //           baseUrl: langSetting.set_baseurl || "",
  //           logoUrl: langSetting.logo?.img
  //             ? `${API}/storage/uploads/${langSetting.logo.img}`
  //             : "/placeholder-icon.png"
  //         });

  //         if (langSetting.logo?.img) {
  //           const favicon = document.querySelector("link[rel='icon']");
  //           if (favicon) {
  //             favicon.href = `${API}/storage/uploads/${langSetting.logo.img}`;
  //           }
  //         }
  //       }
  //     })
  //     .catch(err => console.error("Error fetching settings:", err));
  // }, [location.pathname]);

  useEffect(() => {
    const fetchSettings = async () => {
      const langFromUrl = location.pathname.includes('/km') ? 2 : 1;
      setCurrentLang(langFromUrl);

      let token = localStorage.getItem('token');
      if (!token) {
        await requestGuestToken();
        token = localStorage.getItem('token');
      }

      if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

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
        localStorage.setItem('token', token);
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
          path={`/:lang(km)?${page.p_alias}/*`}
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
