import React from 'react'
import Faculty from './Faculty/Faculty'

const SectionInjector = ({alias}) => {
    switch (alias){
        case '/faculty':
            return <Faculty />
        case '/developer':
            return <div>Developer</div>
        default:
            return null;
    }
}

export default SectionInjector