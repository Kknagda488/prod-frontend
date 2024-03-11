import React, { useEffect, useState } from "react";
import { v4 as uuid_v4 } from "uuid";
import LiveTracker from "./LiveTracker";
// import LiveAttendance from "./LiveAttendance"; 
import { AiOutlineLineChart } from "react-icons/ai";
import { useAuth } from "../../../../../context/auth";

function LiveReportList({
  next,
  previous,
  pgindex,
  page,
  totalCount,
  setLimit,
  client,
  setPage,
  setSearch,
  setBatchPop,
  setChartData,
  assessmentsList,
  setAssessmentPop,
  id,
  setExcelData,
  updater,
  setUpdater,
  syncId,
  setSyncId,
  batchAttendences,
  setAttendancePop,
  attendancePop,
}) {
  const [changer, setChanger] = useState("Fetching...");
  const { userData } = useAuth()
  console.log("batchAttendences", batchAttendences);
  useEffect(() => {
    const timer = setTimeout(() => {
      setChanger("No Data Found...");
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  console.log(
    batchAttendences,
    "batchAttendencesbatchAttendencesbatchAttendencesbatchAttendences"
  );
  return (
    <div className="flex flex-col">
      <h5 className="text-2xl font-medium text-center leading-none text-gray-700 ">
        Live Batch Report Preview
      </h5>
      <div className="flex flex-row  w-full justify-between items-center">
        <div className="px-2  flex w-full justify-between   ">
          <h5 className="text-lg  font-medium leading-none text-gray-700 ">
            Report List of Batch Id: {id}
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
                <td className="px-6 py-4"> </td>
                <td className="px-6 py-4"> </td>
                <td className="px-6 py-4">{changer}</td>
                <td className="px-6 py-4"> </td>
                <td className="px-6 py-4"> </td>
                <td className="px-6 py-4"> </td>
              </tr>
            </tbody>
          ) : (
            <>
              {assessmentsList?.map((list) => {
                return (
                  <tbody key={uuid_v4()} className="text-center">
                    <tr className="border-b   odd:bg-white even:bg-gray-50 odd: even:">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900  whitespace-nowrap"
                      >
                        {list.name}
                      </th>
                      <td className="px-6 py-4">{list.assessmentType}</td>
                      <td className="px-6 py-4">{list.batchId}</td>
                      <td className="px-6 py-4">
                        {list?.createdDate?.substring(0, 10)}
                      </td>
                      <td className="px-6 py-4">{list.clientName}</td>
                      <td className="relative flex flex-row px-6 text-center py-4 justify-center items-center space-x-6  mt-2">
                        <LiveTracker
                          list={list}
                          setBatchPop={setBatchPop}
                          setChartData={setChartData}
                          setExcelData={setExcelData}
                          updater={updater}
                          setUpdater={setUpdater}
                          syncId={syncId}
                          setSyncId={setSyncId}
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
      {
        client === "kotak" ? (
          <>
            <h5 className="text-lg py-5 font-medium leading-none text-gray-700 ">
              Assessmnet Data
            </h5>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm border-b  text-center text-gray-500 ">
                <thead className="text-xs text-white uppercase bg-sky-500  ">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      BatchId
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {/* Total Attendance */}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Add Assessmnet Data
                    </th>
                    {/* <th scope="col" className="px-6 py-3">
                EMPLOYEE ID
              </th>
              <th scope="col" className="px-6 py-3">
                EMPLOYEE NAME
              </th>
              <th scope="col" className="px-6 py-3">
                EMPLOYEE EMAIL
              </th> */}
                  </tr>
                </thead>

                {batchAttendences ? (
                  <>
                    {
                      batchAttendences.length >= 0 && (
                        <tbody>
                          {
                            batchAttendences.map((data) => (

                              < tr >
                                {/* <td className="py-3">{data?.nominee?.employeeId ? `${data?.nominee?.employeeId}` : `-`}</td>
                                <td className="py-3">{data?.nominee?.firstName + "  " + data?.nominee?.lastName}</td>
                                <td className="py-3">{data?.nominee?.email}</td> */}
                              </tr>
                            ))
                          }
                          <tr>
                            <td className="py-3">{id}</td>
                            <td className="py-3"></td>
                            <td className="relative flex flex-row px-6 text-center py-4 justify-center items-center space-x-6  mt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setAssessmentPop(true);
                                }}
                                className=" text-gray-600  flex items-center justify-center space-x-1 text-2xl hover:underline"
                              >
                                <AiOutlineLineChart />
                                <p className="text-sm mb-0.5">Track Report</p>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      )
                      // :(
                      //   <tbody>
                      //     <tr>
                      //       <td className="text-center py-3" colSpan={2}>
                      //         No Attendance Found
                      //       </td>
                      //     </tr>
                      //   </tbody>
                      // )
                    }
                  </>
                ) : (
                  <tbody>
                    <tr>
                      <td className="text-center py-3" colSpan={2}>
                        Fetching...
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
            <h5 className="text-lg py-5 font-medium leading-none text-gray-700 ">
              Attendance Data
            </h5>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm border-b  text-center text-gray-500 ">
                <thead className="text-xs text-white uppercase bg-sky-500  ">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      BatchId
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {/* Total Attendance */}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      View Attendance
                    </th>
                    {/* <th scope="col" className="px-6 py-3">
                EMPLOYEE ID
              </th>
              <th scope="col" className="px-6 py-3">
                EMPLOYEE NAME
              </th>
              <th scope="col" className="px-6 py-3">
                EMPLOYEE EMAIL
              </th> */}
                  </tr>
                </thead>

                {batchAttendences ? (
                  <>
                    {
                      batchAttendences.length >= 0 && (
                        <tbody>
                          {
                            batchAttendences.map((data) => (

                              < tr >
                                {/* <td className="py-3">{data?.nominee?.employeeId ? `${data?.nominee?.employeeId}` : `-`}</td>
                                <td className="py-3">{data?.nominee?.firstName + "  " + data?.nominee?.lastName}</td>
                                <td className="py-3">{data?.nominee?.email}</td> */}
                              </tr>
                            ))
                          }
                          <tr>
                            <td className="py-3">{id}</td>
                            <td className="py-3"></td>
                            <td className="relative flex flex-row px-6 text-center py-4 justify-center items-center space-x-6  mt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setAttendancePop(true);
                                }}
                                className=" text-gray-600  flex items-center justify-center space-x-1 text-2xl hover:underline"
                              >
                                <AiOutlineLineChart />
                                <p className="text-sm mb-0.5">Track Report</p>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      )
                      // :(
                      //   <tbody>
                      //     <tr>
                      //       <td className="text-center py-3" colSpan={2}>
                      //         No Attendance Found
                      //       </td>
                      //     </tr>
                      //   </tbody>
                      // )
                    }
                  </>
                ) : (
                  <tbody>
                    <tr>
                      <td className="text-center py-3" colSpan={2}>
                        Fetching...
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </>
        ) : (
          <>
            <h5 className="text-lg py-5 font-medium leading-none text-gray-700 ">
              Attendance Data
            </h5>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm border-b  text-center text-gray-500 ">
                <thead className="text-xs text-white uppercase bg-sky-500  ">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      BatchId
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {/* Total Attendance */}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      View Attendance
                    </th>
                    {/* <th scope="col" className="px-6 py-3">
                EMPLOYEE ID
              </th>
              <th scope="col" className="px-6 py-3">
                EMPLOYEE NAME
              </th>
              <th scope="col" className="px-6 py-3">
                EMPLOYEE EMAIL
              </th> */}
                  </tr>
                </thead>

                {batchAttendences ? (
                  <>
                    {
                      batchAttendences.length >= 0 && (
                        <tbody>
                          {
                            batchAttendences.map((data) => (

                              < tr >
                                {/* <td className="py-3">{data?.nominee?.employeeId ? `${data?.nominee?.employeeId}` : `-`}</td>
                                <td className="py-3">{data?.nominee?.firstName + "  " + data?.nominee?.lastName}</td>
                                <td className="py-3">{data?.nominee?.email}</td> */}
                              </tr>
                            ))
                          }
                          <tr>
                            <td className="py-3">{id}</td>
                            <td className="py-3"></td>
                            <td className="relative flex flex-row px-6 text-center py-4 justify-center items-center space-x-6  mt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setAttendancePop(true);
                                }}
                                className=" text-gray-600  flex items-center justify-center space-x-1 text-2xl hover:underline"
                              >
                                <AiOutlineLineChart />
                                <p className="text-sm mb-0.5">Track Report</p>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      )
                      // :(
                      //   <tbody>
                      //     <tr>
                      //       <td className="text-center py-3" colSpan={2}>
                      //         No Attendance Found
                      //       </td>
                      //     </tr>
                      //   </tbody>
                      // )
                    }
                  </>
                ) : (
                  <tbody>
                    <tr>
                      <td className="text-center py-3" colSpan={2}>
                        Fetching...
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </>
        )
      }
    </div>
  );
}

export default LiveReportList;
