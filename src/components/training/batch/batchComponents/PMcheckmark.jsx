import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
// import { useSession } from "next-auth/react";
import moment from "moment";
import { useAuth } from "../../../../context/auth";
function PMcheckmark({ batchData, batchId, getOneBatch }) {
  // const { data: session } = useSession();
  const { userData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [checkmarksData, setCheckMarksData] = useState([]);

  async function addPmCheckmark(e) {
    e.preventDefault();
    try {
      var formData = {};
      Array.from(e.currentTarget.elements).forEach((field) => {
        if (!field.name) return;
        formData[field.name] = field.value;
      });
      let form = new URLSearchParams(Object.entries(formData)).toString();
      // return console.log(formData);
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_URL}/api/checkmarks/add?access_token=${
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
      if (!response.ok) {
        toast.error(data?.error?.message);
      } else {
        toast.success("Checkmark added succesfully!");
        fetchPmCheckmarks();
      }
      e.target.reset();
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchPmCheckmarks() {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/checkmarks/list/${batchId}?access_token=${userData?.accessToken}`
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.error?.message);
      } else {
        console.log("fetchPmCheckmarks", data.data);
        setCheckMarksData(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (batchId) {
      fetchPmCheckmarks();
    }
  }, [batchId]);
  return (
    <div>
      {userData.userType !== 7 && (
        <form onSubmit={addPmCheckmark}>
          <div className="flex flex-col">
            <h5 className="text-xl font-semibold mt-2 mb-4 leading-none text-gray-700 ">
              PM Checkmark
            </h5>
            <div className="flex flex-wrap">
              <div className="w-1/3 px-2">
                <label className="leading-loose">Activity Name*</label>
                <select
                  type="checkbox"
                  name="activityName"
                  className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                  required
                >
                  <option value="">Select checkmark</option>
                  <option value="Developing and sharing the framework for each">
                    Developing and sharing the framework for each
                  </option>
                  <option value="Approving the framework">
                    Approving the framework
                  </option>
                  <option value="Content creation">Content creation</option>
                  <option value="Content validation and approval">
                    Content validation and approval
                  </option>
                </select>
              </div>
              <div className="w-1/3 px-2">
                <label className="leading-loose">End Date*</label>
                <input
                  type="date"
                  name="endDate"
                  className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                  required
                />
              </div>
              <div className="w-1/3 px-2">
                <label className="leading-loose">Status*</label>
                <select
                  type="checkbox"
                  name="status"
                  className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                  required
                >
                  <option value="1">Done</option>
                  <option value="2">Not Done</option>
                  <option value="3">Pending</option>
                </select>
              </div>
              <input name="batchId" defaultValue={batchId} hidden />
            </div>
          </div>

          <button
            type="submit"
            //onClick={() => save()}
            className="bg-sky-500 mt-4 truncate flex justify-center items-center w-full text-white px-5 py-2 rounded-md focus:outline-none"
          >
            Submit
          </button>
        </form>
      )}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-md m-4 bg-sky-600 text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                Sr.No
              </th>
              <th scope="col" className="px-6 py-3">
                Activity Name
              </th>
              <th scope="col" className="px-6 py-3">
                End Date
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>

              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {checkmarksData.map((checkMark, index) => (
              <CheckMarkRow
                key={index}
                index={index}
                item={checkMark}
                fetchPmCheckmarks={fetchPmCheckmarks}
              />
            ))}
            {/* <tr className="bg-white border-b  ">
                     <td className="px-6 py-4 text-gray-900">2</td>
                     <td className="px-6 py-4 text-gray-900">Approving the framework</td>
                     <td className="px-6 py-4 text-gray-900">24 June 2023 </td>
                     <td className="px-6 py-4 text-gray-900">Done </td>
                   </tr>
                   <tr className="bg-white border-b  ">
                     <td className="px-6 py-4 text-gray-900">3</td>
                     <td className="px-6 py-4 text-gray-900">Content Creation</td>
                     <td className="px-6 py-4 text-gray-900">20 July 2023 </td>
                     <td className="px-6 py-4 text-gray-900">Not Done </td>
                   </tr> */}
          </tbody>

          {/* <tbody key={uuid_v4()}>
                   <tr className="bg-white border-b  ">
                     <td className="px-6 py-4 text-gray-900">{i + 1}</td>
                     <td className="px-6 py-4 text-gray-900"> {data?.employee.employeeId}</td>
                     <th
                       scope="row"
                       className="flex flex-row items-center px-6 py-4 font-medium text-gray-900  w-44"
                     >
                       {data?.employee.fullName}
                     </th>
                     <td className="px-6 py-4 text-gray-900">
                       {data?.employee.email}
                     </td>
                   </tr>
                 </tbody> */}
        </table>
      </div>
    </div>
  );
}

const CheckMarkRow = ({ index, item, fetchPmCheckmarks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { userData } = useAuth();
  const [checkMark, setCheckmark] = useState({
    activityName: item.activityName,
    endDate: item.endDate ? moment(item.endDate).format("YYYY-MM-DD") : "",
    status: item.status,
  });
  const handleChange = (e) => {
    setCheckmark(() => ({ ...checkMark, [e.target.name]: e.target.value }));
  };

  const handleEditCheckmark = async () => {
    try {
      let form = new URLSearchParams(Object.entries(checkMark)).toString();
      // return console.log(checkMark);
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_URL}/api/checkmarks/updateStatus/${
          item.id
        }?access_token=${userData?.accessToken}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },

          method: "PUT",
          body: form,
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.error?.message);
      } else {
        toast.success("Checkmark update succesfully!");
      }
      // e.target.reset();
      fetchPmCheckmarks();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {!isEditing ? (
        <tr key={index + 1} className="bg-white border-b">
          <td className="px-6 py-4 text-gray-900">{index + 1}</td>
          <td className="px-6 py-4 text-gray-900">{item.activityName} </td>
          <td className="px-6 py-4 text-gray-900">
            {moment(item.endDate).format("Do MMM YYYY")}
          </td>
          <td className="px-6 py-4 text-gray-900">
            {item.status == "1" ? (
              <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                Done
              </span>
            ) : null}{" "}
            {item.status == "2" ? (
              <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                Not done
              </span>
            ) : null}{" "}
            {item.status == "3" ? (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                Pending
              </span>
            ) : null}
          </td>
          <td className="px-6 py-4 text-gray-900">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </td>
        </tr>
      ) : (
        <tr className="bg-white border-b">
          <td className="px-6 py-4 text-gray-900">{index + 1}</td>
          <td className="px-6 py-4 text-gray-900">
            <select
              type="checkbox"
              name="activityName"
              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
              required
              onChange={handleChange}
              value={checkMark.activityName}
            >
              <option value="">Select checkmark</option>
              <option value="Developing and sharing the framework for each">
                Developing and sharing the framework for each
              </option>
              <option value="Approving the framework">
                Approving the framework
              </option>
              <option value="Content creation">Content creation</option>
              <option value="Content validation and approval">
                Content validation and approval
              </option>
            </select>
          </td>
          <td className="px-6 py-4 text-gray-900">
            <input
              type="date"
              name="endDate"
              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
              required
              onChange={handleChange}
              value={checkMark.endDate}
            />
          </td>
          <td className="px-6 py-4 text-gray-900">
            <select
              type="checkbox"
              name="status"
              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
              required
              onChange={handleChange}
              value={checkMark.status}
            >
              <option value="1">Done</option>
              <option value="2">Not Done</option>
              <option value="3">Pending</option>
            </select>
          </td>
          <td className="px-6 py-4 text-gray-900">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              // onClick={toggleEditing
              onClick={handleEditCheckmark}
            >
              Update
            </button>
          </td>
        </tr>
      )}
    </>
  );
};

export default PMcheckmark;
