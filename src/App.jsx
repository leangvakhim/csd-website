import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { API_ENDPOINTS, API } from './Service/APIconfig';
import axios from 'axios';
import PageRenderer from './Component/PageRenderer';
import Faculty from './Component/Faculty/Faculty';

function App() {
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
    axios.get(API_ENDPOINTS.getSetting)
      .then(res => {
        const settingData = res.data?.data || [];
        const langSetting = settingData.find(item => item.lang === currentLang);
        if (langSetting) {
          setSettings({
            facultyTitle: langSetting.set_facultytitle || "",
            departmentTitle: langSetting.set_facultydep || "",
            baseUrl: langSetting.set_baseurl || "",
            logoUrl: langSetting.logo?.img
              ? `${API}/storage/uploads/${langSetting.logo.img}`
              : "/placeholder-icon.png"
          });
        }
      })
      .catch(err => console.error("Error fetching settings:", err));
  }, [currentLang]);
  return (
    <Router>
      {settings ? (
        <Routes>
          <Route path="/" element={<Navigate to={settings.baseUrl} replace />} />
          {/* <Route path="/faculty" element={<Faculty/>}/> */}
          {pages.map(page => (
            <Route
              key={page.p_id}
              path={page.p_alias}
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
        <div className="text-center py-8">Loading...</div> // ✅ Show a loading message
      )}
    </Router>
  );
}

export default App
