import React, { useEffect, useState } from "react";
import { BiRefresh, BiSelectMultiple } from "react-icons/bi";
import { MdOutlineAddToPhotos } from "react-icons/md";
import AssessmentTable from "../../../parts/AssessmentTable";

import { AiOutlineSmallDash } from "react-icons/ai";
import { GiChoice } from "react-icons/gi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { Link } from "react-router-dom";
// import AddFeedbackForm from "../forms/AddFeedbackForm";
import DeletePopupCard from "../../DeletePopCard";
import { v4 as uuid_v4 } from "uuid";
// import EditQuestions from "../forms/EditQuestions";
import BatchTemplateList from "./BatchTemplateList";
import moment from "moment";
import { useAuth } from "../../../../context/auth";
function Assesment({ batchId, batchData }) {
  const [formChanger, setFormChanger] = useState(true);
  const [saveTest, setSaveTest] = useState(true);
  const [batchInfo, setBatchInfo] = useState([]);
  const [bucket, setBucket] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

  const [assessmentDays, setAssessmentDays] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const { userData, signOut } = useAuth();
  const [questionList, setQuestionList] = useState([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(2);
  const [page, setPage] = useState(0);
  const [selectedRow, setSelectedRow] = useState({
    title: "",
    id: "",
  });
  const [popup, setPopup] = useState(false);
  const [totalCount, setTotalCount] = useState();
  const [refresher, setRefresher] = useState(null);
  const [templateList, setTemplateList] = useState([]);

  const setResult = (values) => {
    var question = values.questions;

    var questionObject = [];
    var quest = question.map((q) => {
      questionObject = [...questionObject, { ...q, id: uuid_v4() }];
    });
    //var updatedQuestion = { ...questionObject, id: uuid_v4() };
    console.log(questionObject, "opiuy");
    // setBucket(questionObject);
    //addQuestion(updatedQuestion);
    //saveAssessments();
    feedback(questionObject);
  };

  const getQuestionData = () => {
    fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/FormBatchquestions/list?filter=%7B%22limit%22%3A${limit},%22start%22%3A${page},%22search%22%3A%22${search}%22%7D&access_token=${
        userData?.accessToken
      }`
    )
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }
        setQuestionList(data.data.list);
        setTotalCount(data.data.totalCount);
        // console.log(Math.ceil(data.data.totalCount / limit), "sds");
      })
      .catch((error) => {
        setQuestionList([]);
        console.error("There was an error!", error);
        if (error === "Token Expired") {
          signOut();
        }
      });
  };

  const getTemplateData = () => {
    fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/templateQuestions/listofTranieeBatchTemplate?filter=%7B%22limit%22%3A%22%22,%22start%22%3A%22%22,%22search%22%3A%22%22%7D&access_token=${
        userData?.accessToken
      }`
    )
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }
        console.log(data, "sdsgggg");
        setTemplateList(data.data.list);
        setTotalCount(data.data.totalCount);
      })
      .catch((error) => {
        setTemplateList([]);
        console.error("There was an error!", error);
        if (error === "Token Expired") {
          signOut();
        }
      });
  };

  const npages = totalCount;
  console.log(npages, limit);
  const pgindex = Math.ceil(npages / limit);
  // const pgindex = npages;
  console.log(page, pgindex);
  const next = () => {
    if (totalCount % limit == 0) {
      if (page < pgindex) {
        setPage(page + 1);
        //console.log("max page" ,pgindex)
      } else {
        return;
      }
    }

    // if the number is odd
    else {
      if (page < npages) {
        setPage(page + 1);
        //console.log("else max page" ,npages)
      } else {
        return;
      }
    }
  };
  const previous = () => {
    if (page <= 0) {
      return;
    } else {
      setPage(page - 1);
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
    console.log(formData);
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
        // router.push("/all_teams");

        setSaveTest(false);
        setBatchInfo([]);
        setBucket([]);
      }
    }
  };

  useEffect(() => {
    console.log(search, limit, page, refresher);
    getQuestionData();
    getTemplateData();
  }, [search, limit, page, refresher]);

  // useEffect(() => {
  //   if (selectedForm?.data === "feedback") {
  //     setFormChanger(false);
  //   } else {
  //     setFormChanger(true);
  //   }
  // }, [selectedForm]);

  useEffect(() => {
    if (batchInfo?.batchId == batchId) {
      setSaveTest(true);
    } else {
      setSaveTest(false);
    }
  }, [batchId, batchInfo]);

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
    console.log(QuestionBunch, "lhg");
    //console.log(JSON.parse(QuestionBunch), "iouyty");
    var formData = { id, QuestionBunch };

    var response;
    let form = new URLSearchParams(Object.entries(formData)).toString();
    console.log(formData);
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
    console.log(QuestionBunch, "lhgooooooooo");
    //console.log(JSON.parse(QuestionBunch), "iouyty");
    var formData = { id, QuestionBunch };

    var response;
    let form = new URLSearchParams(Object.entries(formData)).toString();
    console.log(formData);
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
        // router.push("/all_teams");

        setSaveTest(false);
        setBatchInfo([]);
        setBucket([]);
      }
    }
  };

  const handleDeleteFormBatchQuestion = async (id) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/FormBatchquestions/delete/${id}?access_token=${
          userData.accessToken
        }`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },

          method: "Delete",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        throw error;
      } else if (data.code === 400) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        // fetchProgramList();
        // fetchBatchList()
        getQuestionData();
        setPopup(false);
      }
    } catch (error) {
      console.error("There was an error!", error);
      if (error === "Token Expired" || error === "Malformed User") {
        signOut();
      }
    }
  };

  const addAssessments = async (e) => {
    e.preventDefault();
    var Id = batchId;
    var type = 2;
    var activeStatus = 1;
    var formData = { Id, type, activeStatus };
    Array.from(e.currentTarget.elements).forEach((field) => {
      if (!field.name) return;
      if (field.name == "showScore") {
        formData[field.name] = field.checked ? 1 : 0;
      } else {
        formData[field.name] = field.value;
      }
    });
    formData = { ...formData, assessmentType: selectedForm.data };

    if (userData?.client === "axis") {
      formData = { ...formData, assessmentDay: assessmentDays.data };
    }
    var response;
    let form = new URLSearchParams(Object.entries(formData)).toString();
    console.log(formData);
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
    console.log(data, "uy");

    if (!response.ok) {
      console.log("er");
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

  const assessmentDay = [
    { data: "day1", label: "Day1 Assessment" },
    { data: "day2", label: "Day2 Assessment" },
    { data: "day3", label: "Day3 Assessment" },
    { data: "day4", label: "Day4 Assessment" },
    { data: "day5", label: "Day5 Assessment" },
  ];
  const userOptions = [
    { data: "pre", label: "Pre Assessment" },
    { data: "post", label: "Post Assessment" },
    { data: "custom", label: "Custom Assessment" },
  ];
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

  const handleDaychange = (option) => {
    setAssessmentDays(option);
  };
  var term = selectedForm?.data;

  return (
    <div className="flex flex-col bg-white rounded-md py-2  px-3">
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
              days left to create assesment.
            </>
          ) : null}
        </>
      </div>
      {popup ? (
        <div className="fixed z-30  w-full h-screen top-0 left-0 items-center   bg-gray-800/40">
          <div className="flex w-full items-start mt-10 justify-center ">
            <div className="relative mx-20 flex flex-col  w-1/2 items-center justify-center bg-white rounded-lg shadow-md px-8 py-2">
              <div className="absolute z-30 bg-white flex w-full justify-end items-end top-0  p-4 ">
                {/* <IoClose
                  onClick={() => {
                    setPopup(false);
                  }}
                  className="cursor-pointer text-2xl font-semibold text-black "
                /> */}
              </div>
              <div
                id="journal-scroll"
                className="w-full max-h-[32rem] h-fit overflow-y-auto mt-8"
              >
                <DeletePopupCard
                  title={selectedRow.title}
                  cancelDelete={() => setPopup(false)}
                  confirmDelete={() =>
                    handleDeleteFormBatchQuestion(selectedRow.id)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {saveTest ? (
        <>
          {formChanger ? (
            <>
              <h5 className="text-xl font-semibold leading-none text-gray-700 ">
                {batchInfo?.value1}
              </h5>
              <div className="flex flex-col w-full justify-between ">
                <div className="flex justify-between  w-full">
                  <h5
                    onClick={() => setFormChanger(false)}
                    className="text-md font-semibold cursor-pointer bg-sky-500 w-fit py-2 rounded-md px-4 leading-none text-white "
                  >
                    Add from Template?
                  </h5>
                  <div className="flex w-fit justify-end space-x-2">
                    <Link
                      to="/questionbanks"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <a target="_blank" rel="noopener noreferrer">
                        <h5 className="text-md font-semibold cursor-pointer bg-sky-500 w-fit py-2 rounded-md px-4 leading-none text-white ">
                          Add Custom Questions?
                        </h5>
                      </a>
                    </Link>
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
                </div>
                <div className="w-full">
                  <AssessmentTable
                    bucket={bucket}
                    setBucket={setBucket}
                    setSelectedRow={setSelectedRow}
                    setPopup={setPopup}
                    questionList={questionList}
                    next={next}
                    previous={previous}
                    pgindex={pgindex}
                    page={page}
                    totalCount={totalCount}
                    setLimit={setLimit}
                    setPage={setPage}
                    setSearch={setSearch}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => saveAssessments()}
                className="bg-sky-500 mt-4 truncate flex justify-center items-center w-full text-white px-5 py-2 rounded-md focus:outline-none"
              >
                Save Assesments & View
              </button>
            </>
          ) : (
            <>
              <h5 className="text-xl font-semibold leading-none text-gray-700 ">
                {batchInfo?.value1}
              </h5>
              <h5
                onClick={() => setFormChanger(true)}
                className="text-md font-semibold cursor-pointer bg-sky-500 w-fit py-2 rounded-md px-4 leading-none text-white "
              >
                Add from QuestionBank?
              </h5>
              {/* <div
                id="journal-scroll"
                className="flex flex-col h-96 overflow-y-auto"
              >
                <EditQuestions
                  onSubmit={setResult}
                  submitted={submitted}
                  setSubmitted={setSubmitted}
                />
              </div> */}
              <BatchTemplateList
                saveTempAssessments={saveTempAssessments}
                templateList={templateList}
                term={term}
              />
            </>
          )}
        </>
      ) : (
        <form method="POST" onSubmit={addAssessments}>
          <div className="flex flex-col">
            <h5 className="text-xl font-semibold mt-2 mb-4 leading-none text-gray-700 ">
              Add Assesment
            </h5>
            <label className="leading-loose">Assessment Title*</label>
            <input
              type="text"
              name="name"
              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
              placeholder="Assessment Title"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="leading-loose">Assessment Instructions*</label>

            <textarea
              name="description"
              placeholder="Assessment Instructions"
              // required
              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
            ></textarea>
          </div>
          <div className="flex flex-col mt-1">
            <label className="leading-loose">Assessment Type*</label>
            <Select
              //isMulti={true}
              options={userOptions}
              onChange={handleChange}
              styles={styles}
              placeholder="Set Type"
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
          {userData?.client === "axis" ? (
            <div className="flex flex-col mt-1">
              <label className="leading-loose">Assessment Day*</label>
              <Select
                //isMulti={true}
                options={assessmentDay}
                onChange={handleDaychange}
                styles={styles}
                placeholder="Set Day"
              />
              <input
                type="text"
                name="assessmentDays"
                defaultValue={assessmentDays?.data}
                className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                placeholder="Assessment Title"
              />
            </div>
          ) : null}

          {selectedForm?.data == "custom" ? (
            <div>
              <div className="flex items-center my-1">
                <input
                  type="checkbox"
                  className="mr-2"
                  name="showScore"
                ></input>
                <label className="leading-loose">Show score</label>
              </div>
              <div className="grid grid-cols-2 space-x-2">
                <div>
                  <label className="leading-loose">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                  />
                </div>
                <div>
                  <label className="leading-loose">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                  />
                </div>
              </div>
              <div className="flex flex-col mt-1">
                <label className="leading-loose">No Of Attempts</label>
                <input
                  type="number"
                  className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                  name="noOfAttempts"
                  defaultValue={1}
                  min={1}
                ></input>
              </div>
            </div>
          ) : null}
          <div className="flex flex-col">
            <label className="leading-loose">Minimum Passing Score*</label>
            <input
              id="input-hide"
              type="number"
              name="minimumPassingScore"
              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
              placeholder="Minimum Passing Score"
              required
              onWheel={(e) => e.target.blur()}
            />
          </div>

          <button
            type="submit"
            //onClick={() => save()}
            className="bg-sky-500 mt-4 truncate flex justify-center items-center w-full text-white px-5 py-2 rounded-md focus:outline-none"
          >
            Save Assesments & Add Questions
          </button>
        </form>
      )}

      <div className="pt-4  w-fit flex items-center space-x-2">
        {/* <button className="flex  justify-center items-center w-full text-blue-500 px-4 py-3 rounded-md focus:outline-none">
          <svg
            className="w-6 h-6 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>{" "}
          Cancel
        </button> */}
      </div>
    </div>
  );
}

export default Assesment;
