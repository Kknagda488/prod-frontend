import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EMAIL_SUFFIX } from "../../../components/const";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/auth";

function NomineeForm() {
  const { programId } = useParams();
  const { userData } = useAuth();
  const [employeeId, setEmployeeId] = useState("");
  const [success, setSuccess] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  // const [longitude, setLongitude] = useState(null)
  // const [lattitude, setLattitude] = useState(null)
  const [formData, setFormData] = useState({
    programId,
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    pincode: "",
    managerName: "",
    managerEmail: "",
  });
  const handleNomineeFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let form = { ...formData };
      // Array.from(e.currentTarget.elements).forEach((field) => {
      //   if (!field.name) return;
      //   if (field.name == "email" || field.name == "managerEmail") {
      //     var pattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      //     const isValid = pattern.test(field.value.trim());
      //     if (isValid) {
      //       const index = field.value.indexOf("@");
      //       formData[field.name] =
      //         field.value.substr(0, index).trim() + EMAIL_SUFFIX;
      //     } else {
      //       formData[field.name] = field.value.trim() + EMAIL_SUFFIX;
      //     }
      //   } else {
      //     formData[field.name] = field.value;
      //   }
      // });
      var pattern = /^[^@]+$/;
      // const isEmail = pattern.test(form["email"].trim());
      // if (!isEmail) {
      //   toast.error("Invalid Email");
      //   return;
      // }
      // const isEmail2 = pattern.test(form["managerEmail"].trim());
      // if (!isEmail2) {
      //   toast.error("Invalid manager Email");
      //   return;
      // }
      form["email"] = form["email"].trim() + EMAIL_SUFFIX;
      form["managerEmail"] = form["managerEmail"].trim() + EMAIL_SUFFIX;
      // form["lattitude"] = lattitude
      // form["longitude"] = longitude

      const formFields = new URLSearchParams(Object.entries(form)).toString();
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/nominees/register?access_token=${userData?.accessToken}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },

          method: "POST",
          body: formFields,
        }
      );
      const data = await response.json();
      if (!response.ok) {
        const error = (data && data.msg) || response.statusText;
        return toast.error(error);
      } else if (data.status === "failure") {
        if (data.code == 409) {
          setIsError(true);
          setErrMsg(data?.msg);
          return;
        } else {
          toast.error(data?.msg);
        }
      } else {
        toast.success("Register successful.");
        e.target.reset();
        setSuccess(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      programId,
    }));
  }, [programId]);

  // useEffect(() => {
  //   const getLocation = () => {
  //     navigator.geolocation.getCurrentPosition(position => {
  //       setLattitude(position.coords.latitude)
  //       setLongitude(position.coords.longitude)
  //     }, err => console.log(err))
  //   }
  //   getLocation()
  // },[])
  // const fetchEmployeeDetails = async (e) => {
  //   setEmployee(null);
  //   e.preventDefault();
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_URL}/api/employees/getEmployeeDetails/${employeeId}`
  //     );
  //     const data = await response.json();
  //     if (data.data) {
  //       setEmployee(data.data);
  //     } else {
  //       throw Error("Employee not found");
  //     }
  //   } catch (error) {
  //     toast.error(error?.message);
  //   }
  // };

  const handeInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <div className=" bg-white">
      <div
        className="block sm:flex justify-between items-center"
        style={{ maxWidth: "700px", margin: "40px auto" }}
      >
        <img
          src="/LSS Logo.png"
          className="sm:mx-0 mx-auto"
          style={{ height: "5.5rem" }}
        ></img>
        <img
          src="/IDFC-logo-website.jpg"
          className="sm:mx-0 mx-auto"
          style={{ height: "80px" }}
        ></img>
      </div>
      <div
        className="flex justify-center"
        style={{ paddingBottom: "260px", maxWidth: "700px", margin: "0 auto" }}
      >
        <div>
          {!success && !isError ? (
            <div style={{ marginTop: "-20px" }}>
              <div className="flex items-center justify-center p-5">
                <div className="rounded overflow-hidden shadow-lg p-5 bg-[white] ">
                  <h1 className="text-xl text-700">Nominee Registration</h1>
                  <br />
                  {/* <form onSubmit={fetchEmployeeDetails}>
                <div className="flex flex-wrap">
                  <div className="w-3/2 px-2">
                    <label className="leading-loose">Employee Id</label>
                    <input
                      name="employeeId"
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
                      className="bg-sky-500 flex-inline justify-center items-center text-white px-4 py-1 rounded-md focus:outline-none"
                    >
                      Find
                    </button>
                  </div>
                </div>
              </form> */}
                  <form onSubmit={handleNomineeFormSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2  gap-1">
                      <input
                        name="programId"
                        type="hidden"
                        defaultValue={programId}
                      />
                      <div className="w-full px-2">
                        <label className="leading-loose">First name*</label>
                        <input
                          name="firstName"
                          className="px-4 bg-white py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Provide first name"
                          value={formData.firstName}
                          onChange={handeInputChange}
                          required
                        />
                      </div>
                      <div className="w-full px-2">
                        <label className="leading-loose">Last name*</label>
                        <input
                          name="lastName"
                          className="px-4 bg-white py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Provide last name"
                          value={formData.lastName}
                          onChange={handeInputChange}
                          required
                        />
                      </div>
                      <div className="w-full md:col-span-2  px-2">
                        <label className="leading-loose">Email*</label>
                        <div className="flex flex-wrap items-stretch w-full relative">
                          <input
                            type="text"
                            name="email"
                            className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded outline-none rounded-r-none px-3 relative"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handeInputChange}
                            required
                          ></input>
                          <div className="flex -mr-px">
                            <span className="flex items-center leading-normal bg-grey-lighter rounded rounded-l-none border border-l-0 border-grey-light px-3 whitespace-no-wrap text-grey-dark text-sm">
                              {EMAIL_SUFFIX}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full px-2">
                        <label className="leading-loose">City*</label>
                        <input
                          name="city"
                          className="px-4 bg-white py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Provide city"
                          value={formData.city}
                          onChange={handeInputChange}
                          required
                        />
                      </div>
                      <div className="w-full px-2">
                        <label className="leading-loose">Pincode*</label>
                        <input
                          type="number"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handeInputChange}
                          className="px-4 bg-white py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Provide pincode"
                          required
                        />
                      </div>
                      <div className="w-full   px-2">
                        <label className="leading-loose">Manager name*</label>
                        <input
                          name="managerName"
                          value={formData.managerName}
                          onChange={handeInputChange}
                          className="px-4 bg-white py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Provide manager name"
                          required
                        />
                      </div>
                      <div className="w-full   px-2">
                        <label className="leading-loose">Manager email*</label>
                        <div className="flex flex-wrap items-stretch w-full mb-4 relative">
                          <input
                            type="text"
                            name="managerEmail"
                            value={formData.managerEmail}
                            onChange={handeInputChange}
                            className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded outline-none rounded-r-none px-3 relative"
                            placeholder="Manager email"
                            required
                          ></input>
                          <div className="flex -mr-px">
                            <span className="flex items-center leading-normal bg-grey-lighter rounded rounded-l-none border border-l-0 border-grey-light px-3 whitespace-no-wrap text-grey-dark text-sm">
                              {EMAIL_SUFFIX}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className=" text-red-500 text-xs mt-1 px-2">
                      Note: Please provide text before @ in a email field. eg.
                      John.doe instead of John.doe{EMAIL_SUFFIX}
                    </div>
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
                    <div className="py-4 px-2 space-x-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#9d1d27] flex-inline justify-center items-center text-white px-4 py-2 rounded-md focus:outline-none"
                      >
                        Register
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : null}
          {success && (
            <div>
              <div className="flex items-center justify-center">
                <div className="rounded overflow-hidden shadow-lg bg-[white] p-5 ">
                  <div className="flex flex-col items-center space-y-2 ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-green-600 w-28 h-28"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h2 className="text-xl text-center font-bold">
                      Registration completed successfully!
                    </h2>
                    <br />
                  </div>
                </div>
              </div>
            </div>
          )}

          {isError ? (
            <div>
              <div className="flex items-center justify-center">
                <div className="rounded overflow-hidden shadow-lg bg-[white] p-5 ">
                  <div className="flex flex-col items-center space-y-3 ">
                    <AiOutlineCloseCircle size={100} color="#b21c29" />
                    <h2 className="text-lg text-center font-bold">{errMsg}</h2>
                    <br />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default NomineeForm;
