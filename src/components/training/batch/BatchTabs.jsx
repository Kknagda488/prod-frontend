import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineCalendar } from "react-icons/ai";
import { VscFeedback } from "react-icons/vsc";
import { MdContentCopy, MdOutlineFormatListBulleted } from "react-icons/md";

import { TbClipboardList } from "react-icons/tb";
import BatchPeopleList from "./batchComponents/BatchPeopleList";
import { CgMail } from "react-icons/cg";
import Schedule from "./batchComponents/Schedule";

import FeedbackFormTab from "./batchComponents/FeedbackFormTab";
import Assesment from "./batchComponents/Assesment";
import Attendance from "./batchComponents/Attendance";
import Notifications from "./batchComponents/Notifications";
import Venue from "./batchComponents/Venue";
import Trainer from "./batchComponents/Trainer";
import PMcheckmark from "./batchComponents/PMcheckmark";
import EmailLog from "./batchComponents/EmailLog";
import { IoLocationSharp } from "react-icons/io5";
import { IoPeopleOutline } from "react-icons/io5";

import { TiTick, } from "react-icons/ti";
import { BsFillClipboardCheckFill } from "react-icons/bs";
import { BsFillPersonCheckFill } from "react-icons/bs";
// import { FaCheckCircle } from "react-icons/fa";
import { IoNotificationsSharp } from "react-icons/io5";
import { IoCubeSharp } from "react-icons/io5";
import Prework from "./batchComponents/Prework";
import MeetingLink from "./batchComponents/MeetingLink";
// import { use } from "react";
import { useAuth } from "../../../context/auth";
import { EmailRounded } from "@mui/icons-material";

