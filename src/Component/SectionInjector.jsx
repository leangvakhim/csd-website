import React from 'react'
import Faculty from './Faculty/Faculty'

const SectionInjector = ({alias}) => {
    switch (alias){
        case '/faculty':
            return <Faculty />

        default:
            return null;
    }
}

export default SectionInjector