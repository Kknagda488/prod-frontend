import { Link } from "react-router-dom";
import React, { useState } from "react";

import { MdContentCopy } from "react-icons/md";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { useAuth } from "../../../../context/auth";
import { toast } from "react-toastify";
import DeletePopupCard from "../../DeletePopCard";

function ScheduledAssessments({
  test,
  key,
  id,
  batchData,
  getAssessmentLinks,
  assessmentManager,
  assessmentList,
}) {
  const [copied, setCopied] = useState(false);
  const [selectedRow, setSelectedRow] = useState({
    title: "",
    id: "",
  });
  const { userData, signOut } = useAuth();
  const [popup, setPopup] = useState(false);
  const deleteAssessment = async (id) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/Assessments/deleteById/${id}?access_token=${
          userData?.accessToken
        }`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setPopup(false); // Close the popup
        getAssessmentLinks(); // Update the assessment links after deletion
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting assessment:", error);
      toast.error("An error occurred while deleting the assessment.");
    }
  };

  function copy(link) {
    const el = document.createElement("input");
    el.value = link;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
  }

  const url = `${
    import.meta.env.VITE_PUBLIC_LINK
  }/quiz/${id}/${encodeURIComponent(batchData.name)}/${test?.assessmentType}/${
    test?.assessmentId
  }`;
  console.log("--------------", url);

  return (
    <>
      {popup ? (
        <div className="mx-3 ">
          <div className="fixed z-30  w-full h-full top-0 left-0 items-center   bg-gray-800/40">
            <div className="flex w-full items-start mt-10 justify-center ">
              <div className="relative mx-20 flex flex-col  w-1/2 items-center justify-center bg-white rounded-lg shadow-md px-8 py-2">
                <div className="absolute z-30 bg-white flex w-full justify-end items-end top-0  p-4 ">
                  {/* <IoClose
                onClick={() => {
                  setPopup(false);
                }}
                className="cursor-pointer text-2xl font-semibold text-black "
              /> */}
                </div>
                <div
                  id="journal-scroll"
                  className="w-full max-h-[32rem] h-fit overflow-y-auto mt-8"
                >
                  <DeletePopupCard
                    title={selectedRow.title}
                    cancelDelete={() => setPopup(false)}
                    confirmDelete={() => deleteAssessment(selectedRow.id)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <li key={key} className="space-y-2">
        <div className="flex flex-col items-center px-2 py-1 rounded">
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-col">
              <h1 className="text-lg font-medium w-[25rem]">
                {test?.name} (
                {test?.assessmentType === "pre" ? "Pre-Assessment" : null}
                {test?.assessmentType === "post" ? "Post-Assessment" : null}
                {test?.assessmentType == "custom" ? "Custom" : null}
                {test?.assessmentType === "feedback" ? "Feedback Form" : null})
                <button
                  onClick={() => {
                    assessmentManager({
                      assessmentId: test.assessmentId,
                      name: test.name,
                      assessmentType: test.assessmentType,
                      url: `${
                        test?.assessmentType === "pre" ? "Pre-Assessment" : ""
                      }
                    ${test?.assessmentType === "post" ? "Post-Assessment" : ""}
                    ${
                      test?.assessmentType === "feedback" ? "Feedback Form" : ""
                    }
                    Link: <a href="${url}" target="_blank">${url}</a>`,
                    });
                  }}
                  id={`button${test.assessmentId}`}
                  className={`text-sm ${
                    assessmentList.includes(test.assessmentId)
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-yellow-400 hover:bg-yellow-500"
                  } ml-2 items-center px-2 text-white rounded-md py-1`}
                >
                  {assessmentList.includes(test.assessmentId)
                    ? "Remove"
                    : "Add to Mail List"}
                </button>
              </h1>
              <span className="flex flex-col w-full items-start">
                <h1 className="text-md text-gray-600">{test?.start}</h1>
                <h1 className="text-md text-gray-600">
                  Assessment Id: {test?.assessmentId}
                </h1>
                <h1 className="text-md text-gray-600">
                  Type: {test?.assessmentType}
                </h1>
                <h1 className="text-md text-gray-600 max-w-md">
                  {!copied ? null : `Link: ${url}`}
                </h1>
              </span>
            </div>
            <div className="relative flex flex-row items-center">
              <button
                onClick={() => {
                  setPopup(true);
                  setSelectedRow({
                    title: test.name,
                    id: test?.assessmentId,
                  });
                }}
                className="mr-2"
              >
                <AiOutlineDelete color="red" size={20} />
              </button>
              <Link
                to={`/update-assessment/${test?.assessmentId}`}
                target="_blank"
                className="mr-2 text-black hover:underline"
              >
                <AiOutlineEdit size={20} />
              </Link>
              <button
                onClick={() => copy(url)}
                className="flex w-fit px-4 py-2 text-white font-medium bg-green-500 items-center rounded-md mt-2"
              >
                <MdContentCopy className="mr-1 mt-0.5" />
                {!copied ? "Copy Url" : "Copied!"}
              </button>
            </div>
          </div>
          {/* <div className="flex justify-center mt-2">
            <Link
              to={`/savetemplate/${id}/${batchData.name}/${test?.assessmentType}/${test?.assessmentId}`}
            >
              <a target="_blank" rel="noopener noreferrer">
                <button className="flex py-2 text-blue-500 font-medium float-left row-end rounded-md">
                  Copy Form Template
                </button>
              </a>
            </Link>
          </div> */}
        </div>
      </li>
    </>
  );

  // return (
  //   <li key={key} className="space-y-2">
  //     <div className="flex flex-col items-center px-2 py-1   rounded  ">
  //       <div className="flex w-full justify-between items-center">
  //         <div className="flex flex-col">
  //           <h1 className="text-lg font-medium w-[25rem]">
  //             {test?.name} (
  //             {test?.assessmentType == "pre" ? "Pre-Assessment" : null}
  //             {test?.assessmentType == "post" ? "Post-Assessment" : null}
  //             {test?.assessmentType == "feedback" ? "Feedback Form" : null})
  //             <button
  //               onClick={() => {
  //                 assessmentManager({
  //                   assessmentId: test.assessmentId,
  //                   name: test.name,
  //                   assessmentType: test.assessmentType,
  //                   url: `${test?.assessmentType == "pre" ? "Pre-Assessment" : ""
  //                     }
  //                   ${test?.assessmentType == "post" ? "Post-Assessment" : ""}
  //                   ${test?.assessmentType == "feedback" ? "Feedback Form" : ""
  //                     } Link: <a href="${url}" target="_blank">${url}</a>`,
  //                 });
  //               }}
  //               id={`button${test.assessmentId}`}
  //               className={`text-sm ${assessmentList.includes(test.assessmentId)
  //                 ? "bg-red-500 hover:bg-red-600"
  //                 : "bg-yellow-400 hover:bg-yellow-500"
  //                 } ml-2  items-center px-2 text-white rounded-md py-1`}
  //             >
  //               {assessmentList.includes(test.assessmentId)
  //                 ? "Remove"
  //                 : "Add to Mail List"}
  //             </button>
  //           </h1>
  //           <span className="flex flex-col w-full items-start">
  //             <h1 className="text-md  text-gray-600 ">{test?.start}</h1>
  //             <h1 className="text-md text-gray-600 ">
  //               Assessment Id: {test?.assessmentId}
  //             </h1>
  //             <h1 className="text-md text-gray-600 ">
  //               Type: {test?.assessmentType}
  //             </h1>

  //             <h1 className="text-md text-gray-600 max-w-md">
  //               {!copied ? null : `Link: ${url}`}
  //             </h1>
  //           </span>
  //         </div>
  //         <div className="relative flex flex-col justify-end items-end">
  //           <button
  //             onClick={() => copy(url)}
  //             className="flex w-fit px-4 py-2 text-white font-medium bg-green-500 items-center rounded-md mt-2"
  //           >
  //             <MdContentCopy className="mr-1 mt-0.5" />
  //             {!copied ? "Copy Url" : "Copied!"}
  //           </button>
  //           <div className="flex w-fit items-center mt-2">
  //             <button onClick={() => copy(url)}>
  //               <AiOutlineDelete color="red" />
  //             </button>
  //             <Link
  //               to=""
  //               // href={`/${link}/${arr._id}`}
  //               className="text-black mr-4 hover:underline"
  //             >
  //               <a>
  //                 <AiOutlineEdit />
  //               </a>
  //             </Link>
  //           </div>
  //           <Link
  //             to={`/savetemplate/${id}/${batchData.name}/${test?.assessmentType}/${test?.assessmentId}`}
  //           >
  //             <a target="_blank" rel="noopener noreferrer">
  //               <button className="flex w-fit py-2 text-blue-500 font-medium items-center rounded-md mt-2">
  //                 Copy Form Template
  //               </button>
  //             </a>
  //           </Link>
  //         </div>

  //       </div>
  //     </div>
  //   </li>
  // );
}

export default ScheduledAssessments;
