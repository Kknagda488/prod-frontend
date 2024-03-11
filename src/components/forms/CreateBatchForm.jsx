
import React, { useState } from "react";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { CgListTree } from "react-icons/cg";
import Select from "react-select";
// import BulkUploader from "../parts/BulkUploader";
// import { useExcelDownloder } from "react-xls";
function CreateBatchForm({
  uploadCsv,
  setCsv,
  clientData,
  setProgramId,
  setProjectId,
  programData,
  projectData,
  setProjectData,
  projectId,
}) {
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState([]);
  const [buttonR, setButtonR] = useState(false);
  const [buttonD, setButtonD] = useState(false);
  // const { ExcelDownloder, Type } = useExcelDownloder();
  const userOptions = [
    { data: 1, label: "Active" },
    { data: 0, label: "InActive" },
  ];
  const data = {
    batch: [
      {
        fullName: "",
        employeeId: "",
        referenceCode: "",
        branchName: "",
      },
    ],
  };

  const clientOptions = clientData?.map((client) => {
    return { data: client?.client_id, label: client?.client_name };
  });
  const programOptions = programData?.map((program) => {
    return {
      data: program?.project_id,
      label: `${program?.project_title} ~ ProgramId: ${program?.project_id} `,
    };
  });

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
  const handleChange = (option) => {
    setSelectedStatus(option);
  };
  const handleClient = (option) => {
    setSelectedClient(option);
    setProgramId(option.data);
    setSelectedProgram([]);
    setProjectId(null);
    setProjectData([]);
  };
  const handleProgram = (option) => {
    setSelectedProgram(option);
    setProjectId(option.data);
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
                <h2 className="leading-relaxed">Create a Batch</h2>
                <p className="text-sm text-gray-500 font-normal leading-relaxed">
                  Enter the Batch details to display it in Batch List.
                </p>
              </div>
            </div>
            <form
              id="addpath"
              method="POST"
              onSubmit={uploadCsv}
              className="divide-y divide-gray-200"
            >
              <div className="flex flex-col w-full justify-between py-8 text-base leading-6 space-x-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col w-full space-y-1">
                  <label className="leading-loose">Client Name*</label>
                  <div className="relative focus-within:text-gray-600 text-gray-400">
                    <Select
                      //isMulti={true}
                      options={clientOptions}
                      onChange={handleClient}
                      value={selectedClient}
                      styles={styles}
                      getOptionValue={(option) => option.data}
                      placeholder="Select Client"
                    />
                  </div>
                  <input
                    type="text"
                    name="clientName"
                    className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Client Name"
                    required
                    defaultValue={selectedClient?.label}
                  />
                  <input
                    type="text"
                    name="clientId"
                    className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Client Name"
                    required
                    defaultValue={selectedClient?.data}
                  />
                  <div className="flex justify-between w-full items-center">
                    <label className="leading-loose">Program Name* </label>
                    <label className="leading-loose">
                      Program Id: {selectedProgram?.data}
                    </label>
                  </div>
                  <div className="relative focus-within:text-gray-600 text-gray-400">
                    <Select
                      //isMulti={true}
                      options={programOptions}
                      onChange={handleProgram}
                      value={selectedProgram}
                      styles={styles}
                      getOptionValue={(option) => option.data} // changes here!!!
                      placeholder="Select Program"
                    />
                  </div>
                  <input
                    type="text"
                    name="programName"
                    className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Program Name"
                    required
                    defaultValue={selectedProgram.label}
                  />

                  {/* <span className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600">
                    {selectedProgram?.data}
                  </span> */}
                  <input
                    type="text"
                    name="projectId"
                    className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Project Id"
                    required
                    defaultValue={projectId}
                  />
                  <label className="leading-loose">Batch Title*</label>
                  <input
                    type="text"
                    name="teamName"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Batch Title"
                    required
                  />
                  {projectData?.length == 0 ? (
                    <>
                      <label className="leading-loose">Trainer Name*</label>

                      <input
                        type="text"
                        name="tranineeName"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Trainer Name"
                        required
                      />
                      <label className="leading-loose">Trainer Email*</label>
                      <input
                        type="text"
                        name="tranineeEmail"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Trainer Email"
                        required
                      />
                    </>
                  ) : (
                    <>
                      <label className="leading-loose">Trainer Name*</label>

                      {/* <span className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600">
                        {projectData[0]?.name}
                      </span> */}
                      <input
                        name="tranineeName"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        defaultValue={projectData[0]?.name}
                      />
                      <input
                        name="trainerId"
                        className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        defaultValue={projectData[0]?.trainer_id}
                      />
                      <label className="leading-loose">Trainer Email*</label>

                      {/* <span className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600">
                        {projectData[0]?.email}
                      </span> */}
                      <input
                        name="tranineeEmail"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        defaultValue={projectData[0]?.email}
                      />
                    </>
                  )}

                  <div className="flex flex-col w-full">
                    <label className="leading-loose">Active Status*</label>
                    <div className="hidden relative focus-within:text-gray-600 text-gray-400">
                      <input
                        type="text"
                        name="status"
                        className="px-4  py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Active Status"
                        required
                        defaultValue={selectedStatus.data}
                      />
                    </div>

                    <div className="relative focus-within:text-gray-600 text-gray-400">
                      <Select
                        //isMulti={true}
                        options={userOptions}
                        onChange={handleChange}
                        styles={styles}
                        placeholder="Set Status"
                        getOptionValue={(option) => option.data}
                      />
                    </div>
                    {buttonD ? (
                      <div className="flex flex-col mt-3 justify-center">
                        <label className="leading-loose">Excel File*</label>
                        {/* <BulkUploader setButtonR={setButtonR} setCsv={setCsv} /> */}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              {buttonR ? (
                <div className="py-4 flex items-center  justify-center space-x-4">
                  <button
                    type="submit"
                    className="bg-sky-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                  >
                    Add to Batch List
                  </button>
                </div>
              ) : null}
            </form>
            <span className="flex w-full justify-between  items-center">
              <p className="text-sm w-fit font-normal px-6 text-gray-700">
                *To add users in batch first download this excel file and fill
                the required fields and then re-upload this file.
              </p>
              <div onClick={() => setButtonD(true)}>
                {/* <ExcelDownloder
                  data={data}
                  filename={"batchlist"}
                  type={"button"}
                  className="flex w-fit items-center justify-center bg-sky-500 py-2 rounded-md px-5 text-sm  text-white font-medium"
                >
                  Download.Excel
                </ExcelDownloder> */}
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateBatchForm;
