import React, { useCallback, useState } from "react";
import BarChart from "../charts/BarChart";
import DynamicOverviewReport from "./DynamicOverviewReport";
import Select from "react-select";

function ChartList({ chartData, excelData, batchData }) {
  const [selectedReport, setSelectedReport] = useState(null);

  const userOptions = [
    { data: false, label: "Wagons Report" },
    { data: true, label: "Dynamic Report" },
  ];
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
    setSelectedReport(option);
  };

  console.log(selectedReport?.data, "selectedReport?.data", excelData, "=========================", batchData, chartData);
  return (
    <div className="flex flex-col  w-full mt-16">
      <h1 className="font-semibold text-lg text-gray-700 mb-2">
        Report Type: {selectedReport?.label || "No Report Type Selected"}
      </h1>
      {selectedReport?.data ? "Dynamic" : "wagons"}
      <Select
        options={userOptions}
        onChange={handleChange}
        styles={styles}
        getOptionValue={(option) => option.data}
        placeholder="Select Report"
      />
      {selectedReport == null ? (
        <h1 className="font-semibold text-lg text-gray-700 ">
          Please select a Report Type to generate Report{" "}
        </h1>
      ) : (
        <>
          <h1 className="font-semibold text-lg text-gray-700 ">
            Please select a Report Type to generate Report{" "}
          </h1>
          {selectedReport.data ? (
            <DynamicOverviewReport
              chartData={chartData}
              excelData={excelData}
              batchData={batchData}
            />
          ) : (
            <BarChart
              chartData={chartData}
              excelData={excelData}
              batchData={batchData}
            />
          )
          }
        </>
      )}
    </div>
  );
}

export default ChartList;
