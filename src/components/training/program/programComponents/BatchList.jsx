import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuid_v4 } from "uuid";
import moment from "moment";
import { BiRefresh } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineFundView,
} from "react-icons/ai";
import { toast } from "react-toastify";
import DeletePopupCard from "../../DeletePopCard";
import UpdateBatch from "../../../forms/UpdateBatch";
import { useAuth } from "../../../../context/auth";
function BatchList({ programId, programDetails }) {
  // const [, updateState] = React.useState();
  //   const forceUpdate = React.useCallback(() => updateState({}), []);
  //   console.

  //   const update = () => {
  //     // calling the forceUpdate() method
  //     this.forceUpdate();
  //     console.log("rendering...");
  //  };
  const [selectedRow, setSelectedRow] = useState({
    title: "",
    id: "",
  });
  const { userData, signOut } = useAuth();
  const [pageNo, setPageNo] = useState(1);
  const [pageLimit, setPageLimit] = useState(5);
  const [pgindex, setPgindex] = useState(1);
  const [batches, setBacthes] = useState([]);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [batchId, setBatchId] = useState(0);
  const [emailTemplate, setEmailTemplate] = useState("");
  const [popup, setPopup] = useState(false);
  function openPopup(id) {
    setBatchId(id);
    setShowPopup(true);
  }
  const fetchBatchList = async () => {
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
        }/api/batches/list/${programId}?filter=${params}&access_token=${
          userData?.accessToken
        }`
      );
      // check for error response
      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
      const data = await response.json();
      // return console.log(data.data);
      setBacthes(data.data);
    } catch (error) {
      console.error("There was an error!", error);
      if (error === "Token Expired" || error === "Malformed User") {
        signOut();
      }
    }
  };

  const sendManagerMail = async (e) => {
    e.preventDefault();
    console.log(emailTemplate);
    try {
      if (emailTemplate == "1") {
        const response = await fetch(
          `${
            import.meta.env.VITE_PUBLIC_URL
          }/api/programs/sendMangerMail?access_token=${
            userData?.accessToken
          }&programId=${programId}`
        );
        const data = await response.json();
        if (data.status == "success") {
          setEmailTemplate("");
          return toast.success(data.msg);
        } else {
          return toast.error(data.msg);
        }
      }

      if (emailTemplate == "2") {
        const response = await fetch(
          `${
            import.meta.env.VITE_PUBLIC_URL
          }/api/programs/sendManagerReminderMail?access_token=${
            userData?.accessToken
          }&programId=${programId}&programDate=${
            programDetails.programStartDate
          }`
        );
        const data = await response.json();
        if (data.status == "success") {
          setEmailTemplate("");
          return toast.success(data.msg);
        } else {
          return toast.error(data.msg);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (programId) {
      fetchBatchList();
    }
  }, [programId]);
  const handleBatchDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_URL}/api/batches/deleteBatch/${
          selectedRow.id
        }?access_token=${userData.accessToken}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },

          method: "Delete",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        throw error;
      } else if (data.code === 400) {
        toast.error(data.msg);
      } else {
        toast.success(data.msg);
        // fetchProgramList();
        fetchBatchList();
        setPopup(false);
      }
    } catch (error) {
      console.error("There was an error!", error);
      if (error === "Token Expired" || error === "Malformed User") {
        signOut();
      }
    }
  };

  return (
    <div className="mx-3 ">
      <div className="flex items-center space-x-2 justify-end">
        <form
          onSubmit={sendManagerMail}
          className="flex items-center space-x-2 justify-end"
        >
          <select
            value={emailTemplate}
            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900  sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
            required
            onChange={(e) => setEmailTemplate(e.target.value)}
          >
            <option value="">Select Manager mail</option>
            <option value="1">Manager invitation mail</option>
            <option value="2">Manager reminder mail</option>
          </select>
          <button
            className="bg-green-500 hover:bg-green-700 text-sm text-white font-bold py-2 px-3 rounded"
            type="submit"
          >
            Send
          </button>
        </form>
        <span className="text-sm">
          <BiRefresh
            className="cursor-pointer"
            onClick={() => fetchBatchList()}
            size={20}
          />
        </span>
      </div>
      {popup ? (
        <div className="fixed z-30  w-full h-screen top-0 left-0 items-center   bg-gray-800/40">
          <div className="flex w-full items-start mt-10 justify-center ">
            <div className="relative mx-20 flex flex-col  w-1/2 items-center justify-center bg-white rounded-lg shadow-md px-8 py-2">
              <div className="absolute z-30 bg-white flex w-full justify-end items-end top-0  p-4 ">
                {/* <IoClose
                  onClick={() => {
                    setPopup(false);
                  }}
                  className="cursor-pointer text-2xl font-semibold text-black "
                /> */}
              </div>
              <div
                id="journal-scroll"
                className="w-full max-h-[32rem] h-fit overflow-y-auto mt-8"
              >
                <DeletePopupCard
                  title={selectedRow.title}
                  cancelDelete={() => setPopup(false)}
                  confirmDelete={() => handleBatchDelete(selectedRow.id)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {showPopup ? (
        <div className="fixed z-30  w-full h-screen top-0 left-0 items-center   bg-gray-800/40">
          <div className="flex w-full items-start mt-20 justify-center   h-screen">
            <div className="relative mx-20 flex flex-col  w-1/2 items-center justify-center bg-white rounded-lg shadow-md px-8 py-2">
              <div className="absolute z-30 bg-white flex w-full justify-end items-end top-0  p-4 ">
                <IoClose
                  onClick={() => setShowPopup(false)}
                  className="cursor-pointer text-xl font-semibold text-black "
                />
              </div>
              <div
                id="journal-scroll"
                className="w-full h-[30rem] overflow-y-auto"
              >
                <UpdateBatch
                  batchId={batchId}
                  // nominees={selectedNominessData}
                  // session={session}
                  isPopup={true}
                  setShowPopup={setShowPopup}
                  fetchBatchList={fetchBatchList}
                  programDetails={programDetails}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="flex flex-row justify-between">
        <h5 className=" text-md font-medium tracking-wide text-gray-700 lg:text-xl ">
          Batches
        </h5>
        {/* <button onClick={update}>Force re-render</button> */}
        {/* <div className="flex align-center">
          <div className="relative mt-1 mr-4 ">
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
              className="bg-gray-50 border py-1  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5  "
              placeholder="Search for batch"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div> */}
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-md m-4 bg-sky-600 text-white   ">
            <tr>
              {/* <th scope="col" className="px-6 py-3"></th */}
              <th scope="col" className="px-6 py-3">
                Sr.No
              </th>
              <th scope="col" className="px-6 py-3">
                Batch Name
              </th>
              <th scope="col" className="px-6 py-3">
                Location
              </th>
              <th scope="col" className="px-6 py-3">
                Start Date time
              </th>
              <th scope="col" className="px-6 py-3">
                End Date time
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>

              {/* <th scope="col" className="px-6 py-3">
                Action
              </th> */}
            </tr>
          </thead>
          {batches?.map((data, i) => {
            return (
              <tbody key={uuid_v4()}>
                <tr className="bg-white border-b  ">
                  {/* <td className="px-6 py-4 text-gray-900">
                    <input type="checkbox" />
                  </td> */}
                  <td className="px-6 py-4 text-gray-900">{i + 1}</td>
                  <th
                    scope="row"
                    // className="flex flex-row items-center px-6 py-4 font-medium text-gray-900  w-44"
                    className="px-6 py-4 text-gray-900"
                  >
                    {data.name}
                  </th>
                  <td className="px-6 py-4 text-gray-900">
                    {" "}
                    {data.location ? data.location : "-"}
                  </td>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900  whitespace-nowrap"
                  >
                    {moment(data.batchStartDate).format("Do MMM YYYY")}{" "}
                    {moment(data.batchStartTime, "HH:mm:ss").format("hh:mm a")}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900  whitespace-nowrap"
                  >
                    {data.batchEndDate
                      ? moment(data.batchEndDate).format("Do MMM YYYY")
                      : "-"}{" "}
                    {data.batchEndTime
                      ? moment(data.batchEndTime, "HH:mm:ss").format("hh:mm a")
                      : "-"}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900  whitespace-nowrap"
                  >
                    {data.status == "1" ? (
                      <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                        In Active
                      </span>
                    )}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900  whitespace-nowrap"
                  >
                    {/* <div
                      className="text-red-700 mr-4 hover:underline cursor-pointer"
                      onClick={() => {
                        // setPopup(true);
                        // setSelectedRow({
                        //   title: program.programName,
                        //   id: program.id,
                        // });
                      }}
                    >
                      <AiOutlineDelete color="red" />
                    </div>

                    <div className="text-gray-700 mr-4 hover:underline cursor-pointer">
                      <Link to={`/batch/${data.batchId}`}>
                        <AiOutlineFundView />
                      </Link>
                    </div>



                    {userData.userType !== 7 && (
                      <div className="text-gray-700 mr-4 hover:underline cursor-pointer">
                        <button
                          onClick={() => openPopup(data.batchId)}
                          className=""
                        >
                          <AiOutlineEdit />
                        </button>
                      </div>

                    )} */}
                    <div className="flex items-center">
                      <div className="text-red-700 mr-4 hover:underline cursor-pointer">
                        <button
                          onClick={() => {
                            setPopup(true);
                            setSelectedRow({
                              title: data.name,
                              id: data.batchId,
                            });
                          }}
                        >
                          <AiOutlineDelete size={24} color="red" />
                        </button>
                      </div>

                      <div className="text-gray-700 mr-4 hover:underline cursor-pointer">
                        <Link to={`/batch/${data.batchId}`}>
                          <AiOutlineFundView size={24} />
                        </Link>
                      </div>

                      {userData.userType !== 7 && (
                        <div className="text-gray-700 mr-4 hover:underline cursor-pointer">
                          <button onClick={() => openPopup(data.batchId)}>
                            <AiOutlineEdit size={24} />
                          </button>
                        </div>
                      )}
                    </div>
                  </th>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
}

export default BatchList;
