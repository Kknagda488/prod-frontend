import React, { useEffect, useState } from "react";
import { IoMdClose, IoMdMore } from "react-icons/io";
import { MdAddBox } from "react-icons/md";
import ProgramDetails from "./ProgramDetails";
// import { signOut } from "next-auth/react";
import AllProgramTable from "./AllProgramTable";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/auth";
function Program({ id, setId, setBatchListPop, batchListPop }) {
  const { userData, signOut } = useAuth();
  const [selected, setSelected] = useState(false);
  const [programData, setProgramData] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pgindex, setPgindex] = useState(1);
  const [pageLimit, setPageLimit] = useState(5);
  const [programList, setProgramList] = useState([]);
  const [bucket, setBucket] = useState([]);
  const [search, setSearch] = useState("");

  //Fetching selected program details
  const getOneProgram = () => {
    fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/programs/getProgramById/${id}?access_token=${userData?.accessToken}`
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
    if (id) {
      getOneProgram();
    }
  }, [id]);

  //Removing program from selected programs list
  const removeProgramFromBucket = (programObj) => {
    var doesItemExist;
    var objects;
    const newState = bucket.map((item) => {
      if (item.id === programObj.id) {
        //item.quantity += 1;
        doesItemExist = true;
      }
      objects = item;
      return item;
    });

    //  console.log(newState);

    if (doesItemExist) {
      const index = bucket.findIndex((item) => item.id === programObj.id);
      let newBucket = [...bucket];
      if (index >= 0) {
        newBucket.splice(index, 1);
      } else {
        console.warn(`Cannot remove : ${programObj?.batchQuestionId}`);
      }
      setBucket(newBucket);
      setId(null);
    }
  };

  //Fetching programlist
  const fetchProgramList = async () => {
    try {
      const filter = {
        pageLimit,
        pageNo,
        search,
      };
      const params = encodeURIComponent(JSON.stringify(filter));
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/programs/list?filter=${params}&access_token=${
          userData?.accessToken
        }`
      );
      const data = await response.json();
      if (!response.ok) {
        throw data.message;
      }
      setProgramList(data.data.programs);
      setPgindex(data.data.lastPage);
    } catch (error) {
      console.log(error);
      if (error === "Malformed User" || error === "Token Expired") {
        signOut();
      }
    }
  };

  const next = () => {
    console.log(pageNo);
    if (pageNo >= pgindex) {
      return;
    } else {
      setPageNo(pageNo + 1);
    }
  };
  const previous = () => {
    if (pageNo <= 1) {
      return;
    } else {
      setPageNo(pageNo - 1);
    }
  };

  useEffect(() => {
    fetchProgramList();
  }, [pageNo, pageLimit, search]);

  return (
    <div className="flex flex-row w-full h-full space-x-5 py-5">
      <div className="flex w-full h-full rounded-lg">
        <div className="flex w-full h-full bg-white rounded-[33px] flex-col">
          <span className="flex cursor-pointer justify-between items-center p-3 text-sm font-medium text-gray-600 bg-gray-100 hover:underline border-t border-gray-200">
            <div className="float-right rounded-[33px] bg-sky-500 border-sky-500 hover:bg-sky-600 text-white rounded-md px-2 py-1  transition duration-75 ease select-none  focus:outline-none focus:shadow-outline">
              <Link to="create-program">Create New Program</Link>
            </div>
          </span>
          <div className="w-full py-4 px-5">
            <AllProgramTable
              setId={setId}
              //setSelected(true);
              setBatchListPop={setBatchListPop}
              id={id}
              bucket={bucket}
              setBucket={setBucket}
              programList={programList}
              next={next}
              previous={previous}
              pgindex={pgindex}
              page={pageNo}
              setPage={setPageNo}
              setLimit={setPageLimit}
              setSearch={setSearch}
              search={search}
              // session={session}
              fetchProgramList={fetchProgramList}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Program;
