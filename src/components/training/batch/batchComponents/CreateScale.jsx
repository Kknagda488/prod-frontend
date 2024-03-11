import React, { useState } from 'react'
import { useAuth } from '../../../../context/auth'

const CreateScale = ({ setPopUp, batchId, setNewScaleVale }) => {
    const [numberOfFields, setNumberOfFields] = useState(0);
    const [ratingValues, setRatingValues] = useState(Array(numberOfFields).fill(''));
    const [label, setLabel] = useState('Rate each parameter on the scale of 5 to 1 (5 being the highest and 1 being lowest)')

    const generateRatingFields = () => {
        return Array.from({ length: numberOfFields }, (_, index) => (
            <div key={index} className="w-full px-2">
                <label className="block mb-2 text-sm font-medium text-gray-600">{`Scale ${index + 1}`}</label>
                <input
                    type="text"
                    placeholder={`Enter value for Scale ${index + 1}`}
                    value={ratingValues[index]}
                    onChange={(e) => handleRatingChange(index, e.target.value)}
                    className="p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
            </div>
        ));
    };

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        setNumberOfFields(value);
        setRatingValues(Array(value).fill(''));
    };

    const handleRatingChange = (index, value) => {
        const newRatingValues = [...ratingValues];
        newRatingValues[index] = value;
        setRatingValues(newRatingValues);
    };

    const calculateSum = () => {
        const sum = ratingValues.reduce((acc, value) => acc + parseInt(value) || 0, 0);
        alert(`Sum: ${sum}`);
    };

    const scaleOptions = [
        {
            data: ["Poor", "Average", "Good", "Excellent"],
            label:
                "Rate each parameter on the scale of 4 to 1 (4 being the highest and 1 being lowest)",
        },
        {
            data: ["Poor", "Average", "Good", "Very Good", "Excellent"],
            label:
                "Rate each parameter on the  scale of 5 to 1 (5 being the highest and 1 being lowest)",
        },
        {
            data: [
                "Poor",
                "Average",
                "Satisfactory",
                "Good",
                "Very Good",
                "Excellent",
            ],
            label:
                "Rate each parameter on the scale of 5 to 0 (5 being the highest and 0 being lowest)",
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Calculate the sum of the rating values


        // Access the array of rating values
        setNewScaleVale([{ label, data: ratingValues }])
        console.log('Rating Values:', { label, data: ratingValues });
        setPopUp(false)
    };
    const { userData, signOut } = useAuth()



    return (
        <form>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-1">
                <input
                    name="batchId"
                    type="hidden"
                    defaultValue={batchId}
                />

                <div className="w-full md:col-span-2  px-2">
                    <label className="leading-loose">Label *</label>
                    <div className="flex flex-wrap items-stretch w-full relative">
                        <input
                            type="text"
                            name="label"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded outline-none rounded-r-none px-3 relative"
                            placeholder="Label"
                            defaultValue={"Rate each parameter on the scale of 4 to 1 (4 being the highest and 1 being lowest)"}
                            required
                        ></input>

                    </div>
                </div>
                <div className="w-full px-2">
                    <label className="leading-loose">Scale length*</label>
                    <input
                        type="number"
                        value={numberOfFields}
                        minLength={3}
                        maxLength={7}
                        defaultValue={3}
                        onChange={handleInputChange}
                        className="w-full mb-4 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />

                </div>
            </div>

            {generateRatingFields()}

            {/* </div> */}
            <div className="mx-40 flex items-center  justify-center space-x-4">
                <button
                    onClick={handleSubmit}
                    className="bg-sky-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                >
                    Add
                </button>
            </div>
        </form>
    )
}

export default CreateScale