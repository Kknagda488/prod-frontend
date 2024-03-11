import moment from "moment";
import React, { useEffect, useState } from "react";
import { BsFileEarmarkPdf, BsDownload } from "react-icons/bs";
import { AiOutlineWarning } from "react-icons/ai";
import { useParams } from "react-router";
import { useAuth } from "../../../../context/auth";

function ProgramList() {
  const { tenantKey } = useParams();
  // console.log("tenantKey1", tenantKey);
  const [programs, setPrograms] = useState([]);
  const { userData } = useAuth();
  // const [program, setProgram] = useState(null);

  const [programGrp, setProgramGrp] = useState({});
  const [options, setOptions] = useState([]);
  const [fileUrl, setFielUrl] = useState("");
  const [client, setClient] = useState("");
  const [id, setId] = useState(null);

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
  const fetchPrograms = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/programs/listByCompany/${tenantKey}`
      );
      const result = await response.json();
      var obj = {};
      var newOptions = []; // Initialize a new array to hold options
      result.data.forEach((program) => {
        if (obj[program.programId]) {
          obj[program.programId].push(program);
        } else {
          obj[program.programId] = [program];
          newOptions.push({
            label: program.programName,
            value: program.programId,
          });
        }
      });
      setOptions(newOptions); // Set newOptions array to options state
      setProgramGrp(obj);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPrgramOutineURl = async (programid) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/programOutlines/getFile/${programid}?access_token=${
          userData?.accessToken
        }`
      );
      const result = await response.json();
      if (response.ok) {
        const urlWithoutParams = result.data.fileUrl.split("?")[0];
        // setFielUrl(urlWithoutParams)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectChange = (e) => {
    // fetchPrograms();

    const programId = e.target.value;
    setPrograms(programGrp[programId]);
    // fetchPrgramOutineURl(programId)
  };
  useEffect(() => {
    if (tenantKey) {
      // fetchPrograms();
    }
  }, [tenantKey]);
  return (
    <div className="flex  relative flex-col w-full min-h-screen  bg-white">
      <div className="block sm:flex justify-between items-center mt-8 mx-3">
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
      <div className="flex justify-center py-5 mb-5">
        <div>
          <p className="font-medium mb-1">Select program</p>
          <select
            className="bg-gray-50 border py-2  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none block w-80 p-2"
            onChange={handleSelectChange}
            onClick={fetchPrograms}
          >
            <option value="">Select program</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            {/* {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.programName}
              </option>
            ))} */}
          </select>
        </div>
      </div>
      <div className="shadow-lg mx-3">
        {/* <div className="hidden md:flex bg-[#9d1d27] text-white py-2 px-5 "> */}
        <div
          className={`hidden md:flex ${
            tenantKey === "10d08176f2e74175ba526ab1b23beecc"
              ? "bg-[#003366]"
              : tenantKey === "ac7153df458aefc2a93fd1a4f7513147"
              ? "bg-[#97144C]"
              : tenantKey === "uq15v1axohhui5ytm2mxhdzcuywuakj7"
              ? "bg-[#9d1d27]"
              : ""
          } text-white py-2 px-5`}
        >
          <div className="flex-1 p-2">
            <span>
              Program <br></br> ID
            </span>
          </div>
          <div className="flex-1 p-2">
            <span>
              Program <br></br> Name
            </span>
          </div>

          <div className="flex-1 p-2">
            <span>
              Program <br></br> Outline
            </span>
          </div>
          <div className="flex-1 p-2">
            <span>
              Program <br></br>Start Date
            </span>
          </div>
          <div className="flex-1 p-2">
            <span>
              Program <br></br> End Date
            </span>
          </div>
          <div className="flex-1 p-2">
            <span>
              Training <br></br> Type
            </span>
          </div>
          <div className="flex-1 p-2">
            <span>
              Program <br></br> Location
            </span>
          </div>

          <div className="flex-1 p-2">
            <span>
              Nomination <br></br> due date
            </span>
          </div>
          <div className="flex-1 p-2">
            <span>
              Registration <br></br> Link
            </span>
          </div>
        </div>
        {programs.length > 0 ? (
          <>
            {programs.map((selectedProgram, index) => (
              <div
                key={index}
                className="block md:flex bg-white text-black py-2 px-5 rounded-sm md:rounded-none"
              >
                <div className="flex-1 p-2">
                  <span className="font-medium mb-1 block md:hidden">
                    Program Id:
                  </span>
                  <p>{selectedProgram.id}</p>
                </div>
                <div className="flex-1 p-2">
                  <span className="font-medium mb-1 block md:hidden">
                    Program Name:
                  </span>
                  <p>{selectedProgram.programName}</p>
                </div>
                {selectedProgram?.programOutline ? (
                  <div className="flex-1 p-2">
                    <span className="font-medium mb-1 block md:hidden">
                      Program Outline:
                    </span>

                    <a href={selectedProgram.programOutlineUrl} download>
                      {/* <h1>{fileUrl}</h1> */}
                      <div className="mb-3">
                        <div className="flex flex-col rounded  cursor-pointer">
                          <div className="mb-2 ml-1">
                            {/* <BsFileEarmarkPdf size={30} color="#9d1d27" /> */}
                            <BsFileEarmarkPdf
                              size={30}
                              color={
                                tenantKey === "10d08176f2e74175ba526ab1b23beecc"
                                  ? "bg-[#003366]"
                                  : tenantKey ===
                                    "ac7153df458aefc2a93fd1a4f7513147"
                                  ? "#97144C"
                                  : tenantKey ===
                                    "uq15v1axohhui5ytm2mxhdzcuywuakj7"
                                  ? "#9d1d27"
                                  : ""
                              }
                            />
                          </div>
                          {/* <div>
                                    <h1 className="max-w-[243px] text-[15px]">Wagons-Basic Excel program Outline</h1>
                                  </div> */}
                        </div>
                      </div>
                    </a>
                  </div>
                ) : null}
                <div className="flex-1 p-2">
                  <span className="font-medium mb-1 block md:hidden">
                    Program Start Date:
                  </span>
                  <p>
                    {moment(selectedProgram.programStartDate).format(
                      "Do MMM YYYY"
                    )}
                    <br></br>
                    {moment(
                      selectedProgram.programStartTime,
                      "HH:mm:ss"
                    ).format("hh:mm a")}
                  </p>
                </div>
                <div className="flex-1 p-2">
                  <span className="font-medium mb-1 block md:hidden">
                    Program End Date:
                  </span>
                  <p>
                    {moment(selectedProgram.programEndDate).format(
                      "Do MMM YYYY"
                    )}
                    <br></br>
                    {moment(selectedProgram.programEndTime, "HH:mm:ss").format(
                      "hh:mm a"
                    )}
                  </p>
                </div>
                <div className="flex-1 p-2">
                  <span className="font-medium mb-1 block md:hidden">
                    Training type:
                  </span>
                  <p>
                    {selectedProgram.trainingType == 1
                      ? "Class room training"
                      : null}
                    {selectedProgram.trainingType == 2
                      ? "Virtual Training"
                      : null}
                  </p>
                </div>
                <div className="flex-1 p-2">
                  <span className="font-medium mb-1 block md:hidden">
                    Program Location:
                  </span>
                  <p>
                    {selectedProgram.location ? selectedProgram.location : "-"}
                  </p>
                </div>
                <div className="flex-1 p-2">
                  <span className="font-medium mb-1 block md:hidden">
                    Nomination due date
                  </span>
                  <p>
                    {moment(selectedProgram.nominationDate).format(
                      "Do MMM YYYY"
                    )}
                    <br></br>
                    {moment(selectedProgram.nominationTime, "HH:mm:ss").format(
                      "hh:mm a"
                    )}
                  </p>
                </div>
                <div className="flex-1 p-2">
                  <span className="font-medium mb-1 block md:hidden">
                    Registration Link:
                  </span>
                  <a
                    // href={`/nominee-form/${selectedProgram.id}`}
                    href={`/nominee-form/${selectedProgram.id}?client=${client}&key=${tenantKey}`}
                    className={`${
                      tenantKey === "10d08176f2e74175ba526ab1b23beecc"
                        ? "bg-[#003366]"
                        : tenantKey === "ac7153df458aefc2a93fd1a4f7513147"
                        ? "bg-[#97144C]"
                        : tenantKey === "uq15v1axohhui5ytm2mxhdzcuywuakj7"
                        ? "bg-[#9d1d27]"
                        : "bg-[#9d1d27]"
                    } hover:${
                      tenantKey === "10d08176f2e74175ba526ab1b23beecc"
                        ? "bg-[#003366]"
                        : tenantKey === "ac7153df458aefc2a93fd1a4f7513147"
                        ? "bg-[#97144C]"
                        : tenantKey === "uq15v1axohhui5ytm2mxhdzcuywuakj7"
                        ? "bg-[#9d1d27]"
                        : "bg-[#9d1d27]"
                    } text-white font-bold py-2 px-4 rounded inline-block`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Click here
                  </a>
                </div>
              </div>
            ))}
          </>
        ) : null}
      </div>
      <div></div>
      <div className="p-2 mt-[120px]">
        <div className="flex items-center justify-start space-x-1 mb-3">
          <AiOutlineWarning size={25} color="#9d1d27" />
          <h2 className="italic font-medium">No Intercity travel allowed</h2>
        </div>
      </div>
    </div>
  );
}

export default ProgramList;
