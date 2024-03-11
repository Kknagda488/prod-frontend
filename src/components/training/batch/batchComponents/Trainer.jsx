import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AsyncSelect from "react-select/async";
import "react-select-search/style.css";
import moment from "moment";
import _ from "lodash";
import { useAuth } from "../../../../context/auth";
function Trainer({ batchId, getOneBatch, batchData }) {
  const [trainerData, setTrainerData] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [inputValue, setInputValue] = useState("Example Text");
  const [selectedTrainerData, setSelectedTrainerData] = useState({});
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const { userData, signOut } = useAuth();
  const options = [
    { value: "red", label: "Red" },
    { value: "green", label: "Green" },
    { value: "blue", label: "Blue" },
  ];

  function handleEditClick() {
    setIsEditable(true);
  }

  function handleInputChange(e) {
    setInputValue(e.target.value);
  }

  function handleInputBlur() {
    setIsEditable(false);
  }

  async function handleTrainerUpdate(e) {
    try {
      e.preventDefault();
      var formData = {};
      Array.from(e.currentTarget.elements).forEach((field) => {
        if (!field.name) return;
        formData[field.name] = field.value;
      });
      // return console.log(formData)
      let form = new URLSearchParams(Object.entries(formData)).toString();
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/batches/addTrainer/${batchId}?access_token=${
          userData?.accessToken
        }`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },

          method: "POST",
          body: form,
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.error?.message);
        return Promise.reject(data.error);
      } else {
        toast.success("Trainer updated Succesfully!");
        getOneBatch();
        setSelectedTrainer(null);
      }
    } catch (error) {
      console.error("There was an error!", error);
      if (error === "Token Expired" || error === "Malformed User") {
        signOut();
      }
    }
  }

  const fetchTrainerData = async (value) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/programTrainers/getTrainers?name=${value}&access_token=${
          userData?.accessToken
        }`
      );
      const data = await response.json();
      setTrainerData(data.data);
      const trainerOptions = data.data.map((trainer) => ({
        value: trainer.user_id,
        label: trainer.name,
      }));
      return trainerOptions;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return [];
    }
  };

  const trainerOptions = _.debounce(async function (value, cb) {
    const data = await fetchTrainerData(value);
    cb(data);
  }, 500);

  const handleSelectChange = (data) => {
    setSelectedTrainer(data);
    const trainer = trainerData.find(
      (trainer) => trainer.user_id == data.value
    );
    setSelectedTrainerData(trainer);
  };
  // console.log('Trainer Options'+trainerOptions);
  useEffect(() => {
    fetchTrainerData();
  }, []);

  return (
    <form onSubmit={handleTrainerUpdate}>
      <div className="flex justify-end">
        <>
          {moment(
            moment(batchData.batchDateTime)
              .subtract(5, "days")
              .format("YYYY-MM-DD")
          ).isSameOrAfter(moment()) ? (
            <>
              {moment(
                moment(batchData.batchDateTime)
                  .subtract(5, "days")
                  .format("YYYY-MM-DD")
              ).diff(moment(), "days")}{" "}
              days left to decide trainer.
            </>
          ) : null}
        </>
      </div>
      <div className="flex flex-col">
        {userData.userType !== 7 && (
          <div>
            <h5 className="text-xl font-semibold mt-2 mb-4 leading-none text-gray-700 ">
              Add Trainer
            </h5>
            <div className="flex flex-wrap">
              <div className="w-1/2">
                {/* <SelectSearch
            className="select-search"
            // options={trainerOptions}
            options={options}
            placeholder="Search Trainer"
          /> */}
                <AsyncSelect
                  value={selectedTrainer}
                  name="trainer"
                  loadOptions={trainerOptions}
                  placeholder="Search Trainer"
                  onChange={handleSelectChange}
                />
                {/* <Select
                //isMulti={true}
                name="trainer"
                options={trainerOptions}
                onChange={handleSelectChange}
              /> */}
                <input
                  type="hidden"
                  name="trainerId"
                  value={selectedTrainerData.user_id}
                />
                <input
                  type="hidden"
                  name="trainerName"
                  value={selectedTrainerData.name}
                />
                <input
                  type="hidden"
                  name="trainerEmail"
                  value={selectedTrainerData.email}
                />
                <input
                  type="hidden"
                  name="trainerContact"
                  value={selectedTrainerData.contact_number}
                />
              </div>
            </div>
            {userData.userType !== 7 && (
              <button
                type="submit"
                className="bg-sky-500 mt-4 truncate flex justify-center items-center  text-white px-5 py-2 rounded-md focus:outline-none"
              >
                Add
              </button>
            )}
          </div>
        )}
        {batchData.trainerId ? (
          <div>
            <h5 className="text-lg font-semibold mt-6 mb-2 leading-none text-gray-700 ">
              Trainer Details:
            </h5>
            <p className="mb-1">Name: {batchData.trainerName}</p>
            <p className="mb-1">Email: {batchData.trainerEmail}</p>
            <p className="mb-1">Contact No: {batchData.trainerContact}</p>
          </div>
        ) : null}

        {/* <div className="flex flex-wrap">
        <div className="w-1/2 px-2">
          <label className="leading-loose">
              First Name*
          </label>
          <input
              type="text"
              name="first name"
              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
              placeholder="First Name"
              required
          />
          </div>
          <div className="w-1/2 px-2">
          <label className="leading-loose">
              Last Name*
          </label>
          <input
              type="text"
              name="last name"
              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
              placeholder="Last Name"
              required
          />
          </div>
          </div> */}
      </div>
      {/* <div className="flex flex-wrap">
          <div className="w-1/2 px-2">
          <label className="leading-loose">
              Email*
          </label>
          <input
              type="email"
              name="email"
              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
              placeholder="Email"
              required
          />
          </div>
          <div className="w-1/2 px-2">
          <label className="leading-loose">
              Contact No.*
          </label>
          <input
              type="number"
              name="contact no."
              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
              placeholder="Contact No."
              required
          />
          </div>
          </div> */}
    </form>
  );
}

export default Trainer;
