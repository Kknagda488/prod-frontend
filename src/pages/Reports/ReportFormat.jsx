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
const ReportFormat = () => {
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
  const [datarange, setRange] = useState([]);
  const [sumReport, setSumReport] = useState([]);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  const [xlRep, setXlRep] = useState([]);
  const userOptions = [
    { data: "pre", label: "Pre Assessment" },
    { data: "post", label: "Post Assessment" },
    { data: "feedback", label: "Feedback" },
  ];

  const [generated, setGenerated] = useState(null);
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
    if (dates[0].endDate == null) {
      return toast.warn("No End Date Selected");
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
      fromDate: moment(dates[0].startDate).format("YYYY-MM-DD"),
      todate: moment(dates[0].endDate).format("YYYY-MM-DD"),
    };
    var response;

    let form = new URLSearchParams(Object.entries(formData)).toString();

    response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/reports/trainerLevelReport?access_token=${userData?.accessToken}`,
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
      toast.warn(data.message);
      console.log("er");
    } else {
      if (data.code === 404) {
        // console.error(data.message);
        toast.error(data.message);
      } else {
        //setPeopleList(data.data);
        if (data) {
          // setReportsData(data.data);
          toast.success("report fetch suceesfully");
          handleAllExport(data);

          // setGenerate(true);
          // var reportData = data.data.formattedReport;

          // console.log(reportData, "repo");
          // saveAsExcel(reportsData)
          // reportCreator(reportData);
        } else {
          toast.warn(`No Reports Available!`);
        }
      }
    }

    const rowData = [
      {
        employeeId: 20202,
        firstName: "krishna",
        function: "managweer",
        role: "admin",
        day1: "Absent",
        day2: "Present",
        day3: "Absent",
        assessmentScores: 10,
        certification: "yes",
        feedbackScores: "0",
      },
      {
        employeeId: 20202,
        firstName: "krishna",
        function: "managweer",
        role: "admin",
        day1: "Absent",
        day2: "Present",
        day3: "Absent",
        assessmentScores: 10,
        certification: "yes",
        feedbackScores: "0",
      },
      {
        employeeId: 20202,
        firstName: "krishna",
        function: "managweer",
        role: "admin",
        day1: "Absent",
        day2: "Present",
        day3: "Absent",
        assessmentScores: 10,
        certification: "yes",
        feedbackScores: "0",
      },
    ];

    button.disabled = false;
    button.className =
      "h-8 mt-4 w-fit px-6 ml-8 text-white rounded-md bg-green-500 cursor-pointer";
    button.innerText = "Generate Report";
  };

  const reportCreator = (reportData) => {
    Object.keys(reportData).forEach(function (key, index) {
      var batchReportArr = reportData[key];
      var indexNumber = newReports.length + 1;
      highlighter.push(indexNumber, indexNumber + 1);
      resultCreator(batchReportArr);
    });
    const filteredArr = averageReport.reduce((acc, current) => {
      const x = acc.find((item) => item.month === current.month);
      console.log(acc, "data");
      if (!x) {
        var data80 = current.result >= 80 ? [current.result] : [];
        var data90 = current.result >= 90 ? [current.result] : [];
        var data100 = current.result >= 100 ? [current.result] : [];

        const newCurr = {
          month: current.month,
          data: [current.result],
          data80: data80,
          data90: data90,
          data100: data100,
        };
        return acc.concat(newCurr);
      } else {
        const newData = x.data.push(current.result);
        if (current.result >= 80) {
          x.data80.push(current.result);
        }
        if (current.result >= 90) {
          x.data90.push(current.result);
        }
        if (current.result >= 100) {
          x.data100.push(current.result);
        }

        return acc;
      }
    }, []);

    var filterData = filteredArr.map((data) => {
      var monthdata = {
        name: data.month,
        cell1: "",
        cell2: "",
      };
      var monthdata80 = {
        name: ">=80",
        cell1: "",
        cell2: JSON.stringify(data.data80.length),
      };
      var monthdata90 = {
        name: ">=90",
        cell1: "",
        cell2: JSON.stringify(data.data90.length),
      };
      var monthdata100 = {
        name: ">=100",
        cell1: "",
        cell2: JSON.stringify(data.data100.length),
      };
      var monthentries = {
        name: "Total Entries",
        cell1: "",
        cell2: JSON.stringify(data.data.length),
      };
      var monthempty = {
        name: "",
        cell1: "",
        cell2: "",
      };
      //return [monthdata, monthdata80, monthdata90, monthdata100];
      avgexcel.push(
        monthdata,
        monthdata80,
        monthdata90,
        monthdata100,
        monthentries,
        monthempty
      );
    });
    console.log(avgexcel);
    setXlRep(newReports);
    setRange(highlighter);
    setSumReport(avgexcel);
    setGenerated({
      filename: `${moment(dates[0].startDate).format("ll")} to ${moment(
        dates[0].endDate
      ).format("ll")}_${selectedClient.label} ${selectedProgram.label}_${
        selectedType.label
      } Report`,
      timerange: `${moment(dates[0].startDate).format("ll")} to ${moment(
        dates[0].endDate
      ).format("ll")}`,
      report: `${selectedType.label} Report`,
    });

    setSelectedClient([]);
    setSelectedType([]);
    setDates([
      {
        startDate: new Date(),
        endDate: null,
        key: "selection",
      },
    ]);
    setSelectedProgram([]);
    setProgramId(null);
    setProjectId(null);
  };

  const resultCreator = (reportData) => {
    var reportTitleObj = {
      score: moment(reportData[0].arrayofUserRes.createdDate).format("ll"),
      participantName: reportData[0].tranineeName,
      refCode: "",
      employeeCode: "",
      region: "",
      result: "",
    };
    var reportHeadObj = {
      score: "Score",
      participantName: "Full Name",
      refCode: "Application Code/Reference Code",
      employeeCode: "Emp. Code",
      region: "Branch Name, Location",
      result: "Result",
    };
    newReports.push(reportTitleObj);
    newReports.push(reportHeadObj);
    var reportObj;
    var seperateObj;

    const content = reportData.map((r, index) => {
      reportObj = {
        //  month: moment(r.arrayofUserRes.createdDate).format("MMMM"),
        score: `${r.arrayofUserRes.obtainMarks} / ${r.arrayofUserRes.totalMarks}`,
        participantName: r.arrayofUserRes.fullName,
        refCode: r.arrayofUserRes.referenceCode,
        employeeCode: r.arrayofUserRes.employeeId,
        region: r.arrayofUserRes.branchName,
        result: (
          (parseFloat(r.arrayofUserRes.obtainMarks) * 100) /
          parseFloat(r.arrayofUserRes.totalMarks)
        ).toFixed(2),
      };

      seperateObj = {
        month: moment(r.arrayofUserRes.createdDate).format("MMMM"),
        score: `${r.arrayofUserRes.obtainMarks} / ${r.arrayofUserRes.totalMarks}`,
        participantName: r.arrayofUserRes.fullName,
        refCode: r.arrayofUserRes.referenceCode,
        employeeCode: r.arrayofUserRes.employeeId,
        region: r.arrayofUserRes.branchName,
        result: (
          (parseFloat(r.arrayofUserRes.obtainMarks) * 100) /
          parseFloat(r.arrayofUserRes.totalMarks)
        ).toFixed(2),
      };

      newReports.push(reportObj);
      averageReport.push(seperateObj);
    });

    // console.log(getAverageData(filteredArr), "s");

    // var myArr = newReports

    // myArr.sort((a,b)=> new Date(b.created).getTime() - new Date(a.created).getTime());

    // console.log(myArr);
    //  averageFinder(average);
  };

  function getSheetData(data) {
    var fields = Object.keys(data[0]);
    var sheetData = data.map(function (row) {
      return fields.map(function (fieldName) {
        return row[fieldName] ? row[fieldName] : "";
      });
    });
    // sheetData.unshift(header);

    return sheetData;
  }

  function getAverageData(data) {
    var fields = ["name", "cell1", "cell2"];

    var sheetData = data.map(function (row) {
      return fields.map(function (fieldName) {
        return row[fieldName] ? row[fieldName] : "";
      });
    });
    // sheetData.unshift(header);

    return sheetData;
  }

  // async function saveAsExcel() {
  //   var newData = xlRep;
  //   var data = newData;

  //   XlsxPopulate.fromBlankAsync().then(async (workbook) => {
  //     const sheet1 = workbook.sheet(0);
  //     // const sheet2 = workbook.sheet(1);
  //     // workbook.addSheet(SHEET2, 1);
  //     const sheetData = getSheetData(data);
  //     const averageSheet = getAverageData(sumReport);

  //     const totalColumns = sheetData[0].length;

  //     sheet1.cell("A1").value(sheetData);
  //     const range = sheet1.usedRange();
  //     console.log(sheetData, averageSheet);

  //     const endColumn = String.fromCharCode(64 + totalColumns);
  //     sheetData[0].map((sd, i) => {
  //       sheet1
  //         .column(String.fromCharCode(64 + (i + 1)))
  //         .width(20)
  //         .hidden(false);
  //     });

  //     datarange.map((r) => {
  //       sheet1.range(`A${r}:` + endColumn + `${r}`).style("fill", "ffff29");
  //       sheet1.row(`A${r}:` + endColumn + `${r}`).style("bold", true);
  //     });
  //     sheet1.cell("I2").value(averageSheet);
  //     averageSheet[0].map((sd, i) => {
  //       sheet1
  //         .column(String.fromCharCode(72 + (i + 1)))
  //         .width(20)
  //         .hidden(false);
  //     });
  //     // range.style("border", true);
  //     return workbook.outputAsync().then((res) => {
  //       var fname = document.getElementById("filename").innerText;

  //       saveAs(res, `${fname}.xlsx`);
  //     });
  //   });
  // }

  function getSheetData(data, header) {
    console.log(data, "getsheetData");
    var lengthArray = data.map((t) => Object.keys(t).length);
    var BigObjectIndex = lengthArray.indexOf(Math.max.apply(null, lengthArray));

    console.log(data[BigObjectIndex]);
    var fields = Object.keys(data[BigObjectIndex]);
    var sheetData = data.map(function (row) {
      return fields.map(function (fieldName) {
        return row[fieldName] ? row[fieldName] : "";
      });
    });

    sheetData.unshift(header);

    return sheetData;
  }
  const fetchEmployeeAttendence = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/batchAttendences/attendenceReport/${programId}?access_token=${
          userData?.accessToken
        }`
      );
      // check for error response
      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        console.log("error", response.statusText);
        return Promise.reject(error);
      }
      const data = await response.json();
      console.log("data++++++++++++++++", data);

      if (data.status === "failure") {
        toast.error(data?.msg);
        return;
      }
      var allExportAttendenceData = data;
      console.log(
        "allExportAttendenceData++++++++++++++++",
        allExportAttendenceData
      );
      handleAllExport(allExportAttendenceData);
    } catch (error) {
      console.error("There was an error!", error);
      if (error === "Token Expired" || error === "Malformed User") {
        signOut();
      }
    }
  };

  function handleAllExport(allExportAttendenceData) {
    let employees = [
      ["Total No. of participants", "Total No. of Batches", "Trainer Name"],
    ];

    console.log("allExportAttendenceData", allExportAttendenceData);

    // let rowData = [
    //   allExportAttendenceData.trainers,
    //   allExportAttendenceData.totalParticipants,
    //   allExportAttendenceData.totalBatches
    // ];

    let rowData = [
      allExportAttendenceData.totalParticipants,
      allExportAttendenceData.totalBatches,
      allExportAttendenceData.trainers,
    ];
    employees.push(rowData);

    console.log(employees);
    // Assuming Utils.exportAoaToXlsx is correctly implemented

    Utils.exportAoaToXlsx(employees, `Attendance-Report-${Date.now()}`);
  }
  async function saveAsExcel(data) {
    const updatedReport = data.map((report) => {
      const updatedReportData = {
        "Program Name": report.programName,
        Batch: report.batch,
        "Batch Type": report.BatchType,
        Time: report.Time,
        "Total Nomination/List": report.totalNomination,
        "No.of Participants- Day-1": report.noOfParticipantsDay1,
        "No.of Participants Day-2": report.noOfParticipantsDay2,
        "Trainer Name": report.trainerName,
        Date: report.date,
        Day: report.day,
        "Average Score(Out of 20)-Pre-Assessment":
          report.averagePreAssessmentScore,
        "Average Score(Out of 20)-Post Assessment":
          report.averagePostAssessmentScore,
        " Overall Program Rating  ": report.overallProgramRating,
      };
      return updatedReportData;
    });

    console.log("click", data, updatedReport);

    var header = [
      "Program Name",
      "Batch",
      "Batch Type",
      "Time",
      "Total Nomination/List",
      "No.of Participants- Day-1",
      "No.of Participants Day-2",
      "Trainer Name",
      "Date",
      "Day",
      "Average Score(Out of 20)-Pre-Assessment",
      "Average Score(Out of 20)-Post Assessment",
      "Overall Program Rating",
    ];

    var wsData = getSheetData(updatedReport, header);
    var ws = XLSX.utils.aoa_to_sheet(wsData);

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    var fname = XLSX.writeFile(wb, `${fname}.xlsx`);
  }
  // async function saveAsExcel() {
  //   var newData = xlRep;
  //   var data = newData;
  //   var header = [
  //     "Parameters",
  //     "Excellent",
  //     "Very Good",
  //     "Good",
  //     "Satisfactory",
  //     "Average",
  //     "Poor",
  //     "Total Score",
  //     "Average Score",
  //   ];
  //   const workbook = XLSX.utils.book_new();
  //   const sheetData = getSheetData(data,header);
  //   const averageSheet = getAverageData(sumReport);

  //   const totalColumns = sheetData[0].length;

  //   const sheet = XLSX.utils.aoa_to_sheet(sheetData);
  //   XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');

  //   const endColumn = String.fromCharCode(64 + totalColumns);

  //   sheetData[0].map((sd, i) => {
  //     const col = String.fromCharCode(64 + (i + 1));
  //     sheet['!cols'] = sheet['!cols'] || [];
  //     sheet['!cols'].push({ wch: 20 }); // Set column width to 20
  //     sheet['!cols'][col] = { hidden: false }; // Show the column
  //   });

  //   datarange.map((r) => {
  //     const range = XLSX.utils.decode_range(`A${r}:${endColumn}${r}`);
  //     for (let R = range.s.r; R <= range.e.r; ++R) {
  //       for (let C = range.s.c; C <= range.e.c; ++C) {
  //         const cell = sheet[XLSX.utils.encode_cell({ r: R, c: C })];
  //         if (!cell) continue;
  //         cell.s = { fill: { fgColor: { rgb: 'FFFF29' } }, font: { bold: true } };
  //       }
  //     }
  //   });

  //   const averageSheetData = XLSX.utils.aoa_to_sheet(averageSheet);
  //   XLSX.utils.book_append_sheet(workbook, averageSheetData, 'Sheet2');

  //   averageSheet[0].map((sd, i) => {
  //     const col = String.fromCharCode(72 + (i + 1));
  //     sheet['!cols'] = sheet['!cols'] || [];
  //     sheet['!cols'].push({ wch: 20 });
  //     sheet['!cols'][col] = { hidden: false };
  //   });

  //   const blob = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'blob' });
  //   const fname = document.getElementById("filename").innerText;
  //   saveAs(blob, `${fname}.xlsx`);
  // }

  // Example functions, replace them with your actual functions
  // function getSheetData(data) {
  //   // Replace this with your logic to convert data to a 2D array
  //   return [['A1', 'B1', 'C1'], ['A2', 'B2', 'C2'], ['A3', 'B3', 'C3']];
  // }

  function getAverageData(sumReport) {
    // Replace this with your logic to convert sumReport to a 2D array
    return [["AverageA", "AverageB", "AverageC"]];
  }

  // Dummy function to simulate saveAs, replace it with the actual one you are using
  function saveAs(blob, filename) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  console.log(selectedProgram?.data, "S");
  const [reports, setReports] = useState([]);
  // const [timeRange, setTimeRange] = useState('daily'); // Default time range is daily

  // // Fetch reports data based on the selected time range
  // const fetchReports = async () => {
  //   // Implement your API call or data fetching logic here
  //   // Update the 'data' variable with the fetched data
  // //   const data = await yourApiCall(timeRange); // Replace 'yourApiCall' with your actual API call
  //   setReports(rows);
  // };
  // // const [reportFrequency, setReportFrequency] = useState('Daily');

  // useEffect(() => {
  //     fetchReports();
  //   }, [timeRange]);

  //   // Handle time range change
  //   const handleTimeRangeChange = (event) => {
  //     setTimeRange(event.target.value);
  //   };

  // const columns = [
  //     { field: 'id', headerName: 'S.No', width: 90 },
  //     { field: 'empCode', headerName: 'E.Code', width: 120 },
  //     { field: 'empName', headerName: 'Emp. Name', width: 150 },
  //     { field: 'function', headerName: 'Function', width: 120 },
  //     { field: 'role', headerName: 'Role', width: 120 },
  //     { field: 'day1', headerName: 'Day 1', type: 'number', width: 100 },
  //     { field: 'day2', headerName: 'Day 2', type: 'number', width: 100 },
  //     { field: 'day3', headerName: 'Day 3', type: 'number', width: 100 },
  //     { field: 'assessmentScores', headerName: 'Assessment Scores', type: 'number', width: 150 },
  //     { field: 'certification', headerName: 'Certification', width: 120 },
  //     { field: 'feedbackScores', headerName: 'Feedback Scores', type: 'number', width: 150 },
  //     { field: 'attendance', headerName: 'Attendance', width: 120 },
  //     { field: 'interactionScores', headerName: 'Interaction Scores', type: 'number', width: 150 },
  // ];

  return (
    <>
      <div className="flex flex-col w-full min-h-screen ">
        {/* <Script
      strategy="lazyOnload"
      src="https://unpkg.com/flowbite@1.5.5/dist/datepicker.js"
    /> */}
        <div className="flex flex-col shadow-md rounded-md bg-white w-full h-fit mt-12  px-12">
          <label className="leading-loose items-center justify-center flex w-full font-medium text-xl my-3 text-gray-700 text-center">
            Generate Trainer Level report
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
            <label className="text-gray-700 font-medium text-md w-40">
              Time Range*
            </label>
            <DateRange
              className="shadow-md"
              editableDateInputs={true}
              onChange={(item) => setDates([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={dates}
            />
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
              {generated ? (
                <div className="ml-8 break-inside relative overflow-hidden flex flex-col justify-between space-y-2 text-sm rounded-xl max-w-[27rem] p-4 my-4 bg-[#5E17F4] text-white">
                  <span id="reportfor">{generated.report}</span>
                  <div className="flex flex-row items-center space-x-3">
                    <svg
                      width="58"
                      height="56"
                      viewBox="0 0 52 50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M32.6458 38.4379C33.9918 37.1198 33.2655 34.0922 31.0668 30.5948C31.8658 30.4707 32.6129 30.281 33.178 29.9905C35.2112 28.9466 36.584 27.044 37.6232 25.0759C38.7403 22.9647 39.49 20.644 40.9477 18.7215C41.1939 18.3966 41.44 18.1052 41.6853 17.831C44.8304 18.206 47.3412 18.8784 47.3412 18.8784L48.3006 16.4534C47.0896 16.0212 45.848 15.6791 44.586 15.4302C45.3591 14.9931 45.8635 14.8569 45.8635 14.8569L44.9543 12.4121C43.4966 13.025 42.3136 13.9293 41.323 15.0121C37.6206 14.806 33.8921 15.5397 30.9506 17.8086C28.7389 19.5155 27.2447 21.8819 25.839 24.2491C24.5935 23.0333 23.2671 21.9023 21.8688 20.8638C22.134 20.4302 22.4182 20.0405 22.7242 19.7397C24.5728 17.9293 27.0116 16.7716 28.6115 14.7C31.9742 10.35 29.5146 3.53103 26.7481 0C26.2524 0.475 25.4325 1.16724 24.8155 1.71379C27.7561 4.70948 29.8127 9.95431 27.5082 13.8733C26.2203 16.0638 23.8404 17.4379 22.1764 19.3198C21.8887 19.6466 21.6313 20.0603 21.3982 20.5172C17.0466 17.4129 13.053 16.1638 11.4704 17.7138C11.3133 17.8737 11.1838 18.0584 11.0874 18.2603L11.0813 18.2543L11.0388 18.3776C10.9799 18.5112 10.9261 18.65 10.8897 18.8017L0 50L31.774 38.95L31.7653 38.9414C32.1068 38.8319 32.4075 38.6707 32.6458 38.4379ZM6.32065 45.9759L3.66863 44.7465L5.45831 39.6172L13.6666 43.4207L6.32065 45.9759ZM21.0116 40.8664L7.24972 34.4879L9.0394 29.3595L19.3233 34.494C13.1847 30.5198 10.8291 24.2293 10.8291 24.2293L11.441 22.4767C12.5286 25.2138 14.9215 28.6224 18.2097 31.8397C21.5256 35.0862 25.0399 37.4379 27.8488 38.4888L21.0116 40.8664ZM26.2975 24.7112C27.7344 22.6621 29.2156 20.594 31.2748 19.1224C33.2352 17.7207 36.4176 17.4647 39.4345 17.6328C38.4153 19.4034 37.6622 21.3681 36.9861 23.2552C36.1689 25.5397 35.0734 27.9086 32.9847 29.3095C32.4214 29.6871 31.6318 29.9629 30.7886 30.1672C29.6298 28.4009 28.1097 26.5336 26.2975 24.7112Z"
                        fill="white"
                      />
                      <path
                        d="M18.2287 16.3793C19.0971 16.3793 16.4937 13.7931 16.9287 11.525C18.5962 11.3974 22.4078 12.1448 20.1892 9.11379C22.699 9.55345 23.9991 7.68966 21.6296 5.92328C22.4182 5.97845 23.6437 4.49914 22.764 4.31207C19.9456 3.7181 18.8423 5.23448 20.6312 7.42155C18.7505 7.07328 17.2173 7.9431 18.63 9.89655C13.1994 9.22328 16.2891 16.3793 18.2287 16.3793ZM36.8726 14.081C37.6864 13.7155 36.3058 11.3009 35.8569 10.6836C39.2915 10.3181 39.1615 9.3 37.0078 7.11897C42.8631 7.31466 37.1889 4.00431 37.9846 2.69397C38.6736 1.55776 40.7874 2.74914 40.5915 2.11638C39.9311 0 33.6668 1.43103 37.631 5.38276C34.1712 5.45 33.8393 6.575 36.4176 8.9069C31.9265 8.95603 35.5908 14.6552 36.8726 14.081ZM51.7378 22.6078C50.3667 22.9897 50.1553 22.8466 50.3381 24.2043C47.1713 22.7543 43.8207 20.7379 45.854 26.0802C42.2573 23.95 42.4367 25.8155 41.7641 28.8853C40.8888 28.2069 39.6451 26.419 39.6451 26.419L38.3278 27.5319C38.3278 27.5319 40.7414 30.9181 41.9331 30.7259C42.9809 30.5578 43.5512 28.5879 43.6093 26.8517C46.946 28.2526 48.5432 28.4397 47.017 24.3431C49.6846 25.8336 52.9555 27.1483 51.7378 22.6078ZM3.50916 7.27328L5.96011 9.71207L3.50916 12.15L1.05734 9.71207L3.50916 7.27328ZM24.1005 26.5181L21.6478 28.956L19.1959 26.5164L21.6486 24.0776L24.1005 26.5181ZM13.1908 3.44828L15.6417 5.88621L13.1899 8.32586L10.7389 5.88621L13.1908 3.44828ZM39.8765 37.4862L37.4238 35.0474L39.8748 32.6078L42.3275 35.0466L39.8765 37.4862ZM34.4113 45.85L31.9603 43.4121L34.4113 40.9733L36.8631 43.4121L34.4113 45.85ZM45.1649 47.7759L42.7123 45.3371L45.1623 42.8974L47.615 45.3362L45.1649 47.7759ZM47.6159 36.669L45.1649 34.2302L47.6159 31.7922L50.0668 34.2302L47.6159 36.669ZM43.5243 6.03448L45.9753 8.47241L43.5235 10.9112L41.0725 8.47241L43.5243 6.03448Z"
                        fill="white"
                      />
                    </svg>
                    <div className="flex flex-col">
                      <span className="text-base font-medium">
                        Reports Generated Successfully!
                      </span>
                      <span id="filename" className=" text-xs text-gray-300">
                        {generated?.filename}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span id="timerange">{generated.timerange}</span>
                    <button
                      onClick={() => saveAsExcel()}
                      className="flex items-center justify-center text-xs font-medium rounded-full px-4 py-2 space-x-1 bg-white text-black"
                    >
                      <span>Download</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h13M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ReportFormat;
