
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';
import EventBanner from './EventBanner';


const EventsDetails = ({ eventId }) => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.getEvent);
                const sorted = response.data.data
                    .filter(
                        (item) =>
                            item.display === 1 &&
                            item.active === 1 &&
                            item.e_id === parseInt(eventId)
                    )

                    .sort((a, b) => a.e_orders - b.e_orders);
                setSections(sorted);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch event details.');
                console.error('Failed to fetch event sections:', error);
                setLoading(false);
            }
        };
        fetchSections();
    }, [eventId]);


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
                <p className="text-sm sm:text-base lg:text-lg text-gray-500 animate-pulse">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
                <p className="text-sm sm:text-base lg:text-lg text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white">
           <EventBanner eventId={eventId}/>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
               dfghjhgfdyhgt
            </div>
        </div>
    );
};

export default EventsDetails;