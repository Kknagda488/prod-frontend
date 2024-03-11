import React from 'react';

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="border-t-8 border-blue-500 border-solid rounded-full h-20 w-20 animate-spin"></div>
        </div>
    );
};

export default Loader;
