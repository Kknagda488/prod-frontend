import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuid_v4 } from "uuid";
import FeedbackInput from "./FeedbackInput";
import Options from "./Options";
import { useAuth } from "../../../context/auth";
function CustomQuiz({ quiz, questionList, id, setType }) {
  const [totalMarks, setTotalMarks] = useState();
  const { userData, signOut } = useAuth();
  const [add, setAdd] = useState(true);
  const [bucket, setBucket] = useState([]);
  const [disabler, setDisabler] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    setStartTime(new Date());
    var marks = 0;
    const points = quiz.questions.map((point) => {
      marks = marks + parseFloat(point.point);

      return point;
    });
    setTotalMarks(marks);
  }, [quiz]);

  const submitTest = (e) => {
    e.preventDefault();
    // setDisabler(true);

    var firstRun = bucket.sort(function (a, b) {
      return a.qnumber - b.qnumber;
    });
    var secondRun = firstRun.sort(function (a, b) {
      return a.qnumber - b.qnumber;
    });
    const formatedEndtime =
      new Date().toISOString().split("T")[0] +
      " " +
      new Date().toTimeString().split(" ")[0];
    const formatedstarttime =
      startTime.toISOString().split("T")[0] +
      " " +
      startTime.toTimeString().split(" ")[0];

    var formData = {
      batchId: id,
      assessmentId: questionList.assessmentId,
      answerResponseBunch: JSON.stringify(secondRun),
      totalMarks: totalMarks,
      startTime: formatedstarttime,
      endTime: formatedEndtime,
      // employeeId: formData.employeeId,
    };
    Array.from(e.currentTarget.elements).forEach((field) => {
      if (!field.name) return;
      formData[field.name] = field.value;
    });

    formData = { ...formData, referenceCode: formData.employeeId };
    console.log("formData", formData);
    var score = [];
    var marks = 0;
    var results = bucket.map((result) => {
      if (result.questionType == "multiopt") {
        console.log("multiopt");
        var array1 = result.correctAnswer;

        var array2 = result.selectedOption;

        var is_same =
          array1.length == array2.length &&
          array1.every(function (element, index) {
            //return element === array2[index];
            if (array2.indexOf(element) > -1) {
              return (element = array2[array2.indexOf(element)]);
            }
          });
        if (is_same) {
          score.push(parseFloat(result.point));
        } else {
          console.log("wrong answer");
        }
      } else {
        if (
          result.correctAnswer.toLowerCase() ==
          result.selectedOption.toString().toLowerCase()
        ) {
          score.push(parseFloat(result.point));
        } else {
          console.log("wrong answer");
        }
      }

      return result;
    });
    var sum = score.reduce(function (a, b) {
      return a + b;
    }, 0);
    var finalresult;
    if (sum >= questionList.minimumPassingScore) {
      finalresult = "pass";
    } else {
      finalresult = "fail";
    }

    formData = { ...formData, obtainMarks: sum, result: finalresult };
    // console.log(sum, "score");
    // console.log(bucket, "submitted");
    // console.log(formData, "SS");

    saveAssessment(formData);
  };

  const questionManager = (questionData, selectedData, selectedAnswer) => {
    var doesItemExist;
    var objects;
    if (questionData.questionType == "multiopt") {
      objects = {
        ...questionData,
        selectedOption: [parseInt(selectedData)],
        selectedAnswer: [selectedAnswer],
      };
    } else {
      objects = {
        ...questionData,
        selectedOption: selectedData,
        selectedAnswer: selectedAnswer,
      };
    }
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
          if (questionData.questionType == "multiopt") {
            if (replaceOption.selectedOption.length > 0) {
              objects.selectedOption = replaceOption.selectedOption;
              objects.selectedAnswer = replaceOption.selectedAnswer;
              const bindex = objects.selectedOption.indexOf(
                parseInt(selectedData)
              );
              if (bindex > -1) {
                if (objects.selectedOption.length > 1) {
                  objects.selectedOption.splice(bindex, 1);
                  objects.selectedAnswer.splice(bindex, 1);
                } else {
                  newBucket.splice(index, 1);
                  var updatedBucket = [...newBucket];
                  return setBucket(updatedBucket);
                }
              } else {
                objects.selectedOption.push(parseInt(selectedData));
                objects.selectedAnswer.push(selectedAnswer);
              }
            } else {
              objects.selectedOption = [parseInt(selectedData)];
              objects.selectedAnswer = [selectedAnswer];
            }
          }
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

  const saveAssessment = async (formData) => {
    var response;

    let form = new URLSearchParams(Object.entries(formData)).toString();

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
    console.log(data, "response.json");
    if (!response.ok) {
      console.log("er");
      toast.error(data?.error?.message);
    } else {
      if (!data.value) {
        toast.error(data.message);
        // setType("submitted");
        // setDisabler(false);
      } else {
        //document.getElementById("quiz-form").reset;
        // setSubmitted(true);

        toast.success("Assessment Submitted Succesfully !!");
        setType("submitted");
        setBucket([]);
      }
    }
  };
  console.log(bucket, "sd");

  return (
    <div className="flex flex-col w-full justify-center items-center bg-blue-100/80 px-12 py-5 space-y-3 min-h-screen">
      <form
        id="quiz"
        className="mb-6 flex flex-col  max-w-xl justify-center items-center"
        onSubmit={submitTest}
      >
        <div className="flex flex-col px-10 py-12 w-full bg-white rounded-md shadow-md my-2 ">
          <span className="flex justify-between w-full">
            <h3 className="mb-5 text-md font-medium text-gray-700 ">
              {quiz.quizTitle}
            </h3>
            <h3 className="mb-5 text-md font-medium text-blue-500 ">
              Total Points: {totalMarks}
            </h3>
          </span>

          <h3 className="mb-5 text-md font-medium text-gray-700 ">
            {quiz.quizSynopsis}
          </h3>
        </div>

        {userData?.client === "axis" ? (
          <>
            <div className="flex flex-col w-full space-y-4 px-10 py-12   bg-white rounded-md shadow-md my-2 ">
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
                    // required
                  />
                </div>
              </div>
              <div className="flex flex-row w-full  items-center">
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
          </>
        ) : null}

        {userData?.client === "idfc" ? (
          <>
            <div className="flex flex-col w-full space-y-4 px-10 py-12   bg-white rounded-md shadow-md my-2 ">
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

              <div className="flex flex-row w-full  items-center">
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
          </>
        ) : null}

        {userData?.client === "kotak" ? (
          <>
            <div className="flex flex-col w-full space-y-4 px-10 py-12   bg-white rounded-md shadow-md my-2 ">
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

              <div className=" flex-row w-full items-center ">
                <label className="leading-loose w-30 font-semibold text-gray-700">
                  Employee Id/
                  <br />
                  Reference Code
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
              <div className=" flex-row w-full items-center ">
                <label className="leading-loose w-44 font-semibold text-gray-700">
                  Branch Name
                </label>
                <div className="w-full flex-col flex">
                  <input
                    className="px-4  py-2 border-b focus:ring-gray-700 focus:border-gray-800 w-full sm:text-sm border-gray-700  focus:outline-none text-gray-600"
                    type="text"
                    name="branchName"
                    placeholder="Branch Name"
                    // required
                  />
                </div>
              </div>
              <div className="hidden  flex-row w-full items-center ">
                <label className="leading-loose w-44 font-semibold text-gray-700">
                  Reference Code
                </label>
                <div className="w-full flex-col flex">
                  <input
                    className="px-4  py-2 border-b focus:ring-gray-700 focus:border-gray-800 w-full sm:text-sm border-gray-700  focus:outline-none text-gray-600"
                    type="text"
                    name="referenceCode"
                    placeholder="Reference Code"
                    // required
                  />
                </div>
              </div>
            </div>
          </>
        ) : null}
        {console.log("==================================", quiz)}
        {quiz.questions &&
          quiz.questions.map((quizes, i) => {
            quizes.qnumber = i;

            return (
              <div
                key={uuid_v4()}
                className="flex flex-col w-full px-10 py-12  bg-white rounded-md shadow-md my-2 "
              >
                <span className="flex justify-between">
                  <h3 className="mb-5 text-md font-medium text-gray-700 ">
                    Question {i + 1}
                  </h3>
                  <h3 className="mb-5 text-md font-medium text-blue-500 ">
                    Points: {quizes.point}
                  </h3>
                </span>
                <h3 className="mb-5 text-md font-medium text-gray-700 ">
                  {quizes.question}
                </h3>
                {quizes?.questionType == "response" ? (
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
                ) : (
                  <ul className="grid gap-6 w-full ">
                    {quizes.questionType == "multiopt" ? (
                      <p className="text-sm font-medium text-gray-600">
                        *Multiple answers can be selected
                      </p>
                    ) : null}
                    {quizes.answers.map((options, index) => {
                      if (quizes.questionType == "multiopt") {
                        var a;
                        const colorchanger = bucket.map((item) => {
                          if (item.id == quiz.questions[i].id) {
                            //setCss("bg-green-500 border-green-400 hover:bg-green-500");

                            item.selectedOption.find((id) => {
                              if (id === index + 1) {
                                return (a = true);
                              } else {
                                return (a = false);
                              }
                            });

                            return a;
                          }
                        });

                        return (
                          <li key={uuid_v4()} className="space-y-1">
                            <label
                              className={`inline-flex justify-between items-center p-5 w-full rounded-lg border  cursor-pointer  ${
                                a
                                  ? " border-emerald-300 text-white bg-emerald-500 "
                                  : "bg-gray-200 hover:text-gray-800 hover:bg-gray-300 text-gray-700 "
                              }  `}
                              onClick={() =>
                                questionManager(
                                  quiz.questions[i],
                                  index + 1,
                                  options
                                )
                              }
                            >
                              <div className="block w-full">
                                <div className="w-full text-md font-semibold">
                                  {options}
                                </div>
                                {/* <div className="w-full">Explaination</div> */}
                              </div>
                            </label>
                          </li>
                        );
                      } else {
                        return (
                          <Options
                            key={uuid_v4()}
                            options={options}
                            index={index}
                            i={i}
                            bucket={bucket}
                            questionManager={questionManager}
                            quiz={quiz}
                          />
                        );
                      }
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        {bucket?.length == quiz?.questions.length ? (
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
              className="inline-block cursor-not-allowed w-full px-5 py-2 text-md font-medium text-center text-white transition duration-200 bg-gray-500 rounded-lg hover:bg-gray-600 ease"
            >
              Submit Test
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default CustomQuiz;
