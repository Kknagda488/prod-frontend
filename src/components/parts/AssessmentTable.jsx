import React, { useState } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import BatchQuestionListAdd from "./QuestionList/BatchQuestionListAdd";
import { v4 as uuid_v4 } from "uuid";
function AssessmentTable({
  questionList,
  bucket,
  setBucket,
  setSelectedRow,
  setPopup,
  next,
  previous,
  pgindex,
  page,
  totalCount,
  setLimit,
  setPage,
  setSearch,
}) {
  var allQuestion = [];
  const questionManager = (questionData) => {
    //console.log(questionData, "okg");
    var doesItemExist;
    var objects;
    if (bucket.length === 0) {
      setBucket([questionData]);
    } else {
      const newState = bucket.map((item) => {
        if (item.batchQuestionId === questionData.batchQuestionId) {
          //item.quantity += 1;
          doesItemExist = true;
        }
        objects = item;
        return item;
      });

      //  console.log(newState);

      if (doesItemExist) {
        const index = bucket.findIndex(
          (item) => item.batchQuestionId === questionData.batchQuestionId
        );
        let newBucket = [...bucket];
        if (index >= 0) {
          newBucket.splice(index, 1);
        } else {
          console.warn(`Cannot remove : ${questionData.batchQuestionId}`);
        }
        setBucket(newBucket);
      } else {
        setBucket([...bucket, questionData]);
      }
    }
  };
  console.log(bucket, "ojo");
  return (
    <div className="mt-2 ">
      <div className="flex flex-row my-2 justify-between items-center">
        <div className="px-2  flex w-full justify-between   ">
          <h5 className="text-md font-normal leading-none text-gray-700 ">
            Add from Existing Question Bank
          </h5>
        </div>

        <div className="relative mt-1 ">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none py-2 ">
            <svg
              className="w-5 h-5 text-gray-500 "
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className="bg-gray-50 border py-1 outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-80 pl-10 p-2.5  "
            placeholder="Search by Type. eg.fib"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-md m-4 bg-sky-600 text-white   ">
            <tr>
              <th scope="col" className="px-8 py-4">
                Use
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>

              <th scope="col" className="px-6 py-3">
                Question
              </th>

              {/* <th scope="col" className="px-6 py-3">
                Actions
              </th> */}
              {/* <th scope="col" className="px-6 py-3">
                Course
              </th>

              // <th scope="col" className="px-6 py-3">
              //   Options
              // </th> */}
            </tr>
          </thead>
          {questionList?.map((question, index) => {
            return (
              <BatchQuestionListAdd
                key={uuid_v4()}
                index={index}
                setPopup={setPopup}
                setSelectedRow={setSelectedRow}
                bucket={bucket}
                question={question}
                allQuestion={allQuestion}
                questionManager={questionManager}
              />
            );
          })}

          {/* <tbody>
            <tr className="bg-white border-b  ">
              <td className="px-6 py-4 text-gray-900">
                {" "}
                <button
                  type="button"
                  className="border border-green-500 bg-green-500 text-white rounded-md px-2 py-1  transition duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
                >
                  Added
                </button>
              </td>
              <td className="px-6 py-4 text-gray-900"> Fill in the blanks</td>
              <td className="px-6 py-4 text-gray-900">What is a function?</td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900  whitespace-nowrap"
              >
                Introduction to JavaScript
              </th>

              <td className=" flex flex-row text-lg px-6 py-4 text-right mt-2">
                <Link
                  href=""
                  // href={`/${link}/${arr._id}`}
                  className="text-black mr-4 hover:underline"
                >
                  <a>
                    <AiOutlineEdit />
                  </a>
                </Link>
                <Link href="" className=" text-black  hover:underline">
                  <a>
                    <AiOutlineDelete />
                  </a>
                </Link>
              </td>
            </tr>
          </tbody> */}
        </table>
      </div>
      <div className="flex flex-row justify-around mt-10 items-center  ">
        <span className="text-sm flex text-gray-700 ">
          <p>Total</p>
          <span className=" px-1 font-normal tracking-wide text-gray-900 ">
            {totalCount}
          </span>
          <p> Questions </p>
        </span>
        <div className="flex">
          <div className="dropdown flex items-center relative">
            <p>Show</p>
            <span className="bg-gray-100 text-gray-700 mx-2  font-normal tracking-wide rounded inline-flex items-center">
              <select
                className="bg-transparent px-3 py-2  outline-none "
                onChange={(e) => {
                  setLimit(e.target.value);
                  setPage(0);
                }}
              >
                <option className="mr-1">5</option>
                <option className="mr-1">10</option>
                <option className="mr-1">20</option>
                <option className="mr-1">30</option>
                <option className="mr-1">40</option>
                <option className="mr-1">50</option>
              </select>
            </span>
            <p>Entries</p>
          </div>
        </div>

        <div>
          <a
            onClick={() => previous()}
            className={` ${page === 0
              ? "hidden"
              : "inline-flex items-center py-2 px-4 ml-3 text-sm font-medium text-gray-700 bg-gray-200 cursor-pointer rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700   "
              }`}
          >
            Previous
          </a>
          <a
            onClick={() => next()}
            className={` ${page >= pgindex - 1
              ? "hidden"
              : "inline-flex items-center py-2 px-4 ml-3 text-sm font-medium text-gray-700 cursor-pointer bg-gray-200 rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700   "
              }`}
          >
            Next
          </a>
        </div>
      </div>
    </div>
  );
}

export default AssessmentTable;
