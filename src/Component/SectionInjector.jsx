import React from 'react';
import FacultyDepartment from './Faculty/FacultyDepartment';
import FacultyDetail from './Faculty/FacultyDetail';
import DeveloperSection from './developer/DeveloperSection';
import ResearchDetails from './Research/ResearchDetails';
import ResearchSection from './Research/ResearchSection';
import ResearchLabDetails from './ResearchDetails/ResearchLabDetails';
import ScholarshipDetails from './Scholarship/ScholarshipDetails';
import EventsNewsDetails from './Event/EventsNewsDetails';
import { useParams } from 'react-router-dom';
import CareerDetails from './Career/CareerDetails';
import AnnouncementDetails from './Announcement/AnnouncementDetails';
import NewDetails from './New/NewDetails';

const SectionInjector = ({ alias, setOnlyContentMode }) => {
  const { id, sec_page } = useParams(); // Added sec_page from useParams
  const path = window.location.pathname;
  const lastSegment = path.split('/').pop();
  const normalizedAlias = alias.replace(/^\/km/, '');

  // Use sec_page if available, otherwise fall back to normalizedAlias
  const sectionKey = sec_page || normalizedAlias;

  switch (sectionKey) {
    case '/faculty':
      if (lastSegment && lastSegment !== 'faculty') {
        setOnlyContentMode(true);
        return <FacultyDetail facultyId={lastSegment} />;
      }
      setOnlyContentMode(false);
      return <FacultyDepartment />;

    case '/developer':
      if (alias.endsWith('/developer')) {
        if (lastSegment && lastSegment !== 'developer') {
          setOnlyContentMode(true);
          return <DeveloperDetail developerId={lastSegment} />;
        }
        return <DeveloperSection />;
      }

    case '/research':
      if (lastSegment && lastSegment !== 'research') {
        setOnlyContentMode(true);
        return <ResearchDetails researchId={lastSegment} />;
      }
      setOnlyContentMode(false);
      return '';

    case '/researchlab':
      if (lastSegment && lastSegment !== 'researchlab') {
        setOnlyContentMode(true);
        return <ResearchLabDetails researchlabId={lastSegment} />;
      }
      setOnlyContentMode(false);
      return ''; // Replaced empty string with a sensible default

    case '/scholarship':
      if (lastSegment && lastSegment !== 'scholarship') {
        setOnlyContentMode(true);
        return <ScholarshipDetails scholarshipId={lastSegment} />;
      }
      setOnlyContentMode(false);
      return <div></div>;

    case '/events':
      if (lastSegment && lastSegment !== 'events') {
        setOnlyContentMode(true);
        return <EventsNewsDetails  />;
      }
      setOnlyContentMode(false);
      return <div></div>; // Main page content

    case '/news':
      if (lastSegment && lastSegment !== 'news') {
        setOnlyContentMode(true);
        return <NewDetails  newId={lastSegment} />;
      }
      setOnlyContentMode(false);
      return <div></div>; // Main page content

    case '/career':
      if (lastSegment && lastSegment !== 'career') {
        setOnlyContentMode(true);
        return <CareerDetails careerId={lastSegment} />;
      } else {
        setOnlyContentMode(false);
        return ''; // Replace <div></div> with your actual banner or list component
      }

    case '/announcement':
      if (lastSegment && lastSegment !== 'announcement') {
        setOnlyContentMode(true);
        return <AnnouncementDetails announcementID={lastSegment}/>;
      }
        
      setOnlyContentMode(false);
      return <div></div>; // Main page content

    default:
      setOnlyContentMode(false);
      return null;
  }
};

export default SectionInjector;