import { useParams } from "react-router-dom";
import ProgramDetails from "../../../components/training/program/ProgramDetails";
import { useAuth } from "../../../context/auth";
import { useEffect, useState } from "react";
const ProgramPage = () => {
  const { programId } = useParams();
  const { userData, signOut } = useAuth();
  const [programData, setProgramData] = useState({});

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
        console.log(data);

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }

        setProgramData(data.data);
      })
      .catch((error) => {
        setProgramData({});
        console.error("There was an error!", error);
        if (error === "Token Expired" || error === "Malformed User") {
          signOut();
        }
      });
  };

  useEffect(() => {
    if (programId) {
      getOneProgram();
    }
  }, [programId]);

  return (
    <>
      <ProgramDetails
        id={programId}
        batchData={programData}
        setBatchListPop={false}
        // session={session}
        getOneBatch={false}
      />
    </>
  );
};

export default ProgramPage;
