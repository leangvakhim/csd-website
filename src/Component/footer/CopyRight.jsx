import React from 'react';
import { Link } from 'react-router-dom';

const CopyRight = () => {
    const currentYear = new Date().getFullYear();
    const currentLang = window.location.pathname.startsWith('/km') ? 2 : 1;

    return (
        <footer className='text-center text-gray-300 py-5'>
            <p className="tracking-wide">
                © {currentYear} {currentLang === 1 ? "Department of Computer Science. All rights reserved. Developed by" : "រក្សាសិទ្ធិគ្រប់យ៉ាងដោយដេប៉ាតឺម៉ង់ព័ត៌មានវិទ្យា។ អភិវឌ្ឍន៌ដោយ "}{" "}
                <Link to="/developer" className="text-red-900 hover:underline">
                    {currentLang === 1 ? "25th Generation Students" : "និស្សិតជំនាន់ទី ២៥"}
                </Link>
            </p>
        </footer>
    );
};

export default CopyRight;