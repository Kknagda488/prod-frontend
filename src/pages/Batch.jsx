import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import CreateBatchForm from "../components/forms/CreateBatchForm";
import Batch from "../components/training/batch/Batch";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import CreateZoomForm from "../components/forms/CreateZoomForm";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/auth";

function CreateBatch() {
  const { batchId } = useParams();
  const { userData, signOut } = useAuth();
  const [search, setSearch] = useState("");
  const [batchData, setBatchData] = useState(null);
  const [teamData, setTeamData] = useState([]);

  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState();
  const [schedulePop, setSchedulePop] = useState(false);
  const [batchPop, setBatchPop] = useState(false);
  const [batchListPop, setBatchListPop] = useState(false);
  const [csv, setCsv] = useState();
  const [id, setId] = useState(null);
  const [bucket, setBucket] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [programId, setProgramId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [projectData, setProjectData] = useState([]);

  useEffect(() => {
    setProjectId(null);
    setProjectData([]);
  }, [batchPop]);
  const uploadCsv = async (e) => {
    e.preventDefault();
    var formData = {};
    Array.from(e.currentTarget.elements).forEach((field) => {
      if (!field.name) return;
      formData[field.name] = field.value;
    });
    var response;
    var bulkUser = JSON.stringify(csv);
    response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/Users/bulkUploadUser?access_token=${userData?.accessToken}`,
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
    } else {
      // document.getElementById("adduser").reset();
      //   toast.success("Users Added Succesfully !!");
      const ids = data?.map((id) => {
        return id?.data.userId;
      });
      const users = ids.toString();
      //   console.log(users);
      var teamName = formData.teamName;
      var teamDescription = "zoom batches";
      var type = 2;
      formData = { ...formData, users, teamDescription, teamName, type };
      addBatch(formData);
    }
  };

  const addBatch = async (formData) => {
    var response;
    let form = new URLSearchParams(Object.entries(formData)).toString();
    console.log(form);
    response = await fetch(
      `${import.meta.env.VITE_PUBLIC_URL}/api/Teams/add?access_token=${
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
      // console.log(data);
      if (data.code === 404) {
        toast.error(data.msg);
      } else if (data.code == 409) {
        toast.error(data.msg);
      } else {
        setBatchPop(false);
        toast.success("Batch Added Succesfully !!");
      }
      // document.getElementById("adduser").reset();

      // router.push("/all_teams");
    }
  };

  // const getBatchData = () => {
  //   fetch(
  //     `${import.meta.env.VITE_PUBLIC_URL}/api/batches/batchDetails/${batchId}?access_token=${userData?.accessToken}`
  //   )
  //     .then(async (response) => {
  //       const data = await response.json();
  //       // check for error response
  //       if (!response.ok) {
  //         // get error message from body or default to response statusText
  //         const error = (data && data.message) || response.statusText;
  //         return Promise.reject(error);
  //       }
  //       setBatchData(response.data.data);
  //     })

  //     .catch((error) => {
  //       console.error("There was an error!", error);
  //       if (error === "Token Expired") {
  //         signOut();
  //       }
  //     });
  // };

  // useEffect(() => {
  //   getBatchData();
  // }, []);

  useEffect(() => {
    getClientData();
    setProgramData([]);
    setProjectData([]);
  }, []);
  useEffect(() => {
    if (programId) {
      getProgramData();
      setProjectData([]);
    }
    if (projectId) {
      getProjectData();
    }
  }, [programId, projectId]);
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

  const npages = totalCount;
  const pgindex = npages - 5;
  // const pgindex = npages;
  const next = () => {
    if (totalCount % limit == 0) {
      if (page < pgindex) {
        setPage(page + 1);
        //console.log("max page" ,pgindex)
      } else {
        return;
      }
    }

    // if the number is odd
    else {
      if (page < npages) {
        setPage(page + 1);
        //console.log("else max page" ,npages)
      } else {
        return;
      }
    }
  };
  const previous = () => {
    if (page <= 0) {
      return;
    } else {
      setPage(page - 1);
    }
  };
  return (
    <div className="flex flex-col w-full mt-10 justify-center items-center ">
      {batchPop ? (
        <div className="fixed z-30  w-full h-screen top-0 left-0 items-center   bg-gray-800/40">
          <div className="flex w-full items-start mt-20 justify-center   h-screen">
            <div className="relative mx-20 flex flex-col  w-1/2 items-center justify-center bg-white rounded-lg shadow-md px-8 py-2">
              <div className="absolute z-30 bg-white flex w-full justify-end items-end top-0  p-4 ">
                <IoClose
                  onClick={() => setBatchPop(false)}
                  className="cursor-pointer text-xl font-semibold text-black "
                />
              </div>
              <div
                id="journal-scroll"
                className="w-full h-[30rem] overflow-y-auto"
              >
                <CreateBatchForm
                  uploadCsv={uploadCsv}
                  setCsv={setCsv}
                  clientData={clientData}
                  projectData={projectData}
                  programData={programData}
                  setProjectId={setProjectId}
                  projectId={projectId}
                  setProgramId={setProgramId}
                  setProjectData={setProjectData}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {schedulePop ? (
        <div className="fixed z-30  w-full h-screen top-0 left-0 items-center   bg-gray-800/40">
          <div className="flex w-full items-start mt-20 justify-center   h-screen">
            <div className="relative mx-20 flex flex-col  w-1/2 items-center justify-center bg-white rounded-lg shadow-md px-8 py-2">
              <div className="absolute z-30  flex w-full justify-end items-end top-0  p-4 ">
                <IoClose
                  onClick={() => setSchedulePop(false)}
                  className="cursor-pointer text-xl font-semibold text-black "
                />
              </div>
              <div
                // id="journal-scroll"
                className="w-full h-fit"
              >
                <CreateZoomForm setSchedulePop={setSchedulePop} id={id} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* {batchListPop ? (
        <div className="fixed z-30  w-full h-screen top-0 left-0 items-center   bg-gray-800/40">
          <div className="flex w-full items-start mt-[5rem] justify-center   h-screen">
            <div className="relative mx-16 flex flex-col  w-full items-center justify-center bg-white rounded-lg shadow-md px-8 py-2">
              <div className="absolute  flex w-full  justify-end items-end top-0  px-4 py-3 ">
                <IoClose
                  onClick={() => setBatchListPop(false)}
                  className="cursor-pointer text-xl font-semibold text-black "
                />
              </div>
              <div
                id="journal-scroll"
                className="w-full h-[31rem] overflow-y-auto px-8"
              >
                <AllBatchTable
                  session={session}
                  setBatchListPop={setBatchListPop}
                  id={id}
                  bucket={bucket}
                  setBucket={setBucket}
                  teamData={teamData}
                  next={next}
                  previous={previous}
                  pgindex={pgindex}
                  page={page}
                  totalCount={totalCount}
                  setLimit={setLimit}
                  setPage={setPage}
                  setSearch={setSearch}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null} */}
      {/* <div className="px-2 pt-2 flex w-full justify-end  mb-2 ">
        <h5 className="text-3xl font-semibold leading-none text-gray-700 ">
          Batch Training
        </h5>
      </div> */}
      <Batch
        teamData={teamData}
        setBucket={setBucket}
        setBatchPop={setBatchPop}
        batchPop={batchPop}
        schedulePop={schedulePop}
        setSchedulePop={setSchedulePop}
        setBatchListPop={setBatchListPop}
        id={id}
        batchListPop={batchListPop}
        setId={setId}
        setSearch={setSearch}
        bucket={bucket}
        next={next}
        previous={previous}
        pgindex={pgindex}
        page={page}
        totalCount={totalCount}
        setLimit={setLimit}
        setPage={setPage}
        batchId={batchId}
      />
    </div>
  );
}

export default CreateBatch;
