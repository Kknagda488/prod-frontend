import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
// import { EMAIL_SUFFIX } from "../../../components/const";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../../context/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const schema = Yup.object().shape({
  username: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Please Enter Valid First Name")
    .required("First Name is required"),
  lastName: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Please Enter Valid Last Name")
    .required("Last Name is required"),
  // email: Yup.string().required("Email is required"),
  email: Yup.string()
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please Enter Valid Email"
    )
    .required("Email is required"),
  city: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Please Enter Valid City")
    .required("City is required"),
  pin: Yup.string()
    .matches(/^\d{6}$/, "Please Enter Valid Pin")
    .required("Pin is required"),
  managerName: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Please Enter Valid Manager Name")
    .required("Manager Name is required"),
  managerEmail: Yup.string()
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please Enter Valid Manager Email"
    )
    .required("Manager Email is required"),
});

function NomineeForm() {
  const { programId } = useParams();
  let EMAIL_SUFFIX = "@wagonslearning.com";
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tenantKey = searchParams.get("key");
  const client = searchParams.get("client");

  const { userData } = useAuth();
  const [employeeId, setEmployeeId] = useState("");
  const [success, setSuccess] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  // const [longitude, setLongitude] = useState(null)
  // const [lattitude, setLattitude] = useState(null)

  const defaultValues = {
    username: "",
    lastName: "",
    email: "",
    city: "",
    pin: "",
    managerName: "",
    managerEmail: "",
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...defaultValues,
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

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
  const handleNomineeFormSubmit1 = async (e) => {
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
        `${import.meta.env.VITE_PUBLIC_URL}/api/nominees/register`,
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

  const handleNomineeFormSubmit = async (details) => {
    const nomineeDetails = {
      programId: programId,
      firstName: details?.username,
      lastName: details?.lastName,
      email: details?.email + "@wagonslearning.com",
      city: details?.city,
      pincode: details?.pin,
      managerName: details?.managerName,
      managerEmail: details?.managerEmail + "@wagonslearning.com",
    };

    const formData = new URLSearchParams();

    // Append each key-value pair to formData
    for (const key in nomineeDetails) {
      formData.append(key, nomineeDetails[key]);
    }

    const response = await fetch(
      `${import.meta.env.VITE_PUBLIC_URL}/api/nominees/register?access_token=${
        userData?.accessToken
      }`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        method: "POST",
        body: formData.toString(),
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
      // e.target.reset();
      setSuccess(true);
    }
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      programId,
      tenantKey,
    }));
  }, [programId, tenantKey]);

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

  const logoArray = [
    {
      name: "kotak",
      id: "10d08176f2e74175ba526ab1b23beecc",
      logoName: "/kotak.png",
      logoIcon: "/wagon-login.png",
    },
    {
      name: "axis",
      id: "ac7153df458aefc2a93fd1a4f7513147",
      logoName: "/axisLogo-1.png",
      logoIcon: "/wagon-login.png",
    },
    {
      name: "idfc",
      id: "uq15v1axohhui5ytm2mxhdzcuywuakj7",
      logoName: "/IDFC-logo-website.jpg",
      logoIcon: "/wagon-login.png",
    },
  ];

  return (
    <div className=" bg-white">
      <div
        className="block sm:flex justify-between items-center"
        style={{ maxWidth: "700px", margin: "40px auto" }}
      >
        {/* <img
          src="/LSS Logo.png"
          className="sm:mx-0 mx-auto"
          style={{ height: "5.5rem" }}
        ></img>
        <img
          src="/IDFC-logo-website.jpg"
          className="sm:mx-0 mx-auto"
          style={{ height: "80px" }}
        ></img> */}
        {logoArray.map(
          (logo, index) =>
            logo.id === tenantKey && (
              <>
                <img
                  key={index}
                  src={`${logo.logoIcon}`}
                  className="sm:mx-0 mx-auto"
                  style={{ height: "5.5rem" }}
                  alt={`${logo.name} Logo`}
                />
                <img
                  key={index}
                  src={`${logo.logoName}`}
                  className="sm:mx-0 mx-auto"
                  style={{ height: "5.5rem" }}
                  alt={`${logo.name} Logo`}
                />
              </>
            )
        )}
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
                  <form onSubmit={handleSubmit(handleNomineeFormSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2  gap-1">
                      <input
                        name="programId"
                        type="hidden"
                        defaultValue={programId}
                      />
                      <div className="w-full px-2">
                        <label className="leading-loose">First name*</label>
                        <input
                          name="username"
                          className="px-4 bg-white py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Enter first name"
                          control={control}
                          {...register("username")}
                        />
                        <p className="text-red-500 text-xs">
                          {errors?.username?.message}
                        </p>
                      </div>
                      <div className="w-full px-2">
                        <label className="leading-loose">Last name*</label>
                        <input
                          name="lastName"
                          className="px-4 bg-white py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Enter Last Name"
                          control={control}
                          {...register("lastName")}
                        />
                        <p className="text-red-500 text-xs">
                          {errors?.lastName?.message}
                        </p>
                      </div>
                      <div className="w-full md:col-span-2  px-2">
                        <label className="leading-loose">Email*</label>
                        <div className="flex flex-wrap items-stretch w-full relative">
                          <input
                            name="email"
                            className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded outline-none rounded-r-none px-3 relative"
                            placeholder="Enter Email"
                            control={control}
                            {...register("email")}
                          />
                        </div>
                        <p className="text-red-500 text-xs">
                          {errors?.email?.message}
                        </p>
                      </div>
                      <div className="w-full px-2">
                        <label className="leading-loose">City*</label>
                        <input
                          name="city"
                          className="px-4 bg-white py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Enter City"
                          control={control}
                          {...register("city")}
                        />
                        <p className="text-red-500 text-xs">
                          {errors?.city?.message}
                        </p>
                      </div>
                      <div className="w-full px-2">
                        <label className="leading-loose">Pincode*</label>
                        <input
                          name="pin"
                          className="px-4 bg-white py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Enter Pincode"
                          control={control}
                          {...register("pin")}
                        />
                        <p className="text-red-500 text-xs">
                          {errors?.pin?.message}
                        </p>
                      </div>
                      <div className="w-full   px-2">
                        <label className="leading-loose">Manager name*</label>
                        <input
                          name="managerName"
                          className="px-4 bg-white py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Enter Manager Name"
                          control={control}
                          {...register("managerName")}
                        />
                        <p className="text-red-500 text-xs">
                          {errors?.managerName?.message}
                        </p>
                      </div>
                      <div className="w-full   px-2">
                        <label className="leading-loose">Manager email*</label>
                        <div className="flex flex-wrap items-stretch w-full relative">
                          <input
                            name="managerEmail"
                            className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded outline-none rounded-r-none px-3 relative"
                            placeholder="Enter Manager Email"
                            control={control}
                            {...register("managerEmail")}
                          />
                        </div>
                        <p className="text-red-500 text-xs">
                          {errors?.managerEmail?.message}
                        </p>
                      </div>
                    </div>

                    <div className="py-4 px-2 space-x-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`${
                          tenantKey === "10d08176f2e74175ba526ab1b23beecc"
                            ? "bg-[#003366]"
                            : tenantKey === "ac7153df458aefc2a93fd1a4f7513147"
                            ? "bg-[#97144C]"
                            : tenantKey === "uq15v1axohhui5ytm2mxhdzcuywuakj7"
                            ? "bg-[#9d1d27]"
                            : ""
                        } flex-inline justify-center items-center text-white px-4 py-2 rounded-md focus:outline-none`}
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
