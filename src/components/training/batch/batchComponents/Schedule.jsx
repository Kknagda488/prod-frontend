import React, { useEffect, useState } from "react";
import { IoCalendarSharp, IoChevronDown } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";
// import { useSession } from "next-auth/react";
// import { signOut } from "next-auth/react";
import { v4 as uuid_v4 } from "uuid";
import ScheduledMeeting from "./ScheduledMeeting";
import { motion } from "framer-motion";
import ScheduledAssessments from "./ScheduledAssessments";
import { AiOutlineCaretDown } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import zoommailbody from "./zoommailbody";
import { useAuth } from "../../../../context/auth";

function Schedule({ setSchedulePop, schedulePop, id, batchData, openTab }) {
  console.log(batchData);
  // const { data: session } = useSession();
  const { userData, signOut } = useAuth();
  const [zoomData, setZoomData] = useState([]);
  const [assessmentData, setAssessmentData] = useState([]);
  const transition = { type: "spring", stiffness: 2500, damping: 120, mass: 1 };
  const animations = { transition };
  const [open, setOpen] = useState(false);
  const [openZoom, setOpenZoom] = useState(false);
  const [assessmentBucket, setAssessmentBucket] = useState([]);
  const [assessmentList, setAssessmentList] = useState([]);
  const [zoomBucket, setzoomBucket] = useState([]);
  const [zoomList, setzoomList] = useState([]);

  //`/livebatchtracking/batch&id=${id}&batch&name=${batchData.teamName}&trackingid=${id}`
  var link = `${
    import.meta.env.VITE_PUBLIC_LINK
  }/livebatchtracking/batch&id=${id}&batch&name=${
    batchData.name
  }&trackingid=${id}`;
  var url = `Live Tracking Link: <a href="${link.replace(
    /\s/g,
    "+"
  )}" target="_blank">${link.replace(/\s/g, "+")}</a>`;
  const getZoomLinks = () => {
    fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/ZoomLinks/traineeBatchzoomLinkByBatchId?id=${id}&filter=%7B%22limit%22%3A%22%22,%22start%22%3A%22%22,%22search%22%3A%22%22%7D&access_token=${
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

        setZoomData(data.data);
      })
      .catch((error) => {
        setZoomData([]);
        console.error("There was an error!", error);
        if (error === "Token Expired") {
          signOut();
        }
      });
  };
  const getAssessmentLinks = () => {
    fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/batchAssessments/traineeBatchAssessmentdetailsByBatchId?id=${id}&filter=%7B%22limit%22%3A%22%22,%22start%22%3A%22%22,%22search%22%3A%22%22%7D&access_token=${
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
        setAssessmentData(data.data);
      })
      .catch((error) => {
        setAssessmentData([]);
        console.error("There was an error!", error);
        if (error === "Token Expired") {
          signOut();
        }
      });
  };

  useEffect(() => {
    console.log("here");
    getZoomLinks();
    getAssessmentLinks();
  }, [schedulePop, id, batchData, openTab]);

  const assessmentManager = (formData) => {
    //console.log(formData, "okg");

    var doesItemExist;
    var objects;
    if (assessmentBucket.length === 0) {
      setAssessmentBucket([formData]);
      setAssessmentList([formData.assessmentId]);
    } else {
      const newState = assessmentBucket.map((item) => {
        if (item.assessmentId === formData.assessmentId) {
          //item.quantity += 1;
          doesItemExist = true;
        }
        objects = item;
        return item;
      });

      //  console.log(newState);

      if (doesItemExist) {
        const index = assessmentBucket.findIndex(
          (item) => item.assessmentId === formData.assessmentId
        );

        const numindex = assessmentList.indexOf(formData.assessmentId);
        if (numindex > -1) {
          // only splice array when item is found
          assessmentList.splice(numindex, 1); // 2nd parameter means remove one item only
        }
        let newBucket = [...assessmentBucket];
        if (index >= 0) {
          newBucket.splice(index, 1);
        } else {
          console.warn(`Cannot remove : ${formData.assessmentId}`);
        }
        setAssessmentBucket(newBucket);
      } else {
        setAssessmentBucket([...assessmentBucket, formData]);
        setAssessmentList([...assessmentList, formData.assessmentId]);
      }
    }
  };

  const zoomManager = (formData) => {
    //console.log(formData, "okg");

    var doesItemExist;
    var objects;
    if (zoomBucket.length === 0) {
      setzoomBucket([formData]);
      setzoomList([formData.zoomId]);
    } else {
      const newState = zoomBucket.map((item) => {
        if (item.zoomId === formData.zoomId) {
          //item.quantity += 1;
          doesItemExist = true;
        }
        objects = item;
        return item;
      });

      //  console.log(newState);

      if (doesItemExist) {
        const index = zoomBucket.findIndex(
          (item) => item.zoomId === formData.zoomId
        );

        const numindex = zoomList.indexOf(formData.zoomId);
        if (numindex > -1) {
          // only splice array when item is found
          zoomList.splice(numindex, 1); // 2nd parameter means remove one item only
        }
        let newBucket = [...zoomBucket];
        if (index >= 0) {
          newBucket.splice(index, 1);
        } else {
          console.warn(`Cannot remove : ${formData.zoomId}`);
        }
        setzoomBucket(newBucket);
      } else {
        setzoomBucket([...zoomBucket, formData]);
        setzoomList([...zoomList, formData.zoomId]);
      }
    }
  };

  const handleMailSelect = () => {
    console.log(
      assessmentList,
      assessmentBucket.filter(
        (assesment) => assesment.assessmentType !== "attendance"
      )
    );
    if (assessmentList.includes("attendance")) {
      setAssessmentList((prev) => {
        return prev.filter((assesment) => assesment !== "attendance");
      });
      setAssessmentBucket((prev) => {
        return prev.filter(
          (assesment) => assesment.assessmentType !== "attendance"
        );
      });
    } else {
      setAssessmentList((prev) => {
        return [...prev, "attendance"];
      });
      setAssessmentBucket((prev) => {
        return [
          ...prev,
          {
            name: batchData.name,
            assessmentType: "attendance",
            url: `Attendance Link: <a href="${process.env.NEXT_PUBLIC_LINK}/attendance-form/${batchData.batchId}">${process.env.NEXT_PUBLIC_LINK}/attendance-form/${batchData.batchId}</a>`,
          },
        ];
      });
    }
  };
  // console.log(batchData, "batchDataaa");
  const sendEmail = async () => {
    const forms = assessmentBucket.map((form) => {
      return `<h6>${form.url}</h6><br>`;
    });
    console.log(forms);
    // console.log(forms.join(""));
    var button = document.getElementById("emailbutton");
    button.disabled = true;
    button.className =
      "rounded bg-gray-500  cursor-not-allowed transition-colors duration-150 px-5 py-4 font-bold text-white sm:rounded-l-none sm:rounded-r-md";
    button.innerText = "Sending...";
    const formData = {
      batchId: id,
      emailBody: `<body style="font-size: 28px;"><h6>Kindly Note Feedback and attendance to be taken after completion of entire training delivery of the scheduled program.<h6>${forms.join(
        ""
      )}<h6>${url}</h6><h6><strong>It is compulsory to take Attendance & Feedback for each training program you are doing with us.</strong></h6><h6>Thanks & Regards,</h6><h6>Wagons Learning Pvt. Ltd.</h6><h6>Landline: 8149006055</h6><h6>Website: <a href="http://www.wagonslearning.com" target="_blank">http://www.wagonslearning.com</a></h6><h6>Address: A/7-8, 4th Floor, Srushti, Opposite Union Bank, Baner Road, Pune – 411045</h6><h6><strong>"Partnering and fulfilling employees professional knowledge and skilling journey is both our goal and reward!"</strong></h6><span lang="EN-IN" style="color: black"><img border="0" width="191" height="73" style="width: auto; height: 60px" src="https://training.wagonslms.com/wagon-login.png" alt="wagons"></span></body>`,
    };
    console.log(formData);
    var response;

    let form = new URLSearchParams(Object.entries(formData)).toString();
    response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/batches/sendEmailToTrainer?access_token=${userData?.accessToken}`,
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
      console.log(data, "er");
    } else {
      if (data.code == 200) {
        toast.success(data.msg);
        setAssessmentBucket([]);
        setAssessmentList([]);
      } else {
        toast.error(data.msg);
      }
    }
    button.disabled = false;
    button.className =
      "rounded bg-violet-500 hover:bg-violet-600 transition-colors duration-150 px-5 py-4 font-bold text-white sm:rounded-l-none sm:rounded-r-md";
    button.innerText = "Send Email";
  };

  const sendZoomEmail = async () => {
    // const forms = zoomBucket.map((form) => {
    //   return `<h6>${form.url}</h6><br>`;
    // });

    // console.log(forms.join(""));
    var button = document.getElementById("zoomemailbutton");
    button.disabled = true;
    button.className =
      "rounded bg-gray-500  cursor-not-allowed transition-colors duration-150 px-5 py-4 font-bold text-white sm:rounded-l-none sm:rounded-r-md";
    button.innerText = "Sending...";
    const formData = {
      batchId: id,
      emailBody: zoommailbody(zoomBucket, batchData),
    };
    console.log(formData);
    var response;

    let form = new URLSearchParams(Object.entries(formData)).toString();
    response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/userBatchAnswers/sendZoomLinkEmailToTrainer?access_token=${
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
      console.log(data, "er");
    } else {
      if (data.code == 200) {
        toast.success(data.msg);
        setAssessmentBucket([]);
        setAssessmentList([]);
      } else {
        toast.error("Something went wrong!");
      }
    }
    button.disabled = false;
    button.className =
      "rounded bg-violet-500 hover:bg-violet-600 transition-colors duration-150 px-5 py-4 font-bold text-white sm:rounded-l-none sm:rounded-r-md";
    button.innerText = "Send Email";
  };
  console.log(batchData, "batchData");
  return (
    <div className="flex flex-col">
      {/* <span
        onClick={() => setSchedulePop(!schedulePop)}
        className="flex mb-4 cursor-pointer justify-between items-center p-3 text-sm font-medium text-gray-600 bg-gray-100 hover:underline border-t border-gray-200"
      >
        <p>Schedule New Meeting</p>
        <div className="flex hover:transform hover:scale-105 ease-in-out hover:duration-150 flex-col p-2 bg-blue-500 text-white text-xl rounded-md ">
          <IoCalendarSharp />
        </div>
      </span> */}
      {/* <span
        // onClick={() => setSchedulePop(!schedulePop)}
        onClick={() => {
          setOpenZoom(!openZoom);
          setOpen(false);
        }}
        className="flex cursor-pointer mt-1 justify-between items-center p-3 text-sm font-medium text-white bg-sky-400 border-t border-gray-200"
      >
        <p>View Scheduled Meetings ({zoomData?.length || 0})</p>
        <motion.div
          layout
          {...animations}
          animate={{ scaleY: openZoom ? -1 : 1 }}
          className=" text-2xl mx-3 relative"
        >
          <IoChevronDown />
        </motion.div>
      </span> */}
      <motion.div {...animations} animate={{ height: !openZoom ? 0 : "25rem" }}>
        <ul
          id="journal-scroll"
          className={`${
            openZoom ? "overflow-y-auto h-[25rem]" : " h-0 overflow-hidden"
          }  px-3  text-sm text-gray-700  ease-in-out transition-all`}
        >
          <div className="mt-4 flex w-full  flex-col  sm:flex-row ">
            <div className="grow rounded border-2  border-gray-300 py-2 px-3 focus:border-emerald-500 focus:outline-none sm:rounded-l-md sm:rounded-r-none sm:border-r-0">
              {zoomBucket.map((data, index) => {
                return (
                  <span
                    key={index}
                    id="badge-dismiss-yellow"
                    className="inline-flex my-0.5 items-center py-1 px-2 mr-2 text-xs capitalize font-medium text-yellow-800 bg-yellow-100 rounded dark:bg-yellow-200 dark:text-yellow-800"
                  >
                    {data.name}
                    <button
                      onClick={() => zoomManager(data)}
                      type="button"
                      className="inline-flex items-center p-0.5 ml-2 text-sm text-yellow-400 bg-transparent rounded-sm hover:bg-yellow-200 hover:text-yellow-900 dark:hover:bg-yellow-300 dark:hover:text-red-900"
                      data-dismiss-target="#badge-dismiss-yellow"
                      aria-label="Remove"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="sr-only">Remove badge</span>
                    </button>
                  </span>
                );
              })}
            </div>
            <button
              onClick={() => {
                zoomBucket.length == 0
                  ? toast.warn("No Forms Added in Mail List")
                  : sendZoomEmail();
              }}
              id="zoomemailbutton"
              className="rounded bg-violet-500 hover:bg-violet-600 transition-colors duration-150 px-5 py-4 font-bold text-white sm:rounded-l-none sm:rounded-r-md"
            >
              Send Email
            </button>
          </div>
          {zoomData?.map((zoom) => {
            return (
              <ScheduledMeeting
                key={uuid_v4()}
                zoom={zoom}
                zoomBucket={zoomBucket}
                zoomManager={zoomManager}
                zoomList={zoomList}
              />
            );
          }) || (
            <h3 className="mb-5 text-xl text-center font-medium text-gray-700 ">
              No Meetings Scheduled
            </h3>
          )}
        </ul>
      </motion.div>
      <span
        // onClick={() => setSchedulePop(!schedulePop)}
        onClick={() => {
          setOpen(!open);
          setOpenZoom(false);
        }}
        className="flex cursor-pointer  mt-1 justify-between items-center p-3 text-sm font-medium text-white bg-sky-400 border-t border-gray-200"
      >
        <p>
          View Scheduled Assessments, Attendance & Feedback Forms (
          {assessmentData?.length || 1})
        </p>
        <motion.div
          layout
          {...animations}
          animate={{ scaleY: open ? -1 : 1 }}
          className=" text-2xl mx-3 relative"
        >
          <IoChevronDown />
        </motion.div>
      </span>
      <motion.div {...animations} animate={{ height: !open ? 0 : "25rem" }}>
        <ul
          id="journal-scroll"
          className={`${
            open ? "overflow-y-auto h-[25rem]" : " h-0 overflow-hidden"
          }  px-3   text-sm text-gray-700  ease-in-out transition-all`}
        >
          <div className="mt-4 flex w-full  flex-col  sm:flex-row ">
            <div className="grow rounded border-2  border-gray-300 py-2 px-3 focus:border-emerald-500 focus:outline-none sm:rounded-l-md sm:rounded-r-none sm:border-r-0">
              {assessmentBucket.map((data, index) => {
                return (
                  <span
                    key={index}
                    id="badge-dismiss-yellow"
                    className="inline-flex my-0.5 items-center py-1 px-2 mr-2 text-xs capitalize font-medium text-yellow-800 bg-yellow-100 rounded dark:bg-yellow-200 dark:text-yellow-800"
                  >
                    {data.assessmentType}: {data.name}
                    {data.assessmentType === "attendance" ? (
                      <button
                        onClick={() => handleMailSelect()}
                        type="button"
                        className="inline-flex items-center p-0.5 ml-2 text-sm text-yellow-400 bg-transparent rounded-sm hover:bg-yellow-200 hover:text-yellow-900 dark:hover:bg-yellow-300 dark:hover:text-red-900"
                        data-dismiss-target="#badge-dismiss-yellow"
                        aria-label="Remove"
                      >
                        <svg
                          aria-hidden="true"
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span className="sr-only">Remove badge</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => assessmentManager(data)}
                        type="button"
                        className="inline-flex items-center p-0.5 ml-2 text-sm text-yellow-400 bg-transparent rounded-sm hover:bg-yellow-200 hover:text-yellow-900 dark:hover:bg-yellow-300 dark:hover:text-red-900"
                        data-dismiss-target="#badge-dismiss-yellow"
                        aria-label="Remove"
                      >
                        <svg
                          aria-hidden="true"
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span className="sr-only">Remove badge</span>
                      </button>
                    )}
                  </span>
                );
              })}
            </div>
            <button
              onClick={() => {
                assessmentBucket.length == 0
                  ? toast.warn("No Forms Added in Mail List")
                  : sendEmail();
              }}
              id="emailbutton"
              className="rounded bg-violet-500 hover:bg-violet-600 transition-colors duration-150 px-5 py-4 font-bold text-white sm:rounded-l-none sm:rounded-r-md"
            >
              Send Email
            </button>
          </div>
          {assessmentData?.map((test) => {
            return (
              <ScheduledAssessments
                key={uuid_v4()}
                test={test}
                id={id}
                batchData={batchData}
                getAssessmentLinks={getAssessmentLinks}
                assessmentBucket={assessmentBucket}
                assessmentManager={assessmentManager}
                assessmentList={assessmentList}
              />
            );
          }) || (
            <h3 className="mb-5 text-xl text-center font-medium text-gray-700 ">
              No Assessments Schedule
            </h3>
          )}
          <li>
            <div className="flex flex-col items-center px-2 py-1   rounded  ">
              <div className="flex w-full justify-between items-center">
                <div className="flex flex-col">
                  <h1 className="text-lg font-medium w-[25rem]">
                    Attendance
                    <button
                      onClick={handleMailSelect}
                      className={`text-sm ${
                        assessmentList.includes("attendance")
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-yellow-400 hover:bg-yellow-500"
                      } ml-2  items-center px-2 text-white rounded-md py-1`}
                    >
                      {assessmentList.includes("attendance")
                        ? "Remove"
                        : "Add to Mail List"}
                    </button>
                  </h1>
                  <span className="flex flex-col w-full items-start">
                    <h1 className="text-md  text-gray-600 ">
                      <a
                        href={`${
                          import.meta.env.VITE_PUBLIC_LINK
                        }/attendance-form/${batchData.batchId}?programType=${
                          batchData?.program?.programType
                        }&client=${userData?.client}&key=${
                          userData?.tenantKey
                        }`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {`${import.meta.env.VITE_PUBLIC_LINK}/attendance-form/${
                          batchData.batchId
                        }?programType=${batchData?.program?.programType}`}
                      </a>
                    </h1>
                  </span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}

export default Schedule;
