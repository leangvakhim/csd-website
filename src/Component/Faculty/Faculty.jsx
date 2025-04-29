import React from 'react'
import DeputyHeadofDepartment from './DeputyHeadofDepartment'

const Faculty = () => {
  return (
    <div>
       <DeputyHeadofDepartment language="en" /> {/* English deputies */}
       <DeputyHeadofDepartment language="km" /> {/* Khmer deputies */}
    </div>
  )
}

export default Faculty;