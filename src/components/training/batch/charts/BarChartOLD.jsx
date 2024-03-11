import React, { useCallback, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import downloadjs from "downloadjs";
import html2canvas from "html2canvas";
import { v4 as uuid_v4 } from "uuid";
import { AiOutlineDownload } from "react-icons/ai";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// import { faker } from "@faker-js/faker";
import { saveAs } from "file-saver";
// import XlsxPopulate from "-populate";

// import XlsxPopulate from "xlsx-populate";
import * as XLSX from 'xlsx';

import jsPDF from "jspdf";
import AverageChart from "./AverageChart";
import PercentChart from "./PercentChart";
import Loader from "../../../Loader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,

  Title,
  Tooltip,
  Legend
);

function BarChart({ chartData, excelData, batchData }) {
  console.log(chartData, "chartData-chartData");
  const [exr, setexr] = useState([]);
  const [downloader, setDownloader] = useState(false);
  const [formChanger, setFormChanger] = useState(false);
  const [barChanger, setBarChanger] = useState(false);
  const [bars, setBars] = useState([]);
  const [headLabel, setHeadLabel] = useState([]);
  const [averages, setAverages] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  var counter = 1;
  var ne = [];
  var ave = [];
  var links = [];
  const fileName = `${batchData?.teamInfo?.createdDate?.substring(0, 10)} ${batchData?.assessmentRes?.assessmentType
    } Report ${batchData?.teamInfo?.programName} ${batchData?.teamInfo?.tranineeName
    }`.toUpperCase();
  // const handleCaptureClick = useCallback(async () => {

  //   const pricingTableElmt = document.querySelector("#report-container");
  //   if (!pricingTableElmt) return;

  //   const copiedPricingTableElmt = pricingTableElmt.cloneNode(true); //as HTMLElement;
  //   copiedPricingTableElmt.style.position = "fixed";
  //   copiedPricingTableElmt.style.right = "100%";
  //   copiedPricingTableElmt.style.height = "auto";

  //   document.body.append(copiedPricingTableElmt);

  //   const canvas = await html2canvas(copiedPricingTableElmt);

  //   copiedPricingTableElmt.remove();

  //   const dataURL = canvas.toDataURL("image/png");
  //   downloadjs(dataURL, "download.png", "image/png");
  // }, []);

  //const file = `${reportsData?.assessmentRes?.assessmentType}_assessment_${reportsData?.assessmentRes?.name}_${reportsData?.teamInfo?.tranineeName}`;
  // const type = reportData?.assessmentRes?.assessmentType;
  const file = "newexcel";
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
  async function saveAsExcel() {
    var newData = exr;
    var data = newData;
    var header = [
      "Parameters",
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Average",
      "Poor",
      "Total Score",
      "Average Score",
    ];

    var wsData = getSheetData(data, header);
    var ws = XLSX.utils.aoa_to_sheet(wsData);

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    var fname = document.getElementById("title02").innerText;
    XLSX.writeFile(wb, `${fname}.xlsx`);
  }
  // async function saveAsExcel() {
  //   console.log(exr, "exr");
  //   var newData = exr;

  //   var data = newData;
  //   console.log(JSON.parse(JSON.stringify(data)) + "excel-data");
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


  //   // XlsxPopulate.fromBlankAsync().then(async (workbook) => {
  //   //   const sheet1 = workbook.sheet(0);
  //   //   // const sheet2 = workbook.sheet(1);
  //   //   // workbook.addSheet(SHEET2, 1);
  //   //   const sheetData = getSheetData(data, header);
  //   //   console.log(sheetData, "sheetData");
  //   //   const totalColumns = sheetData[0].length;

  //   //   sheet1.cell("A1").value(sheetData);

  //   //   const range = sheet1.usedRange();
  //   //   const endColumn = String.fromCharCode(64 + totalColumns);
  //   //   sheet1.column("A").width(80).hidden(false);
  //   //   sheet1.row(1).style("bold", true);
  //   //   sheet1.row(14).style("bold", true);
  //   //   //static changes
  //   //   // sheet1.row(2).style("bold", true);
  //   //   // sheet1.row(12).style("bold", true);
  //   //   // sheet1.row(19).style("bold", true);
  //   //   // sheet1.row(22).style("bold", true);
  //   //   // sheet1.row(27).style("bold", true);
  //   //   // sheet1.row(28).style("bold", true);
  //   //   // sheet1.row(38).style("bold", true);
  //   //   // sheet1.row(45).style("bold", true);
  //   //   // sheet1.row(48).style("bold", true);
  //   //   // sheet1.range("B2:" + "I2").style("fill", "000000");
  //   //   // sheet1.range("B12:" + "I12").style("fill", "000000");
  //   //   // sheet1.range("B19:" + "I19").style("fill", "000000");
  //   //   // sheet1.range("B22:" + "I22").style("fill", "000000");
  //   //   // sheet1.range("B28:" + "I28").style("fill", "000000");
  //   //   // sheet1.range("B38:" + "I38").style("fill", "000000");
  //   //   // sheet1.range("B45:" + "I45").style("fill", "000000");
  //   //   // sheet1.range("B48:" + "I48").style("fill", "000000");
  //   //   //static changes
  //   //   // sheet1.row(headLabel.length + 7).style("bold", true); // +5 for dynamic
  //   //   range.style("border", true);
  //   //   return workbook.outputAsync().then((res) => {
  //   //     var fname = document.getElementById("title02").innerText;
  //   //     console.log(fname, "fname");
  //   //     saveAs(res, `${fname}.xlsx`);
  //   //   });
  //   // });
  // }
  const A4_PAPER_DIMENSIONS = {
    width: 210,
    height: 297,
  };

  const A4_PAPER_RATIO = A4_PAPER_DIMENSIONS.width / A4_PAPER_DIMENSIONS.height;

  const imageDimensionsOnA4 = (dimensions) => {
    const isLandscapeImage = dimensions.width >= dimensions.height;

    if (isLandscapeImage) {
      return {
        width: A4_PAPER_DIMENSIONS.width,
        height:
          A4_PAPER_DIMENSIONS.width / (dimensions.width / dimensions.height),
      };
    }

    const imageRatio = dimensions.width / dimensions.height;
    if (imageRatio > A4_PAPER_RATIO) {
      const imageScaleFactor =
        (A4_PAPER_RATIO * dimensions.height) / dimensions.width;

      const scaledImageHeight = A4_PAPER_DIMENSIONS.height * imageScaleFactor;

      return {
        height: scaledImageHeight,
        width: scaledImageHeight * imageRatio,
      };
    }

    return {
      width:
        A4_PAPER_DIMENSIONS.height / (dimensions.height / dimensions.width),
      height: A4_PAPER_DIMENSIONS.height,
    };
  };
  async function saveAssessmentExcel() {
    var newData = exr;
    var data = newData;
    var header = [
      "Questions",
      "Total Score",
      "Average Score",
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4",
      "Option 5",
    ];

    var wsData = getSheetData(data, header);
    var ws = XLSX.utils.aoa_to_sheet(wsData);

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    var fname = document.getElementById("title02").innerText;
    XLSX.writeFile(wb, `${fname}.xlsx`);
  }
  // async function saveAssessmentExcel() {
  //   var newData = exr;

  //   var data = newData;

  //   var header = [
  //     "Questions",
  //     "Total Score",
  //     "Average Score",
  //     "Option 1",
  //     "Option 2",
  //     "Option 3",
  //     "Option 4",
  //     "Option 5",
  //   ];
  //   console.log(newData, "newData");

  //   // XlsxPopulate.fromBlankAsync().then(async (workbook) => {
  //   //   const sheet1 = workbook.sheet(0);
  //   //   // const sheet2 = workbook.sheet(1);
  //   //   // workbook.addSheet(SHEET2, 1);
  //   //   const sheetData = getSheetData(data, header);

  //   //   const totalColumns = sheetData[0].length;

  //   //   sheet1.cell("A1").value(sheetData);

  //   //   const range = sheet1.usedRange();
  //   //   const endColumn = String.fromCharCode(64 + totalColumns);
  //   //   // sheet1.row(1).style("bold", true);

  //   //   // sheet1.range("A1:" + endColumn + "1").style("fill", "000000");
  //   //   // range.style("border", true);
  //   //   return workbook.outputAsync().then((res) => {
  //   //     var fname = document.getElementById("title02").innerText;
  //   //     console.log(fname, "fname");
  //   //     saveAs(res, `${fname}.xlsx`);
  //   //   });
  //   // });
  // }

  const downloadImage = useCallback(async () => {
    setLoading(true);
    const pdf = new jsPDF();
    // var width = pdf.internal.pageSize.getWidth() - 12;
    // var height = 130;
    const title = document.querySelector(`#title01`);
    if (!title) return;
    const canvas = await html2canvas(title);
    const titleURL = canvas.toDataURL("image/png");
    const iDimensions = imageDimensionsOnA4({
      width: document.querySelector(`#title01`).clientWidth,
      height: document.querySelector(`#title01`).clientHeight,
    });
    pdf.addImage(
      titleURL,
      "PNG",
      (A4_PAPER_DIMENSIONS.width - iDimensions.width) / 2,
      (A4_PAPER_DIMENSIONS.height - iDimensions.height) / 2,
      iDimensions.width,
      iDimensions.height,
      "",
      "FAST"
    );
    pdf.addPage();
    for (var i = 0; i <= chartData.length; i++) {
      const pricingTableElmt = document.querySelector(`#charts${i}`);
      if (!pricingTableElmt) return;

      const canvas = await html2canvas(pricingTableElmt);
      const dataURL = canvas.toDataURL("image/png");

      const imageDimensions = imageDimensionsOnA4({
        width: document.querySelector(`#charts${i}`).clientWidth,
        height: document.querySelector(`#charts${i}`).clientHeight,
      });

      links.push({
        url: dataURL,
        name: `chart${i}.png`,
        type: "image/png",
      });
      //  pdf.addImage(dataURL, "PNG", 6, 6, width, height, "", "FAST");
      pdf.addImage(
        dataURL,
        "PNG",
        (A4_PAPER_DIMENSIONS.width - imageDimensions.width) / 2,
        (A4_PAPER_DIMENSIONS.height - imageDimensions.height) / 2,
        imageDimensions.width,
        imageDimensions.height,
        "",
        "FAST"
      );
      if (links.length < chartData.length) {
        pdf.addPage();
      }

      if (links.length == chartData.length) {
        var fname = document.getElementById("title01").innerText;
        pdf.save(`${fname}.pdf`);
        setLoading(false);
      }

      // downloadjs(dataURL, "download.png", "image/png");
    }
  }, []);
  const exsave = (data) => {
    console.log(data, "iuhygfjhgvkmnb");
    var a = []; //excel whole data holder
    var c = []; //percent object holder
    var b = []; //data object holder
    var cav = []; //average chart data
    var headerLabel = []; // labels for excel
    var dataset = []; // graph data holder
    var collector; // condition
    var ip = []; //percent chart data holder
    //percentages data representer in graph
    var poor = [];
    var average = [];
    var satisfactory = [];
    var good = [];
    var vgood = [];
    var excellent = [];
    //averages data representer in graph
    var avrarr = [];
    var apoor = [];
    var aaverage = [];
    var asatisfactory = [];
    var agood = [];
    var avgood = [];
    var aexcellent = [];

    //counting length of ratings type
    let countRatings = data.filter((rate) => {
      return rate.type.toLowerCase().includes("ratings");
    });
    //seperate rating type questions
    var b = data.map((bi, index) => {
      if (bi.type == "ratings") {
        collector = false;
        var sum = bi.data.reduce((pv, cv) => pv + cv, 0);
        //data object for excel
        var dataobject = {
          question: bi.label,
          great: JSON.stringify(bi.data[5]),
          verygood: JSON.stringify(bi.data[4]),
          good: JSON.stringify(bi.data[3]),
          satisfactory: JSON.stringify(bi.data[2]),
          average: JSON.stringify(bi.data[1]),
          poor: JSON.stringify(bi.data[0]),
          totalScore: sum,
          averageScore: (
            (bi.data[5] * 5 +
              bi.data[4] * 4 +
              bi.data[3] * 3 +
              bi.data[2] * 2 +
              bi.data[1] * 1 +
              bi.data[0] * 0) /
            sum
          ).toFixed(2),
        };

        console.log(dataobject, "dataobject");
        //data object for percentage in excel
        var percentobject = {
          question: bi.label,
          great: `${JSON.stringify(Math.trunc((bi.data[5] * 100) / sum))}%`,
          verygood: `${JSON.stringify(Math.trunc((bi.data[4] * 100) / sum))}%`,
          good: `${JSON.stringify(Math.trunc((bi.data[3] * 100) / sum))}%`,
          satisfactory: `${JSON.stringify(
            Math.trunc((bi.data[2] * 100) / sum)
          )}%`,
          average: `${JSON.stringify(Math.trunc((bi.data[1] * 100) / sum))}%`,
          poor: `${JSON.stringify(Math.trunc((bi.data[0] * 100) / sum))}%`,
        };

        console.log(percentobject, "percentobject");
        //data object for percentage in chart

        var perc = {
          question: bi.label,
          great: Math.trunc((bi.data[5] * 100) / sum),
          verygood: Math.trunc((bi.data[4] * 100) / sum),
          good: Math.trunc((bi.data[3] * 100) / sum),
          satisfactory: Math.trunc((bi.data[2] * 100) / sum),
          average: Math.trunc((bi.data[1] * 100) / sum),
          poor: Math.trunc((bi.data[0] * 100) / sum),
        };

        console.log(perc, "perc");

        var s = [];
        ip.push(perc);
        console.log("ip2", ip, index == 0);
        //changed here added ladder
        // if (index == 0) {
        //   console.log("index2", index);
        //   b.push(
        //     {
        //       question: "Program Relevance",
        //       great: 0,
        //       verygood: 0,
        //       good: 0,
        //       satisfactory: 0,
        //       average: 0,
        //       poor: 0,
        //       totalScore: 0,
        //       averageScore: 0,
        //     },
        //     dataobject
        //   );
        //   c.push(
        //     {
        //       question: "Program Relevance",
        //       great: 0,
        //       verygood: 0,
        //       good: 0,
        //       satisfactory: 0,
        //       average: 0,
        //       poor: 0,
        //       totalScore: 0,
        //       averageScore: 0,
        //     },
        //     percentobject
        //   );
        //   console.log(b, c, "bc");
        // } else if (index == 9) {
        //   b.push(
        //     {
        //       question: "Trainer Quality",
        //       great: 0,
        //       verygood: 0,
        //       good: 0,
        //       satisfactory: 0,
        //       average: 0,
        //       poor: 0,
        //       totalScore: 0,
        //       averageScore: 0,
        //     },
        //     dataobject
        //   );
        //   c.push(
        //     {
        //       question: "Trainer Quality",
        //       great: 0,
        //       verygood: 0,
        //       good: 0,
        //       satisfactory: 0,
        //       average: 0,
        //       poor: 0,
        //       totalScore: 0,
        //       averageScore: 0,
        //     },
        //     percentobject
        //   );
        // } else if (index == 15) {
        //   b.push(
        //     {
        //       question: "Facilities and Infrastructures",
        //       great: 0,
        //       verygood: 0,
        //       good: 0,
        //       satisfactory: 0,
        //       average: 0,
        //       poor: 0,
        //       totalScore: 0,
        //       averageScore: 0,
        //     },
        //     dataobject
        //   );
        //   c.push(
        //     {
        //       question: "Facilities and Infrastructures",
        //       great: 0,
        //       verygood: 0,
        //       good: 0,
        //       satisfactory: 0,
        //       average: 0,
        //       poor: 0,
        //       totalScore: 0,
        //       averageScore: 0,
        //     },
        //     percentobject
        //   );
        // } else if (index == 17) {
        //   b.push(
        //     {
        //       question: "Overall Score",
        //       great: 0,
        //       verygood: 0,
        //       good: 0,
        //       satisfactory: 0,
        //       average: 0,
        //       poor: 0,
        //       totalScore: 0,
        //       averageScore: 0,
        //     },
        //     dataobject
        //   );
        //   c.push(
        //     {
        //       question: "Overall Score",
        //       great: 0,
        //       verygood: 0,
        //       good: 0,
        //       satisfactory: 0,
        //       average: 0,
        //       poor: 0,
        //       totalScore: 0,
        //       averageScore: 0,
        //     },
        //     percentobject
        //   );
        // } else if (index == 18) {
        //   b.push(
        //     {
        //       question: "Comments & Observation",
        //       great: 0,
        //       verygood: 0,
        //       good: 0,
        //       satisfactory: 0,
        //       average: 0,
        //       poor: 0,
        //       totalScore: 0,
        //       averageScore: 0,
        //     },
        //     dataobject
        //   );
        //   c.push(
        //     {
        //       question: "Comments & Observation",
        //       great: 0,
        //       verygood: 0,
        //       good: 0,
        //       satisfactory: 0,
        //       average: 0,
        //       poor: 0,
        //       totalScore: 0,
        //       averageScore: 0,
        //     },
        //     percentobject
        //   );
        // } else {
        // }
        b.push(dataobject);
        c.push(percentobject);
        //b.push(dataobject);

        console.log(b, "b-data", countRatings);
        cav.push(dataobject);
        //

        //when lenghth of objects matches with b which is (dataobject array)

        //changed here + 5

        if (countRatings.length == b.length) {
          console.log(
            "countRatings.length + 4 == b.length",
            countRatings.length + 4 == b.length
          );
          // a = b.concat(s, c);
          var poorTotal;
          var averageTotal;
          var satisfactoryTotal;
          var goodTotal;
          var vgoodTotal;
          var excellentTotal;
          var newSum;
          // counting avaerages of each question object
          const collectAvg = cav.map((av) => {
            avrarr.push(parseFloat(av.averageScore));
            apoor.push(parseFloat(av.poor));
            aaverage.push(parseFloat(av.average));
            asatisfactory.push(parseFloat(av.satisfactory));
            agood.push(parseFloat(av.good));
            avgood.push(parseFloat(av.verygood));
            aexcellent.push(parseFloat(av.great));

            return av;
          });
          //counting total to add additional fields as dataobjects in excel
          poorTotal = apoor.reduce((pv, cv) => pv + cv, 0);
          averageTotal = aaverage.reduce((pv, cv) => pv + cv, 0);
          satisfactoryTotal = asatisfactory.reduce((pv, cv) => pv + cv, 0);
          goodTotal = agood.reduce((pv, cv) => pv + cv, 0);
          vgoodTotal = avgood.reduce((pv, cv) => pv + cv, 0);
          excellentTotal = aexcellent.reduce((pv, cv) => pv + cv, 0);
          newSum =
            poorTotal +
            averageTotal +
            satisfactoryTotal +
            goodTotal +
            vgoodTotal +
            excellentTotal;
          s.push(
            {
              question: "Total",
              great: JSON.stringify(excellentTotal),
              verygood: JSON.stringify(vgoodTotal),
              good: JSON.stringify(goodTotal),
              satisfactory: JSON.stringify(satisfactoryTotal),
              average: JSON.stringify(averageTotal),
              poor: JSON.stringify(poorTotal),
            },
            {
              question: "Total Percentages",
              great: `${((excellentTotal * 100) / newSum).toFixed(2)}%`,
              verygood: `${((vgoodTotal * 100) / newSum).toFixed(2)}%`,
              good: `${((goodTotal * 100) / newSum).toFixed(2)}%`,
              satisfactory: `${((satisfactoryTotal * 100) / newSum).toFixed(
                2
              )}%`,

              average: `${((averageTotal * 100) / newSum).toFixed(2)}%`,
              poor: `${((poorTotal * 100) / newSum).toFixed(2)}%`,
            },
            {
              question: "",
              great: "",
              verygood: "",
              good: "",
              satisfactory: "",
              average: "",
              poor: "",
            },
            {
              question: "Parameters",
              great: "Excellent",
              verygood: "Very Good",
              good: "Good",
              satisfactory: "Satisfactory",
              average: "Average",
              poor: "Poor",
            }
          );

          // arranging dataset of percentages that are stored in ip for graph
          console.log("ip", ip);
          const collect = ip.map((obj) => {
            poor.push(obj.poor);
            average.push(obj.average);
            satisfactory.push(obj.satisfactory);
            good.push(obj.good);
            vgood.push(obj.verygood);
            excellent.push(obj.great);
            headerLabel.push(obj.question);

            return obj;
          });
          dataset = [
            {
              label: "Poor",
              backgroundColor: "red",
              borderColor: "red",
              borderWidth: 1,
              data: poor,
              barThickness: 9,
            },
            {
              label: "Average",
              backgroundColor: "#ede500",
              borderColor: "#ede500",
              borderWidth: 1,
              data: average,
              barThickness: 9,
            },
            {
              label: "Satisfactory",
              backgroundColor: "orange",
              borderColor: "orange",
              borderWidth: 1,
              data: satisfactory,
              barThickness: 9,
            },
            {
              label: "Good",
              backgroundColor: "green",
              borderColor: "green",
              borderWidth: 1,
              data: good,
              barThickness: 9,
            },
            {
              label: "Very Good",
              backgroundColor: "#4a86ff",
              borderColor: "#4a86ff",
              borderWidth: 1,
              data: vgood,
              // barPercentage: 2,
              barThickness: 9,
              // maxBarThickness: 8,
            },
            {
              label: "Excellent",
              backgroundColor: "darkblue",
              borderColor: "darkblue",
              borderWidth: 1,
              data: excellent,
              barThickness: 9,
            },
          ];


          a = b.concat(s, c);
        }
      } else {
        collector = true;
        var sum = bi.data.reduce((pv, cv) => pv + cv, 0);
        var inc = 1;
        var dataobject = bi.data.reduce(
          (a, b) => ((a[`opt${inc++}`] = JSON.stringify(b)), a),
          {}
        );
        dataobject = {
          question: bi.label,
          totalScore: sum,
          averageScore: sum / bi.data.length,
          ...dataobject,
        };

        a.push(dataobject);
      }
    });
    console.log(
      headLabel,
      dataset,
      avrarr,
      collector,
      a,
      "headLabel, dataset,avrarr, collector, a.length"
    );
    setHeadLabel(headerLabel);
    setBars(dataset);
    setAverages(avrarr);
    setFormChanger(collector);
    setexr(a);

    // setBars(g);
  };
  const imageDownloader = async (i) => {
    const pricingTableElmt = document.querySelector(`#charts${i}`);
    if (!pricingTableElmt) return;

    const canvas = await html2canvas(pricingTableElmt);
    const dataURL = canvas.toDataURL("image/png");
    var fname = document.querySelector(`#button${i}`).innerHTML;
    downloadjs(dataURL, `${fname}.png`, "image/png");
  };
  console.log(ne, "ne");

  return (
    <div
      id="report-container"
      className="flex flex-col justify-center items-center py-7  "
    >
      <h1
        id="title01"
        className="font-semibold flex w-full justify-center items-center  h-14 capitalize text-lg text-gray-700 "
      >
        {/* {batchData?.assessmentRes?.assessmentType}
        {""} Report {""}
        {batchData?.teamInfo?.programName} */}
        Chart {batchData?.assessmentRes?.assessmentType} Report_
        {batchData?.teamInfo?.name}
      </h1>
      <h1
        id="title02"
        className="hidden font-semibold  w-full justify-center items-center  h-14 capitalize text-lg text-gray-700 "
      >
        {/* {batchData?.assessmentRes?.assessmentType}
        {""} Report {""}
        {batchData?.teamInfo?.programName} */}
        Overview {batchData?.assessmentRes?.assessmentType} Report_
        {batchData?.teamInfo?.name}
      </h1>
      <div className=" flex w-full justify-between items-center px-8">
        {loading ? (
          <span className="flex mt-5 w-fit items-center justify-center py-2 rounded-md px-5 text-sm  text-white font-medium">
            <Loader />
          </span>
        ) : (
          <span className="flex mt-5 w-fit items-center justify-center bg-sky-500 py-2 rounded-md px-5 text-sm  text-white font-medium">
            <a href="#" onClick={downloadImage}>
              Download Overview Chart.pdf
            </a>
          </span>
        )}
        <div className="relative">
          <button
            type="button"
            className="flex mt-5 w-fit items-center justify-center bg-sky-500 py-2 rounded-md px-5 text-sm  text-white font-medium"
            // onClick={() => saveAdvanceExcel()}
            onClick={() => {
              exsave(ne);
              setDownloader(!downloader);
              setBarChanger(true);
            }}
          >
            {/* <AiOutlineDownload className="text-xl mr-1" /> */}
            Generate Overview Report2
          </button>
          {downloader ? (
            <div className=" absolute  -mt-4 top-0 left-0  z-50  w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className=" space-y-1" role="none">
                {formChanger ? (
                  <button
                    onClick={() => saveAssessmentExcel()}
                    className="text-gray-700 rounded-t-md   flex  w-full px-4 py-2 text-sm hover:bg-blue-500 hover:text-white"
                  >
                    <AiOutlineDownload className="text-xl mr-1" /> Download
                  </button>
                ) : (
                  <button
                    onClick={() => saveAsExcel()}
                    className="text-gray-700 rounded-t-md   flex  w-full px-4 py-2 text-sm hover:bg-blue-500 hover:text-white"
                  >
                    <AiOutlineDownload className="text-xl mr-1" /> Download
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
        {/* <button
          type="button"
          className="flex mt-5 w-fit items-center justify-center bg-sky-500 py-2 rounded-md px-5 text-sm  text-white font-medium"
          // onClick={() => saveAdvanceExcel()}
          onClick={() => {
            setBars(ave);
            setBarChanger(true);
          }}
        >
          <AiOutlineDownload className="text-xl mr-1" />
          Create Chart
        </button> */}

        {/* <button
          type="button"
          className="flex w-fit  items-center justify-center bg-sky-500 py-2 rounded-md px-5 text-sm  text-white font-medium"
          onClick={() => exsave(ne)}
        >
          save Excel
        </button>

        <button
          type="button"
          className="flex w-fit  items-center justify-center bg-sky-500 py-2 rounded-md px-5 text-sm  text-white font-medium"
          onClick={() => saveAssessmentExcel()}
        >
          save Excel
        </button> */}
      </div>
      {barChanger ? (
        <div className="flex flex-col ">
          <AverageChart headLabel={headLabel} bars={bars} averages={averages} />

          <PercentChart headLabel={headLabel} bars={bars} averages={averages} />
        </div>
      ) : null}
      {chartData.map((chart, index) => {
        if (chart.type !== "response") {
          const labels = chart.options;

          const result = [
            ...chart.data
              .reduce((mp, o) => {
                if (!mp.has(o)) mp.set(o, { option: o, count: 0 });

                mp.get(o).count++;
                return mp;
              }, new Map())
              .values(),
          ];

          let cd = [...result];

          for (var i = 1; i <= labels?.length; i++) {
            var c = result.map((j) => {
              return j.option;
            });

            if (c.indexOf(i) == -1) {
              cd.push({ option: i, count: 0 });
            }
          }

          var firstRun = cd.sort(function (a, b) {
            return a.option - b.option;
          });

          var g = [];
          var newData = firstRun.map((d) => {
            g.push(d.count);
            return d.count;
          });

          ne.push({
            label: chart.label,
            data: g,
            options: chart.options,
            type: chart.type,
          });
          ave.push({
            label: chart.label,
            data: g,
          });

          const data = {
            labels,
            datasets: [
              {
                label: `Participants Responses (${chart.data.length})`,
                data: newData,
                backgroundColor: "rgb(0,191,255,0.5)",
              },
            ],

            //datasets: chartData, labels.map(() =>faker.datatype.number({ min: 0, max: 1000 }) ),
          };

          const options = {
            responsive: true,

            plugins: {
              legend: {
                display: true,
                position: "top",
              },
              title: {
                display: true,
                text: `${chart.label}`,
              },
              datalabels: {
                formatter: (value, ctx) => {
                  let datasets = ctx.chart.data.datasets;
                  let percentage;
                  if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
                    let sum = datasets[0].data.reduce((a, b) => a + b, 0);
                    percentage = Math.round((value / sum) * 100) + "%";
                    return percentage;
                  } else {
                    return percentage;
                  }
                },

                color: "darkgreen",
              },
            },
            scales: {
              y: {
                suggestedMin: 0,
                suggestedMax: chart.data.length + 2,
              },
            },
          };

          return (
            <div key={uuid_v4()} className="w-1/2 my-2 py-4 px-2">
              <Bar
                id={`charts${index}`}
                ref={ref}
                options={options}
                data={data}
                plugins={[ChartDataLabels]}
              />
              <span className="text-md font-normal text-white px-3 py-1 rounded-md my-3 bg-sky-500">
                <button
                  id={`button${index}`}
                  type="button"
                  onClick={() => imageDownloader(index)}
                >
                  Download Chart #{index + 1}
                </button>
              </span>
            </div>
          );
        } else {
          return (
            <div key={uuid_v4()} className="flex flex-col  w-[557.333px]">
              <div
                id={`charts${index}`}
                className="flex flex-col w-full justify-center items-center "
              >
                <p className="text-sm space-y-1  text-gray-600 font-medium my-3">
                  {chart.label}
                </p>
                <div className="grid grid-cols-1 w-full gap-2 my-2">
                  {chart.data.map((re) => {
                    return (
                      <span key={uuid_v4()} className="w-full ">
                        <p className="text-sm p-3 rounded-md text-gray-700 font-medium  bg-gray-200">
                          {re}
                        </p>
                      </span>
                    );
                  })}
                </div>
              </div>
              <span className="text-md justify-start w-fit font-normal text-white px-3 py-1 rounded-md my-3 bg-sky-500">
                <button
                  id={`button${index}`}
                  type="button"
                  onClick={() => imageDownloader(index)}
                >
                  Download Response #{index + 1}
                </button>
              </span>
            </div>
          );
        }
      })}
    </div>
  );
}

export default BarChart;
