import React from 'react'
import HeadofDepartment from './HeadofDepartment';
import DeputyHeadofDepartment from './DeputyHeadofDepartment';
import FacultyMemeber from './FacultyMemeber';

const Faculty = () => {
  return (
    <div>
      <HeadofDepartment/>
      <DeputyHeadofDepartment/>
      <FacultyMemeber/>
    </div>
  )
}

export default Faculty;