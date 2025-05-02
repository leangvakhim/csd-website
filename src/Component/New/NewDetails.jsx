import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../Service/APIconfig';
import EventBanner from './EventBanner';
import SocialSection from '../Social/SocialSection';
import EventData from './EventData';
import RelatedEvent from './RelatedEvent';

const NewDetails = ({ newsId }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.getNews);

        // Log the response for debugging
        console.log('API Response:', response.data);

        // Access the nested 'data' property
        const eventData = response.data.data;

        // Check if eventData is an object and matches the newsId
        if (!eventData || typeof eventData !== 'object') {
          console.error('Expected an event object but got:', eventData);
          throw new Error('Invalid data format: Expected an event object.');
        }

        // Verify the event ID matches
        if (eventData.e_id !== parseInt(newsId)) {
          console.warn(`Event ID mismatch: expected ${newsId}, got ${eventData.e_id}`);
          throw new Error('Event not found.');
        }

        // Wrap the single event object in an array for consistency
        const sorted = [eventData].sort((a, b) => a.e_orders - b.e_orders); // Sorting optional for single item

        setSections(sorted);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch event sections:', error);
        setError(error.message || 'Failed to fetch event details. Please try again later.');
        setLoading(false);
      }
    };

    if (newsId && !isNaN(parseInt(newsId))) {
      fetchSections();
    } else {
      console.warn('Invalid newsId:', newsId);
      setError('Invalid event ID.');
      setLoading(false);
    }
  }, [newsId]);

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

  if (!sections.length) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <p className="text-sm sm:text-base lg:text-lg text-gray-500">No event details found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <EventBanner newsId={newsId} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {sections.map((section) => (
          <div key={section.e_id} className="py-4">
            <SocialSection />
            <EventData />
            <RelatedEvent />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewDetails;