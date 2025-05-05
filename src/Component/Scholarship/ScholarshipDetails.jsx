
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API } from '../../Service/APIconfig';
import ScholarshipBanner from './ScholarshipBanner';
import ScholarshipApplication from './ScholarshipApplication';
import ScholarshipOverview from './ScholarshipOverview';

const ScholarshipDetails = ({ scholarshipId }) => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.getScholarship);
                const sorted = response.data.data
                    .filter(
                        (item) =>
                            item.display === 1 &&
                            item.active === 1 &&
                            item.ref_id === parseInt(scholarshipId)
                    )

                    .sort((a, b) => a.sc_orders - b.sc_orders);
                setSections(sorted);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch scholarship details.');
                console.error('Failed to fetch scholarship sections:', error);
                setLoading(false);
            }
        };
        fetchSections();
    }, [scholarshipId]);


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
            <ScholarshipBanner scholarshipId={scholarshipId} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <ScholarshipOverview scholarshipId={scholarshipId} />
                <ScholarshipApplication scholarshipId={scholarshipId} />

            </div>
        </div>
    );
};

export default ScholarshipDetails;