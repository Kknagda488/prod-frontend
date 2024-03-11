import React, { useEffect, useState } from "react";
import { CgListTree } from "react-icons/cg";
import Select from "react-select";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import moment from "moment";
import RichTextEditor from "../../../components/training/RichTextEditor";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth";

const CreateProgram = () => {
  //console.log('Session:'+session.user.userType);
  // const router = useRouter();
  const navigate = useNavigate();
  const { userData, signOut } = useAuth();
  const [classMode, setClass] = useState("1");
  const [id, setId] = useState(null);
  const [programType, setProgramType] = useState("");
  const [programOutline, setProgramOutline] = useState([]);
  function handleClassChange(event) {
    setClass(event.target.value);
  }

  function handleTypeChange(event) {
    console.log(event.target.value);
    setProgramType(event.target.value);
  }

  const options = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "15", label: "15" },
  ];

  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (option) => {
    setSelectedOption(option);
  };

  const [clientData, setClientData] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]);
  const [programId, setProgramId] = useState(null);
  const [programData, setProgramData] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programOutlineId, setProgramOutlineId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const [buttonR, setButtonR] = useState(false);
  const [buttonD, setButtonD] = useState(false);
  const [csv, setCsv] = useState([]);
  const [fileName, setFileName] = useState("");
  // const programOutline = [];

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const uploadedFileName = selectedFile.name;
      setFileName(uploadedFileName);

      uploadFileToServer(selectedFile);
      // console.log('Uploaded file name:', uploadedFileName);
      const file = uploadedFileName.split(".");
      // console.log('------------file', file[0])
      // // programOutline.concat(file[0])
      setProgramOutline([file[0]]);
    }
  };

  const [content, setContent] = useState("");

  const handleContentChange = (value) => {
    setContent(value);
  };

  const data = {
    user: [
      {
        fullName: "",
        email: "",
        phone: "",
        employeeId: "",
        branchName: "",
      },
    ],
  };

  const styles = {
    container: (base) => ({
      ...base,
      flex: 1,
    }),
    control: (base) => ({
      ...base,
      border: "1px solid rgb(209 213 219)",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid rgb(17 24 39)",
      },
    }),
    input: (base) => ({
      ...base,
      color: "rgb(75 85 99)",
      paddingLeft: "6px",
      paddingBottom: "3px",
      fontSize: "1rem",
      lineHeight: "1.25rem",
      // opacity: "0 !important",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#a1a9bb",
      paddingLeft: "6px",

      fontSize: "0.870rem",
      lineHeight: "1.25rem",
    }),
  };

  //Fetching client data
  const getClientData = () => {
    fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/clients/listofclient?filter=%7B%22search%22%3A%22%22%7D&access_token=${
        userData?.accessToken
      }`
    )
      .then(async (response) => {
        const data = await response.json();
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }

        setClientData(data.data);
        //setTotalCount(data.data.totalCount);
      })
      .catch((error) => {
        setClientData([]);
        console.error("There was an error!", error);
        if (error === "Token Expired") {
          signOut();
        }
      });
  };

  //handling client select
  const handleClient = (option) => {
    setSelectedClient(option);
    setProgramId(option.data);
    setSelectedProgram(null);
    setProjectId(null);
    setProjectData([]);
  };

  //Fetching program data
  const getProgramData = () => {
    fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/projects/listofProgramName?id=${programId}&filter=%7B%22search%22%3A%22%22%7D&access_token=${
        userData?.accessToken
      }`
    )
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }
        setProgramData(data.data);
        //setTotalCount(data.data.totalCount);
      })
      .catch((error) => {
        setProgramData([]);
        console.error("There was an error!", error);
        if (error === "Token Expired") {
          signOut();
        }
      });
  };

  const handleProgram = (option) => {
    setSelectedProgram(option);
    setProjectId(option.data);
  };

  const getProjectData = () => {
    fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/programTrainers/getprogramTrainersName?id=${projectId}&access_token=${
        userData?.accessToken
      }`
    )
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }

        console.log(data.data);
        setProjectData(data.data);
        //setTotalCount(data.data.totalCount);
      })
      .catch((error) => {
        setProjectData([]);
        console.error("There was an error!", error);
        if (error === "Token Expired") {
          signOut();
        }
      });
  };

  useEffect(() => {
    getClientData();
  }, []);

  useEffect(() => {
    if (programId) {
      getProgramData();
    }
  }, [programId]);

  useEffect(() => {
    if (projectId) {
      getProjectData();
    }
  }, [projectId]);

  const clientOptions = clientData?.map((client) => {
    return { data: client?.client_id, label: client?.client_name };
  });

  const programOptions = programData?.map((program) => {
    return {
      data: program?.project_id,
      label: `${program?.project_title} ~ ProgramId: ${program?.project_id} ~ ${
        program?.location_of_training
          ? program?.location_of_training
          : "No location allocate"
      } `,
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!csv.length) {
    //   return toast.error("Please provide announcement list");
    // }
    var formData = {};
    Array.from(e.currentTarget.elements).forEach((field) => {
      if (!field.name) return;
      formData[field.name] = field.value;
    });

    if (content) {
      formData["objectives"] = content;
    }
    // formData["programOutline"] = programOutlineId
    console.log(formData, "formData");

    // let programStartDate = moment(
    //   formData["programStartDate"],
    //   moment.ISO_8601
    // );
    // formData["programStartDate"] = programStartDate
    //   .utc()
    //   .format("YYYY-MM-DD HH:mm:ss");
    // let programEndDate = moment(formData["programEndDate"], moment.ISO_8601);
    // formData["programEndDate"] = programEndDate
    //   .utc()
    //   .format("YYYY-MM-DD HH:mm:ss");
    // let nominationDateTime = moment(
    //   formData["nominationDateTime"],
    //   moment.ISO_8601
    // );
    // formData["nominationDateTime"] = nominationDateTime
    //   .utc()
    //   .format("YYYY-MM-DD HH:mm:ss");
    // if (selectedOption.length) {
    //   formData["intervalDays"] = selectedOption
    //     .map((option) => option.value)
    //     .join(",");
    // }
    addPrgram(formData);
  };

  const addPrgram = async (formData) => {
    var response;
    let form = new URLSearchParams(Object.entries(formData)).toString();
    response = await fetch(
      `${import.meta.env.VITE_PUBLIC_URL}/api/programs/add?access_token=${
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
      if (data.status === "failure") {
        toast.error(data.msg);
      } else if (data.code == 409) {
        toast.error(data.msg);
      } else {
        // uploadCsv(data.data);
        toast.success(" Program created and emails sent successfully !!");
        navigate("/program");
      }
    }
  };

  const uploadCsv = async (id) => {
    var bulkUser = JSON.stringify(csv);
    if (bulkUser.length && id) {
      let response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/employees/addBulkEmployee?access_token=${userData?.accessToken}`,
        {
          headers: {
            "Content-Type": "application/json",
          },

          method: "POST",
          body: bulkUser,
        }
      );
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        toast.error(data?.error?.message);
      } else {
        // document.getElementById("adduser").reset();
        createAnnouncementList(id, data.data);

        // toast.success(" Program created and emails sent successfully !!");
      }
    } else {
      toast.error(data?.error?.message);
    }
  };

  const createAnnouncementList = async (id, employees) => {
    let response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/announcements/add/${id}?access_token=${userData?.accessToken}`,
      {
        headers: {
          "Content-Type": "application/json",
        },

        method: "POST",
        body: JSON.stringify(employees),
      }
    );
    if (!response.ok) {
      toast.error(data?.error?.message);
    } else {
      toast.success(" Program created and emails sent successfully !!");
      navigate("/program");
    }
  };

  console.log(selectedProgram, "selectedProgram");

  const handleClick = (e) => {
    // e.preventDefaul
    const file = fileName.split(".");
    console.log("------------file", file[0]);
    // programOutline.concat(file[0])
    setProgramOutline([file[0]]);
  };

  const uploadFileToServer = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_URL}/api/programOutlines/uploadFile/${
          selectedProgram ? selectedProgram.data : null
        }?access_token=${userData?.accessToken}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      if (response.ok) {
        toast.success("File uploaded successfully.");
        // const fileee = fileName.split('.');
        // console.log('------------file', fileee[0])
        // programOutline.concat(file[0])
        setProgramOutline([file.name]);
        setProgramOutlineId(data.data.id);
        console.log("File uploaded successfully.");
      } else {
        console.error("Failed to upload file.");
        toast.error("File uploaded successfully.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("File uploaded successfully.");
    }
  };
  return (
    <div>
      {/* <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
  <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div className="mb-4">
      <label className="block text-gray-700 font-bold mb-2" for="full-name">
        Full Name
      </label>
      <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="full-name" type="text" placeholder="Enter your full name"/>
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 font-bold mb-2" for="email">
        Email
      </label>
      <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Enter your email address"/>
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 font-bold mb-2" for="password">
        Password
      </label>
      <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Enter your password"/>
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 font-bold mb-2" for="confirm-password">
        Confirm Password
      </label>
      <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="confirm-password" type="password" placeholder="Confirm your password"/>
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 font-bold mb-2" for="message">
        Message
      </label>
      <textarea className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" rows="5" placeholder="Enter your message"></textarea>
    </div>
    <div className="flex items-center justify-center">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Submit
      </button>
    </div>
  </form>
</div> */}

      <div className="flex mt-1 flex-col w-full justify-center">
        <div className="relative py-5 w-full  px-1 ">
          <div className="relative px-4 py-2  rounded-md  bg-white ">
            <div className="w-full mx-auto">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-sky-500 rounded-full flex flex-shrink-0 justify-center items-center text-white text-2xl font-semibold">
                  <CgListTree />
                </div>
                <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                  <h2 className="leading-relaxed">Create a Program</h2>
                  <p className="text-sm text-gray-500 font-normal leading-relaxed">
                    Enter the program details.
                  </p>
                </div>
              </div>
              <form
                onSubmit={handleSubmit}
                className="divide-y divide-gray-200"
              >
                <div className="flex flex-col w-full justify-between py-8 text-base leading-6 space-x-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="flex flex-col w-full space-y-1">
                    <div className="flex flex-wrap">
                      <div className="w-1/2 px-2">
                        <label className="leading-loose">Client Name*</label>
                        <div className="relative focus-within:text-gray-600 text-gray-400">
                          <Select
                            //isMulti={true}
                            options={clientOptions}
                            onChange={handleClient}
                            value={selectedClient}
                            styles={styles}
                            placeholder="Select Client"
                            getOptionValue={(option) => option.data}
                          />
                        </div>
                        <input
                          type="text"
                          name="clientName"
                          className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Client Name"
                          required
                          defaultValue={selectedClient?.label}
                        />
                        <input
                          type="text"
                          name="clientId"
                          className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Client Name"
                          required
                          defaultValue={selectedClient?.data}
                        />
                      </div>
                      <div className="w-1/2 px-2">
                        <div className="flex justify-between w-full items-center">
                          <label className="leading-loose">Program Name*</label>
                          <label className="leading-loose">
                            Program Id:
                            {selectedProgram ? selectedProgram.data : null}
                          </label>
                        </div>
                        <div className="relative focus-within:text-gray-600 text-gray-400">
                          <Select
                            //isMulti={true}
                            options={programOptions}
                            onChange={handleProgram}
                            value={selectedProgram}
                            styles={styles}
                            placeholder="Select Program"
                            getOptionValue={(option) => option.data}
                          />
                        </div>
                        <input
                          type="text"
                          name="programName"
                          className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Program Name"
                          defaultValue={selectedProgram?.label}
                          required
                        />
                        <input
                          type="text"
                          name="programId"
                          className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Program Id"
                          defaultValue={projectId}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="w-1/2 px-2">
                        <label className="leading-loose">Program Type*</label>
                        <select
                          name="programType"
                          required
                          onChange={handleTypeChange}
                          value={programType}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value="">Select program type</option>
                          <option value="1">Open</option>
                          <option value="0">Close</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="w-1/2 px-2">
                        <label className="leading-loose">
                          Program Start Date*
                        </label>
                        <input
                          type="date"
                          name="programStartDate"
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Program  Start Date"
                          required
                        />
                      </div>
                      <div className="w-1/2 px-2">
                        <label className="leading-loose">
                          Program Start Time*
                        </label>
                        <input
                          type="time"
                          name="programStartTime"
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Program Start Time"
                          required
                        />
                      </div>
                      <div className="w-1/2 px-2">
                        <label className="leading-loose">
                          Program End Date*
                        </label>
                        <input
                          type="date"
                          name="programEndDate"
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Program End Date"
                          required
                        />
                      </div>
                      <div className="w-1/2 px-2">
                        <label className="leading-loose">
                          Program End Time*
                        </label>
                        <input
                          type="time"
                          name="programEndTime"
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Program End Time"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap">
                      {programType == "1" ? (
                        <>
                          <div className="w-1/2 px-2">
                            <label className="leading-loose">
                              Nomination End Date*
                            </label>
                            <input
                              type="date"
                              name="nominationDate"
                              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              placeholder="Program Date/Time"
                              required
                            />
                          </div>
                          <div className="w-1/2 px-2">
                            <label className="leading-loose">
                              Nomination End Time*
                            </label>
                            <input
                              type="time"
                              name="nominationTime"
                              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              placeholder="Program Date/Time"
                              required
                            />
                          </div>
                          <div className="w-1/2 px-2">
                            <label className="leading-loose">
                              Nomination Limit*
                            </label>
                            <input
                              type="number"
                              name="nominationLimit"
                              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              placeholder="Program nomination limit"
                              required
                            />
                          </div>
                          <div className="w-1/2 px-2">
                            <label className="leading-loose">
                              Program Outline
                            </label>
                            <select
                              name="programOutline"
                              value={programOutlineId}
                              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                            >
                              {/* <option value="">Select program outline</option>
                              <option value="1">MS Excel - Basic to intermediate</option>
                              <option value="2">MS Excel - Advance</option>
                              <option value="3">MS Powerpoint - Basic to Intermediate</option>
                              <option value="4">MS Powerpoint - Advance</option>
                              <option value="5">Basics Of Banking</option> */}

                              {programOutline &&
                                programOutline.map((item, index) => {
                                  return <option value={item}>{item}</option>;
                                })}
                            </select>
                          </div>

                          {/* <div className="w-1/4 px-2">
                            <label className="leading-loose"> file Type</label>
                            <select
                              name="programOutline"
                              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              required
                            >
                              <option value="">Select files type</option>
                              <option value="1">Pdf</option>
                              <option value="2">Excel</option>
                              <option value="3">Powerpoint</option>
                              {/* <option value="4">MS Powerpoint - Advance</option>
                              <option value="5">Basics Of Banking</option> */}
                          {/* </select>
                          </div> */}
                          {/* <form id="fileUploadForm" enctype="multipart/form-data"> */}
                          <div className="w-1/2 px-2">
                            <label className="leading-loose">Files</label>

                            <input
                              type="file"
                              name="files"
                              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              placeholder="choose file"
                              onChange={handleFileUpload}
                            />
                            {/* <p>{fileName && `Selected file: ${fileName}`}</p> */}
                          </div>
                          {/* <div className="w-1/4 px-2 m-[30px] "> */}
                          {/* <input type="button" className="rounded to-blue-600 p-3" name="button" value="button" />
                           */}
                          {/* <button
                              // type="submit"
                              onClick={handleClick}
                              className="bg-sky-500 flex-inline justify-center items-center text-white px-4 py-2 rounded-md focus:outline-none"
                            >upload</button>
                          </div> */}
                          {/* </form> */}
                        </>
                      ) : null}
                      <div className="w-1/2 px-2">
                        <label className="leading-loose">Training Mode*</label>
                        <select
                          name="trainingType"
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          value={classMode}
                          onChange={handleClassChange}
                          required
                        >
                          <option value="1">Class Room Training</option>
                          <option value="2">Virtual Training</option>
                        </select>
                      </div>
                      {/* {classMode === "2" && (
                        <div className="w-1/2 px-2">
                          <label className="leading-loose">
                            Classroom session link
                          </label>
                          <input
                            type="text"
                            name="meetingLink"
                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                            placeholder="Classroom session link"
                          />
                        </div>
                      )} */}
                      {classMode == "1" ? (
                        <div className="w-1/2 px-2">
                          <label className="leading-loose">Location*</label>
                          <input
                            type="text"
                            name="location"
                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                            placeholder="City"
                            required
                          />
                        </div>
                      ) : null}
                      {/* <div className="w-1/2 px-2">
                        <label className="leading-loose">Interval Days</label>
                        <Select
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          isMulti={true}
                          value={selectedOption}
                          onChange={handleChange}
                          options={options}
                          getOptionValue={(option) => option.value}
                        />
                      </div> */}
                      <div className="w-1/2 px-2">
                        <label className="leading-loose">Program Color*</label>
                        <input
                          type="color"
                          name="color"
                          className="block w-full"
                          placeholder="Program Color"
                          required
                        />
                      </div>
                      <div className="w-1/2 px-2">
                        <label className="leading-loose">Status*</label>
                        <select
                          name="status"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value="1">Active</option>
                          <option value="0">In Active</option>
                        </select>
                      </div>
                      <div className="w-1/2 px-2">
                        <label className="leading-loose">Objectives</label>
                        <RichTextEditor
                          value={content}
                          onChange={handleContentChange}
                        />
                      </div>
                      {/* {buttonD ? ( */}
                      {/* <div className="w-1/2 px-2">
                        <label className="leading-loose">
                          Announcement List
                        </label>
                        <BulkUploader setButtonR={setButtonR} setCsv={setCsv} />
                      </div> */}

                      {/* ) : null} */}
                    </div>

                    {/* <div className="w-1/2 px-2">
                      <label className="leading-loose">Venue</label>
                      <textarea
                        name=""
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Venue"
                      ></textarea>
                    </div> */}
                  </div>
                </div>
                {/* {buttonR ? ( */}
                <div className="py-4  space-x-4">
                  <button
                    type="submit"
                    className="bg-sky-500 flex-inline justify-center items-center text-white px-4 py-2 rounded-md focus:outline-none"
                  >
                    Create Program
                  </button>
                </div>
                {/* ) : null} */}
              </form>
              {/* <span className="flex w-full justify-between  items-center">
                <p className="text-sm w-fit font-normal px-6 text-gray-700">
                  *To add users in batch first download this excel file and fill
                  the required fields and then re-upload this file.
                </p>
                <div onClick={() => setButtonD(true)}>
                  <ExcelDownloder
                    data={data}
                    filename={"batchlist"}
                    type="button"
                    className="flex w-fit items-center justify-center bg-sky-500 py-2 rounded-md px-5 text-sm  text-white font-medium"
                  >
                    Download.Excel
                  </ExcelDownloder>
                </div>
              </span> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProgram;
