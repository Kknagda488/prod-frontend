import React, { useEffect, useState } from "react";
import { BiRefresh, BiSelectMultiple } from "react-icons/bi";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
// import Link from "next/link";
// import AddFeedbackForm from "../forms/AddFeedbackForm";
import { v4 as uuid_v4 } from "uuid";
// import EditQuestions from "../forms/EditQuestions";
import BatchTemplateList from "./BatchTemplateList";
import FeedbackQuestionLister from "../../quiz/FeedbackQuestionLister";
import moment from "moment";
import { useAuth } from "../../../../context/auth";
import { IoClose } from "react-icons/io5";
import CreateScale from "./CreateScale";
function FeedbackFormTab({
  questionList,
  id,
  next,
  previous,
  pgindex,
  page,
  totalCount,
  setRefresher,
  setLimit,
  setPage,
  setSearch,
  templateList,
  batchData,
}) {
  // const { data: session } = useSession();
  const [formChanger, setFormChanger] = useState(true);
  const [saveTest, setSaveTest] = useState(true);
  const [batchInfo, setBatchInfo] = useState([]);
  const [bucket, setBucket] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [newScaleVale, setNewScaleVale] = useState([]);
  const { batchId } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const userOptions = [{ data: "feedback", label: "Feedback Form" }];
  let scaleOption = [
    {
      data: ["Poor", "Average", "Good", "Excellent"],
      label:
        "Rate each parameter on the scale of 4 to 1 (4 being the highest and 1 being lowest)",
    },
    {
      data: ["Poor", "Average", "Good", "Very Good", "Excellent"],
      label:
        "Rate each parameter on the scale of 5 to 1 (5 being the highest and 1 being lowest)",
    },
    {
      data: [
        "Poor",
        "Average",
        "Satisfactory",
        "Good",
        "Very Good",
        "Excellent",
      ],
      label:
        "Rate each parameter on the scale of 5 to 0 (5 being the highest and 0 being lowest)",
    },
  ];

  const scaleOptions = scaleOption.concat(newScaleVale);
  const { userData, sigOut } = useAuth();
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedScale, setSelectedScale] = useState(null);
  const setResult = (values) => {
    //var question = values.questions;
    var question = values;
    var empty = [];
    var questionObject = question;
    var quest = question.map((obj) => {
      // questionObject = [
      //   ...questionObject,
      //   {
      //     ...q,
      //     id: uuid_v4(),
      //     answers: ["Poor", "Average", "Good", "Very Good", "Excellent"],
      //   },
      // ];
      var a = Object.keys(obj).filter((k) => {
        if (obj[k] === "" || obj[k] === undefined || obj[k] === null) {
          return empty.push(k);
        }
      });
    });
    //var updatedQuestion = { ...questionObject, id: uuid_v4() };
    console.log(questionObject, "opiuy");
    // setBucket(questionObject);
    //addQuestion(updatedQuestion);
    //saveAssessments();
    if (empty.length !== 0) {
      toast.error("Fill up the required fields");
      questionObject = [];
    } else {
      feedback(questionObject);
      //console.log(questionObject, "ioiug");
    }
  };

  const feedback = async (questionObject) => {
    var id = parseFloat(batchInfo?.assessmentDetails.assessmentId);

    // console.log(bunch, "ouy");
    var QuestionBunch = JSON.stringify(questionObject);
    console.log(QuestionBunch, "lhg");
    //console.log(JSON.parse(QuestionBunch), "iouyty");
    var formData = { id, QuestionBunch };

    var response;
    let form = new URLSearchParams(Object.entries(formData)).toString();
    // console.log(formData);
    response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/Assessments/addQuestionBunchInTranieeBatch?access_token=${
        userData?.accessToken
      }`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        method: "POST",
        body: form,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data?.error?.message);
    } else {
      // console.log(data);
      if (data.code === 404) {
        toast.error(data.msg);
      } else {
        // document.getElementById("adduser").reset();
        toast.success("Questions Added!!");
        // router.push("/all_teams");

        setSaveTest(false);
        setBatchInfo([]);
        setBucket([]);
      }
    }
  };

  // useEffect(() => {
  //   if (selectedForm?.data === "feedback") {
  //     setFormChanger(false);
  //   } else {
  //     setFormChanger(true);
  //   }
  // }, [selectedForm]);

  useEffect(() => {
    if (batchInfo?.batchId == id) {
      setSaveTest(true);
    } else {
      setSaveTest(false);
    }
  }, [id, batchInfo]);

  //console.log(batchInfo, "jg");

  const saveAssessments = async () => {
    //  e.preventDefault();
    var a = [];
    var id = parseFloat(batchInfo?.assessmentDetails.assessmentId);
    var bunch = bucket?.map((item) => {
      return JSON.parse(item.questionBunch);
    });
    a = bunch;

    var QuestionBunch = JSON.stringify(a);

    //console.log(JSON.parse(QuestionBunch), "iouyty");
    var formData = { id, QuestionBunch };

    var response;
    let form = new URLSearchParams(Object.entries(formData)).toString();

    response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/Assessments/addQuestionBunchInTranieeBatch?access_token=${
        userData?.accessToken
      }`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        method: "POST",
        body: form,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data?.error?.message);
    } else {
      // console.log(data);
      if (data.code === 404) {
        toast.error(data.msg);
      } else {
        // document.getElementById("adduser").reset();
        toast.success("Questions Added!!");
        // router.push("/all_teams");

        setSaveTest(false);
        setBatchInfo([]);
        setBucket([]);
      }
    }
  };
  const saveTempAssessments = async (temp) => {
    //  e.preventDefault();
    var a = temp;
    var id = parseFloat(batchInfo?.assessmentDetails.assessmentId);

    var QuestionBunch = JSON.stringify(a);

    var formData = { id, QuestionBunch };

    var response;
    let form = new URLSearchParams(Object.entries(formData)).toString();

    response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/Assessments/addQuestionBunchInTranieeBatch?access_token=${
        userData?.accessToken
      }`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        method: "POST",
        body: form,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data?.error?.message);
    } else {
      // console.log(data);
      if (data.code === 404) {
        toast.error(data.msg);
      } else {
        // document.getElementById("adduser").reset();
        toast.success("Questions Added!!");
        // router.push("/all_teams");

        setSaveTest(false);
        setBatchInfo([]);
        setBucket([]);
      }
    }
  };

  const addAssessments = async (e) => {
    e.preventDefault();
    var Id = id;
    var type = 2;
    var activeStatus = 1;
    var formData = { Id, type, activeStatus };
    Array.from(e.currentTarget.elements).forEach((field) => {
      if (!field.name) return;
      formData[field.name] = field.value;
    });
    var response;
    let form = new URLSearchParams(Object.entries(formData)).toString();

    response = await fetch(
      `${import.meta.env.VITE_PUBLIC_URL}/api/Assessments/add?access_token=${
        userData?.accessToken
      }`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        method: "POST",
        body: form,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data?.error?.message);
    } else {
      // console.log(data);
      if (data.code === 404) {
        toast.error(data.msg);
      } else {
        // document.getElementById("adduser").reset();
        toast.success("Assessment Saved!!");
        // router.push("/all_teams");
        setBatchInfo(data.data);
        setSaveTest(true);
      }
    }
  };

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
    setSelectedForm(option);
  };
  const handleScaleChange = (option) => {
    setSelectedScale(option);
    // setRefresher(uuid_v4());
  };
  var term = selectedForm?.data;

  return (
    <div className="flex flex-col bg-white rounded-md py-2  px-3">
      {popUp ? (
        <div className="fixed z-30  w-full mt-[40px] h-screen top-0 left-0 items-center   bg-gray-800/40">
          <div className="flex w-full items-start mt-20 justify-center   h-screen">
            <div className="relative mx-20 flex flex-col  w-1/2 items-center justify-center bg-white rounded-lg shadow-md px-8 py-2">
              <div className="absolute z-30 bg-white flex w-full justify-end items-end top-0  p-4 ">
                <IoClose
                  onClick={() => setPopUp(false)}
                  className="cursor-pointer text-xl font-semibold text-black "
                />
              </div>
              <div
                id="journal-scroll"
                className="w-full h-[30rem] mt-[50px] overflow-y-auto"
              >
                <CreateScale
                  batchId={batchId}
                  setNewScaleVale={setNewScaleVale}
                  setPopUp={setPopUp}
                  // nominees={selectedNominessData}
                  // session={session}
                  // isPopup={true}
                  // setShowPopup={setShowPopup}
                  // fetchBatchList={fetchBatchList}
                  // programDetails={programDetails}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex justify-end">
        <>
          {moment(
            moment(batchData.batchDateTime)
              .subtract(5, "days")
              .format("YYYY-MM-DD")
          ).isSameOrAfter(moment()) ? (
            <>
              {moment(
                moment(batchData.batchDateTime)
                  .subtract(5, "days")
                  .format("YYYY-MM-DD")
              ).diff(moment(), "days")}{" "}
              days left to create Feedback form.
            </>
          ) : null}
        </>
      </div>
      {saveTest ? (
        <>
          {formChanger ? (
            <>
              <h5 className="text-xl font-semibold leading-none text-gray-700 ">
                {batchInfo?.value1}
              </h5>
              <div
                id="journal-scroll"
                className="flex flex-col h-[44rem] overflow-y-auto pr-4"
              >
                <h5
                  onClick={() => setFormChanger(false)}
                  className="text-md font-semibold cursor-pointer bg-sky-500 w-fit py-2 rounded-md px-4 leading-none text-white "
                >
                  Add from Template?
                </h5>

                {/* <AddFeedbackForm
                  onSubmit={setResult}
                  submitted={submitted}
                  setSubmitted={setSubmitted}
                /> */}
                <FeedbackQuestionLister
                  setResult={setResult}
                  selectedScale={selectedScale}
                />
              </div>
            </>
          ) : (
            <>
              <h5 className="text-xl font-semibold leading-none text-gray-700 ">
                {batchInfo?.value1}
              </h5>
              <div className="flex w-full justify-between space-x-2">
                <h5
                  onClick={() => setFormChanger(true)}
                  className="text-md font-semibold cursor-pointer bg-sky-500 w-fit py-2 rounded-md px-4 leading-none text-white "
                >
                  Add Custom Questions?
                </h5>

                <span
                  onClick={() => {
                    setRefresher(uuid_v4());
                  }}
                  className="flex w-fit items-center"
                >
                  <h5 className="text-md font-semibold cursor-pointer  w-fit rounded-md leading-none text-gray-600 ">
                    Refresh
                  </h5>
                  <BiRefresh className="text-lg font-semibold cursor-pointer  w-fit rounded-md leading-none text-gray-600 " />
                </span>
              </div>
              <BatchTemplateList
                saveTempAssessments={saveTempAssessments}
                templateList={templateList}
                term={term}
                selectedScale={selectedScale}
              />
            </>
          )}
        </>
      ) : (
        <form method="POST" onSubmit={addAssessments}>
          <div className="flex flex-col">
            <div className="py-0 flex items-center  justify-end space-x-4 mb-2">
              <button
                onClick={() => setPopUp(true)}
                className="bg-sky-500 inline-flex justify-center items-center  text-white px-4 py-3 rounded-md focus:outline-none"
              >
                Create Rating Scale
              </button>
            </div>
            <h5 className="text-xl font-semibold mt-2 mb-4 leading-none text-gray-700 ">
              Add Feedback Form
            </h5>
            <label className="leading-loose">Program Name*</label>
            <input
              type="text"
              name="name"
              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
              placeholder="Form Title"
              required
            />
          </div>

          <div className="flex flex-col mt-1">
            <label className="leading-loose">Select Rating Scale*</label>
            <Select
              //isMulti={true}
              options={scaleOptions}
              onChange={handleScaleChange}
              styles={styles}
              getOptionValue={(option) => option.data}
              placeholder="Form Scale"
            />
            <textarea
              name="description"
              placeholder="Instructions"
              required
              value={JSON.stringify(selectedScale)}
              className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
            ></textarea>
          </div>

          <div className="hidden ">
            <label className="leading-loose">Minimum Passing Score</label>

            <input
              id="input-hide"
              type="number"
              name="minimumPassingScore"
              className="px-4 py-2 hidden border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
              placeholder="Assessment Title"
              required
              defaultValue="0"
              onWheel={(e) => e.target.blur()}
            />
          </div>
          <div className="flex flex-col mt-1">
            <label className="leading-loose">Form Type*</label>
            <Select
              //isMulti={true}
              options={userOptions}
              onChange={handleChange}
              styles={styles}
              placeholder="Form Type"
            />
            <input
              type="text"
              name="assessmentType"
              defaultValue={selectedForm?.data}
              className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
              placeholder="Assessment Title"
              required
            />
          </div>

          <button
            type="submit"
            //onClick={() => save()}
            className="bg-sky-500 mt-4 truncate flex justify-center items-center w-full text-white px-5 py-2 rounded-md focus:outline-none"
          >
            Save Feedback & Add Questions
          </button>
        </form>
      )}
    </div>
  );
}

export default FeedbackFormTab;
