import moment from "moment";
// import { getSession } from "next-auth/react";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import readXlsxFile from "read-excel-file";
import { useAuth } from "../../context/auth";

function Certificates({ session }) {
  const [name, setName] = useState("Select a file...");
  // const [programName, setProgramName] = useState("");
  const { userData } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [csv, setCsv] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pgindex, setPgindex] = useState(1);
  const [pageLimit, setPageLimit] = useState(30);

  const handleChange = (e) => {
    if (e.target.files.length) {
      setName(e.target.files[0].name);
      readXlsxFile(e.target.files[0]).then((rows) => {
        rows.shift();
        let tutorials = [];
        rows.forEach((row, i) => {
          let tutorial = {
            name: row[0],
            email: row[1],
            programName: row[2],
            programDate: row[3],
            programDate2: row[4],
          };

          tutorials.push(tutorial);
        });

        setCsv(tutorials);
      });
    }
  };

  // const handleSelectChange = (e) => {
  //   setProgramName(e.target.value);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!csv.length) {
        toast.error("Please provide users.");
        return;
      }

      // console.log(csv)
      // return
      setLoading(true);
      var response;
      var bulkUser = JSON.stringify(csv);
      console.log(
        "======================================================",
        csv,
        "-------------------------------------------",
        bulkUser
      );
      response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/certificates/generate-certificate?access_token=${
          userData?.accessToken
        }`,
        {
          headers: {
            "Content-Type": "application/json",
          },

          method: "POST",
          body: bulkUser,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.error?.message);
      } else if (data.status === "failure") {
        toast.error(data.msg);
      } else {
        toast.success(data.msg);
        setName("Select a file...");
        setCsv([]);
        e.target.reset();
        fetchCertificateList();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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

  const fetchCertificateList = async () => {
    try {
      const filter = {
        pageLimit,
        pageNo,
      };
      const params = encodeURIComponent(JSON.stringify(filter));
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/certificates/list?filter=${params}&access_token=${
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
      setCertificates(data.data.certifiates);
      setPgindex(data.data.lastPage);
    } catch (error) {
      console.error("There was an error!", error);
      if (error === "Token Expired" || error === "Malformed User") {
        // signOut();
      }
    }
  };

  useEffect(() => {
    fetchCertificateList();
  }, [pageLimit, pageNo]);

  return (
    <div className="flex flex-col w-full h-full">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-full mt-1">
          <div className="grid grid-cols-1">
            {/* <div>
                <label className="leading-loose">Select Program</label>
                <div className="relative focus-within:text-gray-600 text-gray-400">
                  <select
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    onChange={handleSelectChange}
                  >
                    <option value="">Select Program</option>
                    <option value="Program Name 1">Program Name 1</option>
                    <option value="Program Name 2">Program Name 2</option>
                    <option value="Program Name 3">Program Name 3</option>
                  </select>
                </div>
              </div> */}
            <div className="flex flex-col">
              {/* <label className="leading-loose">Upload user list</label> */}
              <span
                htmlFor="files"
                className="relative flex w-full items-center bg-gray-200 rounded-md cursor-pointer "
              >
                <input
                  id="files"
                  name="files"
                  className="absolute w-full opacity-0"
                  type="file"
                  onChange={handleChange}
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
                <span className="flex rounded-l-lg py-2 text-sm px-5 h-full bg-sky-500 text-white w-fit">
                  Upload user list
                </span>
                <p className="text-sm font-medium  px-6 text-gray-700">
                  {name}
                </p>
              </span>
            </div>
          </div>
        </div>
        <div className="pt-4 flex  space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-500 flex justify-center items-center w-100 text-white px-4 py-2 rounded-md focus:outline-none"
          >
            {loading ? <span>Generating...</span> : <span>Generate</span>}
          </button>
        </div>
      </form>
      <h5 className=" text-md font-medium tracking-wide my-2 text-gray-700 lg:text-xl ">
        Certificate data
      </h5>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-md m-4 bg-sky-600 text-white   ">
            <tr>
              {/* <th scope="col" className="px-6 py-3">
                Sr. No
              </th> */}
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Program Name
              </th>
              <th scope="col" className="px-6 py-3">
                Program Date
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Certificate File
              </th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((data, i) => (
              <tr key={i + 1} className="bg-white border-b">
                {/* <td className="px-6 py-4 text-gray-900"> {i + 1}</td> */}
                <th
                  scope="row"
                  className="flex flex-row items-center px-6 py-4 font-medium text-gray-900  w-44"
                >
                  {data?.name}
                </th>
                <td className="px-6 py-4 text-gray-900">{data?.email}</td>
                <td className="px-6 py-4 text-gray-900">{data?.programName}</td>
                <td className="px-6 py-4 text-gray-900">
                  {data?.programDate
                    ? moment(data?.programDate).format("DD-MM-YYYY")
                    : "-"}
                </td>
                <td className="px-6 py-4 text-gray-900">
                  {data?.response ? (
                    JSON.parse(data?.response).accepted.length ? (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        success
                      </span>
                    ) : (
                      <span classNam="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        Failed
                      </span>
                    )
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-6 py-4 text-gray-900">
                  <a href={data?.file} target="_blank" rel="noreferrer">
                    View File
                  </a>
                </td>
                {/* <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900  whitespace-nowrap"
                    >
                      {data?.employeeId}
                    </th> */}
              </tr>
            ))}
          </tbody>
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

export default Certificates;
