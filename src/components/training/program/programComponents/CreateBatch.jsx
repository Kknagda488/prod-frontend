import React, { useState } from "react";
import BulkUploader from "../../../parts/BulkUploader";
import { toast } from "react-toastify";
import moment from "moment";
import { useAuth } from "../../../../context/auth";
const CreateBatch = ({ programId, programDetails }) => {
  // const router = useRouter();
  const [csv, setCsv] = useState([]);
  const { userData, signOut } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    var formData = {};
    Array.from(e.currentTarget.elements).forEach((field) => {
      if (!field.name) return;
      formData[field.name] = field.value;
    });
    if (programId) {
      formData["programId"] = programId;
    }
    if (csv) {
      formData["file"] = JSON.stringify(csv);
    }
    console.log(csv);
    let form = new URLSearchParams(Object.entries(formData)).toString();
    const response = await fetch(
      `${import.meta.env.VITE_PUBLIC_URL}/api/batches/add?access_token=${
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
      // get error message from body or default to response statusText
      const error = (data && data.msg) || response.statusText;
      toast.error(error);
    } else {
      toast.success("Batch created successfully!");
    }

    e.target.reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col mt-3 justify-center">
          <div className="flex flex-wrap">
            <div className="w-1/2 px-2">
              <label className="leading-loose">Batch Name*</label>
              <input
                type="text"
                name="name"
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                placeholder="Batch Name"
                required
              />
            </div>
            {programDetails.trainingType == "1" ? (
              <div className="w-1/2 px-2">
                <label className="leading-loose">Location*</label>
                <input
                  type="text"
                  name="location"
                  className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                  placeholder="Location"
                  required
                />
              </div>
            ) : null}
            <div className="w-1/2 px-2">
              <label className="leading-loose">Batch Start Date*</label>
              <input
                type="date"
                name="batchStartDate"
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                required
              />
            </div>
            <div className="w-1/2 px-2">
              <label className="leading-loose">Batch Start Time*</label>
              <input
                type="time"
                name="batchStartTime"
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                required
              />
            </div>
            <div className="w-1/2 px-2">
              <label className="leading-loose">Batch End Date*</label>
              <input
                type="date"
                name="batchEndDate"
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                required
              />
            </div>
            <div className="w-1/2 px-2">
              <label className="leading-loose">Batch End Time*</label>
              <input
                type="time"
                name="batchEndTime"
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                required
              />
            </div>
          </div>
          {userData.client == "axis" ? (
            <>
              <div className="flex flex-wrap">
                <div className="w-1/2 px-2">
                  <label className="leading-loose">Status*</label>
                  <select
                    placeholder="Select status"
                    name="status"
                    required
                    className="px-4 py-2bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="1">Active</option>
                    <option value="0">In Active</option>
                  </select>
                </div>
                <div className="w-1/2 px-2">
                  <label className="leading-loose">Assessment Status*</label>
                  <select
                    placeholder="Select Assessment status"
                    name="assessmentStatus"
                    required
                    className="px-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="inside">Inside</option>
                    <option value="outside">Outside</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full px-2">
              <label className="leading-loose">Status*</label>
              <select
                placeholder="Select status"
                name="status"
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="1">Active</option>
                <option value="0">In Active</option>
              </select>
            </div>
          )}
          <div className="w-full px-2">
            <label className="leading-loose">Excel File*</label>
            <BulkUploader setCsv={setCsv} />
          </div>

          <button
            className="flex w-fit mt-5 px-6 py-3 text-white text-sm font-medium
                    bg-green-500 items-center rounded-md"
            type="submit"
          >
            Create Batch
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBatch;
