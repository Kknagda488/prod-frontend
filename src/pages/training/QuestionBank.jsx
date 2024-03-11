import React, { useState } from "react";
// import AddQuestions from "../components/adminComponents/forms/AddQuestions";
// import { getSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuid_v4 } from "uuid";
import QuizQuestionLister from "../../components/training/quiz/QuizQuestionLister";
import { useAuth } from "../../context/auth";
// import { useRouter } from "next/router";
function QuestionBanks() {
  // const [question, setQuestion] = useState({ result: null });
  // const [questionBunch, setQuestionBunch] = useState([]);
  const { userData } = useAuth();
  //   const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const setResult = (values) => {
    var question = values;

    var empty = [];
    var questionObject = question;
    var quest = question.map((obj) => {
      if (obj.questionType !== "response") {
        var a = Object.keys(obj).filter((k) => {
          if (obj[k] === "" || obj[k] === undefined || obj[k] === null) {
            return empty.push(k);
          }
        });
        var b = obj.answers.filter((k, i) => {
          if (k === "" || k === undefined || k === null) {
            var newkey = `option${i + 1}`;
            return empty.push({ [newkey]: k });
          }
        });
      } else {
        var resObj = {
          id: obj.id,
          question: obj.question,
          questionType: obj.questionType,
          point: obj.point,
        };
        var a = Object.keys(resObj).filter((k) => {
          if (
            resObj[k] === "" ||
            resObj[k] === undefined ||
            resObj[k] === null
          ) {
            return empty.push(k);
          }
        });
      }
    });
    //var updatedQuestion = { ...questionObject, id: uuid_v4() };
    console.log(empty, "opiuy");
    if (empty.length !== 0) {
      toast.error("Fill up the required fields");
      questionObject = [];
    } else {
      question.forEach((element) => {
        var updatedQuestion = { ...element, id: uuid_v4() };

        addQuestion(updatedQuestion);
        return element;
      });
    }
  };

  const addQuestion = async (question) => {
    const formData = {
      name: question.question,
      type: question.questionType,
      isRequired: 1,
      options: JSON.stringify(question.answers),
      questionBunch: JSON.stringify(question),
    };
    var response;
    console.log(formData);
    let form = new URLSearchParams(Object.entries(formData)).toString();
    console.log(form);
    response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/FormBatchquestions/add?access_token=${userData?.accessToken}`,
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
      if (data.code === 404) {
        toast.error(data.msg);
      } else {
        //document.getElementById("quiz-form").reset;

        setSubmitted(true);
        toast.success("Question Added Succesfully !!");
        // router.push("/batch");
        window.close();
      }
    }
  };

  return (
    <div className="flex flex-col w-full mt-10">
      {/* <AddQuestions
        onSubmit={setResult}
        submitted={submitted}
        setSubmitted={setSubmitted}
      /> */}
      <QuizQuestionLister setResult={setResult} />
    </div>
  );
}

export default QuestionBanks;
