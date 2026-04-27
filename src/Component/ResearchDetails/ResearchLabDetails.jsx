import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../../Context/DataContext';

const ResearchLabDetails = ({researchlabId}) => {
    const { globalData, isLoading } = useData();
    const [researchLab, setResearchLab] = useState(null);
    const location = useLocation();
    const currentLang = location.pathname.startsWith('/km') ? 2 : 1;

    useEffect(() => {
        if (globalData?.researchlab && researchlabId) {
            const filtered = (globalData.researchlab || [])
                .filter(item =>
                    item.ref_id === Number(researchlabId) &&
                    item.lang === currentLang &&
                    item.display === 1 &&
                    item.active === 1
                );
            setResearchLab(filtered);
        }
    }, [researchlabId, currentLang, globalData]);

    if (isLoading) return null;

    return (
        <div className="my-8">
            <div className="container mx-auto px-4 flex flex-col">
                {researchLab && researchLab.length > 0 ? (
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: researchLab[0].rsdl_detail }} />
                ) : (
                    <p className='text-center'>No research lab details found.</p>
                )}
            </div>
        </div>
    )
}

export default ResearchLabDetails;