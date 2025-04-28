import React from 'react';
import { Link } from 'react-router-dom';

const CopyRight = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className='text-center text-gray-300 py-5'>
            <p className="tracking-wide">
                © {currentYear} Department of Computer Science. All rights reserved. Developed by{" "}
                <Link to="/developer" className="text-red-900 hover:underline">
                    25th Generation Students
                </Link>
            </p>
        </footer>
    );
};

export default CopyRight;