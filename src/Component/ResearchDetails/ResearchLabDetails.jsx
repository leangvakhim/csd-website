import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';




const ResearchLabDetails = ({researchlabId}) => {
    const [researchLab, setResearchLab] = useState(null);

    useEffect(() => {
        axios.get(`${API_ENDPOINTS.getResearchlab}/${researchlabId}`)
            .then(response => {
                const lab = response.data.data;
                setResearchLab(lab);
            })
            .catch(error => {
                console.error("Failed to fetch research lab data:", error);
            });
    }, [researchlabId]);

    return (
        <div className="my-16">
            <div className="container mx-auto px-4 text-center flex flex-col items-center">
                {researchLab ? (
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: researchLab.rsdl_detail }} />
                ) : (
                    <p>Loading research lab details...</p>
                )}
            </div>
        </div>
    )
}

export default ResearchLabDetails;