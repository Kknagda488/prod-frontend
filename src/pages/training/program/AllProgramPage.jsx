// import { getSession, signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
// import CreateProgramForm from "../components/adminComponents/forms/CreateProgramForm";
// import Batch from "../components/adminComponents/parts/Batch";
import Program from "../../../components/training/program/Program";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/auth";
// import CreateZoomForm from "../components/adminComponents/forms/CreateZoomForm";
// import AllBatchTable from "../components/adminComponents/parts/AllBatchTable";

function CreateProgram() {
  const [search, setSearch] = useState("");
  const { userData, signOut } = useAuth();

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

  const getBatchData = () => {
    fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/Teams/getListofTeamsforbatch?filter=%7B%22limit%22%3A${limit},%22start%22%3A${page},%22order%22%3A%22teamId%22,%22search%22%3A%22${search}%22%7D&access_token=${
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

        setTeamData(data.data.list);
        setTotalCount(data.data.totalCount);
      })
      .catch((error) => {
        setTeamData([]);
        console.error("There was an error!", error);
        if (error === "Token Expired" || error === "Malformed User") {
          signOut();
        }
      });
  };

  useEffect(() => {
    getBatchData();
  }, [batchPop, search, limit, page]);
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
        if (error === "Token Expired" || error === "Malformed User") {
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
        if (error === "Token Expired" || error === "Malformed User") {
          signOut();
        }
      });
  };

  const npages = totalCount;
  const pgindex = npages - 5;
  // const pgindex = npages;
  console.log(page, pgindex);

  return (
    <div className="flex flex-col w-full mt-0 justify-center items-center ">
      <Program
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
        bucket={bucket}
      />
    </div>
  );
}

export default CreateProgram;
