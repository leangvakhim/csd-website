import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';
import { motion } from 'framer-motion';

const ResearchMeeting = ({rsdtId}) => {
    const [professorData, setProfessorData] = useState(null);

    console.log("rsdtId is; ",rsdtId);

    useEffect(() => {
        const fetchMeetingData = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.getRsdMeeting);
                const matched = response.data.data.find(item => item.title.rsdt_id === rsdtId);
                setProfessorData(matched);
            } catch (error) {
                console.error('Failed to fetch meeting data:', error);
            }
        };
        fetchMeetingData();
    }, [rsdtId]);

    if (!professorData) return null;

    const { rsdm_title, rsdm_detail, img } = professorData;
    const imageUrl = img?.img ? `${API}/storage/uploads/${img.img}` : '';

    return (
        <div className="my-16">
            <div className="container mx-auto px-4">
                <div className='flex flex-col md:flex-row items-center gap-10'>
                    {/* Image Section */}
                    <div className="h-full sm:h-[517px] sm:w-[476px] w-full">
                        <img
                            src={imageUrl}
                            alt={`Professor`}
                            className="rounded-lg shadow-lg w-full h-full"
                        />
                    </div>

                    {/* Text Section */}
                    <div className="md:w-2/3 md:pl-8">
                        <h2 className="text-3xl font-semibold mb-4">{rsdm_title}</h2>
                        <div
                            className="text-gray-700 mb-6"
                            dangerouslySetInnerHTML={{ __html: rsdm_detail }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResearchMeeting