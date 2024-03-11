import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuid_v4 } from "uuid";
function OptionMapper({ ans, question }) {
  return (
    <>
      {question.answers.map((opt, i) => {
        return (
          <div key={uuid_v4()} className="relative w-full mb-3">
            <label
              className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Option {i}
            </label>
            <div className="flex ">
              <input
                type="text"
                defaultValue={opt}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                onBlur={(e) => (question.answers[i] = e.target.value)}
              />
              {opt}
              <button
                type="button"
                title="Remove Option"
                className="flex items-center text-red-500 text-md "
                onClick={() => {
                  var optIndex = question.answers.indexOf(opt);
                  question.answers.splice(optIndex, 1);
                }}
              >
                <AiFillDelete className="text-xl" /> #{i + 1}
              </button>
            </div>
            {/* <button
              type="button"
              title="Remove Option"
              className="flex items-center text-red-500 text-md "
              onClick={() => {
                var optIndex = question.answers.indexOf(opt);
                question.answers.splice(optIndex, 1);
              }}
            >
              <AiFillDelete className="text-xl" /> #{i + 1}
            </button> */}
          </div>
        );
      })}
    </>
  );
}

export default OptionMapper;
