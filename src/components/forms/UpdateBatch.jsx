import React, { useEffect, useState } from "react";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { CgListTree } from "react-icons/cg";
import Select from "react-select";
import moment from "moment";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";
function UpdateBatch({
  batchId,
  setShowPopup,
  fetchBatchList,
  programDetails,
}) {
  const [batchData, setBatchData] = useState({});
  const { userData, signOut } = useAuth();
  const fetchBatch = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/batches/batchDetails/${batchId}?access_token=${
          userData?.accessToken
        }`

        // const response = await fetch(
        //     `${import.meta.env.VITE_PUBLIC_UR}/api/batches/edit/${batchId}?access_token=${session?.user?.accessToken}`,
      );
      const data = await response.json();
      console.log(data.data + "fetchBatch");
      setBatchData(data.data);

      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
    } catch (error) {
      console.error("There was an error!", error);
      if (error === "Token Expired") {
        signOut();
      }
    }
  };

  useEffect(() => {
    fetchBatch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    var formData = {};
    Array.from(e.currentTarget.elements).forEach((field) => {
      if (!field.name) return;
      formData[field.name] = field.value;
    });
    // if (programId) {
    //   formData["programId"] = programId;
    // }
    // if (nominees) {
    //   formData["file"] = JSON.stringify(nominees);
    // }
    // return console.log(csv);
    let form = new URLSearchParams(Object.entries(formData)).toString();
    const response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/batches/edit/${batchId}?access_token=${userData?.accessToken}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: form,
      }
    );
    const data = await response.json();
    toast.success("Batch updated successfully!");
    setShowPopup(false);
    // if (showPopup) {
    // }
    fetchBatchList();
  };
  //   const [selectedStatus, setSelectedStatus] = useState([]);
  //   const [selectedClient, setSelectedClient] = useState([]);
  //   const [selectedProgram, setSelectedProgram] = useState([]);
  //   const [buttonR, setButtonR] = useState(false);
  //   const [buttonD, setButtonD] = useState(false);
  //   const { ExcelDownloder, Type } = useExcelDownloder();
  //   const userOptions = [
  //     { data: 1, label: "Active" },
  //     { data: 0, label: "InActive" },
  //   ];
  //   const data = {
  //     batch: [
  //       {
  //         fullName: "",
  //         employeeId: "",
  //         referenceCode: "",
  //         branchName: "",
  //       },
  //     ],
  //   };

  //   const clientOptions = clientData?.map((client) => {
  //     return { data: client?.client_id, label: client?.client_name };
  //   });
  //   const programOptions = programData?.map((program) => {
  //     return {
  //       data: program?.project_id,
  //       label: `${program?.project_title} ~ ProgramId: ${program?.project_id} `,
  //     };
  //   });

  const styles = {
    container: (base) => ({
      ...base,
      flex: 1,
    }),
    control: (base) => ({
      ...base,
      border: "1px solid rgb(209 213 219)",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid rgb(17 24 39)",
      },
    }),
    input: (base) => ({
      ...base,
      color: "rgb(75 85 99)",
      paddingLeft: "6px",
      paddingBottom: "3px",
      fontSize: "1rem",
      lineHeight: "1.25rem",
      // opacity: "0 !important",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#a1a9bb",
      paddingLeft: "6px",

      fontSize: "0.870rem",
      lineHeight: "1.25rem",
    }),
  };

  return (
    <div className="flex flex-col w-full justify-center  ">
      <div className="relative py-5 w-full  px-1 ">
        <div className="relative px-4 py-10  rounded-md  bg-white ">
          <div className="w-full mx-auto">
            <div className="flex items-center space-x-3">
              <div className="h-14 w-14 bg-sky-500 rounded-full flex flex-shrink-0 justify-center items-center text-white text-2xl font-semibold">
                <CgListTree />
              </div>
              <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                <h2 className="leading-relaxed">Update Batch</h2>
                <p className="text-sm text-gray-500 font-normal leading-relaxed">
                  Enter new batch details.
                </p>
              </div>
            </div>
            <form
              id="addpath"
              method="POST"
              onSubmit={handleSubmit}
              className="divide-y divide-gray-200"
            >
              <div className="flex flex-col w-full justify-between py-8 text-base leading-6 space-x-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col w-full space-y-1">
                  <label className="leading-loose">Batch Name*</label>
                  <input
                    type="text"
                    name="name"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Batch Name"
                    defaultValue={batchData.name}
                    required
                  />
                  {batchData?.program?.trainingType == "1" ? (
                    <>
                      <label className="leading-loose">Location*</label>
                      <input
                        type="text"
                        name="location"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Location"
                        defaultValue={batchData.location}
                        required
                      />
                    </>
                  ) : null}
                  <label className="leading-loose">Status*</label>
                  <select
                    placeholder="Select status"
                    name="status"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option
                      value="1"
                      selected={batchData.status == 1 ? true : false}
                    >
                      Active
                    </option>
                    <option
                      value="0"
                      selected={batchData.status == 0 ? true : false}
                    >
                      In Active
                    </option>
                  </select>
                  <label className="leading-loose">Batch Start Date*</label>
                  <input
                    type="date"
                    name="batchStartDate"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Batch start date"
                    defaultValue={
                      batchData.batchStartDate
                        ? moment(batchData.batchStartDate).format("YYYY-MM-DD")
                        : ""
                    }
                    required
                  />
                  <label className="leading-loose">Batch Start Time*</label>
                  <input
                    type="time"
                    name="batchStartTime"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Batch start time"
                    defaultValue={batchData.batchStartTime}
                    required
                  />
                  <label className="leading-loose">Batch End Date*</label>
                  <input
                    type="date"
                    name="batchEndDate"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Batch End Date"
                    defaultValue={
                      batchData.batchEndDate
                        ? moment(batchData.batchEndDate).format("YYYY-MM-DD")
                        : ""
                    }
                    required
                  />
                  <label className="leading-loose">Batch End Time*</label>
                  <input
                    type="time"
                    name="batchEndTime"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Batch start time"
                    defaultValue={batchData.batchEndTime}
                    required
                  />
                </div>
              </div>

              <div className="py-0 flex items-center  justify-center space-x-4">
                <button
                  type="submit"
                  className="bg-sky-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateBatch;
