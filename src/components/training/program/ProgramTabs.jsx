import React, { useState } from "react";

import { FaUserCircle } from "react-icons/fa";
import { VscFeedback } from "react-icons/vsc";
import { MdContentCopy, MdOutlineFormatListBulleted } from "react-icons/md";
import { TbClipboardList } from "react-icons/tb";

import NominationPeople from "./programComponents/NominationPeople";
import ProgramDetails from "./programComponents/ProgramDetails";
import CreateBatch from "./programComponents/CreateBatch";
import { AiFillNotification } from "react-icons/ai";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { FaList } from "react-icons/fa";
import { useAuth } from "../../../context/auth";
// import AnnouncementList from "../programComponents/AnnouncementList";
import BatchList from "./programComponents/BatchList";
import BulkBatchCreate from "./programComponents/BulkBatchCreate";

const ProgramTabs = ({
  setBatchListPop,
  peoplelist,
  questionList,
  id,
  schedulePop,
  setSchedulePop,
  batchData,
  next,
  previous,
  pgindex,
  page,
  totalCount,
  setRefresher,
  setLimit,
  setPage,
  setSearch,
  getOneBatch,
  templateList,
}) => {
  const [openTab, setOpenTab] = useState(1);
  const { userData } = useAuth();

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full    rounded">
          <div className="border-b border-gray-200  mx-5 ">
            <ul className="flex flex-wrap space-x-3   text-sm font-medium text-center text-gray-500 ">
              <li className="mr-1 cursor-pointer">
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(1);
                  }}
                  className={
                    "inline-flex p-3  rounded-t-lg   border-b-2  items-center" +
                    (openTab === 1
                      ? ` border-sky-600 text-sky-600`
                      : `border-transparent text-gray-500`)
                  }
                >
                  <BsFillInfoCircleFill className="text-xl mr-2" />
                  Program Details
                </span>
              </li>
              {/* <li className="mr-1 cursor-pointer">
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(2);
                  }}
                  className={
                    "inline-flex p-3  rounded-t-lg   border-b-2  items-center" +
                    (openTab === 2
                      ? ` border-sky-600 text-sky-600`
                      : `border-transparent text-gray-500`)
                  }
                >
                  <AiFillNotification className="text-xl mr-2" />
                  Announcement List
                </span>
              </li> */}
              {/* <li className="mr-2 cursor-pointer">
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(2);
                  }}
                  className={
                    "inline-flex p-4  rounded-t-lg  border-b-2  items-center" +
                    (openTab === 2
                      ? ` border-sky-600 text-sky-600`
                      : `border-transparent text-gray-500`)
                  }
                >
                  <TbClipboardList className="text-xl mr-2" />
                  Venue
                </span>
              </li> */}
              {batchData.programType == "1" ? (
                <li className="mr-1 cursor-pointer">
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(3);
                    }}
                    className={
                      "inline-flex p-3  rounded-t-lg  border-b-2  items-center" +
                      (openTab === 3
                        ? ` border-sky-600 text-sky-600`
                        : `border-transparent text-gray-500`)
                    }
                  >
                    <FaUserCircle className="text-xl mr-2" />
                    Nominees
                  </span>
                </li>
              ) : null}
              {userData.userType === 1 && (
                <li className="mr-1 cursor-pointer">
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(4);
                    }}
                    className={
                      "inline-flex p-3  rounded-t-lg  border-b-2  items-center" +
                      (openTab === 4
                        ? ` border-sky-600 text-sky-600`
                        : `border-transparent text-gray-500`)
                    }
                  >
                    <VscFeedback className="text-xl mr-2" />
                    {/* <Link href='/batch'> Batch</Link> */}
                    Batch
                  </span>
                </li>
              )}
              <li className="mr-1 cursor-pointer">
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(5);
                  }}
                  className={
                    "inline-flex p-3  rounded-t-lg  border-b-2  items-center" +
                    (openTab === 5
                      ? ` border-sky-600 text-sky-600`
                      : `border-transparent text-gray-500`)
                  }
                >
                  <FaList className="text-xl mr-2" />
                  {/* <Link href='/batch'> Batch</Link> */}
                  Batch List
                </span>
              </li>
              <li className="mr-1 cursor-pointer">
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(6);
                  }}
                  className={
                    "inline-flex p-3  rounded-t-lg  border-b-2  items-center" +
                    (openTab === 6
                      ? ` border-sky-600 text-sky-600`
                      : `border-transparent text-gray-500`)
                  }
                >
                  <FaList className="text-xl mr-2" />
                  {/* <Link href='/batch'> Batch</Link> */}
                  Bulk Batch Create
                </span>
              </li>
            </ul>
          </div>
          <div className="relative flex flex-col min-w-0 break-words ">
            <div className="px-4 py-5 flex-auto h-fit">
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? "block " : "hidden"} id="link1">
                  {/* <Schedule
                    schedulePop={schedulePop}
                    setSchedulePop={setSchedulePop}
                    id={id}
                    batchData={batchData}
                    openTab={openTab}
                  /> */}
                  <ProgramDetails
                    // session={session}
                    programDetails={batchData}
                  />
                </div>
                {/* <div className={openTab === 2 ? "block " : "hidden"} id="link1">
                  <AnnouncementList
                    programId={batchData.id}
                    session={session}
                  />
                </div> */}
                {batchData.programType == "1" ? (
                  <div
                    className={openTab === 3 ? "block" : "hidden"}
                    id="link3"
                  >
                    {/* <Assesment
                      next={next}
                      previous={previous}
                      pgindex={pgindex}
                      page={page}
                      totalCount={totalCount}
                      setLimit={setLimit}
                      setPage={setPage}
                      setSearch={setSearch}
                      questionList={questionList}
                      id={id}
                      setRefresher={setRefresher}
                      templateList={templateList}
                    /> */}
                    <NominationPeople
                      programId={batchData.id}
                      // session={session}  
                      programDetails={batchData}
                    />
                  </div>
                ) : null}
                <div className={openTab === 4 ? "block" : "hidden"} id="link3">
                  <CreateBatch
                    programId={batchData.id}
                    // session={session}
                    programDetails={batchData}
                  />
                </div>
                <div className={openTab === 5 ? "block" : "hidden"} id="link3">
                  <BatchList
                    programId={batchData.id}
                    // session={session}
                    programDetails={batchData}
                  />
                </div>
                <div className={openTab === 6 ? "block" : "hidden"} id="link3">
                  <BulkBatchCreate
                    programId={batchData.id}
                    // session={session}
                    programDetails={batchData}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function TabsRender({
  peoplelist,
  questionList,
  id,
  batchData,
  schedulePop,
  setSchedulePop,
  next,
  previous,
  pgindex,
  page,
  totalCount,
  setRefresher,
  setLimit,
  setPage,
  setSearch,
  templateList,
  getOneBatch,
}) {
  return (
    <>
      <ProgramTabs
        peoplelist={peoplelist}
        id={id}
        batchData={batchData}
        questionList={questionList}
        schedulePop={schedulePop}
        setSchedulePop={setSchedulePop}
        next={next}
        previous={previous}
        pgindex={pgindex}
        page={page}
        totalCount={totalCount}
        setLimit={setLimit}
        setPage={setPage}
        templateList={templateList}
        setSearch={setSearch}
        setRefresher={setRefresher}
        getOneBatch={getOneBatch}
      />
    </>
  );
}
