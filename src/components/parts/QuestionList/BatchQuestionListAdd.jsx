import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/auth";
import { toast } from "react-toastify";

function BatchQuestionListAdd({
  question,
  allQuestion,
  questionManager,
  setSelectedRow,
  setPopup,
  bucket,
  index,
}) {
  const [add, setAdd] = useState(false);
  const { userData } = useAuth();
  // const [allQuestions, setAllQuestions] = useState([]);
  const [css, setCss] = useState("bg-sky-500 border-sky-500 hover:bg-sky-600");
  useEffect(() => {
    const colorchanger = bucket.map((item) => {
      if (item.batchQuestionId == question?.batchQuestionId) {
        //setCss("bg-green-500 border-green-400 hover:bg-green-500");
        setAdd(true);
      }
      return item;
    });
  }, [bucket]);
  const deleteFromBatchQuestion = async (id) => {
    const response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/FormBatchquestions/delete/${id}?access_token=${
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
      return Promise.resolve(data);
    } else {
      toast.error(data.message);
      return Promise.reject(data.message);
    }
  };

  return (
    <tbody>
      <tr className="bg-white border-b  ">
        {console.log("====================", question)}
        <td className="px-6 py-4 text-gray-900">
          <button
            type="button"
            onClick={() => {
              // setAdd(!add);
              questionManager(question);
            }}
            className={`border  ${
              add
                ? "bg-green-500 border-green-400 hover:bg-green-500"
                : "bg-sky-500 border-sky-500 hover:bg-sky-600"
            } text-white rounded-md px-2 py-1  transition duration-75 ease select-none  focus:outline-none focus:shadow-outline`}
          >
            {add ? "Added" : "Add"}
          </button>
        </td>
        <td className="px-6 py-4 text-gray-900"> {question.type}</td>
        <td className="px-6 py-4 text-gray-900">{question.name}</td>
      </tr>
    </tbody>
  );
}

export default BatchQuestionListAdd;
