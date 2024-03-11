import React, { useEffect, useState } from "react";
import { IoMdClose, IoMdMore } from "react-icons/io";
import { MdAddBox } from "react-icons/md";
import { useAuth } from "../../../context/auth";
import BatchDetails from "./BatchDetails";

function Batch({
  batchPop,
  setBatchPop,
  teamData,
  setBucket,
  schedulePop,
  setSchedulePop,
  id,
  setId,
  setSearch,
  setBatchListPop,
  batchListPop,
  bucket,
  batchId,
  next,
  previous,
  pgindex,
  page,
  totalCount,
  setLimit,
  setPage,
}) {
  const { userData, signOut } = useAuth();
  const [selected, setSelected] = useState(false);
  const [batchData, setBatchData] = useState([]);

  const getOneBatch = () => {
    fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/batches/batchDetails/${batchId}?access_token=${
        userData?.accessToken
      }`
    )
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          throw error;
        }
        setBatchData(data.data);
      })
      .catch((error) => {
        setBatchData([]);
        console.log("There was an error!", error.message);
        if (error === "Token Expired" || error === "Malformed User") {
          signOut();
        }
      });
  };
  useEffect(() => {
    if (batchId) {
      getOneBatch();
    }
  }, [batchId]);

  const removeBacth = (batchObj) => {
    var doesItemExist;
    var objects;
    const newState = bucket.map((item) => {
      if (item.teamId === batchObj.teamId) {
        //item.quantity += 1;
        doesItemExist = true;
      }
      objects = item;
      return item;
    });

    //  console.log(newState);

    if (doesItemExist) {
      const index = bucket.findIndex((item) => item.teamId === batchObj.teamId);
      let newBucket = [...bucket];
      if (index >= 0) {
        newBucket.splice(index, 1);
      } else {
        console.warn(`Cannot remove : ${batchObj.batchQuestionId}`);
      }
      setBucket(newBucket);
      setId(null);
    }
  };

  return (
    <div className="flex flex-row w-full space-x-5 py-5">
      {/* <div className="grid grid-cols-2 w-1/3">
        <div
          onClick={() => setBatchPop(!batchPop)}
          className="flex cursor-pointer  flex-col max-w-sm space-y-2 items-center justify-center "
        >
          <div className="flex hover:transform hover:scale-105 ease-in-out hover:duration-150 flex-col p-4 bg-blue-500 text-white text-4xl rounded-xl ">
            <MdAddBox />
          </div>
          <p className="text-gray-700 text-md font-normal">Create Batch</p>
        </div>
        <div className="flex cursor-pointer flex-col max-w-sm space-y-2 items-center justify-center ">
          <div className="flex hover:transform hover:scale-105 ease-in-out hover:duration-150 flex-col p-4 bg-blue-500 text-white text-4xl rounded-xl ">
            <IoCalendarSharp />
          </div>
          <p className="text-gray-700 text-md font-normal">Schedule Batch</p>
        </div>
      </div> */}

      <BatchDetails
        id={batchId}
        batchData={batchData}
        schedulePop={schedulePop}
        setSchedulePop={setSchedulePop}
        batchId={batchId}
        getOneBatch={getOneBatch}
      />
      {/* {id && batchListPop ? (
        ) : (
          <div className="flex w-full   bg-white rounded-md flex-col">
            <div className="w-full py-4 px-5">
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
        )} */}
    </div>
  );
}

export default Batch;
