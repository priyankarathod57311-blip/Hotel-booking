import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";

const Loader = () => {
    const { navigate } = useAppContext();
    const { nextUrl } = useParams();

    useEffect(() => {
        if (nextUrl) {
            const timer = setTimeout(() => {
                navigate(`/${nextUrl}`);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [nextUrl, navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-300 border-t-blue-600"></div>
        </div>
    );
};

export default Loader;