const BatchTabs = ({
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
  templateList,
  batchId,
  getOneBatch,
}) => {
  const [openTab, setOpenTab] = useState(1);
  //console.log('Batch Tab:'+userData.userType);
  const { userData, sigOut } = useAuth()

  return (
    <>
      <div className="flex flex-wrap">
        {/* <div className="m-2 ml-5 font-bold font-xl">{batchData.name}</div> */}
        <div className="w-full    rounded">
          <div className="border-b border-gray-200  mx-0 ">
            <ul className="flex flex-wrap space-x-2   text-sm font-medium text-center text-gray-500 ">
              {userData.userType !== 7 && (
                <li className="mr-1 cursor-pointer">
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(1);
                    }}
                    className={
                      "inline-flex p-3  rounded-t-lg  border-b-2  items-center" +
                      (openTab === 1
                        ? ` border-sky-600 text-sky-600`
                        : `border-transparent text-gray-500`)
                    }
                  >
                    <BsFillClipboardCheckFill className="text-xl mr-2" />
                    PM Checkmark
                  </span>
                </li>
              )}

              {userData.userType !== 7 && (
                <li className="mr-1 cursor-pointer">
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(2);
                    }}
                    className={
                      "inline-flex p-3  rounded-t-lg  border-b-2  items-center" +
                      (openTab === 2
                        ? ` border-sky-600 text-sky-600`
                        : `border-transparent text-gray-500`)
                    }
                  >
                    <IoNotificationsSharp className="text-xl mr-2" />
                    Notifications
                  </span>
                </li>
              )}
              {userData.userType !== 7 && (
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
                    <IoCubeSharp className="text-xl mr-2" />
                    Prework
                  </span>
                </li>
              )}
              {
                batchData?.program?.trainingType === 1 ?
                  <li className="mr-1 cursor-pointer">
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenTab(4);
                      }}
                      className={
                        "inline-flex p-3  rounded-t-lg   border-b-2  items-center" +
                        (openTab === 4
                          ? ` border-sky-600 text-sky-600`
                          : `border-transparent text-gray-500`)
                      }
                    >
                      <IoLocationSharp className="text-xl mr-2" />
                      Venue
                    </span>
                  </li>
                  :
                  null
              }
              {
                batchData?.program?.trainingType == 2 ?
                  <li className="mr-1 cursor-pointer">
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenTab(11);
                      }}
                      className={
                        "inline-flex p-3  rounded-t-lg   border-b-2  items-center" +
                        (openTab === 11
                          ? ` border-sky-600 text-sky-600`
                          : `border-transparent text-gray-500`)
                      }
                    >
                      <AiOutlineCalendar className="text-xl mr-2" />
                      Meeting Link
                    </span>
                  </li>
                  :
                  null
              }
              <li className="mr-1 cursor-pointer">
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(5);
                  }}
                  className={
                    "inline-flex p-3  rounded-t-lg   border-b-2  items-center" +
                    (openTab === 5
                      ? ` border-sky-600 text-sky-600`
                      : `border-transparent text-gray-500`)
                  }
                >
                  <FaUserCircle className="text-xl mr-2" />
                  Trainer
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
                  <IoPeopleOutline className="text-xl mr-2" />
                  Batch People
                </span>
              </li>
              {userData.userType !== 7 && (
                <li className="mr-1 cursor-pointer">
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(7);
                    }}
                    className={
                      "inline-flex p-3  rounded-t-lg  border-b-2  items-center" +
                      (openTab === 7
                        ? ` border-sky-600 text-sky-600`
                        : `border-transparent text-gray-500`)
                    }
                  >
                    <TbClipboardList className="text-xl mr-2" />
                    Assessments
                  </span>
                </li>
              )}
              {userData.userType !== 7 && (
                <li className="mr-1 cursor-pointer">
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(8);
                    }}
                    className={
                      "inline-flex p-3  rounded-t-lg  border-b-2  items-center" +
                      (openTab === 8
                        ? ` border-sky-600 text-sky-600`
                        : `border-transparent text-gray-500`)
                    }
                  >
                    <VscFeedback className="text-xl mr-2" />
                    Feedback
                  </span>
                </li>
              )}

              {userData.userType !== 7 && (
                <li className="mr-1 cursor-pointer">
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(9);
                    }}
                    className={
                      "inline-flex p-3  rounded-t-lg  border-b-2  items-center" +
                      (openTab === 9
                        ? ` border-sky-600 text-sky-600`
                        : `border-transparent text-gray-500`)
                    }
                  >
                    <BsFillPersonCheckFill className="text-xl mr-2" />
                    Attendance
                  </span>
                </li>
              )}
              {userData.userType !== 7 && (
                <li className="mr-1 cursor-pointer">
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(10);
                    }}
                    className={
                      "inline-flex p-3  rounded-t-lg   border-b-2  items-center" +
                      (openTab === 10
                        ? ` border-sky-600 text-sky-600`
                        : `border-transparent text-gray-500`)
                    }
                  >
                    <MdOutlineFormatListBulleted className="text-xl mr-2" />
                    Schedule
                  </span>
                </li>
              )}

              {userData.userType !== 7 && (
                <li className="mr-1 cursor-pointer">
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(12);
                    }}
                    className={
                      "inline-flex p-3  rounded-t-lg   border-b-2  items-center" +
                      (openTab === 12
                        ? ` border-sky-600 text-sky-600`
                        : `border-transparent text-gray-500`)
                    }
                  >
                    <CgMail className="text-xl mr-2" />
                    Email Log
                  </span>
                </li>
              )}
            </ul>
          </div>
          <div className="relative flex flex-col min-w-0 break-words ">
            <div className="px-4 py-5 flex-auto h-fit">
              <div className="tab-content tab-space">
                {userData?.userType === 1 ? (
                  <div
                    className={openTab === 1 ? "block" : "hidden"}
                    id="link3"
                  >
                    <PMcheckmark
                      batchId={batchId}

                      getOneBatch={getOneBatch}
                      batchData={batchData}
                    />
                  </div>
                ) : null}
                <div className={openTab === 2 ? "block" : "hidden"} id="link3">
                  <Notifications batchId={batchId} />
                </div>
                <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                  <Prework
                    batchId={batchId}

                    batchData={batchData}
                  />
                </div>

                <div className={openTab === 11 ? "block " : "hidden"} id="link1">
                  <MeetingLink batchData={batchData} />
                </div>
                <div className={openTab === 4 ? "block " : "hidden"} id="link1">
                  <Venue
                    batchId={batchId}

                    getOneBatch={getOneBatch}
                    batchData={batchData}
                  />
                </div>
                <div className={openTab === 5 ? "block " : "hidden"} id="link1">
                  <Trainer
                    batchId={batchId}

                    getOneBatch={getOneBatch}
                    batchData={batchData}
                  />
                </div>
                <div className={openTab === 6 ? "block" : "hidden"} id="link2">
                  <BatchPeopleList batchId={batchId} batchData={batchData} />
                </div>
                <div className={openTab === 7 ? "block" : "hidden"} id="link3">
                  <Assesment
                    batchId={batchId}

                    batchData={batchData}
                  />
                </div>
                <div className={openTab === 8 ? "block" : "hidden"} id="link3">
                  <FeedbackFormTab
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
                    batchData={batchData}
                  />
                </div>
                <div className={openTab === 9 ? "block" : "hidden"} id="link3">
                  <Attendance
                    batchId={batchId}

                    batchData={batchData}
                  />
                </div>
                <div
                  className={openTab === 10 ? "block " : "hidden"}
                  id="link1"
                >
                  <Schedule
                    schedulePop={schedulePop}
                    setSchedulePop={setSchedulePop}
                    id={batchId}
                    batchData={batchData}
                    openTab={openTab}
                  />
                </div>
                <div
                  className={openTab === 12 ? "block " : "hidden"}
                  id="link1"
                >
                  <EmailLog
                    batchId={batchId}
                    batchData={batchData}
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
  getOneBatch,
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
  batchId,
}) {
  return (
    <>
      <BatchTabs
        peoplelist={peoplelist}
        id={id}
        batchData={batchData}
        getOneBatch={getOneBatch}
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
        batchId={batchId}
      />
    </>
  );
}
