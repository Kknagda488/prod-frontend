import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { v4 as uuid_v4 } from "uuid";

function FeedbackQuestionLister({ setResult, selectedScale }) {
  // const [newQuestions, setNewQuestions] = useState(allQuestion);
  var questionObject = {
    id: uuid_v4(),
    question: "",
    questionType: "ratings",
    point: 0,
    answers: selectedScale?.data,
  };
  const [fields, setFields] = useState([questionObject]);
  const [ans, setAns] = useState([]);
  useEffect(() => {
    questionObject = {
      id: uuid_v4(),
      question: "",
      questionType: "ratings",
      point: 0,
      answers: selectedScale?.data,
    };
  }, [selectedScale?.data, selectedScale]);

  var ansObj = "";
  // console.log(fields, "jkdj");
  const [obj, setObj] = useState();
  // console.log(fields, "oiuy");
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
    <ul className="flex flex-col w-full my-2 ">
      <div className="w-full  px-4 ">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6  rounded-lg  border-0">
          {/* <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between space-x-4 items-center">
              <h6 className="text-blueGray-700 w-40 text-xl font-semibold  ">
                Template Name:
              </h6>
              <input
                type="text"
                placeholder="Set Template Title"
                className="flex w-2/3 border-b-2 border-blue-500  outline-none"
                onBlur={(e) => setName(e.target.value)}
                defaultValue={name}
                required
              />
              <button
                className="bg-sky-500 text-white active:bg-sky-600 font-semibold  text-sm px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                //type="submit"
                onClick={() => setResult(fields)}
              >
                Submit
              </button>
            </div>
          </div> */}
          <div className="flex-auto px-4  py-10 pt-0 ">
            <div>
              {fields?.map((question, index) => {
                return (
                  <div
                    className="my-4 border-b-2 pb-2 border-sky-500 "
                    key={index}
                  >
                    <div className="text-center flex justify-between items-center">
                      <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-semibold ">
                        Question #{index + 1}
                      </h6>
                      <button
                        className="bg-sky-500 text-white active:bg-sky-600 h-fit font-semibold  text-sm px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                      >
                        Remove Question #{index + 1}
                      </button>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="w-full lg:w-12/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block  text-blueGray-600 text-sm font-semibold mb-2"
                            htmlFor="grid-password"
                          >
                            Question
                          </label>
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-gray-50 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            name="question"
                            defaultValue={question.question}
                            required
                            onBlur={(e) => (question.question = e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-1/2 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block  text-blueGray-600 text-sm font-semibold mb-2"
                            htmlFor="grid-password"
                          >
                            Question Type
                          </label>
                          <select
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-gray-50 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            required="required"
                            name="questionType"
                            defaultValue={question.type}
                            onBlur={(e) =>
                              (question.questionType = e.target.value)
                            }

                          //   selected={
                          //     question.type == parseInt(question.correctAnswer)
                          //       ? "selected"
                          //       : null
                          //   }
                          >
                            <option
                              value={question.questionType}
                              selected
                              hidden
                            >
                              {question?.questionType == "ratings"
                                ? "Ratings"
                                : null}
                              {question?.questionType == "response"
                                ? "Personal Response"
                                : null}
                              {question?.questionType == ""
                                ? "Select a Type"
                                : null}
                            </option>

                            <option value="ratings">Rating</option>
                            <option value="response">Personal Response</option>
                          </select>
                        </div>
                      </div>

                      {/* <div className="w-full lg:w-1/2 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block  text-blueGray-600 text-sm font-semibold mb-2"
                          htmlFor="grid-password"
                        >
                          Points
                        </label>
                        <input
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-gray-50 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          name="points"
                          defaultValue={question.point}
                          onBlur={(e) => (question.point = e.target.value)}
                          required
                        />
                      </div>
                    </div> */}
                    </div>

                    <hr className="mt-6 border-b-1 border-blueGray-300" />
                    {/* <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-semibold ">
                    Answer Information
                  </h6>
                  <button
                    className="bg-sky-500 text-white active:bg-sky-600 font-semibold  text-sm px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    type="button"
                    //  onClick={() => question.answers.push("")}
                    onClick={() =>
                      //   setFields([
                      //     ...fields,
                      //     // { ...fields[index] },
                      //     fields[index].answers.push(""),
                      //   ])
                      addOption(question.id)
                    }
                  >
                    Add Option
                  </button>
                  <div className="flex  flex-wrap">
                    <div className="w-full flex flex-col lg:w-6/12 px-4">
                     
                      {question?.answers?.map((opt, i) => {
                        return (
                          <div className="relative w-full mb-3">
                            <label
                              className="block  text-blueGray-600 text-sm font-semibold mb-2"
                              htmlFor="grid-password"
                            >
                              Option {i}
                            </label>
                            <div className="flex ">
                              <input
                                type="text"
                                required
                                defaultValue={opt}
                                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-gray-50 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                onBlur={(e) =>
                                  (question.answers[i] = e.target.value)
                                }
                              />

                              <button
                                type="button"
                                title="Remove Option"
                                className="flex items-center text-red-500 text-md "
                                onClick={() => {
                                  //var optIndex = question.answers.indexOf(opt);
                                  //question.answers.splice(optIndex, 1);
                                  removeOption(question.id, opt);
                                }}
                              >
                                <AiFillDelete className="text-xl" /> #{i + 1}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block  text-blueGray-600 text-sm font-semibold mb-2"
                          htmlFor="grid-password"
                        >
                          Correct Option
                        </label>
                        <select
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-gray-50 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          required="required"
                          name="correctOption"
                          onBlur={(e) =>
                            (question.correctAnswer = e.target.value)
                          }
                        >
                          <option selected disabled hidden value="">
                            Select Correct Option
                          </option>
                          {question?.answers?.map((as, i) => {
                            return (
                              <option
                                selected={
                                  i + 1 == parseInt(question.correctAnswer)
                                    ? "selected"
                                    : null
                                }
                                value={`${i + 1}`}
                              >
                                {`option #${i + 1}`}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div> */}

                    {/* <hr className="mt-6 border-b-1 border-blueGray-300" />

                  <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-semibold ">
                    Extra Information
                  </h6>
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-12/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block  text-blueGray-600 text-sm font-semibold mb-2"
                          htmlFor="grid-password"
                        >
                          Explaination
                        </label>
                        <textarea
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-gray-50 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          rows="4"
                          defaultValue={question.explanation}
                        />
                      </div>
                      <div className="relative w-full mb-3">
                        <label
                          className="block  text-blueGray-600 text-sm font-semibold mb-2"
                          htmlFor="grid-password"
                        >
                          Message for Correct Option
                        </label>
                        <textarea
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-gray-50 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          rows="4"
                          defaultValue={question.messageForCorrectAnswer}
                        />
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="block  text-blueGray-600 text-sm font-semibold mb-2"
                          htmlFor="grid-password"
                        >
                          Message for Incorrect Option
                        </label>
                        <textarea
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-gray-50 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          rows="4"
                          defaultValue={question.messageForIncorrectAnswer}
                        />
                      </div>
                    </div> 
                  </div>*/}
                  </div>
                );
              })}
              <div className="flex w-full justify-between items-center">
                <button
                  className="bg-sky-500  text-white active:bg-sky-600 font-semibold  text-sm px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setFields([...fields, questionObject])}
                >
                  Add Question #{fields.length + 1}
                </button>
                {fields.length == 0 ? null : (
                  <button
                    className="bg-sky-500 text-white active:bg-sky-600 font-semibold  text-sm px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    //type="submit"
                    onClick={() => setResult(fields)}
                  >
                    Submit & Save
                  </button>
                )}
              </div>
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

export default FeedbackQuestionLister;
