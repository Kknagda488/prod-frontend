import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { v4 as uuid_v4 } from "uuid";
// import OptionMapper from "../batchComponents/OptionMapper";
function QuizQuestionLister({ setResult }) {
  // const [newQuestions, setNewQuestions] = useState(allQuestion);

  const [fields, setFields] = useState([
    {
      id: uuid_v4(),
      question: "",
      questionType: "mcq",
      point: "",
      answers: ["", ""],
      correctAnswer: "",
    },
  ]);
  const [ans, setAns] = useState([]);
  var questionObject = {
    id: uuid_v4(),
    question: "",
    questionType: "mcq",
    point: "",
    answers: ["", ""],
    correctAnswer: "",
  };

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
    <ul className="flex flex-col w-full my-6 ">
      <div className="w-full  px-4 mx-auto mt-3">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <h6 className="text-gray-700 w-full text-xl font-bold  ">
              Add Quetions in QuestionBank
            </h6>
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0 bg-violet-200">
            <div>
              {fields?.map((question, index) => (
                <div
                  className="my-4 border-b-2 pb-2 border-sky-500 "
                  key={index}
                >
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
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Question
                        </label>
                        <input
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          name="question"
                          placeholder="Question"
                          defaultValue={question.question}
                          onBlur={(e) => {
                            question.question = e.target.value;
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-1/2 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Question Type
                        </label>
                        <select
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          required="required"
                          name="questionType"
                          defaultValue={question.type}
                          onChange={(e) => {
                            question.questionType = e.target.value;
                            {
                              question.questionType == "multiopt"
                                ? (question.correctAnswer = [])
                                : (question.correctAnswer = "");
                            }
                            question.answers = ["", ""];
                            setFields([...fields]);
                          }}
                        >
                          <option value={question.questionType} selected hidden>
                            {question?.questionType == "mcq"
                              ? "Multiple Choice"
                              : null}{" "}
                            {question?.questionType == "fib"
                              ? "Fill in the Blanks"
                              : null}{" "}
                            {question?.questionType == "tf"
                              ? "True or False"
                              : null}{" "}
                            {question?.questionType == "multiopt"
                              ? "Multi-Option"
                              : null}{" "}
                            {question?.questionType == "response"
                              ? "Response"
                              : null}{" "}
                            {question?.questionType == "text" || ""
                              ? "Select a Type"
                              : null}
                          </option>
                          <option value="mcq">Multiple Choice</option>
                          <option value="fib">Fill in the Blanks</option>
                          <option value="tf">True or False</option>
                          <option value="multiopt">Multi-Option</option>
                          <option value="response">Response</option>
                        </select>
                      </div>
                    </div>

                    <div className="w-full lg:w-1/2 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Points
                        </label>
                        <input
                          id="input-hide"
                          type="number"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          name="points"
                          placeholder="Points"
                          defaultValue={question.point}
                          onWheel={(e) => e.target.blur()}
                          onBlur={(e) => (question.point = e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="mt-6 border-b-1 border-blueGray-300" />
                  <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                    Answer Information
                  </h6>
                  {question?.questionType !== "response" ? (
                    <>
                      <button
                        className="bg-sky-500 text-white active:bg-sky-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                        type="button"
                        //  onClick={() => question.answers.push("")}
                        onClick={() =>

                          addOption(question.id)
                        }
                      >
                        Add Option
                      </button>
                      <div className="flex  flex-wrap">
                        <div className="w-full flex flex-col lg:w-6/12 px-4">
                          {/* <OptionMapper ans={ans} question={question} /> */}
                          {question?.answers?.map((opt, i) => {
                            return (
                              <div
                                key={uuid_v4()}
                                className="relative w-full mb-3"
                              >
                                <label
                                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                  htmlFor="grid-password"
                                >
                                  Option {i + 1}
                                </label>
                                <div className="flex ">
                                  <input
                                    type="text"
                                    required
                                    defaultValue={opt}
                                    placeholder={`Option ${i + 1}`}
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
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
                                    <AiFillDelete className="text-xl" /> #
                                    {i + 1}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="w-full lg:w-6/12 px-4">
                          <div className="relative w-full mb-3">
                            <label
                              className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                              htmlFor="grid-password"
                            >
                              Correct Option
                            </label>
                            {question.questionType == "multiopt" ? (
                              <div className="bg-white flex flex-col px-3 py-1 h-full">
                                {question?.answers?.map((as, i) => {
                                  return (
                                    <div
                                      key={uuid_v4()}
                                      className="form-check  "
                                    >
                                      <input
                                        checked={question.correctAnswer.find(
                                          (id) => id === i + 1
                                        )}
                                        className=" h-4 w-4 text-blue-400 bg-white rounded  bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer focus:outline-none transition duration-200 mt-1 align-top"
                                        type="checkbox"
                                        value={`${i + 1}`}
                                        onChange={(e) => {
                                          const index =
                                            question.correctAnswer.indexOf(
                                              e.target.value
                                            );
                                          if (index > -1) {
                                            question.correctAnswer.splice(
                                              index,
                                              1
                                            );
                                          } else {
                                            question.correctAnswer.push(
                                              parseInt(e.target.value)
                                            );
                                          }
                                        }}
                                        name={`option#${i + 1}`}
                                        id={`option#${i + 1}`}
                                      />
                                      <label className="form-check-label inline-block  text-gray-700 font-semibold ">
                                        {`Option #${i + 1}`}
                                      </label>

                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <select
                                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
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
                                        i + 1 ==
                                          parseInt(question.correctAnswer)
                                          ? "selected"
                                          : null
                                      }
                                      value={`${i + 1}`}
                                      key={uuid_v4()}
                                    >
                                      {`option #${i + 1}`}
                                    </option>
                                  );
                                })}
                              </select>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full lg:w-12/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Correct Answer
                        </label>
                        <input
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          name="correctOption"
                          placeholder="Enter correct answer"
                          defaultValue={question.correctAnswer}
                          onBlur={(e) =>
                            (question.correctAnswer = e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  <hr className="mt-6 border-b-1 border-blueGray-300" />
                </div>
              ))}

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
                    type="submit"
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

export default QuizQuestionLister;
