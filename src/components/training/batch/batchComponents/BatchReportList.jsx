
import React, { useEffect, useState } from "react";
import { v4 as uuid_v4 } from "uuid";
import ReportGenerator from "./ReportGenerator";
// import "react-circular-progressbar/dist/styles.css";
import { ToastContainer, toast } from "react-toastify";

function BatchReportList({
  next,
  previous,
  pgindex,
  page,
  totalCount,
  setLimit,
  setPage,
  setSearch,
  setReportPop,
  setBatchPop,
  setChartData,
  assessmentsList,
  id,
  setExcelData,
  batchData,
  setBatchData,
}) {
  const [changer, setChanger] = useState("Fetching...");
  useEffect(() => {
    const timer = setTimeout(() => {
      setChanger("No Data Found...");
    }, 10000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="mt-2 ">
      <div className="flex flex-row my-2 w-full justify-between items-center">
        <div className="px-2  flex w-full justify-between   ">
          <h5 className="text-lg  font-medium leading-none text-gray-700 ">
            Assessments Report List of Batch Id:{id}
          </h5>
        </div>

        <div className="relative mt-1 ">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none py-2 ">
            <svg
              className="w-5 h-5 text-gray-500 "
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className="bg-gray-50 border py-1 outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-80 pl-10 p-2.5  "
            placeholder="Search by Assessments"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm  text-center text-gray-500 ">
          <thead className="text-xs text-white uppercase bg-sky-500  ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Assessment
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>
              <th scope="col" className="px-6 py-3">
                Batch Id
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Client Name
              </th>

              <th scope="col" className="px-6 py-3">
                Download Report
              </th>
            </tr>
          </thead>
          {assessmentsList?.length == 0 ? (
            <tbody>
              <tr className="border-b  text-lg font-medium odd:bg-white even:bg-gray-50 ">
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4">{changer}</td>
                <td className="px-6 py-4"> </td>
                <td className="px-6 py-4"></td>
              </tr>
            </tbody>
          ) : (
            <>
              {assessmentsList?.map((list) => {
                return (
                  <tbody key={uuid_v4()} className="text-left">
                    <tr className="border-b   odd:bg-white even:bg-gray-50 odd: even:">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900  whitespace-nowrap"
                      >
                        {list.name}
                      </th>
                      <td
                        id={`assesType${list.assessmentId}`}
                        className="px-6 py-4"
                      >
                        {/* {list.assessmentType} */}
                        {list?.assessmentType == "pre"
                          ? "Pre-Assessment Report"
                          : null}
                        {list?.assessmentType == "post"
                          ? "Post-Assessment Report"
                          : null}
                        {list?.assessmentType == "feedback"
                          ? "Feedback Report"
                          : null}
                      </td>
                      <td className="px-6 py-4">{list.batchId}</td>
                      <td className="px-6 py-4">
                        {list?.createdDate?.substring(0, 10)}
                      </td>
                      <td className="px-6 py-4">{list.clientName}</td>
                      <td className="relative flex flex-row px-6 text-center py-4 justify-center items-center space-x-6  mt-2">
                        <ReportGenerator
                          list={list}
                          setBatchPop={setBatchPop}
                          setReportPop={setReportPop}
                          setChartData={setChartData}
                          setExcelData={setExcelData}
                          batchData={batchData}
                          setBatchData={setBatchData}
                        />
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </>
          )}
        </table>
      </div>
      {/* <div className="flex flex-row justify-around mt-10 items-center  ">
        <span className="text-sm flex text-gray-700 ">
          <p>Displaying</p>
          <span className=" px-1 font-normal tracking-wide text-gray-900 ">
           
          </span>
          <p> Assessments </p>
        </span>
        <div className="flex">
          <div className="dropdown flex items-center relative">
            <p>Show</p>
            <span className="bg-gray-100 text-gray-700 mx-2  font-normal tracking-wide rounded inline-flex items-center">
              <select
                className="bg-transparent px-3 py-2  outline-none "
                onChange={(e) => {
                  setLimit(e.target.value);
                  setPage(0);
                }}
              >
                <option className="mr-1">5</option>
                <option className="mr-1">10</option>
                <option className="mr-1">20</option>
                <option className="mr-1">30</option>
                <option className="mr-1">40</option>
                <option className="mr-1">50</option>
              </select>
            </span>
            <p>Entries</p>
          </div>
        </div>

        <div>
          <a
            onClick={() => previous()}
            className={` ${
              page === 0
                ? "hidden"
                : "inline-flex items-center py-2 px-4 ml-3 text-sm font-medium text-gray-700 bg-gray-200 cursor-pointer rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700   "
            }`}
          >
            Previous
          </a>

          <a
            onClick={() => next()}
            className={` ${
              page > pgindex
                ? "hidden"
                : "inline-flex items-center py-2 px-4 ml-3 text-sm font-medium text-gray-700 cursor-pointer bg-gray-200 rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700   "
            }`}
          >
            Next
          </a>
        </div>
      </div> */}
    </div>
  );
}

export default BatchReportList;
