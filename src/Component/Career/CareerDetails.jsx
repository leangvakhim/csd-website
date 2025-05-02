
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';
import CareerBanner from './CareerBanner';
import SocialSection from '../Social/SocialSection';


const CareerDetails = ({ careerId }) => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.getCareer);
                const sorted = response.data.data
                    .filter(
                        (item) =>
                            item.display === 1 &&
                            item.active === 1 &&
                            item.c_id === parseInt(careerId)
                    )

                    .sort((a, b) => a.c_orders - b.c_orders);
                setSections(sorted);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch scholarship details.');
                console.error('Failed to fetch scholarship sections:', error);
                setLoading(false);
            }
        };
        fetchSections();
    }, [careerId]);


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

    console.log('Career sections:', sections);

    return (
        <div className="bg-white">
            <CareerBanner careerId={careerId} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <SocialSection />
            </div>
        </div>
    );
};

export default CareerDetails;