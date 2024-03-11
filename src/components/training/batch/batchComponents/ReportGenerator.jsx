import React, { useEffect, useState } from "react";
import { AiOutlineDownload } from "react-icons/ai";

import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../../../context/auth";
// import { ExcelJS } from "exceljs"
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
function ReportGenerator({
  list,
  setBatchPop,
  setChartData,
  setExcelData,
  batchData,
  setReportPop,
  setBatchData,
}) {
  const [generate, setGenerate] = useState(false);
  const [chartRep, setChartRep] = useState([]);
  const { userData } = useAuth();
  const [xlRep, setXlRep] = useState([]);
  const [advxl, setadvXl] = useState([]);
  const [labels, setLabels] = useState([]);
  const [reportsData, setReportsData] = useState([]);
  const [newLabels, setNewLabels] = useState([]);
  const [averageScore, setAverageScore] = useState([]);
  const [downloader, setDownloader] = useState(false);
  console.log(reportsData, "s");

  var average = [];
  var newReports = [];
  var newAdvanceReport = [];
  var chartReports = [];
  var chartArr = [];
  const reportDownloader = async (bId, aId) => {
    const formData = { assessmentId: aId, batchId: bId };
    var response;

    let form = new URLSearchParams(Object.entries(formData)).toString();

    response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/userBatchAnswers/getReport?access_token=${userData?.accessToken}`,
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
        if (data?.value) {
          setReportsData(data.data);
          console.log(data.data, "ub");
          // setGenerate(true);
          var reportData = data.data;
          resultCreator(reportData);
        } else {
          toast.warn(`No reports available!! Try again later`);
        }
      }
    }
  };

  const resultCreator = (reportData) => {
    console.log(reportData, "reportData");
    var reportObj;
    var chartObj;
    var advanceReportObj;

    const content = reportData?.reportData.map((r, index) => {
      reportObj = {
        timestamp: r.createdDate.substring(0, 10),
        participantName: r.fullName,
        employeeCode: r.employeeId,
        email: r.email,
        score: `${r.obtainMarks} / ${r.totalMarks}`,
        region: r.branchName,
        result: r.result,
        avgscore: "",
      };
      advanceReportObj = {
        program: reportData?.teamInfo?.programName,
        facilitator: reportData?.teamInfo?.tranineeName,
        timestamp: r.createdDate.substring(0, 10),
        participantName: r.fullName,
        employeeCode: r.employeeId,
        email: r.email,
        contact: r?.contactNo,
        score: r.obtainMarks,
        region: r.branchName,
        result: r.result,
      };

      var g = JSON.parse(r.answerResponseBunch);
      var h = g.map((op, i) => {
        console.log(op, "OP");
        var selectedAnswer;
        if (op.questionType == "multiopt") {
          selectedAnswer =
            op?.selectedAnswer.join() || op?.selectedOption.join();
        } else {
          selectedAnswer = op?.selectedAnswer || op?.selectedOption;
        }
        var userselected = {};
        userselected = {
          ...userselected,
          [`question${i + 1}`]: selectedAnswer,
        };
        advanceReportObj = { ...advanceReportObj, ...userselected };
        return op;
      });

      //setAverageScore([...averageScore, r.obtainMarks]);
      average.push(parseInt(r.obtainMarks));

      chartReports.push(JSON.parse(r.answerResponseBunch));

      newReports.push(reportObj);
      if (newReports.length == reportData.reportData.length) {
        var sum = average.reduce((pv, cv) => pv + cv, 0);
        var avgs = sum / average.length;
        newReports.push({
          timestamp: "",
          participantName: "",
          employeeCode: "",
          email: "",
          score: "",
          region: "",
          result: "",
          avgscore: `${Math.trunc(avgs)} / ${r.totalMarks}`,
        });
      }
      newAdvanceReport.push(advanceReportObj);

      return r;
    });
    //  averageFinder(average);

    setXlRep(newReports);
    setadvXl(newAdvanceReport);
    const newChartData = chartReports.map((rep) => {
      return rep.map((newrep) => {
        chartObj = {
          label: newrep.question,
          data: newrep.selectedOption,
          type: newrep.questionType,
          options: newrep.answers,
        };

        return chartArr.push(chartObj);
      });
    });

    arrayMerger(chartArr);
  };

  const arrayMerger = (data) => {
    console.log("==============datat======", data);
    const filteredArr = data.reduce((acc, current) => {
      const x = acc.find((item) => item.label === current.label);

      if (!x) {
        const newCurr = {
          label: current.label,
          data: [current.data],
          type: current.type,
          options: current.options,
        };
        return acc.concat([newCurr]);
      } else {
        const newData = x.data.push(current.data);
        const newCurr = {
          label: current.label,
          data: newData,
          type: current.type,
          options: current.options,
        };
        return acc;
      }
    }, []);

    var c = [];
    var allLabels = [];
    console.log(filteredArr, "shh");
    var u = filteredArr.map((f) => {
      allLabels.push(f.label);

      //  var a = { ...f.data };
      // var inc = 1;
      // var a = f.data.reduce(
      //   (a, b) => ((a[`opt${inc++}`] = JSON.stringify(b)), a),
      //   {}
      // );
      // c.push(a);
      return f;
    });
    console.log(c, "pouu");
    var tr = [];
    // const finalReport = newReports.map((add, i) => {
    //   var finals = {};
    //   finals = { ...add, ...c[i] };
    //   tr.push(finals);
    // });
    for (var i = 0; i <= c.length; i++) {
      var finals = {};
      finals = { ...newReports[i], ...c[i] };
      tr.push(finals);
    }
    allLabels = [
      "Program Title",
      "Facilitator",
      "Date",
      "Employee Name",
      "EmployeeId",
      "Email",
      "Contact",
      "Score",
      "Region",
      "Result",
      ...allLabels,
    ];
    // console.log(tr, allLabels, "ihug");
    //setadvXl(tr);
    setNewLabels(allLabels);

    // // chartArry = filteredArr;
    console.log(filteredArr, "ouigvvhf");

    //  setLabels(allLabels);
    console.log("===================================filet ararra", filteredArr);
    //setChartData(filteredArr);
    setChartRep(filteredArr);
    setGenerate(true);
  };

  const file = `${reportsData?.teamInfo?.createdDate?.substring(0, 10)} ${
    reportsData?.assessmentRes?.assessmentType
  } Report ${reportsData?.teamInfo?.programName} ${
    reportsData?.teamInfo?.tranineeName
  }`.toUpperCase();
  // const type = reportData?.assessmentRes?.assessmentType;

  function getSheetData(data, header) {
    var fields = Object.keys(data[0]);
    var sheetData = data.map(function (row) {
      return fields.map(function (fieldName) {
        return row[fieldName] ? row[fieldName] : "";
      });
    });
    sheetData.unshift(header);

    return sheetData;
  }

  // async function saveAsExcel() {
  //   var newData = xlRep;
  //   // var scoreObj = {
  //   //   timestamp: "",
  //   //   participantName: "",
  //   //   employeeCode: "",
  //   //   email: "",
  //   //   score: "",
  //   //   region: "",
  //   //   result: "",
  //   //   avgscore: averageScore,
  //   // };
  //   // newData.push(scoreObj);

  //   var data = newData;
  //   console.log(data, "uh");
  //   let header = [
  //     "Time Stamps",
  //     "Employee Name",
  //     "EmployeeId",
  //     "Email",
  //     "Score",
  //     "Branch Name",
  //     "Result",
  //     "Average Score",
  //   ];

  //   XlsxPopulate.fromBlankAsync().then(async (workbook) => {
  //     const sheet1 = workbook.sheet(0);
  //     // const sheet2 = workbook.sheet(1);
  //     // workbook.addSheet(SHEET2, 1);
  //     const sheetData = getSheetData(data, header);

  //     const totalColumns = sheetData[0].length;

  //     sheet1.cell("A1").value(sheetData);

  //     const range = sheet1.usedRange();
  //     const endColumn = String.fromCharCode(64 + totalColumns);
  //     sheet1.row(1).style("bold", true);
  //     sheet1.range("A1:" + endColumn + "1").style("fill", "ffff29");
  //     range.style("border", true);
  //     return workbook.outputAsync().then((res) => {
  //       var fname = document.getElementById(
  //         `basic${list.assessmentId}`
  //       ).innerText;
  //       saveAs(res, `${fname}.xlsx`);
  //     });
  //   });
  //   setDownloader(!downloader);
  // }

  // async function saveAsExcel() {
  //   var newData = xlRep;

  //   var data = newData;
  //   console.log(data, "uh");
  //   let header = [
  //     "Time Stamps",
  //     "Employee Name",
  //     "EmployeeId",
  //     "Email",
  //     "Score",
  //     "Branch Name",
  //     "Result",
  //     "Average Score",
  //   ];

  //   // Create a new workbook and add a worksheet
  //   var workbook = new ExcelJS.Workbook();
  //   var sheet = workbook.addWorksheet("Sheet 1");

  //   // Add header row
  //   sheet.addRow(header);

  //   // Add data rows
  //   data.forEach(row => {
  //     sheet.addRow([
  //       row.timestamp || "",
  //       row.participantName || "",
  //       row.employeeCode || "",
  //       row.email || "",
  //       row.score || "",
  //       row.region || "",
  //       row.result || "",
  //       row.avgscore || "",
  //     ]);
  //   });

  //   // Apply styles
  //   sheet.getRow(1).font = { bold: true };
  //   sheet.getRow(1).fill = {
  //     type: "pattern",
  //     pattern: "solid",
  //     fgColor: { argb: "ffff29" },
  //   };

  //   // Set column widths
  //   sheet.columns = [
  //     { width: 15 },
  //     { width: 20 },
  //     { width: 15 },
  //     { width: 25 },
  //     { width: 10 },
  //     { width: 20 },
  //     { width: 15 },
  //     { width: 15 },
  //   ];

  //   // Save the workbook
  //   var fname = document.getElementById(`basic${list.assessmentId}`).innerText;
  //   await workbook.xlsx.writeBuffer().then(function (buffer) {
  //     saveAs(new Blob([buffer], { type: "application/octet-stream" }), `${fname}.xlsx`);
  //   });

  //   setDownloader(!downloader);
  // }

  async function saveAsExcel() {
    var newData = xlRep;
    var data = newData;
    console.log(data, "uh");

    let header = [
      "Time Stamps",
      "Employee Name",
      "EmployeeId",
      "Email",
      "Score",
      "Branch Name",
      "Result",
      "Average Score",
    ];

    const sheetData = getSheetData(data, header);

    const ws = XLSX.utils.aoa_to_sheet([header, ...sheetData]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

    const wopts = { bookType: "xlsx", bookSST: false, type: "binary" };
    const wbout = XLSX.write(wb, wopts);

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }

    const fname = document.getElementById(
      `basic${list.assessmentId}`
    ).innerText;
    saveAs(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      `${fname}.xlsx`
    );

    setDownloader(!downloader);
  }

  const averageFinder = (average) => {
    console.log(average, "uhj");
    //var arr = [3, "a", "a", "a", 2, 3, "a", 3, "a", 2, 4, 9, 3];
    var arr = average;
    var mf = 1;
    var m = 0;
    var item;

    for (var i = 0; i < arr.length; i++) {
      for (var j = i; j < arr.length; j++) {
        if (arr[i] == arr[j]) m++;
        if (mf < m) {
          mf = m;
          item = arr[i];
        }
      }

      m = 0;
    }
    setAverageScore(item);
    console.log(item + " ( " + mf + " times ) ", "uhukbk");
  };

  // async function saveAdvanceExcel() {
  //   var data2 = advxl.map((data) => {
  //     Object.keys(data).forEach((key) => {
  //       if (key.match("question")) {
  //         if (data[key] === "Excellent") {
  //           data = { ...data, [key]: "5" };
  //         } else if (data[key] === "Very Good") {
  //           data = { ...data, [key]: "4" };
  //         } else if (data[key] === "Good") {
  //           data = { ...data, [key]: "3" };
  //         } else if (data[key] === "Satisfactory") {
  //           data = { ...data, [key]: "2" };
  //         } else if (data[key] === "Average") {
  //           data = { ...data, [key]: "1" };
  //         } else if (data[key] === "Poor") {
  //           data = { ...data, [key]: "0" };
  //         }
  //       }
  //     });
  //     return data;
  //   });

  //   // console.log(data2);

  //   let header = newLabels;
  //   console.log(data2, header, "popopop");
  //   // XlsxPopulate.fromBlankAsync().then(async (workbook) => {
  //   //   const sheet1 = workbook.sheet(0);
  //   //   // const sheet2 = workbook.sheet(1);
  //   //   // workbook.addSheet(SHEET2, 1);
  //   //   const sheetData = getSheetData(data2, header);

  //   //   const totalColumns = sheetData[0].length;

  //   //   sheet1.cell("A1").value(sheetData);

  //   //   const range = sheet1.usedRange();
  //   //   const endColumn = String.fromCharCode(64 + totalColumns);
  //   //   sheet1.row(1).style("bold", true);
  //   //   //sheet1.range("A1:" + endColumn + "1").style("fill", "ffff29");
  //   //   range.style("border", true);

  //   //   return workbook.outputAsync().then((res) => {
  //   //     var fname = document.getElementById(
  //   //       `advance${list.assessmentId}`
  //   //     ).innerText;

  //   //     saveAs(res, `${fname}.xlsx`);
  //   //   });
  //   // });
  //   setDownloader(!downloader);
  // }
  // ${reportsData?.teamInfo?.createdDate?.substring(0, 10)} ${
  //   reportsData?.assessmentRes?.assessmentType
  // } Report ${reportsData?.teamInfo?.programName} ${
  //   reportsData?.teamInfo?.tranineeName
  // }

  async function saveAdvanceExcel() {
    var data2 = advxl.map((data) => {
      Object.keys(data).forEach((key) => {
        if (key.match("question")) {
          if (data[key] === "Excellent") {
            data = { ...data, [key]: "5" };
          } else if (data[key] === "Very Good") {
            data = { ...data, [key]: "4" };
          } else if (data[key] === "Good") {
            data = { ...data, [key]: "3" };
          } else if (data[key] === "Satisfactory") {
            data = { ...data, [key]: "2" };
          } else if (data[key] === "Average") {
            data = { ...data, [key]: "1" };
          } else if (data[key] === "Poor") {
            data = { ...data, [key]: "0" };
          }
        }
      });
      return data;
    });

    let header = newLabels;
    console.log(data2, header, "popopop");

    const ws = XLSX.utils.aoa_to_sheet([
      header,
      ...getSheetData(data2, header),
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

    const wopts = { bookType: "xlsx", bookSST: false, type: "binary" };
    const wbout = XLSX.write(wb, wopts);

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }

    const fname = document.getElementById(
      `advance${list.assessmentId}`
    ).innerText;
    saveAs(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      `${fname}.xlsx`
    );

    setDownloader(!downloader);
  }

  return (
    <>
      {generate ? (
        <>
          <div>
            <p id={`basic${list.assessmentId}`} className="hidden capitalize">
              Basic{" "}
              {
                document.getElementById(`assesType${list.assessmentId}`)
                  .innerText
              }
              _{reportsData?.teamInfo?.teamName}
            </p>
            <p id={`advance${list.assessmentId}`} className="hidden capitalize">
              {
                document.getElementById(`assesType${list.assessmentId}`)
                  .innerText
              }
              _ User Response Report_{reportsData?.teamInfo?.teamName}
            </p>
            <button
              type="button"
              className="flex w-fit items-center justify-center bg-sky-500 py-2 rounded-md px-5 text-sm  text-white font-medium"
              // onClick={() => saveAdvanceExcel()}
              onClick={() => setDownloader(!downloader)}
            >
              <AiOutlineDownload className="text-xl mr-1" /> Excel Report
            </button>
            {downloader ? (
              <div className=" absolute  -mt-24  left-16  w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className=" space-y-1" role="none">
                  <button
                    onClick={() => saveAsExcel()}
                    className="text-gray-700 rounded-t-md   flex  w-full px-4 py-2 text-sm hover:bg-blue-500 hover:text-white"
                  >
                    <AiOutlineDownload className="text-xl mr-1" /> Basic Report
                  </button>
                  <button
                    onClick={() => saveAdvanceExcel()}
                    className="text-gray-700 rounded-b-md  flex  w-full px-4 py-2 text-sm hover:bg-blue-500 hover:text-white"
                  >
                    <AiOutlineDownload className="text-xl mr-1" /> User Response
                    Report
                  </button>
                </div>
              </div>
            ) : null}
          </div>
          <div>
            <button
              onClick={() => {
                setChartData(chartRep);
                setExcelData(reportsData?.assessmentRes?.assessmentType);
                // setBatchPop(true);
                setReportPop(true);
                setDownloader(false);
                setBatchData(reportsData);
              }}
              type="button"
              className="flex w-fit items-center justify-center bg-sky-500 py-2 rounded-md px-5 text-sm  text-white font-medium"
            >
              <AiOutlineDownload className="text-xl mr-1" /> Overview Report
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            reportDownloader(list.batchId, list.assessmentId);
            //setGenerate(true);
          }}
          className=" text-gray-600  flex items-center justify-center space-x-1 text-2xl hover:underline"
        >
          <AiOutlineDownload />
          <p className="text-sm mb-0.5">Generate Report</p>
        </button>
      )}
    </>
  );
}

export default ReportGenerator;
