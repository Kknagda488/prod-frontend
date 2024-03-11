import React, { useEffect, useState } from "react";
import { BiRefresh } from "react-icons/bi";
import { v4 as uuid_v4 } from "uuid";
import Utils from "../../../utils";
import moment from "moment";
import { useAuth } from "../../../../context/auth";

const Attendance = ({ batchId, batchData }) => {
  const [pageNo, setPageNo] = useState(1);
  const [pageLimit, setPageLimit] = useState(5);
  const [pgindex, setPgindex] = useState(1);
  const { userData, signOut } = useAuth();
  const [attendence, setAttendence] = useState([]);
  const [search, setSearch] = useState("");
  const [allBatchAttendence, setAllBatchAttendence] = useState(0);

  const fetchAttendence = async () => {
    try {
      const filter = {
        pageLimit,
        pageNo,
        search,
      };
      const params = encodeURIComponent(JSON.stringify(filter));
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/batchAttendences/list/${batchId}?filter=${params}&access_token=${
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
      setAllBatchAttendence(data.data.allBatchAttendence?.length);
      setAttendence(data.data.attendences);
      setPgindex(data.data.lastPage);
    } catch (error) {
      console.error("There was an error!", error);
      if (error === "Token Expired" || error === "Malformed User") {
        signOut();
      }
    }
  };

  useEffect(() => {
    if (batchId) {
      fetchAttendence();
    }
  }, [batchId, pageLimit, pageNo, search]);

  const next = () => {
    if (pageNo >= pgindex) {
      return;
    } else {
      setPageNo(pageNo + 1);
    }
  };
  const previous = () => {
    if (pageNo <= 1) {
      return;
    } else {
      setPageNo(pageNo - 1);
    }
  };

  const exportAttendanceReport = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/batchAttendences/export/${batchId}?access_token=${
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
      handleAllExport(data);
    } catch (error) {
      console.error("There was an error!", error);
      if (error === "Token Expired" || error === "Malformed User") {
        signOut();
      }
    }
  };

  const handleAllExport = (allExportAttendenceData) => {
    console.log(
      "allExportAttendenceData@@@@@@@@@@@@@@@@",
      allExportAttendenceData
    );
    let employees = [
      [
        "Emp. Name",
        "Emp. Email",
        "Training Name",
        "Training Start Date",
        "Training Start Time",
        "Training End Date",
        "Training End Time",
        "Trainer Name",
        "Attendence Date",
        "Attendence",
      ],
    ];
    // console.log("dssssssss", daywiseAttendence)

    Object.entries(allExportAttendenceData).forEach((entry) => {
      const [key, value] = entry;
      let dateofBatch = key;
      console.log("dateofBatch++++++++++++++", dateofBatch);
      value.forEach((data, index) => {
        console.log("data++++++++++++++", data);
        employees.push([
          data.firstName
            ? `${data.firstName} ${data.lastName || ""}`
            : `${data.firstName} ${data.lastName || ""}`,
          data.email || data.email,
          // data.data.nominee?.firstName || data.data.firstName + " " + data.data.nominee?.lastName == undefined || data.data.nominee?.lastName || data.data.lastName == undefined,
          batchData?.name,
          moment(batchData?.batchStartDate).format("DD-MM-YYYY"),
          moment(batchData?.batchStartTime, "HH:mm:ss").format("hh:mm a"),
          moment(batchData?.batchEndDate).format("DD-MM-YYYY"),
          moment(batchData?.batchEndTime, "HH:mm:ss").format("hh:mm a"),
          batchData?.trainerName,
          dateofBatch,
          data.Attendance,
        ]);
      });
    });

    console.log(employees);
    Utils.exportAoaToXlsx(
      employees,
      `${batchData.name} - attendance-${Date.now()}`
    );
  };

  const handleExport = () => {
    let employees = [
      [
        "Sr.No",
        "Emp. Email",
        "Emp. Name",
        "Attendance Date",
        "Training Name",
        "Training Start Date",
        "Training Start Time",
        "Training End Date",
        "Training End Time",
        "Trainer Name",
        "Venue Name",
      ],
    ];

    attendence.forEach((data, index) => {
      employees.push([
        index + 1,
        data.nomineeAttendance.email,
        data.nomineeAttendance.firstName +
          " " +
          data.nomineeAttendance.lastName,
        moment(data?.attendenceDate).format("DD-MM-YYYY"),
        batchData?.name,
        moment(batchData?.batchStartDate).format("DD-MM-YYYY"),
        moment(batchData?.batchStartTime, "HH:mm:ss").format("hh:mm a"),
        moment(batchData?.batchEndDate).format("DD-MM-YYYY"),
        moment(batchData?.batchEndTime, "HH:mm:ss").format("hh:mm a"),
        batchData?.trainerName,
        batchData?.location,
      ]);
    });

    // return console.log(employees);
    Utils.exportAoaToXlsx(employees, `${batchData.name} - attendance`);
  };

  return (
    <div>
      <div className="flex justify-end">
        <span className="text-sm">
          <BiRefresh
            className="cursor-pointer"
            onClick={() => fetchAttendence()}
            size={20}
          />
        </span>
      </div>
      {/* <form method="POST">
        <div className="flex flex-col">
          <h5 className="text-xl font-semibold mt-2 mb-4 leading-none text-gray-700 ">
            Send Attendance Link
          </h5>
          <label className="leading-loose">Employee Id*</label>
            <input
              type="text"
              name="name"
              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
              placeholder="Employee Id"
              required
            />
          <a
            href={`${process.env.NEXT_PUBLIC_LINK}/attendence-form/${batchId}`}
            target="_blank"
            rel="noreferrer"
          >
            {process.env.NEXT_PUBLIC_LINK}/attendence-form/{batchId}
          </a>
        </div>

        <button
          type="button"
          //onClick={() => save()}
          className="bg-sky-500 mt-4 truncate flex justify-center items-center  text-white px-5 py-2 rounded-md focus:outline-none"
        >
          Send
        </button>
      </form> */}
      <div className="flex justify-between items-center mt-5 mb-4">
        <h5 className="text-xl font-semibold  leading-none text-gray-700 ">
          Attendance List ({allBatchAttendence || 0})
        </h5>
        <button
          className="flex w-fit px-4 py-3 text-white text-sm font-medium bg-green-500 items-center rounded-md"
          onClick={handleExport}
        >
          Export
        </button>
        <button
          className="flex w-fit px-4 py-3 text-white text-sm font-medium bg-green-500 items-center rounded-md"
          onClick={exportAttendanceReport}
        >
          Export All
        </button>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-md m-4 bg-sky-600 text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                Sr.No
              </th>
              {userData?.client === "kotak" ? null : (
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
              )}
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Attendance date
              </th>
              <th scope="col" className="px-6 py-3">
                Training Name
              </th>
              <th scope="col" className="px-6 py-3">
                Training Start Date
              </th>
              <th scope="col" className="px-6 py-3">
                Training Start Time
              </th>
              <th scope="col" className="px-6 py-3">
                Training End Date
              </th>
              <th scope="col" className="px-6 py-3">
                Training End Time
              </th>
              <th scope="col" className="px-6 py-3">
                Trainer Name
              </th>
              <th scope="col" className="px-6 py-3">
                Venue Name
              </th>

              {/* <th scope="col" className="px-6 py-3">
                Action
              </th> */}
            </tr>
          </thead>
          {attendence?.map((data, i) => {
            return (
              <tbody key={uuid_v4()}>
                <tr className="bg-white border-b  ">
                  <td className="px-6 py-4 text-gray-900">{i + 1}</td>
                  {userData?.client === "kotak" ? null : (
                    <td className="px-6 py-4 text-gray-900">
                      {data?.nomineeAttendance?.email}
                    </td>
                  )}

                  <th
                    scope="row"
                    className="flex flex-row items-center px-6 py-4 font-medium text-gray-900  w-44"
                  >
                    {data?.nomineeAttendance?.lastName ? (
                      <>
                        {data?.nomineeAttendance?.firstName +
                          " " +
                          data?.nomineeAttendance?.lastName}
                      </>
                    ) : (
                      <>{data?.nomineeAttendance?.firstName}</>
                    )}
                  </th>
                  <td className="px-6 py-4 text-gray-900">
                    {moment(data?.attendenceDate).format("DD-MM-YYYY")}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{batchData?.name}</td>
                  <td className="px-6 py-4 text-gray-900">
                    {moment(batchData?.batchStartDate).format("DD-MM-YYYY")}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {moment(batchData?.batchStartTime, "HH:mm:ss").format(
                      "hh:mm a"
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {moment(batchData?.batchEndDate).format("DD-MM-YYYY")}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {moment(batchData?.batchEndTime, "HH:mm:ss").format(
                      "hh:mm a"
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {batchData?.trainerName}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {batchData?.location}
                  </td>

                  {/* <td className=" flex flex-row px-6 py-4 text-right mt-2">
                    <Link
                      href=""
                      // href={`/${link}/${arr._id}`}
                      className="text-black mr-4 hover:underline"
                    >
                      <a>
                        <AiOutlineEdit />
                      </a>
                    </Link>
                    <Link href="" className=" text-black  hover:underline">
                      <a>
                        <AiOutlineDelete />
                      </a>
                    </Link>
                  </td> */}
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
      <div className="flex flex-row justify-around mt-10 items-center  ">
        <span className="text-sm flex text-gray-700 ">
          {/* <p>Total</p>
          <span className=" px-1 font-normal tracking-wide text-gray-900 ">
           // {totalCount}
          </span>
          <p> Questions </p> */}
        </span>
        <div className="flex">
          <div className="dropdown flex items-center relative">
            <p>Show</p>
            <span className="bg-gray-100 text-gray-700 mx-2  font-normal tracking-wide rounded inline-flex items-center">
              <select
                className="bg-transparent px-3 py-2  outline-none "
                onChange={(e) => {
                  setPageLimit(e.target.value);
                  setPageNo(1);
                }}
              >
                <option className="mr-1">5</option>
                <option className="mr-1">10</option>
                <option className="mr-1">20</option>
                <option className="mr-1">30</option>
                <option className="mr-1">40</option>
                <option className="mr-1">50</option>
                <option className="mr-1">100</option>
                <option className="mr-1">250</option>
                <option className="mr-1">500</option>
              </select>
            </span>
            <p>Entries</p>
          </div>
        </div>

        <div>
          <a
            onClick={() => previous()}
            className={` ${
              pageNo === 1
                ? "hidden"
                : "inline-flex items-center py-2 px-4 ml-3 text-sm font-medium text-gray-700 bg-gray-200 cursor-pointer rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700   "
            }`}
          >
            Previous
          </a>

          <a
            onClick={() => next()}
            className={` ${
              pageNo >= pgindex
                ? "hidden"
                : "inline-flex items-center py-2 px-4 ml-3 text-sm font-medium text-gray-700 cursor-pointer bg-gray-200 rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700   "
            }`}
          >
            Next
          </a>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
