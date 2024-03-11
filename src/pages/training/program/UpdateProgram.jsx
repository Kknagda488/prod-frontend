import React, { useEffect, useState } from "react";
// import { getSession, signOut } from "next-auth/react";
import { CgListTree } from "react-icons/cg";
import Select from "react-select";
// import { useExcelDownloder } from "react-xls";
// import BulkUploader from "../../components/adminComponents/parts/BulkUploader";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
// import { useRouter } from "next/router";
import moment from "moment";
import RichTextEditor from "../../../components/training/RichTextEditor";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/auth";
// import { response } from "express";

const UpdateProgram = () => {
  //console.log('Session:'+session.user.userType);
  // const router = useRouter();
  // const [batchId, setBatchId] = useState(router.query.batchId);
  const { id } = useParams();
  console.log("--------------id", id);
  const navigate = useNavigate();
  const { userData, signOut } = useAuth();
  const [programId, setProgramId] = useState(id);
  // console.log(programId);
  const [programOutline, setProgramOutline] = useState([]);

  const [programOutlineId, setProgramOutlineId] = useState(null);
  const [classMode, setClass] = useState("1");
  const [programType, setProgramType] = useState("");
  function handleClassChange(event) {
    setClass(event.target.value);
  }

  function handleTypeChange(event) {
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
  const [selectedClient, setSelectedClient] = useState(null);
  const [programData, setProgramData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [program, setProgram] = useState({});
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const [buttonR, setButtonR] = useState(false);
  const [buttonD, setButtonD] = useState(false);
  const [csv, setCsv] = useState([]);
  // const { ExcelDownloder, Type } = useExcelDownloder();
  const [color, setColor] = useState("");

  const [content, setContent] = useState("");

  const handleContentChange = (value) => {
    setContent(value);
  };
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const uploadedFileName = selectedFile.name;
      setFileName(uploadedFileName);

      uploadFileToServer(selectedFile);
      // console.log('Uploaded file name:', uploadedFileName);
      // const file = uploadedFileName.split('.');
      // console.log('------------file', file[0])
      // // programOutline.concat(file[0])
      // setProgramOutline([file[0]])
    }
  };

  const uploadFileToServer = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_URL}/api/programOutlines/updateFile/${
          selectedProgram ? selectedProgram.data : null
        }?access_token=${userData?.accessToken}`,
        {
          method: "PUT",
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
        console.log("File updated successfully.");
      } else {
        console.error("Failed to updated file.");
        toast.error("File updated successfully.");
      }
    } catch (error) {
      console.error("Error updated file:", error);
      toast.error("File updated Faild.");
    }
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
    // setProgramId(option.data);
    setSelectedProgram(null);
    setProjectId(null);
    setProjectData([]);
  };

  //Fetching program data
  const getProgramData = () => {
    fetch(
      `${import.meta.env.VITE_PUBLIC_URL}/api/projects/listofProgramName?id=${
        selectedClient.data
      }&filter=%7B%22search%22%3A%22%22%7D&access_token=${
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
        // console.log(data.data);
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

  useEffect(() => {
    getClientData();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      getProgramData();
    }
  }, [selectedClient]);

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

    var formData = {};
    Array.from(e.currentTarget.elements).forEach((field) => {
      if (!field.name) return;
      formData[field.name] = field.value;
    });

    if (content) {
      formData["objectives"] = content;
    }
    // if (programType == "0") {
    //   formData["nominationDate"] = null;
    //   formData["nominationTime"] = null;
    // }
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

    updateProgram(formData);
  };

  const updateProgram = async (formData) => {
    try {
      var response;
      let form = new URLSearchParams(Object.entries(formData)).toString();
      response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/programs/edit/${programId}?access_token=${userData?.accessToken}`,
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
        if (data.code === 404) {
          toast.error(data.msg);
        } else if (data.status === "failure") {
          toast.error(data.msg);
        } else {
          // uploadCsv(data.data);
          toast.success("Program updated successfully!!");
          navigate("/program");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getOneProgram = () => {
    fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/programs/getProgramById/${programId}?access_token=${
        userData?.accessToken
      }`
    )
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          throw new Error(error);
        }
        console.log(data.data);
        setProgram(data.data);
        if (data.data.objectives) {
          setContent(data.data.objectives);
        }
        setColor(data.data.color);
      })
      .catch((error) => {
        setProgram({});
        console.error("There was an error!", error);
        if (error === "Token Expired" || error === "Malformed User") {
          signOut();
        }
      });
  };

  const handleProgramDate = async (e) => {
    e.preventDefault();
    try {
      let formData = {};
      Array.from(e.currentTarget.elements).forEach((field) => {
        if (!field.name) return;
        formData[field.name] = field.value;
      });
      let form = new URLSearchParams(Object.entries(formData)).toString();
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/programs/updateProgramTime/${programId}?access_token=${
          userData?.accessToken
        }`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },

          method: "PUT",
          body: form,
        }
      );
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        toast.error(data?.error?.message);
        return Promise.reject(data?.error);
      } else if (data.code === 400) {
        toast.error(data.msg);
      } else {
        toast.success(data.msg);
      }
    } catch (error) {
      console.error("There was an error!", error);
      if (error === "Token Expired" || error === "Malformed User") {
        signOut();
      }
    }
  };

  useEffect(() => {
    if (programId) {
      getOneProgram();
    }
  }, [programId]);
  // console.log(selectedOption)
  useEffect(() => {
    if (program) {
      if (program.intervalDays) {
        setSelectedOption(() => {
          return program.intervalDays.split(",").map((day) => ({
            label: day,
            value: day,
          }));
        });
      }
      if (program.clientId) {
        setSelectedClient({
          label: program.clientName,
          data: program.clientId,
        });
      }
      if (program.programId) {
        // setProgramOutlineId( program.programName)
        setSelectedProgram({
          label:
            program.programName +
            " ~ ProgramId: " +
            program.programId +
            " ~ " +
            program.location,
          data: program.programId,
        });
      }
      setClass(program.trainingType);
      setProgramType(program.programType);
    }
  }, [program]);

  console.log(selectedProgram, "program");
  return (
    <div>
      <div className="flex mt-5 flex-col w-full justify-center  ">
        <div className="relative py-5 w-full  px-1 ">
          <div className="relative px-4 py-2  rounded-md  bg-white ">
            <div className="w-full mx-auto">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-sky-500 rounded-full flex flex-shrink-0 justify-center items-center text-white text-2xl font-semibold">
                  <CgListTree />
                </div>
                <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                  <h2 className="leading-relaxed">Update Program</h2>
                  <p className="text-gray-500 font-normal leading-relaxed text-lg">
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
                        <label className="leading-loose">Client Name</label>
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
                          <label className="leading-loose">Program Name</label>
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
                        />
                        <input
                          type="text"
                          name="programId"
                          className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Program Id"
                          defaultValue={selectedProgram?.data}
                        />
                        {/* <h1>{selectedProgram?.data}</h1>
                         */}
                      </div>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="w-1/2 px-2">
                        <label className="leading-loose">Program Type</label>
                        <select
                          name="programType"
                          required
                          onChange={handleTypeChange}
                          value={programType}
                          defaultValue={program?.programType}
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
                          Program Start Date
                        </label>
                        <input
                          type="date"
                          name="programStartDate"
                          required
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Program Start Date"
                          defaultValue={
                            program?.programStartDate
                              ? moment(program?.programStartDate).format(
                                  "YYYY-MM-DD"
                                )
                              : ""
                          }
                        />
                      </div>
                      <div className="w-1/2 px-2">
                        <label className="leading-loose">
                          Program Start Time
                        </label>
                        <input
                          type="time"
                          name="programStartTime"
                          required
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Program Start Time"
                          defaultValue={program?.programStartTime}
                        />
                      </div>
                      <div className="w-1/2 px-2">
                        <label className="leading-loose">
                          Program End Date
                        </label>
                        <input
                          type="date"
                          name="programEndDate"
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Program End Date"
                          required
                          defaultValue={
                            program?.programEndDate
                              ? moment(program?.programEndDate).format(
                                  "YYYY-MM-DD"
                                )
                              : ""
                          }
                        />
                      </div>
                      <div className="w-1/2 px-2">
                        <label className="leading-loose">
                          Program End Time
                        </label>
                        <input
                          type="time"
                          name="programEndTime"
                          required
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Program End Date"
                          defaultValue={program?.programEndTime}
                        />
                      </div>
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
                              placeholder="Program Date"
                              required
                              defaultValue={
                                program.nominationDate
                                  ? moment(program.nominationDate).format(
                                      "YYYY-MM-DD"
                                    )
                                  : ""
                              }
                            />
                          </div>
                          <div className="w-1/2 px-2">
                            <label className="leading-loose">
                              Nomination End Time*
                            </label>
                            <input
                              type="time"
                              name="nominationTime"
                              required
                              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              placeholder="Program Time"
                              defaultValue={program.nominationTime}
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
                              defaultValue={program.nominationLimit}
                              required
                            />
                          </div>
                          <div className="w-1/2 px-2">
                            <label className="leading-loose">
                              Program Outline
                            </label>
                            <select
                              name="programOutline"
                              defaultValue={program.programOutline}
                              value={programOutlineId}
                              // required
                              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                            >
                              <option value="">{program.programOutline}</option>
                              {programOutline &&
                                programOutline.map((item, index) => {
                                  return <option value={item}>{item}</option>;
                                })}
                              {/* <option value="">{program.programOutline}</option> */}
                              {/* <option value="1">MS Excel - Basic to intermediate</option>
                              <option value="2">MS Excel - Advance</option>
                              <option value="3">MS Powerpoint - Basic to Intermediate</option>
                              <option value="4">MS Powerpoint - Advance</option>
                              <option value="5">Basics Of Banking</option> */}
                            </select>
                          </div>
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
                        </>
                      ) : null}
                      <div className="w-1/2 px-2">
                        <label className="leading-loose">Training Mode</label>
                        <select
                          name="trainingType"
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          value={classMode}
                          required
                          onChange={handleClassChange}
                          defaultValue={program?.trainingType}
                        >
                          <option value="1">Class Room Training</option>
                          <option value="2">Virtual Training</option>
                        </select>
                      </div>
                      {classMode == "1" ? (
                        <div className="w-1/2 px-2">
                          <label className="leading-loose">Location</label>
                          <input
                            type="text"
                            name="location"
                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                            placeholder="City"
                            defaultValue={program?.location}
                          />
                        </div>
                      ) : null}
                      <div className="w-1/2 px-2">
                        <label className="leading-loose">Program Color</label>
                        <input
                          type="color"
                          name="color"
                          className="block w-full"
                          placeholder="Program Color"
                          required
                          onChange={(e) => {
                            setColor(e.target.value);
                          }}
                          value={color}
                        />
                      </div>
                      <div className="w-1/2 px-2">
                        <label className="leading-loose">Status</label>
                        <select
                          placeholder="Select status"
                          name="status"
                          required
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option
                            value="1"
                            selected={program?.status == 1 ? true : false}
                          >
                            Active
                          </option>
                          <option
                            value="0"
                            selected={program?.status == 0 ? true : false}
                          >
                            In Active
                          </option>
                        </select>
                      </div>{" "}
                      <div className="w-1/2 px-2">
                        <label className="leading-loose">Objectives</label>
                        <RichTextEditor
                          value={content}
                          onChange={handleContentChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="py-4  space-x-4">
                  <button
                    type="submit"
                    className="bg-sky-500 flex-inline justify-center items-center text-white px-4 py-2 rounded-md focus:outline-none"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProgram;
