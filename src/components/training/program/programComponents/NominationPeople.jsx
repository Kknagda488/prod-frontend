import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuid_v4 } from "uuid";
import Utils from "../../../utils";
import CreateBatch from "../../../forms/CreateBatch";
import { IoClose } from "react-icons/io5";
import { BiRefresh } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { useAuth } from "../../../../context/auth";
import DeletePopCard from "../../DeletePopCard";

function NominationPeople({ programId, programDetails }) {
  const { userData, signOut } = useAuth();
  const [pageNo, setPageNo] = useState(1);
  const [pageLimit, setPageLimit] = useState(30);
  const [pgindex, setPgindex] = useState(1);
  const [nominees, setNominees] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedNominees, setSelectedNominees] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [allNominees, setAllNominees] = useState([]);

  const fetchNomineesList = async () => {
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
        }/api/nominees/list/program/${programId}?filter=${params}&access_token=${
          userData?.accessToken
        }`
      );
      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
      const data = await response.json();
      // return console.log(data.data.nominees);
      setAllNominees(data.data.allProgramNominees);
      setNominees(data.data.allProgramNominees);
      setPgindex(data.data.lastPage);
    } catch (error) {
      console.error("There was an error!", error);
      if (error === "Token Expired" || error === "Malformed User") {
        signOut();
      }
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

  useEffect(() => {
    if (programId) {
      fetchNomineesList();
    }
  }, [programId, pageLimit, pageNo, search]);

  const handleCheckboxChange = (event) => {
    const { name } = event.target;

    const employeeId = parseInt(name);
    setSelectedNominees((prevCheckedItems) =>
      prevCheckedItems.includes(employeeId)
        ? prevCheckedItems.filter((item) => item !== employeeId)
        : [...prevCheckedItems, employeeId]
    );
  };

  const handleExport = () => {
    if (selectedNominees.length === 0) {
      return toast.error("Please select nominees.");
    }
    const employees = [
      ["First Name", "Last Name", "Email", "Manager Name", "Manager Email"],
    ];
    allNominees.forEach((nom) => {
      if (selectedNominees.includes(nom.nomineeId)) {
        employees.push([
          nom.firstName,
          nom.lastName,
          nom.email,
          nom.managerName,
          nom.managerEmail,
        ]);
      }
    });
    Utils.exportAoaToXlsx(employees, programDetails.programName);
  };
  const selectedNominessData = [];
  allNominees.forEach((nom) => {
    if (selectedNominees.includes(nom.nomineeId)) {
      selectedNominessData.push({
        firstName: nom.firstName,
        lastName: nom.lastName,
        email: nom.email,
        mobileNo: nom.mobileNo,
      });
    }
  });

  const handleMailSend = async (e) => {
    e.preventDefault();

    try {
      console.log(nominees.length);
      if (!selectedNominees.length) {
        return toast.error("Please select nominees");
      }
      var formData = {};
      const selectedNominessData = [];
      allNominees.forEach((nom) => {
        if (selectedNominees.includes(nom.nomineeId)) {
          selectedNominessData.push({
            firstName: nom.firstName,
            lastName: nom.lastName,
            email: nom.email,
            mobileNo: nom.mobileNo,
          });
        }
      });
      // return console.log(selectedNominessData);
      Array.from(e.currentTarget.elements).forEach((field) => {
        if (!field.name) return;
        formData[field.name] = field.value;
      });

      if (selectedNominessData.length) {
        formData["file"] = JSON.stringify(selectedNominessData);
      }
      console.log(formData);
      const form = new URLSearchParams(Object.entries(formData)).toString();
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/nominees/sendMail/${programId}?access_token=${
          userData?.accessToken
        }`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "POST",
          body: form,
        }
      );

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        const error = (data && data.message) || response.statusText;
        throw error;
      } else if (data.status === "failure") {
        toast.error(data?.message);
      } else {
        toast.success(data.message);
        setSelectedNominees([]);
      }
      e.target.reset();
    } catch (error) {
      console.log(error);
      console.error("There was an error!", error);
      if (error === "Token Expired") {
        signOut();
      }
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
        fetchNomineesList();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      const result = [];
      allNominees.forEach((nom) => {
        if (!selectedNominees.includes(nom.nomineeId)) {
          result.push(nom.nomineeId);
        }
      });
      setSelectedNominees((prev) => [...prev, ...result]);
    } else {
      setSelectedNominees([]);
    }
    setSelectAll(isChecked);
  };
  console.log(selectedNominees, "selectedNominees");
  return (
    <div className="mx-3">
      <div className="flex justify-end">
        <span
          style={{ marginTop: "-10px", marginBottom: "10px" }}
          className="text-sm "
        >
          <BiRefresh
            className="cursor-pointer"
            onClick={() => fetchNomineesList()}
            size={20}
          />
        </span>
      </div>
      {/* <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setShowPopup(true)}
      >
        Open Form
      </button> */}

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
                <DeletePopCard
                  title={selectedRow.title}
                  cancelDelete={() => setShowDeletePopup(false)}
                  confirmDelete={() => handleNomineeDelete(selectedRow.id)}
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
                <CreateBatch
                  programId={programId}
                  nominees={selectedNominessData}
                  isPopup={true}
                  fetchNomineesList={fetchNomineesList}
                  setShowPopup={setShowPopup}
                  setSelectedNominees={setSelectedNominees}
                  programDetails={programDetails}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* {showPopup && (
        <div className="fixed top-0 left-0 h-screen w-screen bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-3">Contact Us</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  className="rounded shadow-lg py-2 px-3 w-full"
                  type="text"
                  name="name"
                  id="name"
                  value={formValues.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="rounded shadow-lg py-2 px-3 w-full"
                  type="email"
                  name="email"
                  id="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  className="rounded shadow-lg py-2 px-3 w-full"
                  name="message"
                  id="message"
                  rows="5"
                  value={formValues.message}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  type="submit"
                >
                  Submit
                </button>
                <button
                  className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
      <div className="flex flex-row justify-between">
        {/* <h5 className=" text-md font-medium tracking-wide text-gray-700 lg:text-xl ">
            Nominees
          </h5> */}
        <span>Total Nominees: {allNominees?.length || 0}</span>
        <div className="flex align-center">
          <div className="relative mt-1">
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
              placeholder="Search for nominee"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      {userData.userType === 1 && (
        <div>
          <div className="flex justify-between mt-2">
            <form onSubmit={handleMailSend} className="flex space-x-2">
              <select
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-30 sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                name="type"
                required
              >
                <option value="">Select Template</option>
                <option value="cancellation">Cancellation</option>
                <option value="reschedule">Reschedule</option>
              </select>
              <button className="bg-green-500 hover:bg-green-700 text-sm text-white font-bold py-2 px-3 rounded">
                Send
              </button>
            </form>
            <div>
              {selectedNominees.length ? (
                <span className="mr-4">
                  Selected Nominees: {selectedNominees.length}
                </span>
              ) : null}
              <button
                className="px-2 py-2 mr-2 text-sm bg-green-500 text-white rounded-md"
                onClick={() => handleExport()}
              >
                Export
              </button>
              {selectedNominees.length > 0 && (
                <button
                  onClick={() => setShowPopup(true)}
                  className="px-2 py-2 text-sm bg-green-500 text-white rounded-md"
                >
                  Create Batch
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-md m-4 bg-sky-600 text-white   ">
            <tr>
              {userData.userType === 1 && (
                <th scope="col" className="px-6 py-3">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    className="form-checkbox h-4 w-4 text-blue-600"
                    checked={selectAll}
                  ></input>
                </th>
              )}
              <th scope="col" className="px-6 py-3">
                Sr no.
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Supervisor Name
              </th>
              <th scope="col" className="px-6 py-3">
                Supervisor Email
              </th>
              <th scope="col" className="px-6 py-3">
                Batch Assigned
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
              {/* <th scope="col" className="px-6 py-3">
                Batch
              </th> */}

              {/* <th scope="col" className="px-6 py-3">
                Action
              </th> */}
            </tr>
          </thead>
          {nominees.map((data, i) => {
            return (
              <tbody key={uuid_v4()}>
                <tr className="bg-white border-b">
                  {userData.userType === 1 && (
                    <td className="px-6 py-4 text-gray-900">
                      <input
                        type="checkbox"
                        name={data.nomineeId}
                        checked={selectedNominees.includes(data.nomineeId)}
                        onChange={handleCheckboxChange}
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 text-gray-900">{i + 1}</td>
                  <th
                    scope="row"
                    className="flex flex-row items-center px-6 py-4 font-medium text-gray-900  w-44"
                  >
                    {data.firstName} {data.lastName}
                  </th>
                  <td className="px-6 py-4 text-gray-900">{data.email}</td>
                  <td className="px-6 py-4 text-gray-900">
                    {data.managerName}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {data.managerEmail}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {data.batch ? data.batch.name : "-"}
                  </td>
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
                    <AiOutlineDelete color="red" size={20} />
                  </div>
                  {/* <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900  whitespace-nowrap"
                  >
                    {data.batch ? data.batch.name : "-"}
                  </th> */}
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
                value={pageLimit}
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

export default NominationPeople;
