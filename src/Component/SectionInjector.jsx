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
import EventNewsInfo from './New/EventNewsInfo';
import ResearchInfo from './Research/ResearchInfo';

const SectionInjector = ({ alias, setOnlyContentMode }) => {
  const { id, sec_page } = useParams(); // Added sec_page from useParams
  const path = window.location.pathname;
  const lastSegment = path.split('/').pop();
  const normalizedAlias = alias.replace(/^\/km/, '');

  // Use sec_page if available, otherwise fall back to normalizedAlias
  const sectionKey = sec_page || normalizedAlias;

  React.useEffect(() => {
    const shouldOnlyShowContent =
      (sectionKey === '/faculty' && lastSegment && lastSegment !== 'faculty') ||
      (sectionKey === '/developer' && lastSegment && lastSegment !== 'developer') ||
      (sectionKey === '/research' && lastSegment && lastSegment !== 'research') ||
      (sectionKey === '/researchlab' && lastSegment && lastSegment !== 'researchlab') ||
      (sectionKey === '/scholarship' && lastSegment && lastSegment !== 'scholarship') ||
      (sectionKey === '/events' && lastSegment && lastSegment !== 'events') ||
      (sectionKey === '/news' && lastSegment && lastSegment !== 'news') ||
      (sectionKey === '/career' && lastSegment && lastSegment !== 'career') ||
      (sectionKey === '/announcement' && lastSegment && lastSegment !== 'announcement');

    setOnlyContentMode(shouldOnlyShowContent);
  }, [sectionKey, lastSegment, setOnlyContentMode]);

  switch (sectionKey) {
    case '/faculty':
      if (lastSegment && lastSegment !== 'faculty') {
        return <FacultyDetail facultyId={lastSegment} />;
      }
      return <FacultyDepartment />;

    case '/developer':
      if (alias.endsWith('/developer')) {
        if (lastSegment && lastSegment !== 'developer') {
          return <DeveloperDetail developerId={lastSegment} />;
        }
        return <DeveloperSection />;
      }

    case '/research':
      if (lastSegment && lastSegment !== 'research') {
        return <ResearchDetails refId={lastSegment} />;
      }
      return <ResearchInfo/>;

    case '/researchlab':
      if (lastSegment && lastSegment !== 'researchlab') {
        return <ResearchLabDetails researchlabId={lastSegment} />;
      }
      return ''; // Replaced empty string with a sensible default

    case '/scholarship':
      if (lastSegment && lastSegment !== 'scholarship') {
        return <ScholarshipDetails scholarshipId={lastSegment} />;
      }
      return <div></div>;

    case '/events':
      if (lastSegment && lastSegment !== 'events') {
        return <EventsNewsDetails  eventId={lastSegment}/>;
      }
      return <div></div>; // Main page content

    case '/news':
      if (lastSegment && lastSegment !== 'news') {
        return <NewDetails  newId={lastSegment} />;
      }
      return <div></div>; // Main page content

    case '/news&events':
      return <EventNewsInfo/>; // Main page content

    case '/career':
      if (lastSegment && lastSegment !== 'career') {
        return <CareerDetails careerId={lastSegment} />;
      } else {
        return ''; // Replace <div></div> with your actual banner or list component
      }

    case '/announcement':
      if (lastSegment && lastSegment !== 'announcement') {
        return <AnnouncementDetails announcementID={lastSegment}/>;
      }

      return <div></div>; // Main page content

    default:
      return null;
  }
};

export default SectionInjector;