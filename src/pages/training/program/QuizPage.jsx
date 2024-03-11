import React, { useEffect, useState } from "react";
import { v4 as uuid_v4 } from "uuid";
// import "react-quiz-component";
//import { quiz } from "../../components/adminComponents/quiz/Quiz";
import CustomQuiz from "../../../components/training/quiz/CustomQuiz";
import { FaCheckCircle } from "react-icons/fa";
import CustomFeedback from "../../../components/training/quiz/CustomFeedback";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/auth";
import moment from "moment";
import CustomQuiz2 from "../../../components/training/quiz/CustomeQuiz2";

function QuizPage() {
  const [questionList, setQuestionList] = useState([]);
  const [questionjson, setQuestionJson] = useState(null);
  const [id, setId] = useState(null);
  const { userData, singOut } = useAuth();
  const [type, setType] = useState(null);
  const [loading, setLoading] = useState("Loading...");
  const [allQuestion, setAllQuestions] = useState([]);
  const [assessmentId, setAssessmentId] = useState(null);
  const [noOfAttemptsRemain, setNoOfAttemptsRemain] = useState(0);
  const [programTitle, setProgramTitle] = useState("");
  const [description, setDescription] = useState({ data: [], label: "" });
  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState(false);
  const [result, setResult] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const today = moment();
  const [isBetweentodayStatus, setIsBetweentodayStatus] = useState(false);
  // const router = useRouter();
  // const path = router.query;
  const { batchid, name, asstype, id: pathid } = useParams();

  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    // Set the current URL when the component mounts
    setCurrentUrl(window.location.href);

    // Optional cleanup function to avoid memory leaks
    return () => {
      // Cleanup code (if needed)
    };
  }, []);
  // const {batchId} = useParams()
  //console.log(path.id);
  var links = pathid;
  useEffect(() => {
    if (links !== undefined) {
      var arr = links.split("=");
      var num = arr.length - 1;
      //console.log(arr[num], "yt");
      setAssessmentId(arr[num]);
    }
  }, [links]);
  console.log(assessmentId, "ss");
  //27 //38
  const getQuestionData = () => {
    fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/Assessments/traineeBatchAssessmentdetailsById?id=${assessmentId}&access_token=${
        userData?.accessToken
      }`
    )
      .then(async (response) => {
        const data = await response.json();
        console.log(data);
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          setLoading("Something went Wrong!!");
          return Promise.reject(error);
        }
        const programdate = data.data.teamName.split("-");

        setTeamData({
          ...data.data,
          programDate: programdate[programdate.length - 1],
        });

        setQuestionList(data.data.assessmentRes);
        // var a = JSON.stringify(
        //   data.data.assessmentRes.questionBunchOfAssessment
        // );
        setId(data.data.batchId);
        setType(data.data.assessmentRes.assessmentType);
        setProgramTitle(data.data.programTitle);
        setQuizData(data.data);
        // console.log(a);
        console.log(
          "date",
          today.isBetween(
            data.data?.assessmentRes?.startDate,
            data.data?.assessmentRes?.endDate,
            null,
            "[]"
          )
        );
        setIsBetweentodayStatus(
          today.isBetween(
            data.data?.assessmentRes?.startDate,
            data.data?.assessmentRes?.endDate,
            null,
            "[]"
          )
        );
        setQuestionJson(true);
      })
      .catch((error) => {
        setQuestionList([]);
        setLoading("Redirecting...");
        console.error("There was an error!", error);
      });
  };
  useEffect(() => {
    if (assessmentId) {
      getQuestionData();
    }
  }, [assessmentId, questionjson]);
  // var a = [];
  useEffect(() => {
    if (questionjson) {
      var a = JSON.parse(questionList.questionBunchOfAssessment);
      console.log("=============qurstion array", a);
      if (type == "feedback") {
        var b = JSON.parse(questionList?.description);
        setDescription(b);
      } else {
        setDescription({ data: "", label: questionList?.description });
      }

      setAllQuestions(a);
    }
  }, [questionjson]);

  const quiz = {
    quizTitle: programTitle,
    quizSynopsis: description?.label,
    questions: allQuestion,
  };

  // var x;
  // var a = [];
  // var b;
  // if (questionjson) {
  //   //console.log(questionjson);
  //   x = JSON.parse(questionList.questionBunchOfAssessment),
  //   //b = [x.toString()];
  //   var c = x.map((nx) => {
  //     return JSON.parse(nx);
  //   });
  //   a = c;
  // }

  console.log(type, "result");
  debugger;
  if (type == null) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h5 className="text-3xl font-semibold leading-none text-gray-700 ">
          {loading}
        </h5>
      </div>
    );
  } else if (
    type == "submitted" &&
    teamData?.assessmentRes?.assessmentType == "custom" &&
    teamData?.assessmentRes?.showScore == 1
  ) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h5 className="text-3xl font-semibold leading-none text-center text-gray-700 mb-[40px]">
          {error ? (
            <p>Sorry, You are declare failed!</p>
          ) : (
            <>
              {((result?.obtainMarks / result?.totalMarks) * 100).toFixed(2) >=
              90 ? (
                <>Congratulations, You have cleared the exam.</>
              ) : (
                <div>
                  {noOfAttemptsRemain <= 0 ? (
                    <p>Sorry, You are declare failed!</p>
                  ) : (
                    <>
                      <p>
                        Please attempt again, {noOfAttemptsRemain} left for you
                      </p>
                      <a className="underline" href={currentUrl}>
                        Retry
                      </a>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </h5>
        {!error ? (
          <div className="grid grid-cols-4 justify-items-center bg-[#f1f8f8]">
            <div className="p-5">
              <p className="font-semibold text-[2rem] text-[#02756d] text-center">
                {result?.totalMarks}
              </p>
              <h2 className="text-gray-500 font-semibold text-center">
                Total Points
              </h2>
            </div>
            <div className="p-5">
              <p className="font-semibold text-[2rem] text-[#02756d] text-center">
                {result?.obtainMarks}
              </p>
              <h2 className="text-gray-500 font-semibold text-center">
                Your Points
              </h2>
            </div>
            <div className="p-5">
              <p className="font-semibold text-[2rem] text-[#02756d] text-center">
                {((result?.obtainMarks / result?.totalMarks) * 100).toFixed(2)}%
              </p>
              <h2 className="text-gray-500 font-semibold text-center">
                Percentage score (%)
              </h2>
            </div>
            <div className="p-5">
              <p className="font-semibold text-[2rem] text-[#02756d] text-center capitalize">
                {result?.result}
              </p>
              <h2 className="text-gray-500 font-semibold text-center ">
                Status
              </h2>
            </div>
          </div>
        ) : null}
        {teamData.assessmentRes.endDate}
      </div>
    );
  }
  //   else if(type == "submitted" && teamData?.assessmentRes?.assessmentType == "custom" && teamData?.assessmentRes?.showScore == 1 && today.isBetween(teamData?.assessmentRes?.startDate, teamData?.assessmentRes?.endDate, null, '[]')){
  //   return(
  //     <>
  //     No Program Found
  //     </>
  //   )
  // }
  else if (type == "submitted") {
    return (
      <main className=" h-screen pt-60 bg-white">
        <div className=" mx-auto  max-w-screen-lg ">
          <div className="flex flex-col text-2xl  p-10 ">
            <div className="mt-4 mb-5 flex items-center justify-center space-x-2">
              <FaCheckCircle className="h-10 text-7xl text-green-500" />
              <h1 className="text-2xl text-gray700 font-medium">
                Thank You, your Response has been submitted!
              </h1>
            </div>
          </div>
        </div>
      </main>
    );
  } else {
    if (type === "custom" && isBetweentodayStatus) {
      return (
        <div className="flex flex-col">
          <CustomQuiz2
            setType={setType}
            quiz={quiz}
            questionList={questionList}
            setResult={setResult}
            id={id}
            setNoOfAttemptsRemain={setNoOfAttemptsRemain}
            setError={setError}
          />
        </div>
      );
    } else if (type === "feedback") {
      return (
        <div className="flex flex-col">
          <CustomFeedback
            setType={setType}
            quiz={quiz}
            questionList={questionList}
            id={id}
            description={description}
            teamData={teamData}
          />
        </div>
      );
    } else {
      return (
        <div className="flex flex-col">
          <CustomQuiz
            setType={setType}
            quiz={quiz}
            questionList={questionList}
            setResult={setResult}
            id={id}
            setNoOfAttemptsRemain={setNoOfAttemptsRemain}
          />
        </div>
      );
    }
  }
}

export default QuizPage;
