import React, {useEffect} from 'react';
import { FaHome } from 'react-icons/fa';
import logo from '../assets/rupp.png';
// import { Helmet } from 'react-helmet';

const NotFound = () => {

    useEffect(() => {
        document.title = '404 Not Found - Department of Computer Science';
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen ">
            <div className="flex justify-center items-center gap-2 lg:gap-6 mb-4 lg:mb-8">
                <span className="text-7xl md:text-9xl font-extrabold text-red-900">4</span>
                <div className="w-20 h-20 md:w-32 md:h-32">
                <img
                    src={logo}
                    alt="Royal University of Phnom Penh Logo"
                    className="w-full h-full object-contain"
                />
            </div>
            <span className="text-7xl md:text-9xl font-extrabold text-red-900">4</span>
          </div>
          <div className="text-xl text-red-900 lg:text-2xl font-semibold mb-2 lg:mb-4">Opp! This Page is Not Found.</div>
          <div className="text-base lg:text-lg text-gray-600 mb-4 lg:mb-8">Please Return Back to Home Page</div>
          <button
          onClick={() => window.location.href = '/'}
          className="bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded">
            <FaHome className="inline-block mr-2" />
            Back Home
          </button>
        </div>
    );
}

export default NotFound