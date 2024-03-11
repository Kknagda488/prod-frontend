import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaShareAltSquare } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../../../context/auth";
const Prework = ({ batchId, batchData }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData, signOut } = useAuth();
  const [preworks, setPreworks] = useState([]);
  // const {userData} = useAuth()
  async function handlePreworkUpdate(e) {
    setLoading(true);
    e.preventDefault();
    try {
      console.log(files);
      let formData = new FormData();
      Object.keys(files).forEach((file) => {
        formData.append("file", files[file]);
      });
      let response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/preworks/uploadFile/${batchId}?access_token=${
          userData?.accessToken
        }`,
        {
          headers: {
            // Accept: "application/json",
            // "Content-Type": "CompleteMultipartUpload",
            // "Content-Type": "Multipart/form-data",
          },
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data?.code === 200) {
        fetchPrework();
        toast.success("File is uploaded successfully");
        setLoading(false);
      }
      //handleSendMail(data, e);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const handleSendMail = async (files, e) => {
    e.preventDefault();
    try {
      var response;
      let form = new URLSearchParams(
        Object.entries({
          batchId,
          files: JSON.stringify(files),
        })
      ).toString();
      console.log(form);
      response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/batches/sendPreworkMails?access_token=${userData?.accessToken}`,
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
        if (data.code == "failure") {
          toast.error(data.msg);
        } else {
          // uploadCsv(data.data);
          toast.success("Emails sent successfully !!");
          fetchPrework();
          e.target.reset();
        }
      }
    } catch (error) {
      console.error("There was an error!", error);
      if (error === "Token Expired" || error === "Malformed User") {
        signOut();
      }
    } finally {
      setLoading(false);
    }
  };

  function handleFileChange(e) {
    setFiles(e.target.files);
  }
  const fetchPrework = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/preworks/listByBatch/${batchId}?access_token=${
          userData?.accessToken
        }`
      );
      const data = await response.json();
      if (!response.ok) {
        throw data.message;
      }
      setPreworks(data.data);
    } catch (error) {
      console.log(error);
      if (error === "Malformed User" || error === "Token Expired") {
        signOut();
      }
    }
  };

  useEffect(() => {
    if (batchId) {
      fetchPrework();
    }
  }, []);
  return (
    <>
      <form onSubmit={handlePreworkUpdate}>
        <div className="flex justify-end">
          <>
            {moment(
              moment(batchData.batchDateTime)
                .subtract(5, "days")
                .format("YYYY-MM-DD")
            ).isSameOrAfter(moment()) ? (
              <>
                {moment(
                  moment(batchData.batchDateTime)
                    .subtract(5, "days")
                    .format("YYYY-MM-DD")
                ).diff(moment(), "days")}{" "}
                days left to send preworks.
              </>
            ) : null}
          </>
        </div>
        <div className="flex flex-col">
          <h5 className="text-xl font-semibold mt-2 mb-4 leading-none text-gray-700 ">
            Prework
          </h5>

          <div className="flex flex-wrap">
            <div className="w-1/3 px-2">
              <label className="leading-loose">Upload file</label>
              <input
                type="file"
                accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
                text/plain, application/pdf, image/*"
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                required
                multiple
                maxLength={3}
                onChange={handleFileChange}
              />
            </div>
            <div className="px-2">
              <button
                type="submit"
                className="bg-sky-500 mt-8  truncate flex justify-center items-center w-full text-white px-5 py-2 rounded-md focus:outline-none"
                disabled={loading}
              >
                {loading ? (
                  <div
                    className="inline-block h-4 w-4 animate-spin mr-2 rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      Loading...
                    </span>
                  </div>
                ) : null}
                Send
              </button>
            </div>
          </div>
        </div>
      </form>
      <h1 className="pb-2 pt-3 text-gray-900">Prework list</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-md m-4 bg-sky-600 text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                Sr.No
              </th>
              <th scope="col" className="px-6 py-3">
                File name
              </th>
              <th scope="col" className="px-6 py-3">
                File link
              </th>

              {/* <th scope="col" className="px-6 py-3">
                Action
              </th> */}
            </tr>
          </thead>
          {preworks?.map((data, i) => {
            return (
              <tbody key={i}>
                <tr className="bg-white border-b  ">
                  <td className="px-6 py-4 text-gray-900">{i + 1}</td>
                  <th
                    scope="row"
                    className="flex flex-row items-center px-6 py-4 font-medium text-gray-900  w-44"
                  >
                    {data.fileName}
                  </th>
                  <td className="px-6 py-4 text-gray-900">
                    <a href={data.file} target="blank">
                      {data.file}
                    </a>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    </>
  );
};

export default Prework;
