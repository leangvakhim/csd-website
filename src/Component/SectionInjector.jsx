import React from 'react';
import FacultyDepartment from './Faculty/FacultyDepartment';
import FacultyDetail from './Faculty/FacultyDetail';
import DeveloperSection from './developer/DeveloperSection';
import { useParams } from 'react-router-dom';

const SectionInjector = ({ alias, setOnlyContentMode }) => {
  const { id } = useParams();
  const path = window.location.pathname;
  const lastSegment = path.split('/').pop();

  switch (alias) {
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
        return <DeveloperDetail developerId={lastSegment} />;
      }
      setOnlyContentMode(false);
      return <DeveloperSection />;
    default:
      setOnlyContentMode(false);
      return null;
  }
};

export default SectionInjector;