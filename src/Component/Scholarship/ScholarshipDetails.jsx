import React, { useEffect, useState } from 'react';
import ScholarshipBanner from './ScholarshipBanner';
import ScholarshipApplication from './ScholarshipApplication';
import ScholarshipOverview from './ScholarshipOverview';
import { useData } from '../../Context/DataContext';

const ScholarshipDetails = ({ scholarshipId }) => {
    const { globalData, isLoading } = useData();
    const [sections, setSections] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (globalData?.scholarship) {
            const sorted = (globalData.scholarship || [])
                .filter(
                    (item) =>
                        item.display === 1 &&
                        item.active === 1 &&
                        item.ref_id === parseInt(scholarshipId)
                )
                .sort((a, b) => a.sc_orders - b.sc_orders);
            setSections(sorted);
            if (sorted.length === 0) {
                setError('Failed to fetch scholarship details.');
            } else {
                setError(null);
            }
        }
    }, [scholarshipId, globalData]);

    if (isLoading) return null;

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