import React from 'react';
import FacultyDepartment from './Faculty/FacultyDepartment';
import FacultyDetail from './Faculty/FacultyDetail';
import DeveloperSection from './developer/DeveloperSection';
// Assuming DeveloperDetail exists; import it if available
// import DeveloperDetail from './developer/DeveloperDetail';
import ResearchDetails from './Research/ResearchDetails';
import ResearchSection from './Research/ResearchSection';
import ResearchLabDetails from './ResearchDetails/ResearchLabDetails';
import ScholarshipDetails from './Scholarship/ScholarshipDetails';
import EventsDetails from './Event/EventsDetails';
import { useParams } from 'react-router-dom';

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
      if (lastSegment && lastSegment !== 'developer') {
        setOnlyContentMode(true);
        // Replace with actual DeveloperDetail component if available
        return <div>Developer Detail (ID: {lastSegment})</div>;
        // return <DeveloperDetail developerId={lastSegment} />;
      }
      setOnlyContentMode(false);
      return '';

    case '/research':
      if (lastSegment && lastSegment !== 'research') {
        setOnlyContentMode(true);
        return <ResearchDetails researchId={lastSegment} />;
      }
      setOnlyContentMode(false);
      return ''; // Replaced empty string with ResearchSection

    case '/researchlab': // Added leading '/' for consistency
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
      return <div></div>; // Placeholder; replace with actual component

    case '/news&events':
      if (lastSegment && lastSegment !== 'news&events') {
        setOnlyContentMode(true);
        return <EventsDetails eventId={lastSegment} />;
      }
      setOnlyContentMode(false);
      return <div></div>; // Placeholder; replace with actual component

    default:
      setOnlyContentMode(false);
      return null;
  }
};

export default SectionInjector;