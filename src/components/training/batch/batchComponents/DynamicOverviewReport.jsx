import React, { useCallback, useEffect, useRef, useState } from "react";
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
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";
// import XlsxPopulate from "xlsx-populate";
import jsPDF from "jspdf";
import AverageChart from "../charts/AverageChart";
import PercentChart from "../charts/PercentChart";
import Loader from "../../../Loader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,

  Title,
  Tooltip,
  Legend
);
function DynamicOverviewReport({ chartData, excelData, batchData }) {
  console.log(batchData, "batchData");
  const [exr, setexr] = useState([]);
  const [downloader, setDownloader] = useState(false);
  const [formChanger, setFormChanger] = useState(false);
  const [barChanger, setBarChanger] = useState(false);
  const [bars, setBars] = useState([]);
  const [headLabel, setHeadLabel] = useState([]);
  const [averages, setAverages] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (excelData == "feedback") {
      setShowChart(false);
      setFormChanger(false);
    } else {
      setShowChart(true);
      setFormChanger(true);
    }
  }, []);

  const ref = useRef(null);

  var counter = 1;
  var ne = [];
  var ave = [];
  var links = [];
  function getSheetData(data, header) {
    var lengthArray = data.map((t) => Object.keys(t).length);
    var BigObjectIndex = lengthArray.indexOf(Math.max.apply(null, lengthArray));

    // console.log(data[BigObjectIndex], "uuuuuuu");
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

    console.log(newData, "newData");

    var data = newData;

    var header = ne[0].options;

    const ws = XLSX.utils.aoa_to_sheet([header, ...getSheetData(data, header)]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

    const wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
    const wbout = XLSX.write(wb, wopts);

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }

    const fname = document.getElementById("title02").innerText;
    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), `${fname}.xlsx`);
  }
  async function saveAssessmentExcel() {
    var newData = exr;

  }

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

  const downloadImage = useCallback(async () => {
    setLoading(true);
    const pdf = new jsPDF();
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
        width: pricingTableElmt.clientWidth,
        height: pricingTableElmt.clientHeight,
      });

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
    }
  }, []);
  const exsave = (data) => {
    console.log(data, "ne");
    var a = []; //excel whole data holder
    var c = []; //percent object holder
    var b = []; //data object holder
    var headerLabel = []; // labels for excel
    var dataset = []; // graph data holder
    var collector; // condition
    var ip = []; //percent chart data holder
    //percentages data representer in graph
    let data1 = [];
    let data2 = [];
    let data3 = [];
    let data4 = [];
    let data5 = [];
    let data6 = [];
    let data7 = [];
    let data8 = [];
    let data9 = [];
    let data10 = [];

    let avdata1 = [];
    let avdata2 = [];
    let avdata3 = [];
    let avdata4 = [];
    let avdata5 = [];
    let avdata6 = [];
    let avdata7 = [];
    let avdata8 = [];
    let avdata9 = [];
    let avdata10 = [];

    var poor = [];
    var average = [];
    var satisfactory = [];
    var good = [];
    var vgood = [];
    var excellent = [];
    //averages data representer in graph
    var avrarr = [];
    var apoor = [];
    var asatisfactory = [];
    var aaverage = [];
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
        // debugger
        var dataobject = {
          question: bi.label,
          data1: typeof bi.data[0] !== 'undefined' ? JSON.stringify(bi.data[0]) : null,
          data2: typeof bi.data[1] !== 'undefined' ? JSON.stringify(bi.data[1]) : null,
          data3: typeof bi.data[2] !== 'undefined' ? JSON.stringify(bi.data[2]) : null,
          data4: typeof bi.data[3] !== 'undefined' ? JSON.stringify(bi.data[3]) : null,
          data5: typeof bi.data[4] !== 'undefined' ? JSON.stringify(bi.data[4]) : null,
          data6: typeof bi.data[5] !== 'undefined' ? JSON.stringify(bi.data[5]) : null,
          data7: typeof bi.data[6] !== 'undefined' ? JSON.stringify(bi.data[6]) : null,
          data8: typeof bi.data[7] !== 'undefined' ? JSON.stringify(bi.data[7]) : null,
          data9: typeof bi.data[8] !== 'undefined' ? JSON.stringify(bi.data[8]) : null,
          data10: typeof bi.data[9] !== 'undefined' ? JSON.stringify(bi.data[9]) : null,
          totalScore: sum,
          averageScore: (
            (
              (bi.data[9] || 0) * 10 +
              (bi.data[8] || 0) * 9 +
              (bi.data[7] || 0) * 8 +
              (bi.data[6] || 0) * 7 +
              (bi.data[5] || 0) * 6 +
              (bi.data[4] || 0) * 5 +
              (bi.data[3] || 0) * 4 +
              (bi.data[2] || 0) * 3 +
              (bi.data[1] || 0) * 2 +
              (bi.data[0] || 0) * 1) /
            sum
          ).toFixed(2),
        };
        // debugger

        console.log(dataobject);

        //data object for percentage in excel
        var percentobject = {
          question: bi.label,
          data1: typeof bi.data[0] !== 'undefined' ? Math.trunc((bi.data[0] * 100) / sum) + "%" : null,
          data2: typeof bi.data[1] !== 'undefined' ? Math.trunc((bi.data[1] * 100) / sum) + "%" : null,
          data3: typeof bi.data[2] !== 'undefined' ? Math.trunc((bi.data[2] * 100) / sum) + "%" : null,
          data4: typeof bi.data[3] !== 'undefined' ? Math.trunc((bi.data[3] * 100) / sum) + "%" : null,
          data5: typeof bi.data[4] !== 'undefined' ? Math.trunc((bi.data[4] * 100) / sum) + "%" : null,
          data6: typeof bi.data[5] !== 'undefined' ? Math.trunc((bi.data[5] * 100) / sum) + "%" : null,
          data7: typeof bi.data[6] !== 'undefined' ? Math.trunc((bi.data[6] * 100) / sum) + "%" : null,
          data8: typeof bi.data[7] !== 'undefined' ? Math.trunc((bi.data[7] * 100) / sum) + "%" : null,
          data9: typeof bi.data[8] !== 'undefined' ? Math.trunc((bi.data[8] * 100) / sum) + "%" : null,
          data10: typeof bi.data[9] !== 'undefined' ? Math.trunc((bi.data[9] * 100) / sum) + "%" : null,
          // poor: `${JSON.stringify(Math.trunc((bi.data[0] * 100) / sum))}%`,
          // average: `${JSON.stringify(Math.trunc((bi.data[1] * 100) / sum))}%`,
          // satisfactory: `${JSON.stringify(
          //   Math.trunc((bi.data[2] * 100) / sum)
          // )}%`,
          // good: `${JSON.stringify(Math.trunc((bi.data[3] * 100) / sum))}%`,
          // verygood: `${JSON.stringify(Math.trunc((bi.data[4] * 100) / sum))}%`,
          // great: `${JSON.stringify(Math.trunc((bi.data[5] * 100) / sum))}%`,
        };
        // debugger
        //data object for percentage in chart

        var perc = {

          question: bi.label,
          data1: typeof bi.data[0] !== 'undefined' ? Math.trunc((bi.data[0] * 100) / sum) : null,
          data2: typeof bi.data[1] !== 'undefined' ? Math.trunc((bi.data[1] * 100) / sum) : null,
          data3: typeof bi.data[2] !== 'undefined' ? Math.trunc((bi.data[2] * 100) / sum) : null,
          data4: typeof bi.data[3] !== 'undefined' ? Math.trunc((bi.data[3] * 100) / sum) : null,
          data5: typeof bi.data[4] !== 'undefined' ? Math.trunc((bi.data[4] * 100) / sum) : null,
          data6: typeof bi.data[5] !== 'undefined' ? Math.trunc((bi.data[5] * 100) / sum) : null,
          data7: typeof bi.data[6] !== 'undefined' ? Math.trunc((bi.data[6] * 100) / sum) : null,
          data8: typeof bi.data[7] !== 'undefined' ? Math.trunc((bi.data[7] * 100) / sum) : null,
          data9: typeof bi.data[8] !== 'undefined' ? Math.trunc((bi.data[8] * 100) / sum) : null,
          data10: typeof bi.data[9] !== 'undefined' ? Math.trunc((bi.data[9] * 100) / sum) : null,
        };
        // debugger
        var s = [];
        ip.push(perc);
        //changed here added ladder

        b.push(dataobject);
        c.push(percentobject);
        //when lenghth of objects matches with b which is (dataobject array)
        // debugger
        //changed here + 5
        // console.log(b.length, b, "ppppppppppppppppppppppppppppppppppppp");
        if (countRatings.length == b.length) {
          // a = b.concat(s, c);
          var data1Total;
          var data2Total;
          var data3Total;
          var data4Total;
          var data5Total;
          var data6Total;
          var data7Total;
          var data8Total;
          var data9Total;
          var data10Total;

          // debugger
          var averageTotal;
          var satisfactoryTotal;
          var goodTotal;
          var vgoodTotal;
          var excellentTotal;
          var newSum;
          // counting avaerages of each question object
          const collectAvg = b.map((av) => {
            avrarr.push(parseFloat(av.averageScore));
            avdata1.push(parseFloat(av.data1));
            avdata2.push(parseFloat(av.data2));
            avdata3.push(parseFloat(av.data3));
            avdata4.push(parseFloat(av.data4));
            avdata5.push(parseFloat(av.data5));
            avdata6.push(parseFloat(av.data6));
            avdata7.push(parseFloat(av.data7));
            avdata8.push(parseFloat(av.data8));
            avdata9.push(parseFloat(av.data9));
            avdata10.push(parseFloat(av.data10));

            return av;
          });
          //counting total to add additional fields as dataobjects in excel
          // debugger

          data1Total = avdata1.reduce((pv, cv) => pv + cv, 0);
          data2Total = avdata2.reduce((pv, cv) => pv + cv, 0);
          data3Total = avdata3.reduce((pv, cv) => pv + cv, 0);
          data4Total = avdata4.reduce((pv, cv) => pv + cv, 0);
          data5Total = avdata5.reduce((pv, cv) => pv + cv, 0);
          data6Total = avdata6.reduce((pv, cv) => pv + cv, 0);
          data7Total = avdata7.reduce((pv, cv) => pv + cv, 0);
          data8Total = avdata8.reduce((pv, cv) => pv + cv, 0);
          data9Total = avdata9.reduce((pv, cv) => pv + cv, 0);
          data10Total = avdata10.reduce((pv, cv) => pv + cv, 0);

          newSum =
            data1Total +
            data2Total +
            data3Total +
            data4Total +
            data5Total +
            data6Total +
            data7Total +
            data8Total +
            data9Total +
            data10Total;

          s.push(
            {
              question: "Total",
              data1: JSON.stringify(data1Total),
              data2: JSON.stringify(data2Total),
              data3: JSON.stringify(data3Total),
              data4: JSON.stringify(data4Total),
              data5: JSON.stringify(data5Total),
              data6: JSON.stringify(data6Total),
              data7: JSON.stringify(data7Total),
              data8: JSON.stringify(data8Total),
              data9: JSON.stringify(data9Total),
              data10: JSON.stringify(data10Total),
            },
            {
              question: "Total Percentages",
              data1: `${((data1Total * 100) / newSum).toFixed(2)}%`,
              data2: `${((data2Total * 100) / newSum).toFixed(2)}%`,
              data3: `${((data3Total * 100) / newSum).toFixed(2)}%`,
              data4: `${((data4Total * 100) / newSum).toFixed(2)}%`,
              data5: `${((data5Total * 100) / newSum).toFixed(2)}%`,
              data6: `${((data6Total * 100) / newSum).toFixed(2)}%`,
              data7: `${((data7Total * 100) / newSum).toFixed(2)}%`,
              data8: `${((data8Total * 100) / newSum).toFixed(2)}%`,
              data9: `${((data9Total * 100) / newSum).toFixed(2)}%`,
              data10: `${((data10Total * 100) / newSum).toFixed(2)}%`,
            },
            {
              question: "",
              poor: "",
              average: "",
              satisfactory: "",
              good: "",
              verygood: "",
              great: "",
            },
            {
              question: "Parameters",
              poor: "Poor",
              average: "Average",
              satisfactory: "Satisfactory",
              good: "Good",
              verygood: "Very Good",
              great: "Excellent",
            }
          );

          // arranging dataset of percentages that are stored in ip for graph
          const collect = ip.map((obj) => {
            data1.push(obj.data1);
            data2.push(obj.data2);
            data3.push(obj.data3);
            data4.push(obj.data4);
            data5.push(obj.data5);
            data6.push(obj.data6);
            data7.push(obj.data7);
            data8.push(obj.data8);
            data9.push(obj.data9);
            data10.push(obj.data10);

            headerLabel.push(obj.question);

            return obj;
          });


          const LabelData = ne[0].options; // Assuming ne[0].options is an array
          // debugger
          const dataArray = [data1, data2, data3, data4, data5, data6, data7, data8, data9, data10];

          const dataPoints = [];
          console.log("----------------dataArray--------------", ne)
          // debugger

          dataArray.forEach((data, index) => {
            if (Array.isArray(data) && data.some(value => value !== null)) {
              // debugger
              dataPoints.push({
                label: LabelData[index],
                backgroundColor: generateRandomColor(),
                borderColor: generateRandomColor(),
                borderWidth: 1,
                data: data,
                barThickness: 11,
              });
            }
          });


          dataset = [
            // ... your previous dataset
            // Add the dynamically generated dataPoints here
            ...dataPoints,
          ];

          // Print the final dataset
          console.log("dataset", dataset);

          function generateRandomColor() {
            let labelColors = [
              '#008FFB',
              '#00E396',
              '#FEB019',
              '#FF4560',
              '#775DD0',
              '#D3D3D3',
              '#B19CD9',
              '#FF7F50',
              '#20B2AA',
              '#FF6347',
            ];
            const randomIndex = Math.floor(Math.random() * labelColors.length);
            return labelColors[randomIndex];
          }

          // Function to generate a random color
          // function generateRandomColor() {
          //   const letters = '0123456789ABCDEF';
          //   let color = '#';
          //   for (let i = 0; i < 6; i++) {
          //     color += letters[Math.floor(Math.random() * 16)];
          //   }
          //   return color;
          // }
          // dataset = [
          //   {
          //     label: "Poor",
          //     backgroundColor: "#C2322D",
          //     borderColor: "#C2322D",
          //     borderWidth: 1,
          //     data: data1,
          //     barThickness: 11,
          //   },
          //   {
          //     label: "Average",
          //     backgroundColor: "#E0B83F",
          //     borderColor: "#E0B83F",
          //     borderWidth: 1,
          //     data: average,
          //     barThickness: 11,
          //   },
          //   {
          //     label: "Satisfactory",
          //     backgroundColor: "#E9083F",
          //     borderColor: "#E9083F",
          //     borderWidth: 1,
          //     data: satisfactory,
          //     barThickness: 11,
          //   },
          //   {
          //     label: "Good",
          //     backgroundColor: "#0c637d",
          //     borderColor: "#0c637d",
          //     borderWidth: 1,
          //     data: good,
          //     barThickness: 11,
          //   },
          //   {
          //     label: "Very Good",
          //     backgroundColor: "#9E3EC7",
          //     borderColor: "#9E3EC7",
          //     borderWidth: 1,
          //     data: vgood,
          //     // barPercentage: 2,
          //     barThickness: 11,
          //     // maxBarThickness: 8,
          //   },
          //   {
          //     label: "Excellent",
          //     backgroundColor: "blue",
          //     borderColor: "blue",
          //     borderWidth: 1,
          //     data: excellent,
          //     barThickness: 11,
          //   },
          // ];

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
    console.log(a, "setexr");
    setHeadLabel(headerLabel);
    setBars(dataset);
    setAverages(avrarr);
    //setFormChanger(collector);
    setexr(a);

    // setBars(g);
  };
  const imageDownloader = async (i) => {
    const pricingTableElmt = document.querySelector(`#charts${i}`);
    if (!pricingTableElmt) return;

    const canvas = await html2canvas(pricingTableElmt);
    const dataURL = canvas.toDataURL("image/png");
    downloadjs(dataURL, "download.png", "image/png");
  };

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
        Chart_{batchData?.assessmentRes?.assessmentType} Report_
        {batchData?.teamInfo?.teamName}
      </h1>
      <h1
        id="title02"
        className="hidden font-semibold  w-full justify-center items-center  h-14 capitalize text-lg text-gray-700 "
      >
        {/* {batchData?.assessmentRes?.assessmentType}
        {""} Report {""}
        {batchData?.teamInfo?.programName} */}
        Overview{batchData?.assessmentRes?.assessmentType} Report _
        {batchData?.teamInfo?.teamName}
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
            Generate Overview Report
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
      {showChart ? null : (
        <>
          {barChanger ? (
            <div className="flex flex-col ">
              <AverageChart
                headLabel={headLabel}
                bars={bars}
                averages={averages}
              />

              <PercentChart
                headLabel={headLabel}
                bars={bars}
                averages={averages}
              />
            </div>
          ) : null}
        </>
      )}
      {chartData.map((chart, index) => {
        if (chart.type == "ratings") {
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
                <button type="button" onClick={() => imageDownloader(index)}>
                  Download Chart #{index + 1}
                </button>
              </span>
            </div>
          );
        } else if (chart.type == "response") {
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
                <button type="button" onClick={() => imageDownloader(index)}>
                  Download Response #{index + 1}
                </button>
              </span>
            </div>
          );
        } else {
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
                <button type="button" onClick={() => imageDownloader(index)}>
                  Download Chart #{index + 1}
                </button>
              </span>
            </div>
          );
        }
      })}
    </div>
  );
}

export default DynamicOverviewReport;
