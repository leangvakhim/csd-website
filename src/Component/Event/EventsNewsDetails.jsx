import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../Service/APIconfig';
import EventBanner from './EventBanner';
import SocialSection from '../Social/SocialSection';
import EventData from './EventData';
import RelatedEvent from './RelatedEvent';

const EventsNewsDetails = ( { eventId, newId }) => {
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

        // Fetch event data if eventId is provided
        if (eventId) {
          const eventRes = await axios.get(`${API_ENDPOINTS.getEvent}/${eventId}`);
          eventData = eventRes.data?.data;
          if (!eventData || eventData.e_id !== parseInt(eventId)) {
            throw new Error('Event not found.');
          }
        }

        // Fetch news data if newId is provided
        if (newId) {
          const newsRes = await axios.get(`${API_ENDPOINTS.getNews}/${newId}`);
          newsData = newsRes.data?.data;
          if (!newsData || newsData.n_id !== parseInt(newId)) {
            throw new Error('News not found.');
          }
        }

        setEvent(eventData);
        setNews(newsData);
        setLoading(false);
      } catch (error) {
        setError(error.message || 'Failed to fetch content.');
        setLoading(false);
      }
    };

    // Fetch data if at least one ID is provided
    if (eventId || newId) {
      fetchData();
    } else {
      setError('No event or news ID provided.');
      setLoading(false);
    }
  }, [eventId, newId]);

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

  if (!event && !news) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <p className="text-sm sm:text-base lg:text-lg text-gray-500">No event or news details found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Conditionally render EventBanner based on eventId and newId */}
      {(eventId || newId) && <EventBanner eventId={eventId} newId={newId} />}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          {/* Render SocialSection with available data */}
          <SocialSection event={event} news={news} />
          {/* Render EventData with available data */}
          <EventData event={event} news={news} />
          {/* Conditionally render RelatedEvent if eventId or newId is provided */}
          {(eventId || newId) && <RelatedEvent eventId={eventId} newId={newId} />}
        </div>
      </div>
    </div>
  );
};

export default EventsNewsDetails;