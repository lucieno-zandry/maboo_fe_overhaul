import React from 'react';
import { Home, Frown } from 'lucide-react';
import notFound from "~/assets/images/404.png";
import Button from '../custom-components/button';
import { useNavigate } from 'react-router';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        // Responsive container filling the screen height
        <div className="min-h-screen flex items-center justify-center p-4 font-sans text-gray-800">
            <div className="flex flex-col items-center text-center p-6 sm:p-10 md:p-16 rounded-3xl border border-gray-100 max-w-xl w-full">

                {/* Placeholder for Flaticon Image */}
                {/*
          ACTION: Replace the <img/> tag below with your actual Flaticon image URL or SVG.
          The current placeholder uses a deep blue color that fits a modern theme.
        */}
                <div className="mb-8 w-48 h-48 sm:w-64 sm:h-64">
                    <img
                        src={notFound}
                        alt="Page not found illustration"
                        className="w-full h-full object-contain mx-auto rounded-xl"
                    />
                </div>

                {/* Large Error Code */}
                <div className="flex items-center justify-center space-x-2 mb-4">
                    <h1 className="text-7xl sm:text-8xl font-extrabold text-blue-600 tracking-tighter">
                        404
                    </h1>
                    <Frown className="w-10 h-10 text-yellow-500" />
                </div>

                {/* Main Message */}
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
                    Oops! Page Not Found.
                </h2>

                {/* Detailed Explanation */}
                <p className="text-lg text-gray-600 mb-8 max-w-sm">
                    We couldn't find the page you were looking for. It might have been moved or deleted.
                </p>

                <Button onClick={() => navigate('/')}>
                    <Home className="w-5 h-5 mr-2" />
                    Go Back Home
                </Button>

            </div>
        </div>
    );
};

export default NotFound;