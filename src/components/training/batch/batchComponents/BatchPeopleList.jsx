import React, { useState, useEffect } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { v4 as uuid_v4 } from "uuid";
import DeletePopupCard from "../../DeletePopCard";
import { toast } from "react-toastify";
import { useAuth } from "../../../../context/auth";
import AddNomineeForm from "../../../forms/AddNomineeForm";

function BatchPeopleList({ batchId, batchData }) {
  console.log("BatchPeopleList", batchData?.program?.id);
  const [peoplelist, setPeopleList] = useState();
  const [pageNo, setPageNo] = useState(1);
  const [pageLimit, setPageLimit] = useState(5);
  const [pgindex, setPgindex] = useState(1);
  const [nominees, setNominees] = useState([]);
  const [search, setSearch] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showAddNominee, setShowAddNominee] = useState(false);
  const { userData, signOut } = useAuth();

  const fetchBatchPeopleList = async () => {
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
        }/api/nominees/list/batch/${batchId}?filter=${params}&access_token=${
          userData?.accessToken
        }`
      );
      const data = await response.json();
      // return console.log("data.data.nominees",data.data.nominees);
      setPeopleList(data.data.nominees);
      setPgindex(data.data.lastPage);
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleNomineeDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_URL}/api/nominees/deleteNominee/${
          selectedRow.id
        }?access_token=${userData?.accessToken}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "DELETE",
        }
      );
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        const error = (data && data.message) || response.statusText;
        throw error;
      } else if (data.status === "failure") {
        toast.error(data?.msg);
      } else {
        toast.success(data.msg);
        setSelectedRow(null);
        setShowDeletePopup(false);
        fetchBatchPeopleList();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (batchId) {
      fetchBatchPeopleList();
    }
  }, [batchId, pageLimit, pageNo, search]);

  return (
    <div className="mx-3 ">
      {showDeletePopup ? (
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
                  cancelDelete={() => setShowDeletePopup(false)}
                  confirmDelete={() => handleNomineeDelete(selectedRow.id)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {showAddNominee ? (
        <div className="fixed z-30  w-full h-screen top-0 left-0 items-center   bg-gray-800/40">
          <div className="flex w-full items-start mt-20 justify-center ">
            <div className="relative mx-20 my-20 flex flex-col  w-1/2 items-center justify-center bg-white rounded-lg shadow-md px-8 py-2">
              <div className="absolute z-30 bg-white flex w-full justify-end items-end top-0  p-4 ">
                <IoClose
                  onClick={() => {
                    setShowAddNominee(false);
                  }}
                  className="cursor-pointer text-2xl font-semibold text-black "
                />
              </div>
              <div
                id="journal-scroll"
                className="w-full max-h-[32rem] h-fit overflow-y-auto mt-10"
              >
                <AddNomineeForm
                  batchId={batchId}
                  programId={batchData?.program?.id}
                  fetchBatchPeopleList={fetchBatchPeopleList}
                  setShowAddNominee={setShowAddNominee}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="py-0 flex items-center  justify-end space-x-4 mb-2">
        {userData?.client === "kotak" ? null : (
          <>
            <button
              onClick={() => setShowAddNominee(true)}
              className="bg-sky-500 inline-flex justify-center items-center  text-white px-4 py-3 rounded-md focus:outline-none"
            >
              Add Nominee
            </button>
          </>
        )}
      </div>
      <div className="flex flex-row justify-between">
        <h5 className=" text-md font-medium tracking-wide text-gray-700 lg:text-xl">
          Batch Peoples
        </h5>

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
            className="bg-gray-50 border py-1  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5  "
            placeholder="Search for users"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* {session.user.userType !==7 &&
        <button className="bg-green-500 hover:bg-green-700 text-sm text-white font-bold py-0 px-4 rounded">
            Export
          </button>
          } */}
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-md m-4 bg-sky-600 text-white">
            {userData?.client === "kotak" ? (
              <>
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Sr.No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    EmployeeId
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Assigned Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Reference Code
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Branch Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </>
            ) : (
              <>
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Sr.No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>

                  {userData?.client === "axis" ? (
                    <th scope="col" className="px-6 py-3">
                      Employee Id
                    </th>
                  ) : null}

                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </>
            )}
          </thead>
          {peoplelist?.map((data, i) => {
            return (
              <tbody key={uuid_v4()}>
                {userData?.client === "kotak" ? (
                  <tr className="bg-white border-b  ">
                    <td className="px-6 py-4 text-gray-900">{i + 1}</td>
                    <th
                      scope="row"
                      className="flex flex-row items-center px-6 py-4 font-medium text-gray-900  w-44"
                    >
                      {/* <imgZZZ
                      className="w-6 h-6 rounded-full mr-2"
                      src="/user-profile.png"
                      alt=""
                    /> */}
                      {data.firstName} {data.lastName}
                    </th>
                    <td className="px-6 py-4 text-gray-900">
                      {data.employeeId}
                    </td>

                    <td className="px-6 py-4 text-gray-900">
                      {new Date(batchData.batchStartDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-900">
                      {data.referenceCode}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {data.branchName}
                    </td>

                    <td className=" flex flex-row px-6 py-4 text-right mt-2">
                      <div
                        className="text-red-700 flex justify-center items-center hover:underline cursor-pointer"
                        onClick={() => {
                          setShowDeletePopup(true);
                          setSelectedRow({
                            title: `${data.firstName} ${data.lastName}`,
                            id: data.nomineeId,
                          });
                        }}
                      >
                        <AiOutlineDelete size={20} />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr className="bg-white border-b  ">
                    <td className="px-6 py-4 text-gray-900">{i + 1}</td>
                    <th
                      scope="row"
                      className="flex flex-row items-center px-6 py-4 font-medium text-gray-900  w-44"
                    >
                      {/* <imgZZZ
                      className="w-6 h-6 rounded-full mr-2"
                      src="/user-profile.png"
                      alt=""
                    /> */}
                      {data.firstName} {data.lastName}
                    </th>
                    <td className="px-6 py-4 text-gray-900">{data.email}</td>
                    {userData?.client === "axis" ? (
                      <td className="px-6 py-4 text-gray-900">
                        {data.employeeId}
                      </td>
                    ) : null}

                    <td className=" flex flex-row px-6 py-4 text-right mt-2">
                      <div
                        className="text-red-700 flex justify-center items-center hover:underline cursor-pointer"
                        onClick={() => {
                          setShowDeletePopup(true);
                          setSelectedRow({
                            title: `${data.firstName} ${data.lastName}`,
                            id: data.nomineeId,
                          });
                        }}
                      >
                        <AiOutlineDelete size={20} />
                      </div>
                    </td>
                  </tr>
                )}
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
}

export default BatchPeopleList;
