import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API, API_ENDPOINTS } from '../../Service/APIconfig';

const EventData = ({ sectionId, menuLang }) => {
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(`${API_ENDPOINTS.getEvent}?section_id=${sectionId}&lang=${menuLang}`)
            .then((response) => {
                const data = response.data?.data || {};
                const formattedData = {
                    date: data.e_date || 'TBD',
                    title: data.e_title || 'Untitled Event',
                    shortTitle: data.e_shorttitle || '',
                    detail: data.e_detail || 'No details available.',
                };
                setEventData(formattedData);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching event data:', err);
                setError('Failed to load event data.');
                setLoading(false);
            });
    }, [sectionId, menuLang]);

    if (loading) {
        return (
            <div className="my-16">
                <div className="max-w-4xl mx-auto px-4">
                    <p>Loading event data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-16">
                <div className="max-w-4xl mx-auto px-4">
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-16">
            <div className="max-w-4xl mx-auto px-4">
                <section>
                    <h2 className="text-2xl font-bold mb-4">
                        {eventData.title}
                    </h2>
                    <div
                        className="text-gray-700"
                        dangerouslySetInnerHTML={{ __html: eventData.detail }}
                    />
                </section>
            </div>
        </div>
    );
};

export default EventData;