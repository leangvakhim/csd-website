import React from 'react';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import SocialIcon from '../social/SocialIcon';
import { Link } from 'react-router-dom';

const FooterNotfound = () => {
    return (
        <div className="border-t border-gray-800 py-6">
            <div className="max-w-4xl mx-auto px-6 text-center items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                <div>
                    <p className="text-gray-700 font-semibold">You can contact us:</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <FaPhone className="text-gray-700" />
                    <p className="text-gray-600">+855 12345678</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <FaEnvelope className="text-gray-600" />
                    <Link to="mailto:rupp@gmail.com" className="text-gray-700 hover:underline">
                        ruppdcs@gmail.com
                    </Link>
                </div>
                <div className="flex justify-center -my-16">
                    <SocialIcon />
                </div>
            </div>
        </div>
    );
};

export default FooterNotfound;
