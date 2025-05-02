import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../Service/APIconfig';
import EventBanner from './EventBanner';
import SocialSection from '../Social/SocialSection';
import EventData from './EventData';
import RelatedEvent from './RelatedEvent';

const EventsNewsDetails = ({ eventId, newId }) => {
  const [event, setEvent] = useState(null);
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let eventData = null;
        let newsData = null;

        if (eventId) {
          const eventRes = await axios.get(`${API_ENDPOINTS.getEvent}/${eventId}`);
          eventData = eventRes.data?.data;
          if (!eventData || eventData.e_id !== parseInt(eventId)) {
            throw new Error('Event not found.');
          }
           setEvent(eventData);
        }

        if (newId) {
          const newsRes = await axios.get(`${API_ENDPOINTS.getNews}/${newId}`);
          newsData = newsRes.data?.data;
          if (!newsData || newsData.n_id !== parseInt(newId)) {
            throw new Error('News not found.');
          }
          setNews(newsData);
        }

       
       
        setLoading(false);
      } catch (error) {
        setError(error.message || 'Failed to fetch content.');
        setLoading(false);
      }
    };

    if (eventId || newId) {
      fetchData();
    } else {
      setError('No event or news ID provided.');
      setLoading(false);
    }
  }, [eventId, newId]);

  // Debug logs to verify data
  useEffect(() => {
    console.log('Event ID:', eventId);
    console.log('New ID:', newId);
    console.log('Event Data:', event);
    console.log('News Data:', news);
  }, [eventId, newId, event, news]);

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

  // Prioritize news if newId and news exist, otherwise use event if eventId and event exist
  const displayData = newId && news ? news : (eventId && event ? event : null);

  if (!displayData) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <p className="text-sm sm:text-base lg:text-lg text-gray-500">No event or news details found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {(eventId || newId) && <EventBanner eventId={eventId} newId={newId} />}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <SocialSection event={event} news={news} />
          <EventData event={event} news={news} eventId={eventId} newId={newId} />
          {(eventId || newId) && <RelatedEvent eventId={eventId} newId={newId} />}
        </div>
      </div>
    </div>
  );
};

export default EventsNewsDetails;