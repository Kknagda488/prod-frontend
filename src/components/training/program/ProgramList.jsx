
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { useAuth } from "../../../context/auth";
import BackButton from "./BackButton";
function ProgramList({
  index,
  program,
  programManager,
  bucket,
  fetchProgramList,
  setBatchListPop,
  setId,
  setSelectedRow,
  setPopup,
}) {
  const [add, setAdd] = useState(false);
  const { userData, signOut } = useAuth()
  // const [allQuestions, setAllQuestions] = useState([]);
  const navigate = useNavigate();
  const [css, setCss] = useState("bg-sky-500 border-sky-500 hover:bg-sky-600");
  useEffect(() => {
    const colorchanger = bucket.map((item) => {
      if (item.id == program?.id) {
        //setCss("bg-green-500 border-green-400 hover:bg-green-500");
        setAdd(true);
      }
      return item;
    });
  }, [bucket]);
  console.log("---------------progrram", program)
  const programStartDate = new Date(program.programStartDate);
  program.programStartDate = programStartDate.toISOString().split('T')[0];

  const programEndDate = new Date(program.programEndDate);
  program.programEndDate = programEndDate.toISOString().split('T')[0];

  return (
    <>
      <tr className="bg-white border-b  odd:bg-white even:bg-gray-50">
        <td className="px-6 py-4 text-gray-900">
          <button
            type="button"
            onClick={() => {
              // setAdd(!add);
              navigate(`/program/${program?.id}`)
              // setId(program?.id)
              // setBatchListPop(true)
              // // programManager(program);
            }}
            className={`border  ${add
              ? "bg-green-500 border-green-400 hover:bg-green-500"
              : "bg-sky-500 border-sky-500 hover:bg-sky-600"
              } text-white rounded-md px-2 py-1  transition duration-75 ease select-none  focus:outline-none focus:shadow-outline`}
          >
            {add ? "Added" : "Add"}
          </button>
        </td>
        <td className="px-6 py-4 text-gray-900">{program.programName}</td>
        <td className="px-6 py-4 text-gray-900">{program.clientName}</td>
        <td className="px-6 py-4 text-gray-900">
          {program.programType == "1"
            ? "Open"
            : program.programType == "0"
              ? "Close"
              : "-"}
        </td>
        <td className="px-6 text-gray-900">{program.programStartDate}</td>
        <td className="px-6 text-gray-900">{program.programEndDate}</td>
        <td className="px-6 py-4 text-gray-900">
          {program.trainingType == "1"
            ? "Class Room Training"
            : program.trainingType == "2"
              ? "Virtual Training"
              : "-"}
        </td>
        <td className="px-6 py-4 text-gray-900">
          {program.trainingType == "1" && program.location
            ? program.location
            : "-"}
        </td>
        <td className=" flex  pl-10 flex-row px-6 py-4  mt-2">
          {userData?.userType == "1" ? (
            <>
              <div className="text-gray-700 mr-4 hover:underline cursor-pointer">
                <Link to={`/program/UpdateProgram/${program.id}`}>
                  <AiOutlineEdit />
                </Link>
              </div>
              <div
                className="text-red-700 mr-4 hover:underline cursor-pointer"
                onClick={() => {
                  setPopup(true);
                  setSelectedRow({
                    title: program.programName,
                    id: program.id,
                  });
                }}
              >
                <AiOutlineDelete color="red" />
              </div>
            </>
          ) : null}
        </td>
      </tr>
    </>
  );
}

export default ProgramList;
