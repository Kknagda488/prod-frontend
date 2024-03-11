import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuid_v4 } from "uuid";
import FeedbackInput from "./FeedbackInput";
import FeedbackOptions from "./FeedbackOptions";
import { useAuth } from "../../../context/auth";

function CustomFeedback({
  quiz,
  questionList,
  id,
  setType,
  description,
  quizData,
}) {
  const [totalMarks, setTotalMarks] = useState();
  const [add, setAdd] = useState(true);
  const [bucket, setBucket] = useState([]);
  const { userData } = useAuth();
  const [formSubmit, setFormSubmit] = useState([]);
  const [disabler, setDisabler] = useState(false);
  const questionManager = (questionData, selectedData, selectedAnswer) => {
    console.log(questionData, selectedData, "okg");

    var doesItemExist;
    var objects = {
      ...questionData,
      selectedOption: selectedData,
      selectedAnswer: selectedAnswer,
    };
    if (bucket.length === 0) {
      setBucket([objects]);
    } else {
      const newState = bucket.map((item) => {
        if (item.id === objects.id) {
          //item.quantity += 1;
          doesItemExist = true;
        }
        //  objects = item;
        return item;
      });

      //  console.log(newState);

      if (doesItemExist) {
        const index = bucket.findIndex((item) => item.id === objects.id);

        let newBucket = [...bucket];
        if (index >= 0) {
          var replaceOption = newBucket[index];
          newBucket.splice(index, 1);
        } else {
          console.warn(`Cannot remove : ${objects.id}`);
        }
        var updatedBucket = [...newBucket, objects];
        setBucket(updatedBucket);
      } else {
        setBucket([...bucket, objects]);
      }
    }
  };
  console.log(bucket, "ihuih");

  const submitTest = (e) => {
    e.preventDefault();
    setDisabler(true);
    var firstRun = bucket.sort(function (a, b) {
      return a.qnumber - b.qnumber;
    });
    var secondRun = firstRun.sort(function (a, b) {
      return a.qnumber - b.qnumber;
    });
    console.log(secondRun, "secondrun");
    if (
      secondRun?.length === 0 ||
      secondRun?.length !== quiz?.questions.length
    ) {
      toast.error("Please answer all questions");
      return;
    }
    var error = false;
    secondRun.forEach((item) => {
      if (!item.selectedAnswer) {
        error = true;
      }
    });
    if (error) {
      toast.error("Please answer all questions");
      return;
    }
    var formData = {
      batchId: id,
      assessmentId: questionList.assessmentId,
      answerResponseBunch: JSON.stringify(secondRun),
      totalMarks: 0,
    };
    Array.from(e.currentTarget.elements).forEach((field) => {
      if (!field.name) return;
      formData[field.name] = field.value;
    });

    formData = {
      ...formData,
      referenceCode: formData.employeeId,
      obtainMarks: 0,
      result: "Submitted",
    };

    // console.log(sum, "score");
    // console.log(bucket, "submitted");

    // return console.log(formData);
    saveAssessment(formData);
  };

  const saveAssessment = async (formData) => {
    var response;
    console.log(formData);
    let form = new URLSearchParams(Object.entries(formData)).toString();
    console.log(form);
    response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/userBatchAnswers/add?access_token=${userData?.accessToken}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        method: "POST",
        body: form,
      }
    );

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      console.log("er");
      toast.error(data?.error?.message);
    } else {
      console.log(data);
      if (!data.value) {
        toast.error(data.message);
      } else {
        //document.getElementById("quiz-form").reset;
        // setSubmitted(true);
        console.log(data);
        toast.success("Assessment Submitted Succesfully !!");
        setType("submitted");
        setBucket([]);
      }
    }
  };
  console.log("===========quiz data", quizData);
  return (
    <>
      {userData?.client === "axis" ? (
        <>
          <div className="flex flex-col w-full justify-center items-center bg-blue-100/80 px-12 py-5 space-y-3 min-h-screen">
            <form
              className="flex flex-col items-center justify-center max-w-2xl"
              id="quiz"
              onSubmit={submitTest}
            >
              <div className=" w-full  py-5  my-2 bg-white rounded-md shadow-md">
                <div className="flex justify-center">
                  <div className="flex sm:flex-row px-5 justify-center flex-col mb-2 sm:w-full w-[50]  items-center sm:justify-between">
                    <img
                      className="h-auto"
                      style={{ width: "9rem" }}
                      src="/wagon-login.png"
                    />
                    <img
                      className="w-[8rem] h-auto mt-2 sm:mt-0 "
                      src="/axisLogo-1.png"
                    />
                  </div>
                </div>
                <div className="flex flex-col px-20 ">
                  <h3 className="my-3  text-2xl text-center font-bold text-gray-700 ">
                    Feedback Form
                  </h3>
                  <span className="flex justify-center w-full mt-2">
                    <h3 className="mb-3 text-lg text-center font-medium text-gray-700 ">
                      {quiz?.quizTitle}
                    </h3>
                  </span>

                  <h3 className="mb-2 text-md text-center font-medium text-gray-700 ">
                    {quiz?.quizSynopsis}
                  </h3>
                </div>
              </div>
              <div className="flex flex-col w-full space-y-4 px-20 py-12 bg-white rounded-md shadow-md my-2 ">
                <div className="flex flex-row w-full  items-center">
                  <label className="leading-loose w-44 font-semibold text-gray-700">
                    Full Name*
                  </label>
                  <div className="w-full flex-col flex">
                    <input
                      className="px-4  py-2 border-b focus:ring-gray-700 focus:border-gray-800 w-full sm:text-sm border-gray-700  focus:outline-none text-gray-600"
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-row w-full items-center ">
                  <label className="leading-loose w-44 font-semibold text-gray-700">
                    Employee Id*
                  </label>
                  <div className="w-full flex-col flex">
                    <input
                      className="px-4  py-2 border-b focus:ring-gray-700 focus:border-gray-800 w-full sm:text-sm border-gray-700  focus:outline-none text-gray-600"
                      type="text"
                      name="employeeId"
                      placeholder="Employee Id"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-row w-full items-center ">
                  <label className="leading-loose w-44 font-semibold text-gray-700">
                    Email*
                  </label>
                  <div className="w-full flex-col flex">
                    <input
                      className="px-4  py-2 border-b focus:ring-gray-700 focus:border-gray-800 w-full sm:text-sm border-gray-700  focus:outline-none text-gray-600"
                      type="email"
                      name="email"
                      placeholder="Email"
                      required
                    />
                  </div>
                </div>
              </div>
              {quiz?.questions.map((quizes, i) => {
                quizes.qnumber = i;
                return (
                  <div
                    key={uuid_v4()}
                    className="flex flex-col w-full px-10 py-12 bg-white rounded-md shadow-md my-2 "
                  >
                    <span className="flex justify-between">
                      <h3 className="mb-5 text-xl font-medium text-gray-700 ">
                        Question {i + 1}
                      </h3>
                      <h3 className="mb-5 hidden text-lg font-medium text-blue-500 ">
                        Points: N/A
                      </h3>
                    </span>
                    <h3 className="mb-4 text-xl font-medium text-gray-700 ">
                      {quizes.question}
                    </h3>
                    {/* //${description.data.length} */}
                    {quizes?.questionType == "ratings" ? (
                      <>
                        <span
                          className={`grid gap-4 grid-cols-3 md:grid-cols-6 w-full`}
                        >
                          {Array(description.data.length)
                            .fill()
                            .map((_, index) => {
                              return (
                                <FeedbackOptions
                                  key={uuid_v4()}
                                  // options={options}
                                  // index={index}
                                  index={index}
                                  i={i}
                                  bucket={bucket}
                                  quizes={quizes}
                                  description={description}
                                  questionManager={questionManager}
                                  quiz={quiz}
                                />
                              );
                            })}
                        </span>
                        {/* <div className="flex  w-full justify-between px-2 mt-1">
                    <p className="mb-5 text-sm font-medium text-blue-500 ">
                      Poor
                    </p>
                    <p className="mb-5 text-sm font-medium text-blue-500 ">
                      Average
                    </p>
                    <p className="mb-5 text-sm font-medium text-blue-500 ">
                      Good
                    </p>
                    <p className="mb-5 text-sm font-medium text-blue-500 ">
                      Very Good
                    </p>
                    <p className="mb-5 text-sm font-medium text-blue-500 ">
                      Excellent
                    </p>
                  </div> */}
                      </>
                    ) : (
                      <FeedbackInput
                        key={uuid_v4()}
                        // options={options}
                        // index={index}
                        //index={index}
                        i={i}
                        bucket={bucket}
                        questionManager={questionManager}
                        quiz={quiz}
                      />
                    )}
                  </div>
                );
              })}
              <div className="relative">
                <button
                  type="submit"
                  className="inline-block  w-full px-5 py-2 text-md font-medium text-center text-white transition duration-200 bg-sky-500 rounded-lg hover:bg-sky-600 ease"
                >
                  Submit
                </button>
              </div>
              {/* {bucket?.length == quiz?.questions.length ? (
          <>
            {disabler ? (
              <div className="relative">
                <button
                  type="submit"
                  disabled
                  className="inline-block cursor-not-allowed w-full px-5 py-2 text-md font-medium text-center text-white transition duration-200 bg-gray-500 rounded-lg hover:bg-gray-600 ease"
                >
                  Submit Test
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  type="submit"
                  className="inline-block w-full px-5 py-2 text-md font-medium text-center text-white transition duration-200 bg-sky-500 rounded-lg hover:bg-sky-600 ease"
                >
                  Submit Test
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="relative">
            <button
              type="submit"
              disabled
              className="inline-block cursor-not-allowed w-full px-5 py-2 text-xl font-medium text-center text-white transition duration-200 bg-gray-500 rounded-lg hover:bg-gray-600 ease"
            >
              Submit Test
            </button>
          </div>
        )} */}
            </form>
          </div>
        </>
      ) : null}
      {userData?.client === "idfc" ? (
        <>
          <div className="flex flex-col w-full justify-center items-center bg-blue-100/80 px-12 py-5 space-y-3 min-h-screen">
            <form
              className="flex flex-col items-center justify-center max-w-2xl"
              id="quiz"
              onSubmit={submitTest}
            >
              <div className=" w-full  py-5  my-2 bg-white rounded-md shadow-md">
                <div className="flex justify-center">
                  <div className="flex sm:flex-row px-5 justify-center flex-col mb-2 sm:w-full w-[50]  items-center sm:justify-between">
                    {quizData?.programType == "1" ? (
                      <>
                        <img
                          className="h-auto"
                          style={{ width: "9rem" }}
                          src="/LSS Logo.png"
                        />
                        <div>
                          <img
                            className="w-[8rem] h-auto mt-2 sm:mt-0 "
                            src="/IDFC-logo-website.jpg"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          className="h-auto"
                          style={{ width: "5rem" }}
                          src="/Retail Pro Logo.png"
                        />
                        <div>
                          <img
                            className="w-[8rem] h-auto mt-2 sm:mt-0 "
                            src="/IDFC-logo-website.jpg"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col px-20 ">
                  <h3 className="my-3  text-2xl text-center font-bold text-gray-700 ">
                    Feedback Form
                  </h3>
                  <span className="flex justify-center w-full mt-2">
                    <h3 className="mb-3 text-lg text-center font-medium text-gray-700 ">
                      {quiz?.quizTitle}
                    </h3>
                  </span>
                  <span className="flex justify-center w-full">
                    <h3 className="mb-3 text-lg text- font-medium text-gray-700 ">
                      <b>Trainer Name:</b> {quizData?.trainerName}
                    </h3>
                  </span>
                  <span className="flex justify-center w-full">
                    <h3 className="mb-3 text-lg text-center text- font-medium text-gray-700 ">
                      <b>Program Date:</b> {quizData?.programDate}
                    </h3>
                  </span>

                  <h3 className="mb-2 text-md text-center font-medium text-gray-700 ">
                    {quiz?.quizSynopsis}
                  </h3>
                </div>
              </div>
              <div className="flex flex-col w-full space-y-4 px-20 py-12 bg-white rounded-md shadow-md my-2 ">
                <div className="flex flex-row w-full  items-center">
                  <label className="leading-loose w-44 font-semibold text-gray-700">
                    Full Name*
                  </label>
                  <div className="w-full flex-col flex">
                    <input
                      className="px-4  py-2 border-b focus:ring-gray-700 focus:border-gray-800 w-full sm:text-sm border-gray-700  focus:outline-none text-gray-600"
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                </div>

                <div className="hidden flex-row w-full items-center ">
                  <label className="leading-loose w-44 font-semibold text-gray-700">
                    Reference Code
                  </label>
                  <div className="w-full flex-col flex">
                    <input
                      className="px-4  py-2 border-b focus:ring-gray-700 focus:border-gray-800 w-full sm:text-sm border-gray-700  focus:outline-none text-gray-600"
                      type="text"
                      name="referenceCode"
                      placeholder="Reference Code"
                    />
                  </div>
                </div>
                <div className="flex flex-row w-full items-center ">
                  <label className="leading-loose w-44 font-semibold text-gray-700">
                    Email*
                  </label>
                  <div className="w-full flex-col flex">
                    <input
                      className="px-4  py-2 border-b focus:ring-gray-700 focus:border-gray-800 w-full sm:text-sm border-gray-700  focus:outline-none text-gray-600"
                      type="email"
                      name="email"
                      placeholder="Email"
                      required
                    />
                  </div>
                </div>
              </div>
              {quiz?.questions.map((quizes, i) => {
                quizes.qnumber = i;
                return (
                  <div
                    key={uuid_v4()}
                    className="flex flex-col w-full px-10 py-12 bg-white rounded-md shadow-md my-2 "
                  >
                    <span className="flex justify-between">
                      <h3 className="mb-5 text-xl font-medium text-gray-700 ">
                        Question {i + 1}
                      </h3>
                      <h3 className="mb-5 hidden text-lg font-medium text-blue-500 ">
                        Points: N/A
                      </h3>
                    </span>
                    <h3 className="mb-4 text-xl font-medium text-gray-700 ">
                      {quizes.question}
                    </h3>
                    {/* //${description.data.length} */}
                    {quizes?.questionType == "ratings" ? (
                      <>
                        <span
                          className={`grid gap-4 grid-cols-3 md:grid-cols-6 w-full`}
                        >
                          {Array(description.data.length)
                            .fill()
                            .map((_, index) => {
                              return (
                                <FeedbackOptions
                                  key={uuid_v4()}
                                  // options={options}
                                  // index={index}
                                  index={index}
                                  i={i}
                                  bucket={bucket}
                                  quizes={quizes}
                                  description={description}
                                  questionManager={questionManager}
                                  quiz={quiz}
                                />
                              );
                            })}
                        </span>
                      </>
                    ) : (
                      <FeedbackInput
                        key={uuid_v4()}
                        // options={options}
                        // index={index}
                        //index={index}
                        i={i}
                        bucket={bucket}
                        questionManager={questionManager}
                        quiz={quiz}
                      />
                    )}
                  </div>
                );
              })}
              <div className="relative">
                <button
                  type="submit"
                  className="inline-block  w-full px-5 py-2 text-md font-medium text-center text-white transition duration-200 bg-sky-500 rounded-lg hover:bg-sky-600 ease"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </>
      ) : null}
      {userData?.client === "kotak" ? (
        <>
          <div className="flex flex-col w-full justify-center items-center bg-blue-100/80 px-12 py-5 space-y-3 min-h-screen">
            <form
              className="flex flex-col items-center justify-center max-w-2xl"
              id="quiz"
              onSubmit={submitTest}
            >
              <div className="flex flex-col w-full px-20 py-5 bg-white rounded-md shadow-md my-2 ">
                <h3 className="mb-3  text-2xl text-center font-bold text-gray-700 ">
                  Feedback Form
                </h3>
                <div className="flex justify-center">
                  <div className="sm:flex mb-2 sm:w-full w-[50]  items-center justify-center">
                    {/* <img className="w-40 h-auto" src="../HDFC-Bank-logo.png" /> */}
                    <img className="w-40 h-auto" src="/wagon-login.png" />
                  </div>
                </div>
                <span className="flex justify-center w-full">
                  <h3 className="mb-3 text-lg text- font-medium text-gray-700 ">
                    {quiz?.quizTitle}
                  </h3>
                </span>
                {/* <span className="flex justify-center w-full">
            <h3 className="mb-3 text-lg text- font-medium text-gray-700 capitalize">
              <b>Trainer Name:</b> {teamData?.trainerName}
            </h3>
          </span>
          <span className="flex justify-center w-full">
            <h3 className="mb-3 text-lg text- font-medium text-gray-700 ">
              <b>Program Date:</b> {teamData?.programDate}
            </h3>
          </span> */}
                <h3 className="mb-2 text-md text-center font-medium text-gray-700 ">
                  {quiz?.quizSynopsis}
                </h3>
              </div>
              <div className="flex flex-col w-full space-y-4 px-20 py-12 bg-white rounded-md shadow-md my-2 ">
                <div className="flex flex-row w-full  items-center">
                  <label className="leading-loose w-44 font-semibold text-gray-700">
                    Employee Name*
                  </label>
                  <div className="w-full flex-col flex">
                    <input
                      className="px-4  py-2 border-b focus:ring-gray-700 focus:border-gray-800 w-full sm:text-sm border-gray-700  focus:outline-none text-gray-600"
                      type="text"
                      name="fullName"
                      placeholder="Employee Name"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-row w-full items-center ">
                  <label className="leading-loose w-44 font-semibold text-gray-700">
                    Employee Id
                  </label>
                  <div className="w-full flex-col flex">
                    <input
                      className="px-4  py-2 border-b focus:ring-gray-700 focus:border-gray-800 w-full sm:text-sm border-gray-700  focus:outline-none text-gray-600"
                      type="text"
                      name="employeeId"
                      placeholder="Employee Id"
                    />
                  </div>
                </div>
              </div>
              {quiz?.questions.map((quizes, i) => {
                quizes.qnumber = i;
                return (
                  <div
                    key={uuid_v4()}
                    className="flex flex-col w-full px-10 py-12 bg-white rounded-md shadow-md my-2 "
                  >
                    <span className="flex justify-between">
                      <h3 className="mb-5 text-xl font-medium text-gray-700 ">
                        Question {i + 1}
                      </h3>
                      <h3 className="mb-5 hidden text-lg font-medium text-blue-500 ">
                        Points: N/A
                      </h3>
                    </span>
                    <h3 className="mb-4 text-xl font-medium text-gray-700 ">
                      {quizes.question}
                    </h3>
                    {/* //${description.data.length} */}
                    {quizes?.questionType == "ratings" ? (
                      <>
                        <span
                          className={`grid gap-4 grid-cols-3 md:grid-cols-6 w-full `}
                        >
                          {Array(description.data.length)
                            .fill()
                            .map((_, index) => {
                              return (
                                <FeedbackOptions
                                  key={uuid_v4()}
                                  // options={options}
                                  // index={index}
                                  index={index}
                                  i={i}
                                  bucket={bucket}
                                  quizes={quizes}
                                  description={description}
                                  questionManager={questionManager}
                                  quiz={quiz}
                                />
                              );
                            })}
                        </span>
                        {/* <div className="flex  w-full justify-between px-2 mt-1">
                    <p className="mb-5 text-sm font-medium text-blue-500 ">
                      Poor
                    </p>
                    <p className="mb-5 text-sm font-medium text-blue-500 ">
                      Average
                    </p>
                    <p className="mb-5 text-sm font-medium text-blue-500 ">
                      Good
                    </p>
                    <p className="mb-5 text-sm font-medium text-blue-500 ">
                      Very Good
                    </p>
                    <p className="mb-5 text-sm font-medium text-blue-500 ">
                      Excellent
                    </p>
                  </div> */}
                      </>
                    ) : (
                      <FeedbackInput
                        key={uuid_v4()}
                        // options={options}
                        // index={index}
                        //index={index}
                        i={i}
                        bucket={bucket}
                        questionManager={questionManager}
                        quiz={quiz}
                      />
                    )}
                  </div>
                );
              })}
              <div className="relative">
                <button
                  type="submit"
                  className="inline-block  w-full px-5 py-2 text-md font-medium text-center text-white transition duration-200 bg-sky-500 rounded-lg hover:bg-sky-600 ease"
                >
                  Submit Test
                </button>
              </div>
              {/* {bucket?.length == quiz?.questions.length ? (
          <>
            {disabler ? (
            ) : (
              <div className="relative">
                <button
                  type="submit"
                  className="inline-block w-full px-5 py-2 text-md font-medium text-center text-white transition duration-200 bg-sky-500 rounded-lg hover:bg-sky-600 ease"
                >
                  Submit Test
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="relative">
            <button
              type="submit"
              disabled
              className="inline-block cursor-not-allowed w-full px-5 py-2 text-xl font-medium text-center text-white transition duration-200 bg-gray-500 rounded-lg hover:bg-gray-600 ease"
            >
              Submit Test
            </button>
          </div>
        )} */}
            </form>
          </div>
        </>
      ) : null}
    </>
  );
}

export default CustomFeedback;
