import React, { useState } from "react";
import Select from "react-select";
import { v4 as uuid_v4 } from "uuid";
function BatchTemplateList({
  templateList,
  saveTempAssessments,
  term,
  selectedScale,
}) {
  const [selectedTemplate, setSelectedTemplate] = useState([]);
  const templateOptions = templateList?.map((temp) => {
    return {
      value: temp.questionBunchOfAssessment,
      label: temp.name,
      description: temp.description,
    };
  });
  const searchTerm = term;

  const result = templateOptions?.filter((s) => s.description === searchTerm);

  var preview = [];
  var newQuestionBunch;
  if (selectedTemplate?.length !== 0) {
    var a = JSON.parse(selectedTemplate?.value);
    if (term == "pre" || term == "post") {
      newQuestionBunch = a;
      const c = a.map((q) => {
        preview = [...preview, q.question];
        return q;
      });
    } else {
      const b = a.map((q) => {
        var objects = {
          ...q,
          answers: selectedScale?.data,
        };
        return objects;
      });
      console.log(b, "poiuyt");
      const c = a.map((q) => {
        preview = [...preview, q.question];
        return q;
      });
      newQuestionBunch = b;
    }
  }
  //setBucket(a);
  const styles = {
    container: (base) => ({
      ...base,
      flex: 1,
    }),
    control: (base) => ({
      ...base,
      border: "1px solid rgb(209 213 219)",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid rgb(17 24 39)",
      },
    }),
    input: (base) => ({
      ...base,
      color: "rgb(75 85 99)",
      paddingLeft: "6px",
      paddingBottom: "3px",
      fontSize: "1rem",
      lineHeight: "1.25rem",
      // opacity: "0 !important",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#a1a9bb",
      paddingLeft: "6px",

      fontSize: "0.870rem",
      lineHeight: "1.25rem",
    }),
  };
  const handleChange = (option) => {
    setSelectedTemplate(option);
    preview = [];
  };
  // console.log(preview, "ojuihu");
  return (
    <div className="flex flex-col">
      <div className="flex flex-col w-full">
        <label className="leading-loose">Select Template</label>
        <div className="relative focus-within:text-gray-600 text-gray-400">
          <Select
            //isMulti={true}
            options={result}
            onChange={handleChange}
            styles={styles}
            placeholder="Select Template"
          />
        </div>
        <label className="leading-loose text-lg font-medium mt-5">
          Preview Question List
        </label>
        {preview?.length > 0 ? (
          <ul
            id="journal-scroll"
            role="list"
            className="my-7 py-4 space-y-5 h-96 overflow-y-scroll"
          >
            {preview.map((question) => {
              return (
                <li key={uuid_v4()} className="flex space-x-3 ">
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 w-5 h-5 text-green-600 "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Check icon</title>
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    {question}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <label className="leading-loose text-center text-lg font-normal">
            No Questions Found!
          </label>
        )}
      </div>
      <button
        type="button"
        onClick={() => saveTempAssessments(newQuestionBunch)}
        className="bg-sky-500 mt-4 truncate flex justify-center items-center w-full text-white px-5 py-2 rounded-md focus:outline-none"
      >
        Save Assesments & View
      </button>
    </div>
  );
}

export default BatchTemplateList;
