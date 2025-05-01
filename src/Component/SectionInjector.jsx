import React from 'react';
import FacultyDepartment from './Faculty/FacultyDepartment';
import FacultyDetail from './Faculty/FacultyDetail';
import DeveloperSection from './developer/DeveloperSection';
import { useParams } from 'react-router-dom';
import ResearchDetails from './Research/ResearchDetails';
import ResearchSection from './Research/ResearchSection';
import ResearchLabDetails from './ResearchDetails/ResearchLabDetails';
import ScholarshipDetails from './Scholarship/ScholarshipDetails';
import EventsDetails from './Event/EventsDetails';

const SectionInjector = ({ alias, setOnlyContentMode }) => {
  const { id } = useParams();
  const path = window.location.pathname;
  const lastSegment = path.split('/').pop();
  const normalizedAlias = alias.replace(/^\/km/, '');

  // switch (alias) {
  switch (normalizedAlias) {
    case '/faculty':
      if (alias.endsWith('/faculty')) {
        if (lastSegment && lastSegment !== 'faculty') {
          setOnlyContentMode(true);
          return <FacultyDetail facultyId={lastSegment} />;
        }
        setOnlyContentMode(false);
        return <FacultyDepartment />;
      }

    case '/developer':
      if (alias.endsWith('/developer')) {
        if (lastSegment && lastSegment !== 'developer') {
          setOnlyContentMode(true);
          return <DeveloperDetail developerId={lastSegment} />;
        }
        return <DeveloperSection />;
      }

    case '/research':
      if (alias.endsWith('/research')) {
        if (lastSegment && lastSegment !== 'research') {
          setOnlyContentMode(true);
          return <ResearchDetails researchId={lastSegment} />;
        }
        setOnlyContentMode(false);
        return '';
      }

    case 'researchlab':
      if (lastSegment && lastSegment !== 'researchlab') {
        setOnlyContentMode(true);
        return <ResearchLabDetails researchlabId={lastSegment} />;
      }
      setOnlyContentMode(false);
      return ''; 


    case '/scholarship': // Match the route with leading '/'
      if (lastSegment && lastSegment !== 'scholarship') {
        setOnlyContentMode(true);
        return <ScholarshipDetails scholarshipId={lastSegment} />;
      }
      setOnlyContentMode(false);
      return ''; 

      case '/news&events': // Match the route with leading '/'
      if (lastSegment && lastSegment !== 'news&events') {
        setOnlyContentMode(true);
        return <EventsDetails eventId={lastSegment} />;
      }
      setOnlyContentMode(false);
      return ''; // Add a component for the scholarship list


    default:
      setOnlyContentMode(false);
      return null;
  }
};

export default SectionInjector;