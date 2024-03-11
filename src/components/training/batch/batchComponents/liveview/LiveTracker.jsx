import React, { useEffect, useState } from "react";
import {
  AiOutlineDownload,
  AiOutlineFundView,
  AiOutlineLineChart,
} from "react-icons/ai";

import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../../../../context/auth";
import { saveAs } from "file-saver";
import { useParams } from "react-router";
// import XlsxPopulate from "xlsx-populate";
function LiveTracker({
  list,
  setBatchPop,
  setChartData,

  setExcelData,
  updater,
  setUpdater,
  syncId,
  setSyncId,
}) {
  const { userData } = useAuth();
  const [generate, setGenerate] = useState(false);
  const [chartRep, setChartRep] = useState([]);

  const [xlRep, setXlRep] = useState([]);
  const [advxl, setadvXl] = useState([]);
  const [labels, setLabels] = useState([]);
  const { id: batchId } = useParams();
  const [reportsData, setReportsData] = useState([]);
  const [newLabels, setNewLabels] = useState([]);
  const [averageScore, setAverageScore] = useState([]);

  const [downloader, setDownloader] = useState(false);
  var average = [];
  var newReports = [];
  var newAdvanceReport = [];
  var chartReports = [];
  var chartArr = [];

  useEffect(() => {
    if (updater.status !== "init") {
      reportDownloader(syncId.batch, syncId.assessment);

      setUpdater({ ...updater, status: "init" });
    }
  }, [updater]);

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
          // console.log(data.data, "ub");
          // setGenerate(true);
          var reportData = data.data;
          resultCreator(reportData, bId, aId);
        } else {
          toast.warn(`No reports available!! Try again later`);
        }
      }
    }
  };

  const resultCreator = (reportData, bId, aId) => {
    var reportObj;
    var chartObj;
    var advanceReportObj;

    const content = reportData?.reportData.map((r, index) => {
      reportObj = {
        timestamp: r.createdDate,
        program: reportData?.teamInfo?.programName,
        facilitator: reportData?.teamInfo?.tranineeName,
        batchId: bId,
        assessmentId: aId,
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
        // newReports.push({
        //   timestamp: "",
        //   participantName: "",
        //   employeeCode: "",
        //   email: "",
        //   score: "",
        //   region: "",
        //   result: "",
        //   avgscore: `${Math.trunc(avgs)} / ${r.totalMarks}`,
        // });
      }
      newAdvanceReport.push(advanceReportObj);

      return r;
    });
    //  averageFinder(average);

    setXlRep(newReports);
    if (updater.status !== "init") {
      setExcelData(newReports);
    }

    newReports = [];
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
    // console.log(filteredArr, "shh");
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
    // console.log(c, "pouu");
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
    // console.log(filteredArr, "ouigvvhf");

    //  setLabels(allLabels);

    //setChartData(filteredArr);
    setChartRep(filteredArr);
    setGenerate(true);
  };

  const file = `${reportsData?.assessmentRes?.assessmentType}_assessment_${reportsData?.assessmentRes?.name}_${reportsData?.teamInfo?.tranineeName}`;
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
  // console.log(xlRep, "pppppppppo");
  async function saveAsExcel() {
    var newData = xlRep;
    // var scoreObj = {
    //   timestamp: "",
    //   participantName: "",
    //   employeeCode: "",
    //   email: "",
    //   score: "",
    //   region: "",
    //   result: "",
    //   avgscore: averageScore,
    // };
    // newData.push(scoreObj);

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

    // XlsxPopulate.fromBlankAsync().then(async (workbook) => {
    //   const sheet1 = workbook.sheet(0);
    //   // const sheet2 = workbook.sheet(1);
    //   // workbook.addSheet(SHEET2, 1);
    //   const sheetData = getSheetData(data, header);

    //   const totalColumns = sheetData[0].length;

    //   sheet1.cell("A1").value(sheetData);

    //   const range = sheet1.usedRange();
    //   const endColumn = String.fromCharCode(64 + totalColumns);
    //   sheet1.row(1).style("bold", true);
    //   sheet1.range("A1:" + endColumn + "1").style("fill", "ffff29");
    //   range.style("border", true);
    //   //   return workbook.outputAsync().then((res) => {
    //   //     saveAs(res, `BasicReport_${file}.xlsx`);
    //   //   });
    // });
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

  async function saveAdvanceExcel() {
    var data = advxl;
    let header = newLabels;
    console.log(data, header, "popopop");
    // XlsxPopulate.fromBlankAsync().then(async (workbook) => {
    //   const sheet1 = workbook.sheet(0);
    //   // const sheet2 = workbook.sheet(1);
    //   // workbook.addSheet(SHEET2, 1);
    //   const sheetData = getSheetData(data, header);

    //   const totalColumns = sheetData[0].length;

    //   sheet1.cell("A1").value(sheetData);

    //   const range = sheet1.usedRange();
    //   const endColumn = String.fromCharCode(64 + totalColumns);
    //   sheet1.row(1).style("bold", true);
    //   //sheet1.range("A1:" + endColumn + "1").style("fill", "ffff29");
    //   range.style("border", true);

    //   return workbook.outputAsync().then((res) => {
    //     saveAs(res, `UserReport_${file}.xlsx`);
    //   });
    // });
    setDownloader(!downloader);
  }

  return (
    <>
      {generate ? (
        <>
          {/* <div>
            <button
              type="button"
              className="flex w-fit items-center justify-center bg-sky-500 py-2 rounded-md px-5 text-sm  text-white font-medium"
              onClick={() => saveAsExcel()}
              // onClick={() => setDownloader(!downloader)}
            >
              <AiOutlineDownload className="text-xl mr-1" /> Preview Report
            </button>
          </div> */}
          <div>
            <button
              onClick={() => {
                // saveAsExcel();
                //setChartData(chartRep);
                //  setExcelData(reportsData?.assessmentRes?.assessmentType);
                setExcelData(xlRep);
                setBatchPop(true);
                setDownloader(false);
              }}
              type="button"
              className="flex w-fit items-center justify-center bg-green-500 py-2 rounded-md px-5 text-sm  text-white font-medium"
            >
              <AiOutlineFundView className="text-xl mr-1" /> Preview Report
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => {
            reportDownloader(list.batchId, list.assessmentId);
          }}
          className=" text-gray-600  flex items-center justify-center space-x-1 text-2xl hover:underline"
        >
          <AiOutlineLineChart />
          <p className="text-sm mb-0.5">Track Report</p>
        </button>
      )}
    </>
  );
}

export default LiveTracker;
