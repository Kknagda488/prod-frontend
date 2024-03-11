import React, { useEffect, useState } from "react";
import { CgListTree } from "react-icons/cg";
import Select from "react-select";
// import { useExcelDownloder } from "react-xls";
// import BulkUploader from "../../components/adminComponents/parts/BulkUploader";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
// import { useRouter } from "next/router";
// import {} from "react-router-dom";

import moment from "moment";
import RichTextEditor from "../../components/training/RichTextEditor";
// import {RichTextEditor} from "../../components/training/RichTextEditor";
const CreateProgram = () => {
  const [classMode, setClass] = useState("1");

  function handleClassChange(event) {
    setClass(event.target.value);
  }

  const options = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "15", label: "15" },
  ];
  const data = {
    user: [
      {
        fullName: "",
        email: "",
        phone: "",
        employeeId: "",
        branchName: "",
      },
    ],
  };

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
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (option) => {
    setSelectedOption(option);
  };

  const [clientData, setClientData] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]);
  const [programId, setProgramId] = useState(null);
  const [programData, setProgramData] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const [buttonR, setButtonR] = useState(false);
  const [buttonD, setButtonD] = useState(false);
  const [csv, setCsv] = useState([]);
  // const { ExcelDownloder, Type } = useExcelDownloder();

  const [content, setContent] = useState("");

  const handleContentChange = (value) => {
    setContent(value);
  };
  const handleProgram = (option) => {
    setSelectedProgram(option);
    setProjectId(option.data);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!csv.length) {
    //   return toast.error("Please provide announcement list");
    // }
    var formData = {};
    Array.from(e.currentTarget.elements).forEach((field) => {
      if (!field.name) return;
      formData[field.name] = field.value;
    });

    if (content) {
      formData["objectives"] = content;
    }

    console.log(formData, "formData");

    // addPrgram(formData);
  };
  return (
    <div>
    {/* <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
<form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
  <div className="mb-4">
    <label className="block text-gray-700 font-bold mb-2" for="full-name">
      Full Name
    </label>
    <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="full-name" type="text" placeholder="Enter your full name"/>
  </div>
  <div className="mb-4">
    <label className="block text-gray-700 font-bold mb-2" for="email">
      Email
    </label>
    <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Enter your email address"/>
  </div>
  <div className="mb-4">
    <label className="block text-gray-700 font-bold mb-2" for="password">
      Password
    </label>
    <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Enter your password"/>
  </div>
  <div className="mb-4">
    <label className="block text-gray-700 font-bold mb-2" for="confirm-password">
      Confirm Password
    </label>
    <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="confirm-password" type="password" placeholder="Confirm your password"/>
  </div>
  <div className="mb-4">
    <label className="block text-gray-700 font-bold mb-2" for="message">
      Message
    </label>
    <textarea className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" rows="5" placeholder="Enter your message"></textarea>
  </div>
  <div className="flex items-center justify-center">
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      Submit
    </button>
  </div>
</form>
</div> */}

    <div className="flex mt-5 flex-col w-full justify-center  ">
      <div className="relative py-5 w-full  px-1 ">
        <div className="relative px-4 py-2  rounded-md  bg-white ">
          <div className="w-full mx-auto">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-sky-500 rounded-full flex flex-shrink-0 justify-center items-center text-white text-2xl font-semibold">
                <CgListTree />
              </div>
              <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                <h2 className="leading-relaxed">Create a Program</h2>
                <p className="text-sm text-gray-500 font-normal leading-relaxed">
                  Enter the program details.
                </p>
              </div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="divide-y divide-gray-200"
            >
              <div className="flex flex-col w-full justify-between py-8 text-base leading-6 space-x-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col w-full space-y-1">
                  <div className="flex flex-wrap">
                    <div className="w-1/2 px-2">
                      <label className="leading-loose">Client Name</label>
                      <div className="relative focus-within:text-gray-600 text-gray-400">
                        <Select
                          //isMulti={true}
                          // options={clientOptions}
                          // onChange={handleClient}
                          value={selectedClient}
                          styles={styles}
                          placeholder="Select Client"
                          getOptionValue={(option) => option.data}
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
                        // defaultValue={selectedClient?.data}
                      />
                    </div>
                    <div className="w-1/2 px-2">
                      <div className="flex justify-between w-full items-center">
                        <label className="leading-loose">Program Name</label>
                        <label className="leading-loose">
                          Program Id:
                          {/* {selectedProgram ? selectedProgram.data : null} */}
                        </label>
                      </div>
                      <div className="relative focus-within:text-gray-600 text-gray-400">
                        <Select
                          //isMulti={true}
                          // options={}
                          onChange={handleProgram}
                          value={selectedProgram}
                          styles={styles}
                          placeholder="Select Program"
                          getOptionValue={(option) => option.data}
                        />
                      </div>
                      <input
                        type="text"
                        name="programName"
                        className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Program Name"
                        defaultValue={selectedProgram?.label}
                        required
                      />
                      <input
                        type="text"
                        name="programId"
                        className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Program Id"
                        defaultValue={projectId}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap">
                    <div className="w-1/2 px-2">
                      <label className="leading-loose">
                        Program Start Date
                      </label>
                      <input
                        type="date"
                        name="programStartDate"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Program  Start Date"
                        required
                      />
                    </div>
                    <div className="w-1/2 px-2">
                      <label className="leading-loose">
                        Program Start Time
                      </label>
                      <input
                        type="time"
                        name="programStartTime"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Program Start Time"
                        required
                      />
                    </div>
                    <div className="w-1/2 px-2">
                      <label className="leading-loose">
                        Program End Date
                      </label>
                      <input
                        type="date"
                        name="programEndDate"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Program End Date"
                        required
                      />
                    </div>
                    <div className="w-1/2 px-2">
                      <label className="leading-loose">
                        Program End Time
                      </label>
                      <input
                        type="time"
                        name="programEndTime"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Program End Time"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap">
                    <div className="w-1/2 px-2">
                      <label className="leading-loose">
                        Nomination End Date
                      </label>
                      <input
                        type="date"
                        name="nominationDate"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Program Date/Time"
                        required
                      />
                    </div>
                    <div className="w-1/2 px-2">
                      <label className="leading-loose">
                        Nomination End Time
                      </label>
                      <input
                        type="time"
                        name="nominationTime"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Program Date/Time"
                        required
                      />
                    </div>
                    <div className="w-1/2 px-2">
                      <label className="leading-loose">
                        Class Room Training
                      </label>
                      <select
                        name="trainingType"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        value={classMode}
                        onChange={handleClassChange}
                      >
                        <option value="1">Class Room Training</option>
                        {/* <option value="2">Virtual Training</option> */}
                      </select>
                    </div>
                    {/* {classMode === "2" && (
                      <div className="w-1/2 px-2">
                        <label className="leading-loose">
                          Classroom session link
                        </label>
                        <input
                          type="text"
                          name="meetingLink"
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Classroom session link"
                        />
                      </div>
                    )} */}
                    <div className="w-1/2 px-2">
                      <label className="leading-loose">City</label>
                      <input
                        type="text"
                        name="location"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="City"
                        required
                      />
                    </div>
                    {/* <div className="w-1/2 px-2">
                      <label className="leading-loose">Interval Days</label>
                      <Select
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        isMulti={true}
                        value={selectedOption}
                        onChange={handleChange}
                        options={options}
                        getOptionValue={(option) => option.value}
                      />
                    </div> */}
                    <div className="w-1/2 px-2">
                      <label className="leading-loose">Program Color</label>
                      <input
                        type="color"
                        name="color"
                        className="block w-full"
                        placeholder="Program Color"
                        required
                      />
                    </div>
                    <div className="w-1/2 px-2">
                      <label className="leading-loose">Status*</label>
                      <select
                        name="status"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="1">Active</option>
                        <option value="0">In Active</option>
                      </select>
                    </div>
                    <div className="w-1/2 px-2">
                      <label className="leading-loose">Objectives</label>
                      <RichTextEditor
                        value={content}
                        onChange={handleContentChange}
                      />
                    </div>
                    {/* {buttonD ? ( */}
                    {/* <div className="w-1/2 px-2">
                      <label className="leading-loose">
                        Announcement List
                      </label>
                      <BulkUploader setButtonR={setButtonR} setCsv={setCsv} />
                    </div> */}

                    {/* ) : null} */}
                  </div>

                  {/* <div className="w-1/2 px-2">
                    <label className="leading-loose">Venue</label>
                    <textarea
                      name=""
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      placeholder="Venue"
                    ></textarea>
                  </div> */}
                </div>
              </div>
              {/* {buttonR ? ( */}
              <div className="py-4  space-x-4">
                <button
                  type="submit"
                  className="bg-sky-500 flex-inline justify-center items-center text-white px-4 py-2 rounded-md focus:outline-none"
                >
                  Create Program
                </button>
              </div>
              {/* ) : null} */}
            </form>
            {/* <span className="flex w-full justify-between  items-center">
              <p className="text-sm w-fit font-normal px-6 text-gray-700">
                *To add users in batch first download this excel file and fill
                the required fields and then re-upload this file.
              </p>
              <div onClick={() => setButtonD(true)}>
                <ExcelDownloder
                  data={data}
                  filename={"batchlist"}
                  type="button"
                  className="flex w-fit items-center justify-center bg-sky-500 py-2 rounded-md px-5 text-sm  text-white font-medium"
                >
                  Download.Excel
                </ExcelDownloder>
              </div>
            </span> */}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
export default CreateProgram;