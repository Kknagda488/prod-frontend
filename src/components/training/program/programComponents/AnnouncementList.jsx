import React, { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { v4 as uuid_v4 } from "uuid";
import { toast } from "react-toastify";
import { useAuth } from "../../../../context/auth";
function AnnouncementList({ programId }) {
  const [announcementList, setAnnouncementList] = useState([]);
  const { userData, signOut } = useAuth();
  const [pageNo, setPageNo] = useState(1);
  const [pgindex, setPgindex] = useState(1);
  const [pageLimit, setPageLimit] = useState(5);

  const fetchAnnouncementList = async () => {
    try {
      const filter = {
        pageLimit,
        pageNo,
      };
      const params = encodeURIComponent(JSON.stringify(filter));
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/announcements/list/${programId}?filter=${params}&access_token=${
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

      setAnnouncementList(data.data.announcements);
      setPgindex(data.data.lastPage);
    } catch (error) {
      console.error("There was an error!", error);
      if (error === "Token Expired" || error === "Malformed User") {
        signOut();
      }
    }
  };

  const handleMailSend = async (e) => {
    e.preventDefault();

    try {
      var formData = {};
      Array.from(e.currentTarget.elements).forEach((field) => {
        if (!field.name) return;
        formData[field.name] = field.value;
      });
      const form = new URLSearchParams(Object.entries(formData)).toString();
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/announcements/sendMail/${programId}?access_token=${
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
        toast.error(data?.error?.message);
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      } else {
        toast.success(data.msg);
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

  const next = () => {
    console.log(pageNo);
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
      fetchAnnouncementList();
    }
  }, [programId, pageLimit, pageNo]);
  return (
    <div className="mx-3 ">
      <div className="flex flex-row justify-between">
        <h5 className=" text-md font-medium tracking-wide text-gray-700 lg:text-xl ">
          Announcement List
        </h5>

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
              placeholder="Search for nominee"
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>
          <button className="bg-green-500 hover:bg-green-700 text-sm text-white font-bold py-0 px-4 rounded">
            Export
          </button>
        </div> */}

        {userData.userType === 1 && (
          <a
            href={`/nominee-form/${programId}`}
            target="_blank"
            rel="noreferrer"
          >
            Click here to register
          </a>
        )}
      </div>
      {userData.userType === 1 && (
        <div>
          <form className="flex flex-wrap" onSubmit={handleMailSend}>
            <div className="px-2">
              <label className="leading-loose">Select Template</label>
              <select
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                placeholder="Batch Name"
                name="type"
                required
              >
                <option value="">Select Template</option>
                {/* <option>Reminder</option> */}
                <option value="reschedule">Re- Schedule</option>
                <option value="cancellation">Cancellation</option>
              </select>
            </div>
            <div className="px-2">
              <button
                type="submit"
                className="flex w-fit mt-7 px-6 py-3 text-white text-sm font-medium
                          bg-green-500 items-center rounded-md"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-md m-4 bg-sky-600 text-white   ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Employee Id
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Mobile No.
              </th>
            </tr>
          </thead>
          {announcementList.map((data, i) => {
            return (
              <tbody key={uuid_v4()}>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 text-gray-900">
                    {" "}
                    {data?.employee?.employeeId}
                  </td>
                  <th
                    scope="row"
                    className="flex flex-row items-center px-6 py-4 font-medium text-gray-900  w-44"
                  >
                    {data?.employee?.fullName}
                  </th>
                  <td className="px-6 py-4 text-gray-900">
                    {data?.employee?.email}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {data?.employee?.phone}
                  </td>
                  {/* <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900  whitespace-nowrap"
                  >
                    {data?.employeeId}
                  </th> */}
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
      <div className="flex flex-row justify-around mt-10 items-center  ">
        <span className="text-sm flex text-gray-700 "></span>
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

export default AnnouncementList;
