import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/auth";
function AttendenceForm() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { userData } = useAuth();
  const programType = queryParams.get("programType");
  const tenantKey = queryParams.get("key");
  const { batchId } = useParams();
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState("");

  const [employee, setEmployee] = useState(null);
  const [attendanceModel, setAttendanceModel] = useState(false);

  useEffect(() => {
    // Use an effect to set the client based on tenantKey only once when the component mounts
    if (tenantKey === "10d08176f2e74175ba526ab1b23beecc") {
      setClient("kotak");
    } else if (tenantKey === "ac7153df458aefc2a93fd1a4f7513147") {
      setClient("axis");
    } else if (tenantKey === "uq15v1axohhui5ytm2mxhdzcuywuakj7") {
      setClient("idfc");
    }
  }, [tenantKey]);

  const handleAttenceFormSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!employee) {
      toast.error("Employee not found");
    } else {
      try {
        let form = new URLSearchParams({
          email: employee.email,
          batchId: batchId,
        }).toString();
        // return console.log(form);
        const response = await fetch(
          `${
            import.meta.env.VITE_PUBLIC_URL
          }/api/batchAttendences/addAttendence`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },

            method: "POST",
            body: form,
          }
        );
        const data = await response.json();
        if (data.status === "failure") {
          return toast.error(data.msg);
        }
        toast.success("Attendence submitted successful.");
        e.target.reset();
        setEmail("");
        setEmployee(null);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };
  const fetchIdfcEmployeeDetails = async (e) => {
    setEmployee(null);
    e.preventDefault();
    try {
      const params = encodeURIComponent(JSON.stringify({ email, batchId }));
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/nominees/getByEmail?filter=${params}`
      );
      const data = await response.json();
      if (data.status === "failure") {
        toast.error(data.msg);
      } else if (Object.keys(data.data).length) {
        console.log(data, "fetchEmployeeDetails");
        setEmployee({
          email: data.data.email,
          name: data.data.firstName + " " + data.data.lastName,
        });

        if (data.status === "failure") {
          toast.error(data.msg);
        }
      } else {
        if (data.status === "failure") {
          toast.error(data.msg);
        }
        throw Error("Employee not found");
      }
    } catch (error) {
      toast.error(error?.msg);
    }
  };

  const handleAttenceIDFCForm = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!employee) {
      toast.error("Employee not found");
    } else {
      try {
        let form = new URLSearchParams({
          email: employee.email,
          batchId: batchId,
        }).toString();
        // return console.log(form);
        const response = await fetch(
          `${
            import.meta.env.VITE_PUBLIC_URL
          }/api/batchAttendences/addAttendenceforIdfc  `,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },

            method: "POST",
            body: form,
          }
        );
        const data = await response.json();
        if (data.status === "failure") {
          return toast.error(data.msg);
        }
        toast.success("Attendence submitted successful.");
        e.target.reset();
        setEmail("");
        setEmployee(null);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchAxisEmployeeDetails = async (e) => {
    setEmployee(null);
    e.preventDefault();
    try {
      const params = encodeURIComponent(
        JSON.stringify({ employeeId, batchId })
      );
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/nominees/getNomineeById?filter=${params?.trim()}`
      );
      const data = await response.json();
      if (data.status === "success") {
        if (Object.keys(data.data).length !== 0) {
          console.log(data, "fetchEmployeeDetails");
          setEmployee({
            email: data.data.email,
            name: data.data.firstName + " " + data.data.lastName,
          });
          if (client === "axis") {
            addAttendenceFormReq(e);
          }
        } else {
          toast.error("Kindly Check Your Employee Id Once Again");
        }
      } else {
        throw Error("Kindly Check Your Employee Id Once Again");
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const addAttendenceFormReq = async (e) => {
    e.preventDefault();
    try {
      let form = new URLSearchParams({
        email: email,
        employeeId: employeeId,
        batchId: batchId,
      }).toString();
      // return console.log(form);
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/batchAttendences/addAttendenceforAxis`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },

          method: "POST",
          body: form,
        }
      );
      const data = await response.json();
      if (data.status === "failure") {
        return toast.error(data.msg);
      } else {
        if (client === "kotak") {
          toast.success(data?.msg);
        } else {
          setAttendanceModel(true);
        }
        // toast.success("Attendence submitted successful.");
      }
      // e.target.reset();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const closeAttendanceModule = () => {
    setAttendanceModel(false);
    setEmail("");
    setEmployee(null);
  };

  return (
    <>
      {client === "idfc" ? (
        <div>
          <div className="flex justify-center my-5">
            <div className="flex mb-4 sm:flex-row flex-col sm:w-full w-[50]  items-center justify-center sm:justify-around px-10">
              {programType == "1" ? (
                <>
                  <img
                    className="h-auto sm:mb-0 mb-2"
                    style={{ width: "12rem" }}
                    src="/llslogo.png"
                  />
                </>
              ) : (
                <>
                  <img
                    className="h-auto sm:mb-0 mb-2"
                    style={{ width: "5rem" }}
                    src="/Retail Pro Logo.png"
                  />
                </>
              )}
              <img
                className="w-40 h-auto sm:mb-0 mb-3 mt-2 sm:mt-0"
                src="/IDFC-logo-website.jpg"
              />
            </div>
          </div>
          {/* <div className="flex justify-center my-1">
        <img src="/IDFC-logo-website.jpg" style={{ width: "250px" }}></img>
      </div> */}
          <div
            style={{ paddingBottom: "200px" }}
            className="flex justify-center"
          >
            <div className="flex items-center justify-center p-5">
              <div className="rounded overflow-hidden shadow-lg p-5 bg-[white] ">
                <h1 className="text-xl text-700">Attendence Form</h1>
                <br />
                <form onSubmit={fetchIdfcEmployeeDetails}>
                  <div className="w-100 flex flex-wrap">
                    <div className="px-2">
                      <label className="leading-loose">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Provide Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="py-1 mt-7 space-x-4">
                      <button
                        type="submit"
                        className="bg-[#9d1d27] flex-inline justify-center items-center text-white px-4 py-1 rounded-md focus:outline-none"
                      >
                        Find
                      </button>
                    </div>
                  </div>
                </form>
                <form onSubmit={handleAttenceIDFCForm}>
                  `{" "}
                  <div className="px-2">
                    <label className="leading-loose">Full name</label>
                    <input
                      name="fullName"
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      placeholder="Provide full name"
                      required
                      disabled
                      // readOnly
                      defaultValue={employee?.name}
                    />
                  </div>
                  `
                  <div className="px-2">
                    <label className="leading-loose">Email</label>
                    <input
                      name="email"
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      placeholder="Provide email"
                      required
                      disabled
                      defaultValue={employee?.email}
                    />
                  </div>
                  {/* <div className="px-2">
                <label className="leading-loose">Phone</label>
                <input
                  name="phone"
                  className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                  placeholder="Provide phone"
                  disabled
                  defaultValue={employee?.mobileNo}
                />
              </div> */}
                  {/* <div className="w-1/2 px-2">
              <label className="leading-loose">Branch Name</label>
              <input
                name="branchName"
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                placeholder="Provide employee id"
                required
                readOnly
                defaultValue={employee.branchName}
              />
            </div> */}
                  <div className="py-4  space-x-4 px-2">
                    <button
                      type="submit"
                      className="bg-[#9d1d27] flex-inline justify-center items-center text-white px-4 py-2 rounded-md focus:outline-none"
                      disabled={loading}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {client === "axis" ? (
        <div>
          <div className="flex justify-center my-5">
            <div className="flex mb-4 sm:flex-row flex-col sm:w-full w-[50]  items-center justify-center sm:justify-around px-10">
              <img
                className="h-auto sm:mb-0 mb-2"
                style={{ width: "12rem" }}
                src="/wagon-login.png"
              />
              <img
                className="h-auto sm:mb-0 mb-2"
                style={{ width: "10rem" }}
                src="/axisLogo-1.png"
              />
            </div>
          </div>
          {/* <div className="flex justify-center my-1">
        <img src="/IDFC-logo-website.jpg" style={{ width: "250px" }}></img>
      </div> */}
          <div
            style={{ paddingBottom: "200px" }}
            className="flex justify-center"
          >
            <div className="flex items-center justify-center p-5">
              <div className="rounded overflow-hidden shadow-lg p-5 bg-[white] shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                <h1 className="text-xl text-700">Attendence Form</h1>
                <br />
                {/* <form onSubmit={fetchEmployeeDetails}> */}
                <form onSubmit={fetchAxisEmployeeDetails}>
                  <div className="w-100 flex flex-wrap">
                    <div className="md:px-2 sm:px-0">
                      <label className="leading-loose">Employee Id</label>
                      <input
                        type="text"
                        name="email"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Provide Employee Id"
                        required
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                      />
                    </div>
                    <div className="py-1 mt-7 space-x-4">
                      <button
                        type="submit"
                        className="bg-[#97144c] flex-inline justify-center items-center text-white px-4 py-1 rounded-md focus:outline-none"
                      >
                        Find
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {attendanceModel && (
            <div className="fixed top-0 left-0 w-full h-full flex items-start justify-center bg-gray-800/40 p-4">
              <div className="bg-white w-full max-w-md shadow-md px-4 sm:p-6 sm:max-w-lg sm:w-full mt-10 sm:mx-auto rounded-lg">
                <div className="flex justify-end items-end p-2">
                  <IoClose
                    onClick={closeAttendanceModule}
                    className="cursor-pointer text-2xl font-semibold text-black"
                  />
                </div>
                <div className="px-4">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-600">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlnx="http://www.w.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <div className="rounded overflow-hidden">
                    <p className="font-bold text-gray-800 md:text-lg sm:text-sm flex justify-center text-center">
                      Attendance Submitted Successfully.
                    </p>
                    <p className="my-4 text-gray-900 dark:text-gray-400 text-center">
                      Thank you! The attendance for{" "}
                      <span className="font-medium">{employee?.name}</span> With
                      Email{" "}
                      <span className="font-medium">{employee?.email}</span> has
                      been successfully submitted.
                    </p>
                    <button
                      type="button"
                      className="py-3 my-2 mx-auto px-4 rounded-lg flex items-center gap-x-2 text-sm font-semibold bg-green-600 text-white disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                      onClick={closeAttendanceModule}
                    >
                      Confirm
                    </button>

                    <br />
                    {/* Add your form fields and content here */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {client === "kotak" ? (
        <div>
          <div className="flex justify-center my-5">
            <div className="flex mb-4 sm:flex-row flex-col sm:w-full w-[50]  items-center justify-center sm:justify-around px-10">
              <img
                className="h-auto sm:mb-0 mb-2"
                style={{ width: "12rem" }}
                src="/wagon-login.png"
              />
              <img
                className="h-auto sm:mb-0 mb-2"
                style={{ width: "10rem" }}
                src="/kotak.png"
              />
            </div>
          </div>
          {/* <div className="flex justify-center my-1">
        <img src="/IDFC-logo-website.jpg" style={{ width: "250px" }}></img>
      </div> */}
          <div
            style={{ paddingBottom: "200px" }}
            className="flex justify-center"
          >
            <div className="flex items-center justify-center p-5">
              <div className="rounded overflow-hidden shadow-lg p-5 bg-[white] shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                <h1 className="text-xl text-700">Attendence Form</h1>
                <br />
                {/* <form onSubmit={fetchEmployeeDetails}> */}
                <form onSubmit={fetchAxisEmployeeDetails}>
                  <div className="w-100 flex flex-wrap">
                    <div className="md:px-2 sm:px-0">
                      <label className="leading-loose">Employee Id</label>
                      <input
                        type="text"
                        name="email"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Provide Employee Id"
                        required
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                      />
                    </div>
                    <div className="py-1 mt-7 space-x-4">
                      <button
                        type="submit"
                        className="bg-[#003366] flex-inline justify-center items-center text-white px-4 py-1 rounded-md focus:outline-none"
                      >
                        Find
                      </button>
                    </div>
                  </div>
                </form>
                <form onSubmit={addAttendenceFormReq}>
                  `{" "}
                  <div className="px-2">
                    <label className="leading-loose">Full name</label>
                    <input
                      name="fullName"
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      placeholder="Provide full name"
                      required
                      disabled
                      // readOnly
                      defaultValue={employee?.name}
                    />
                  </div>
                  <div className="py-4  space-x-4 px-2">
                    <button
                      type="submit"
                      className="bg-[#003366] flex-inline justify-center items-center text-white px-4 py-2 rounded-md focus:outline-none"
                      disabled={loading}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default AttendenceForm;
