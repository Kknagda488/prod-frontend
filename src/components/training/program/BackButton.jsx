import { useNavigate } from 'react-router-dom';
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'; // Import the desired icon from react-icons

const BackButton = ({ setBatchListPop }) => {
    const navigate = useNavigate(); // Import the useNavigate hook from react-router-dom
    const handleClick = () => {
        // setBatchListPop(false);
        navigate("/program")
    };

    return (
        <button
            className="bg-sky-600 h-[25px] w-[102px] m-[10px] px-5 font-[22px] rounded"
            onClick={handleClick}
        >
            <FaArrowLeft className="inline-block mr-2" /> Back
        </button>
    );
}

export default BackButton
