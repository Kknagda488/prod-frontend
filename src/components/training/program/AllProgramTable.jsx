import React, { useState } from "react";
// import BatchQuestionListAdd from "./QuestionList/BatchQuestionListAdd";
import { v4 as uuid_v4 } from "uuid";
import ProgramList from "./ProgramList";
import { IoClose } from "react-icons/io";
import DeletePopupCard from "../DeletePopCard";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/auth";
import BackButton from "./BackButton";
// import { signOut } from "next-auth/react";
function AllProgramTable({
  programList,
  setBatchListPop,
  id,
  bucket,
  setBucket,
  setId,
  //setSelected(true);
  next,
  previous,
  pgindex,
  page,
  setLimit,
  setPage,
  setSearch,
  search,
  fetchProgramList,
}) {
  var selectedBatches = [];
  const [popup, setPopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState({
    title: "",
    id: "",
  });
  const { userData, signOut } = useAuth();
  const programManager = (programData) => {
    //console.log(questionData, "okg");
    var doesItemExist;
    var objects;
    if (bucket.length === 0) {
      setBucket([programData]);
    } else {
      const newState = bucket.map((item) => {
        if (item.id === programData.id) {
          //item.quantity += 1;
          doesItemExist = true;
        }
        objects = item;
        return item;
      });

      //  console.log(newState);

      if (doesItemExist) {
        const index = bucket.findIndex((item) => item.id === programData.id);
        let newBucket = [...bucket];
        if (index >= 0) {
          newBucket.splice(index, 1);
        } else {
          console.warn(`Cannot remove : ${programData.batchQuestionId}`);
        }
        setBucket(newBucket);
      } else {
        setBucket([...bucket, programData]);
      }
    }
  };
  const handleProgramDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_URL}/api/programs/deleteProgram/${
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
        fetchProgramList();
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
    <div className=" space-y-4 flex flex-col justify-between">
      {/* <BackButton setBatchListPop={setBatchListPop} /> */}
      <div className="flex flex-row my-4 justify-between items-center ">
        <div className="px-2  flex w-full justify-between   ">
          <h5 className="font-medium leading-none text-gray-700 ">
            Add Program from Existing Programs
          </h5>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none py-2  ">
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
            value={search}
            type="text"
            id="table-search"
            className="bg-gray-50 border py-1 outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-80 pl-10 p-2.5  "
            placeholder="Search by Program Name"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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
                  confirmDelete={() => handleProgramDelete(selectedRow.id)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="relative overflow-x-auto shadow-md rounded-lg mt-3">
        <table className="w-full text-sm text-left  text-gray-500">
          <thead className="text-md m-4 bg-sky-600 text-white">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">
                View
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Program Name
              </th>

              <th scope="col" className="px-6 py-3 font-medium">
                Client Name
              </th>
              <th scope="col" className="px-6 py-3 font-medium ">
                Type
              </th>
              <th scope="col" className="px-6 py-3 font-medium ">
                Start Date
              </th>

              <th scope="col" className="px-6 py-3 font-medium ">
                End Date
              </th>
              <th scope="col" className="px-6 py-3 font-medium ">
                Mode
              </th>
              <th scope="col" className="px-6 py-3 font-medium ">
                Location
              </th>
              {userData.userType == "1" ? (
                <th scope="col" className="px-6 py-3 font-medium ">
                  Actions
                </th>
              ) : (
                <th scope="col" className="px-6 py-3 font-medium "></th>
              )}
            </tr>
          </thead>
          <tbody>
            {programList.length == 0 ? (
              <tr className="border-b  font-medium odd:bg-white even:bg-gray-50 ">
                <td className="px-6 py-4"></td>

                <td className="px-6 py-4">
                  No Program Data Found!! Create a new Program
                </td>

                <td className="px-6 py-4"></td>
              </tr>
            ) : (
              <>
                {programList.map((program, index) => {
                  return (
                    <ProgramList
                      key={uuid_v4()}
                      index={index}
                      bucket={bucket}
                      program={program}
                      //allQuestion={allQuestion}
                      programManager={programManager}
                      // session={session}
                      setId={setId}
                      //setSelected(true);
                      setBatchListPop={setBatchListPop}
                      setPopup={setPopup}
                      // fetchProgramList={fetchProgramList
                      setSelectedRow={setSelectedRow}
                    />
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-row justify-around mt-2 items-center  ">
        <div className="flex">
          <div className="dropdown flex items-center relative">
            <p>Show</p>
            <span className="bg-gray-100 text-gray-700 mx-2  font-normal tracking-wide rounded inline-flex items-center">
              <select
                className="bg-transparent px-3 py-2  outline-none"
                onChange={(e) => {
                  setLimit(e.target.value);
                  setPage(1);
                }}
              >
                <option className="mr-1 ">5</option>
                <option className="mr-1 ">10</option>
                <option className="mr-1 ">20</option>
                <option className="mr-1 ">30</option>
                <option className="mr-1 ">40</option>
                <option className="mr-1 ">50</option>
              </select>
            </span>
            <p>Programs</p>
          </div>
        </div>

        <div>
          <a
            onClick={() => previous()}
            className={` ${
              page === 1
                ? "hidden"
                : "inline-flex items-center py-2 px-4 ml-3 text-sm font-medium text-gray-700 bg-gray-200 cursor-pointer rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700   "
            }`}
          >
            Previous
          </a>

          <a
            onClick={() => next()}
            className={` ${
              page >= pgindex
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
}

export default AllProgramTable;
