import React, { useEffect, useState } from "react";

import Select from "react-select";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";
// import XlsxPopulate from "xlsx-populate";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import * as XLSX from "xlsx";
import { DateRange } from "react-date-range";
import { useAuth } from "../../context/auth";
import Utils from "../../components/utils";
const Assessmenteports = () => {
  var newReports = [];
  var averageReport = [];
  var avgexcel = [];
  var highlighter = [];
  const [selectedClient, setSelectedClient] = useState([]);
  const { userData, signOut } = useAuth();
  const [clientData, setClientData] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [programId, setProgramId] = useState(null);

  const [selectedProgram, setSelectedProgram] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [reportsData, setReportsData] = useState([]);
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    getClientData();
    if (programId) {
      getProgramData();
    }
  }, [selectedClient]);

  const getClientData = () => {
    fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/clients/listofclient?filter=%7B%22search%22%3A%22%22%7D&access_token=${
        userData?.accessToken
      }`
    )
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }

        setClientData(data.data);
        //setTotalCount(data.data.totalCount);
      })
      .catch((error) => {
        setClientData([]);
        console.error("There was an error!", error);
        if (error === "Token Expired") {
          signOut();
        }
      });
  };
  const clientOptions = clientData?.map((client) => {
    return { data: client?.client_id, label: client?.client_name };
  });
  const programOptions = programData?.map((program) => {
    return {
      data: program?.id,
      label: program?.programName,
    };
  });

  const getProgramData = () => {
    fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/programs/listofProgramName?id=${programId}&filter=%7B%22search%22%3A%22%22%7D&access_token=${
        userData?.accessToken
      }`
    )
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }

        setProgramData(data.data);
        //setTotalCount(data.data.totalCount);
      })
      .catch((error) => {
        setProgramData([]);
        console.error("There was an error!", error);
      });
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

  const handleClient = (option) => {
    setSelectedClient(option);
    setProgramId(option.data);
    setSelectedProgram([]);
    setProjectId(null);
  };
  const handleOption = (option) => {
    setSelectedType(option);
  };
  const handleProgram = (option) => {
    setSelectedProgram(option);
    setProjectId(option.data);
  };

  const reportDownloader = async () => {
    if (selectedClient.length == 0) {
      return toast.warn("No Client Name Selected");
    }
    if (selectedProgram.length == 0) {
      return toast.warn("No Program Name Selected");
    }
    var button = document.getElementById("generate");
    button.disabled = true;
    button.className =
      "h-8 mt-4 w-fit px-6 ml-8 text-white rounded-md bg-gray-500 cursor-not-allowed ";
    button.innerText = "Please Wait...";
    console.log("selectedProgram.data++++++++++++++++++", selectedProgram.data);
    const formData = {
      clientName: selectedClient.label,
      programName: selectedProgram.label,
      programId: selectedProgram.data,
    };
    var response;

    let form = new URLSearchParams(Object.entries(formData)).toString();

    response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/reports/assessmentScore?access_token=${userData?.accessToken}`,
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
      console.log("er");
    } else {
      if (data.code === 404) {
        console.error(data.msg);
      } else {
        //setPeopleList(data.data);
        if (data) {
          // setReportsData(data.data);
          toast.success("report fetch success");
          assessmentReportExport(data);
        } else {
          toast.warn(`No Reports Available!`);
        }
      }
    }
  };

  const assessmentReportExport = (allExportAttendanceData) => {
    const employees = [
      ["Program", allExportAttendanceData.programName],
      ["", ""],
      ["", ""],
      ["Nominated", allExportAttendanceData.totalNominated],
      [
        "Present as per attendance criteria",
        allExportAttendanceData.presentAttendanceCriteria,
      ],
      [
        "Present as per attendance criteria \n and attempted final assessment",
        allExportAttendanceData.presentAttendanceAndAttemptedAssessment,
      ],
      [
        "Final Assessment Passed",
        allExportAttendanceData.finalAssessmentPassed,
      ],
      [
        "Attempted final assessment but have\n not qualified the attendance criteria",
        allExportAttendanceData.attemptedAssessmentNotQualifiedAttendance,
      ],
      [
        "Present as per attendance criteria but\n not attempted final day assessment",
        allExportAttendanceData.presentAttendanceNotAttemptedAssessment,
      ],
      [
        "Overall Attendance %",
        allExportAttendanceData.overallAttendancePercentage,
      ],
      [
        "Assessment Cleared by %",
        allExportAttendanceData.assessmentClearedPercentage,
      ],
      [
        "Attendance qualified Participants \nwho scored => 60%",
        allExportAttendanceData.attendanceQualifiedParticipants60Percent,
      ],
      [
        "% Participants in 60% \nor above bucket",
        allExportAttendanceData.participants60PercentAndAbove,
      ],
    ];

    console.log("programName", allExportAttendanceData);

    console.log(employees);

    // Assuming Utils.exportAoaToXlsx is correctly implemented
    Utils.exportAoaToXlsx(employees, `Attendance-Report-${Date.now()}`);
  };

  return (
    <>
      <div className="flex flex-col w-full min-h-screen ">
        {/* <Script
      strategy="lazyOnload"
      src="https://unpkg.com/flowbite@1.5.5/dist/datepicker.js"
    /> */}
        <div className="flex flex-col shadow-md rounded-md bg-white w-full h-fit mt-12  px-12">
          <label className="leading-loose items-center justify-center flex w-full font-medium text-xl my-3 text-gray-700 text-center">
            Generate Assessment Report
          </label>
          <div className="flex items-center  w-full ">
            <label className="text-gray-700 font-medium text-md w-44">
              Client Name*
            </label>
            <div className="relative focus-within:text-gray-600 w-full text-gray-400">
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
          </div>
          <div className="flex items-center  w-full mt-3">
            <label className="text-gray-700 font-medium text-md w-44">
              Program Name*
            </label>
            <div className="relative focus-within:text-gray-600 w-full text-gray-400">
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
          </div>
          <div className="flex items-start py-4 ">
            <div className="flex flex-col items-left ml-4 w-1/2">
              <div className="flex items-center w-full">
                {/* <label className="text-gray-700 font-medium text-md w-32">
              Report For*
            </label>
            <div className="relative focus-within:text-gray-600 w-full text-gray-400">
              <Select
                //isMulti={true}
                options={userOptions}
                onChange={handleOption}
                value={selectedType}
                styles={styles}
                getOptionValue={(option) => option.data}
                placeholder="Select Report For"
              />
            </div> */}
                <input
                  type="text"
                  name="clientName"
                  className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                  placeholder="Client Name"
                  required
                  defaultValue={selectedClient?.label}
                />
              </div>
              <button
                onClick={() => reportDownloader()}
                id="generate"
                className="h-8 mt-4 w-fit px-6 ml-8 text-white rounded-md bg-green-500 cursor-pointer"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Assessmenteports;
