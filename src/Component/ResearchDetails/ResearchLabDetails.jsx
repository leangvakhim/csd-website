import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, API, axiosInstance } from '../../Service/APIconfig';
import { useLocation } from 'react-router-dom';

const ResearchLabDetails = ({researchlabId}) => {
    const [researchLab, setResearchLab] = useState(null);
    const location = useLocation();
    const currentLang = location.pathname.startsWith('/km') ? 2 : 1;

    useEffect(() => {
        axiosInstance.get(`${API_ENDPOINTS.getResearchlab}`)
            .then(response => {
                const filtered = response.data.data
                    .filter(item =>
                        item.ref_id === Number(researchlabId) &&
                        item.lang === currentLang &&
                        item.display === 1 &&
                        item.active === 1
                    )
                setResearchLab(filtered);
            })
            .catch(error => {
                console.error("Failed to fetch research lab data:", error);
            });
    }, [researchlabId, currentLang, location.pathname]);

    return (
        <div className="my-8">
            <div className="container mx-auto px-4 flex flex-col">
                {researchLab ? (
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: researchLab[0].rsdl_detail }} />
                ) : (
                    <p className='text-center'>Loading research lab details...</p>
                )}
            </div>
        </div>
    )
}

export default ResearchLabDetails;