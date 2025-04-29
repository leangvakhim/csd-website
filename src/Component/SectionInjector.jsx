import React from 'react'
import FacultyDepartment from './Faculty/FacultyDepartment'
import { useParams } from 'react-router-dom';
import FacultyDetail from './Faculty/FacultyDetail';

const SectionInjector = ({alias, setOnlyContentMode}) => {
    const { id } = useParams();
    const path = window.location.pathname;
    const lastSegment = path.split('/').pop();

    switch (alias){
        case '/faculty':

            if (lastSegment && lastSegment !== 'faculty') {
                setOnlyContentMode(true);
                return <FacultyDetail facultyId={lastSegment} />;
            }
            setOnlyContentMode(false);
            return <FacultyDepartment />

        default:
            setOnlyContentMode(false);
            return null;
    }
}

export default SectionInjector