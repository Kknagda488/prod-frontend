import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuid_v4 } from "uuid";
import { useAuth } from "../../../context/auth";
import CustomQuestion from "../../../components/forms/CustomQuestion";
import CustomQuestionFeedback from "../../../components/forms/CustomQuestionFeedback";
const Savetemplate = () => {
  const [questionList, setQuestionList] = useState([]);
  const [questionjson, setQuestionJson] = useState(null);
  const [type, setType] = useState(null);
  const [loading, setLoading] = useState("Loading...");
  const [allQuestion, setAllQuestions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [description, setDescription] = useState({ data: [], label: "" });
  const [name, setName] = useState("");
  const { userData, singOut } = useAuth();

  const { batchId, asstype, assessmentId } = useParams();

  const setResult = (values) => {
    var question = values;

    var questionObject = [];
    var quest = question.map((q) => {
      questionObject = [...questionObject, { ...q, id: uuid_v4() }];
    });
    //var updatedQuestion = { ...questionObject, id: uuid_v4() };
    console.log(questionObject, "opiuy");
    // setBucket(questionObject);
    //addQuestion(updatedQuestion);
    //saveAssessments();
    // feedback(questionObject);
    if (name.length == 0) {
      toast.error("Name of Template is required");
      questionObject = [];
    } else {
      submitTemplate(questionObject);
      // console.log(questionObject, "ioiug");
    }
  };

  const submitTemplate = async (questionObject) => {
    //  var id = parseFloat(batchInfo?.assessmentDetails.assessmentId);

    // console.log(bunch, "ouy");
    var QuestionBunch = JSON.stringify(questionObject);
    console.log(QuestionBunch, "lhg");
    //console.log(JSON.parse(QuestionBunch), "iouyty");
    var formData = {
      name: name,
      activeStatus: 1,
      type: 2,
      description: type,
      QuestionBunch,
    };

    var response;
    let form = new URLSearchParams(Object.entries(formData)).toString();
    console.log(formData);
    response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/templateQuestions/add?access_token=${userData?.accessToken}`,
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
      // console.log(data);
      if (data.code === 404) {
        toast.error(data.msg);
      } else {
        // document.getElementById("adduser").reset();
        toast.success("Questions Added!!");
        setSubmitted(true);
        // router.push(`/batch?batchId=${path.id}`);

        // setSaveTest(false);
        // setBatchInfo([]);
        // setBucket([]);
      }
    }
  };
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

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          setLoading("Something went Wrong!!");
          return Promise.reject(error);
        }

        setQuestionList(data.data.assessmentRes);
        // var a = JSON.stringify(
        //   data.data.assessmentRes.questionBunchOfAssessment
        // );
        setType(data.data.assessmentRes.assessmentType);
        // console.log(a);
        setQuestionJson(true);
      })
      .catch((error) => {
        setQuestionList([]);
        setLoading("Redirecting...");
        console.error("There was an error!", error);
      });
  };
  useEffect(() => {
    getQuestionData();
  }, [assessmentId, questionjson]);
  useEffect(() => {
    if (questionjson) {
      var a = JSON.parse(questionList.questionBunchOfAssessment);
      setAllQuestions(a);
      if (type == "feedback") {
        var b = JSON.parse(questionList?.description);
        setDescription(b);
      } else {
        setDescription({ data: "", label: questionList?.description });
      }
    }
  }, [questionjson]);

  console.log(allQuestion);
  if (type == null) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h5 className="text-3xl font-semibold leading-none text-gray-700 ">
          {loading}
        </h5>
      </div>
    );
  } else {
    if (type !== "feedback") {
      return (
        <div className="flex flex-col mt-5">
          <CustomQuestion
            allQuestion={allQuestion}
            questionjson={questionjson}
            setResult={setResult}
            setName={setName}
            name={name}
          />
        </div>
      );
    } else {
      return (
        <div className="flex flex-col mt-5">
          <CustomQuestionFeedback
            allQuestion={allQuestion}
            questionjson={questionjson}
            setResult={setResult}
            setName={setName}
            name={name}
            description={description}
          />
        </div>
      );
    }
  }
};

export default Savetemplate;
