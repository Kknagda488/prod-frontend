import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { v4 as uuid_v4 } from "uuid";
function CustomQuestionFeedback({
  allQuestion,
  updateAeessment,
  questionjson,
  setResult,
  setName,
  description,
  name,
}) {
  // const [newQuestions, setNewQuestions] = useState(allQuestion);
  const [fields, setFields] = useState([]);
  const [ans, setAns] = useState([]);
  var questionObject = {
    id: uuid_v4(),
    question: "",
    questionType: "",
    point: "",
    answers: description?.data,
    correctAnswer: "",
    messageForCorrectAnswer: "",
    messageForIncorrectAnswer: "",
    explanation: "",
  };
  useEffect(() => {
    setFields(allQuestion);
  }, [allQuestion]);

  var ansObj = "";
  console.log(fields, "jkdj");
  const [obj, setObj] = useState();
  console.log(fields, "oiuy");
  //console.log(obj);
  const addOption = (id) => {
    const index = fields.findIndex((item) => item.id === id);

    let newFields = [...fields];
    if (index >= 0) {
      var replaceOption = newFields[index];
      //newFields.splice(index, 1);
      replaceOption.answers.push("");
    } else {
      console.warn(`Cannot remove : ${id}`);
    }
    //var updatedFields = [...newFields];
    setFields(newFields);
  };
  const removeOption = (id, roption) => {
    const index = fields.findIndex((item) => item.id === id);
    const optionIndex = fields[index].answers.findIndex(
      (opts) => opts === roption
    );

    let newFields = [...fields];
    if (index >= 0) {
      var replaceOption = newFields[index].answers.splice(optionIndex, 1);
      //newFields.splice(index, 1);
      //replaceOption.answers.push("");
    } else {
      console.warn(`Cannot remove : ${id}`);
    }
    //var updatedFields = [...newFields];
    setFields(newFields);
  };
  const removeQuestion = (id) => {
    var doesItemExist;

    const newState = fields.map((item) => {
      if (item.id === id) {
        //item.quantity += 1;
        doesItemExist = true;
      }
      //  objects = item;
      return item;
    });

    //  console.log(newState);

    if (doesItemExist) {
      const index = fields.findIndex((item) => item.id === id);

      let newFields = [...fields];
      if (index >= 0) {
        var replaceOption = newFields[index];
        newFields.splice(index, 1);
      } else {
        console.warn(`Cannot remove : ${id}`);
      }
      //var updatedFields = [...newFields];
      setFields(newFields);
    }
  };
  const RenderQuestions = () => (
    <ul className="flex flex-col w-full my-6">
      <div className="w-full lg:w-10/12 px-4 mx-auto mt-6">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            {updateAeessment === 'updateAeessment' ? (
              <h6 className="text-gray-700 w-full text-xl font-bold">
                Add Questions in Question Bank
              </h6>
            ) : (
              <div className="text-center flex justify-between space-x-4 items-center">
                <h6 className="text-blueGray-700 w-40 text-xl font-bold">
                  Template Name:
                </h6>
                <input
                  type="text"
                  placeholder="Set Template Title"
                  className="flex w-2/3 border-b-2 border-blue-500 outline-none"
                  onMouseLeave={(e) => setName(e.target.value)}
                  defaultValue={name}
                  required
                />
                <button
                  className="bg-sky-500 text-white active:bg-sky-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  onClick={() => setResult(fields)}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0 bg-violet-200">
            <div>
              {fields?.map((question, index) => (
                <div className="my-4 border-b-2 pb-2 border-sky-500" key={index}>
                  <div className="text-center flex justify-between items-center">
                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                      Question #{index + 1}
                    </h6>
                    <button
                      className="bg-sky-500 text-white active:bg-sky-600 h-fit font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                    >
                      Remove Question #{index + 1}
                    </button>
                  </div>
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-12/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                          Question
                        </label>
                        <input
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          name="question"
                          defaultValue={question.question}
                          onBlur={(e) => (question.question = e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-1/2 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                          Question Type
                        </label>
                        <select
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          required="required"
                          name="questionType"
                          defaultValue={question.type}
                          onBlur={(e) =>
                            (question.questionType = e.target.value)
                          }
                        >
                          <option value="" disabled hidden>
                            Select Type
                          </option>
                          <option value="ratings">Rating</option>
                          <option value="response">Personal Response</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <hr className="mt-6 border-b-1 border-blueGray-300" />
                </div>
              ))}
              <button
                className="bg-sky-500 text-white active:bg-sky-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setFields([...fields, questionObject])}
              >
                Add Question
              </button>
              {updateAeessment === "updateAeessment" && (
                <button
                  className="bg-sky-500 text-white active:bg-sky-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  onClick={() => setResult(fields)}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ul>
  );
  return (
    <div className="flex flex-col">
      <RenderQuestions />
    </div>
  );
}

export default CustomQuestionFeedback;
