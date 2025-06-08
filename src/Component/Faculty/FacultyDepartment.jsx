import React from 'react'
import HeadofDepartment from './HeadofDepartment';
import DeputyHeadofDepartment from './DeputyHeadofDepartment';
import FacultyMemeber from './FacultyMemeber';

const Faculty = ({section, facultyDetailPage}) => {

  return (
    <div>

      <HeadofDepartment section={section} facultyDetailPage={facultyDetailPage}/>
      <DeputyHeadofDepartment section={section} facultyDetailPage={facultyDetailPage}/>
      <FacultyMemeber section={section} facultyDetailPage={facultyDetailPage}/>

    </div>
  )
}

export default Faculty;