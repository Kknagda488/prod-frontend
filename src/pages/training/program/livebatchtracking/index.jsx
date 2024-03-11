import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
// import ChartList from "../../components/adminComponents/batchComponents/ChartList";
import LiveReportList from "../../../../components/training/batch/batchComponents/liveview/LiveReportList";
import LiveSubmissionList from "../../../../components/training/batch/batchComponents/liveview/LiveSubmissionList";
import { BiRefresh } from "react-icons/bi";
import moment from "moment";
import { toast } from "react-toastify";
import Utils from "../../../../components/utils";
import { useAuth } from "../../../../context/auth";
import { useParams } from "react-router-dom";
// import Utils from "../../components/utils";

//report by id
function BatchReports() {
  const [assessmentsList, setAssessmentsList] = useState([]);
  const [batchPop, setBatchPop] = useState(false);
  const [attendancePop, setAttendancePop] = useState(false);
  const [assessmentPop, setAssessmentPop] = useState(false);
  const [search, setSearch] = useState("");
  // const [limit, setLimit] = useState(100);
  const { userData, signOut } = useAuth();
  const [client, setClient] = useState("");
  const [tenantKey, setTenantKey] = useState("");
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState();
  const [chartData, setChartData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [updater, setUpdater] = useState({ status: "init", id: "0" });
  const [syncId, setSyncId] = useState(null);
  // const router = useRouter();
  const [batchAttendences, setBatchAttendances] = useState([]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [batchAssessments, setBatchAssessments] = useState([]);

  const [selectValue, setSelectValue] = useState("Absent");
  // const [pageLimit, setPageLimit] = useState(5);
  // const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(5);
  const [start, setstart] = useState(0);
  const [attendence, setAttendence] = useState([]);
  const [assessment, setAssessment] = useState([]);
  const [dateOptions, setDateOptions] = useState([]);
  const [batchData, setBatchData] = useState({});
  const [showAddNominee, setShowAddNominee] = useState(false);
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [nominee, setNominee] = useState(null);
  const [date, setDate] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(null);
  const [assessmentDate, setAssessmentDate] = useState(null);
  const currentDate = moment().format("YYYY-MM-DD");

  //const { id } = router.query;
  // var ab = [];
  const [ab, setAb] = useState([]);
  const [id, setId] = useState(null);
  let { batchId } = useParams();

  // console.log("links", path)
  // console.log("links", path.id)
  // 1&batch&name=batch 1&1
  // alert(batchId)

  let arr = batchId.split("&");

  batchId = arr[0];
  // alert(batchId)
  const fetchBAtchDetails = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.REACT_APP_DOMAIN
        }/api/batches/batchDetails/${batchId}?access_token=${
          userData?.accessToken
        }`
      );
      const res = await response.json();
      if (res.statusCode !== 200) {
        const error = (res && res?.message) || response.statusText;
        throw error;
      } else {
        // setBatchData(res?.data);
        let batch = res.data;
        setTenantKey(batch.tenantKey);
      }
      //setPeopleList(data.data.nominees);
      //setPgindex(data.data.lastPage);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchBAtchDetails();
  }, [batchId]);
  useEffect(() => {
    // Use an effect to set the client based on tenantKey only once when the component mounts
    if (tenantKey === "10d08176f2e74175ba526ab1b23beecc") {
      setClient("kotak");
    } else if (tenantKey === "ac7153df458aefc2a93fd1a4f7513147") {
      setClient("axis");
    } else if (tenantKey === "uq15v1axohhui5ytm2mxhdzcuywuakj7") {
      setClient("idfc");
    }
  }, [tenantKey]);

  useEffect(() => {
    getAssessmentsData();
  }, [search, limit, page, updater]);

  useEffect(() => {
    searchAttendence();
    //getOneBatch(id);
  }, [date]);

  const getAssessmentsData = async () => {
    var response = await fetch(
      `${import.meta.env.VITE_PUBLIC_URL}/api/userBatchAnswers/listOfReport/${batchId}?access_token=${userData?.accessToken}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        method: "GET",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const error = (data && data.message) || response.statusText;

      return Promise.reject(error);
    } else {
      // console.log(data);
      if (data.code === 404) {
        console.error(data.msg);
      } else {
        setAssessmentsList(data.data);

        setTotalCount(data?.data?.length || 0);
      }
    }
  };
  const npages = totalCount;
  const pgindex = npages - 5;
  // const pgindex = npages;
  const next = () => {
    if (start >= pgindex) {
      return;
    } else {
      setstart(start + 1);
    }
  };

  const fetchAssessmentData = async () => {
    try {
      var response = await fetch(
        `${import.meta.env.VITE_PUBLIC_URL}/api/userBatchAnswers/all/${batchId}?access_token=${userData?.accessToken}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "GET",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      } else {
        // console.log(data);
        if (data.code === 404) {
          console.error(data.msg);
        } else {
          setBatchAssessments();
          // setBatchAttendances(data.data.allBatchAttendence);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAttendance = async () => {
    try {
      var response = await fetch(
        `${import.meta.env.VITE_PUBLIC_URL}/api/batchAttendences/all/${batchId}?access_token=${userData?.accessToken}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "GET",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      } else {
        // console.log(data);
        if (data.code === 404) {
          console.error(data.msg);
        } else {
          setBatchAttendances(data.data.allBatchAttendence);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAssessmnetPeopleList = async () => {
    try {
      const filter = {
        // pageLimit,
        // pageNo,
        // search,
        limit,
        start,
        search,
      };
      const params = encodeURIComponent(JSON.stringify(filter));
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_URL}/api/batchAssessments/listAssessmentofLiveTrackingLinks/${batchId}?filter=${params}&access_token=${userData?.accessToken}`
      );
      const data = await response.json();
      if (data?.status === "success") {
        // setAttendence(data?.data?.result);
        setAssessment(data?.data?.result);
        console.log(
          "data-----------------fetchBatchPeopleList ---------is " +
            data?.data?.result
        );
      }
      //setPgindex(data.data.lastPage);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBatchPeopleList = async () => {
    try {
      const filter = {
        // pageLimit,
        // pageNo,
        // search,
        limit,
        start,
        search,
      };
      const params = encodeURIComponent(JSON.stringify(filter));
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_URL}/api/batchAttendences/listAttendenceofLiveTrackingLinks/${batchId}?filter=${params}&access_token=${userData?.accessToken}`
      );
      const data = await response.json();
      if (data?.status === "success") {
        setAttendence(data?.data?.result);
        console.log(
          "data-----------------fetchBatchPeopleList ---------is " +
            data?.data?.result
        );
      }
      //setPgindex(data.data.lastPage);
    } catch (error) {
      console.log(error);
    }
  };

  const previous = () => {
    if (start <= 0) {
      return;
    } else {
      setstart(start - 1);
    }
  };

  function findBatch(i) {
    var temparr = [];
    // console.log(i);

    const filteredassessment = assessmentsList?.map((a) => {
      if (a.batchId == i) {
        //setAb([...ab, a]);
        temparr = [...temparr, a];
        // console.log(a);
      }
      return a;
    });

    setAb(temparr);
  }

  const onRefresh = () => {
    //console.log(batchId, "yt");
    if (client === "kotak") {
      fetchAssessmnetPeopleList(batchId);
    }
    getOneBatch(batchId);
    setId(batchId);
    findBatch(batchId);
    fetchAttendance(batchId);
    fetchBatchPeopleList(batchId);
    getDays();
  };

  useEffect(() => {
    // var arr = links.split("=");
    // var num = arr.length - 1;
    // //console.log(batchId, "yt");

    // setId(batchId);
    // findBatch(batchId);
    // fetchAttendance(batchId);
    onRefresh();
    //getDays();
  }, [batchId, assessmentsList, start]);

  const updateAssessment = async (item, status) => {
    if (status === "Update") {
      console.log("==============item---", item);
      try {
        let form = new URLSearchParams({
          assessmentValue: selectValue,
        }).toString();
        const response = await fetch(
          `${import.meta.env.VITE_PUBLIC_URL}/api/userBatchAnswers/updateAssessmentData/${item?.userBatchAnswerId}?access_token=${userData?.accessToken}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },

            method: "PUT",
            body: form,
          }
        );
        const data = await response.json();
        if (data?.status === "failure" || data?.error?.statusCode === 404) {
          return toast.error(data?.message);
        } else if (data?.status === "success") {
          toast.success(data?.message);
          onRefresh();
        }
        // e.target.reset();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        let form = new URLSearchParams({
          branchName: item?.branchName,
          employeeId: item?.employeeId,
          firstName: item?.firstName,
          nomineeId: item?.nomineeId,
          referenceCode: item?.referenceCode,
          tenantKey: item?.tenantKey,
          assessmentValue: selectValue,
          batchId: item?.batchId,
        }).toString();
        const response = await fetch(
          `${import.meta.env.VITE_PUBLIC_URL}/api/userBatchAnswers/addAssessmentData?access_token=${userData?.accessToken}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },

            method: "POST",
            body: form,
          }
        );
        const data = await response.json();
        if (data.status === "failure") {
          return toast.error(data?.message);
        } else {
          onRefresh();
          toast.success("Assessment Data submitted successful.");
          // e.target.reset();
          setEmail("");
          setEmployee(null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const addAssessmentForm = async (e) => {
    e.preventDefault();
    console.log("=================consolellg", nominee);
    try {
      let form = new URLSearchParams({
        branchName: nominee?.branchName,
        employeeId: nominee?.employeeId,
        firstName: nominee?.firstName,
        nomineeId: nominee?.nomineeId,
        referenceCode: nominee?.referenceCode,
        tenantKey: nominee?.tenantKey,
        assessmentValue: selectValue,
        batchId: nominee?.batchId,
      }).toString();
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_URL}/api/userBatchAnswers/addAssessmentData?access_token=${userData?.accessToken}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },

          method: "POST",
          body: form,
        }
      );
      const data = await response.json();
      if (data.status === "failure") {
        return toast.error(data?.message);
      } else {
        onRefresh();
        toast.success("Assessment Data submitted successful.");
        // e.target.reset();
        setEmail("");
        setEmployee(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateAttendance = async (item, status) => {
    console.log("------------attdenceData d", item);
    if (status === "Update") {
      try {
        let form = new URLSearchParams({
          attendenceStatus: selectValue,
        }).toString();
        const response = await fetch(
          `${import.meta.env.VITE_PUBLIC_URL}/api/batchAttendences/updateAttendence/${item?.attendenceId}?access_token=${userData?.accessToken}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },

            method: "PUT",
            body: form,
          }
        );
        const data = await response.json();
        if (data?.status === "failure" || data?.error?.statusCode === 404) {
          return toast.error(data?.msg);
        } else if (data?.result?.status === "success") {
          toast.success("Attendence submitted successful.");
          onRefresh();
        }
        // e.target.reset();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        let form = new URLSearchParams({
          email: item?.email,
          employeeId: item?.employeeId,
          batchId: item?.batchId,
        }).toString();
        const response = await fetch(
          `${import.meta.env.VITE_PUBLIC_URL}/api/batchAttendences/addAttendenceforAxis?access_token=${userData?.accessToken}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },

            method: "POST",
            body: form,
          }
        );
        const data = await response.json();
        if (data.status === "failure") {
          return toast.error(data?.msg);
        }
        onRefresh();
        toast.success("Attendence submitted successful.");
        // e.target.reset();
        setEmail("");
        setEmployee(null);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getOneBatch = async (ids) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_URL}/api/batches/batchDetails/${ids}?access_token=${userData?.accessToken}`
      );
      const res = await response.json();
      if (res.statusCode !== 200) {
        const error = (res && res?.message) || response.statusText;
        throw error;
      } else {
        setBatchData(res?.data);
      }
      //setPeopleList(data.data.nominees);
      //setPgindex(data.data.lastPage);
    } catch (error) {
      console.log(error);
    }
  };

  const getDays = () => {
    var startDate = moment(batchData?.batchStartDate);
    var endDate = moment(batchData?.batchEndDate);
    var daysBetween = [];
    var currentDate = startDate.clone();
    while (currentDate.isSameOrBefore(endDate)) {
      // Check if the current date is not a Sunday (dayOfWeek() returns 0 for Sunday)
      if (currentDate.day() !== 0) {
        var currentDateFormat = currentDate.format("YYYY-MM-DD");
        daysBetween.push(currentDateFormat);
      }
      currentDate.add(1, "days");
    }
    setDateOptions(daysBetween);
  };

  const addAttendenceForm = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!employee) {
      toast.error("Employee not found");
    } else {
      try {
        let form = new URLSearchParams({
          employeeId: employeeId,
          email: email,
          batchId: id,
          attendenceDate: moment(attendanceDate).format("YYYY-MM-DD"),
        }).toString();
        const response = await fetch(
          `${import.meta.env.VITE_PUBLIC_URL}/api/batchAttendences/addDateWiseAttendence?access_token=${userData?.accessToken}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },

            method: "POST",
            body: form,
          }
        );
        const data = await response.json();
        if (data?.status === "failure") {
          e.target.reset();
          setEmployeeId("");
          setEmail("");
          return toast.error(data?.msg);
        }
        toast.success("Attendence submitted successful.");
        e.target.reset();
        setEmployeeId("");
        setEmail("");
      } catch (error) {
        console.log(error);
      } finally {
        setEmployee(null);
        setLoading(false);
        if (client === "kotak") {
          setShowAddEmployee(!showAddEmployee);
        } else {
          setShowAddNominee(!showAddNominee);
        }
      }
    }
  };
  const fetchEmployeeDetails = async (e) => {
    setEmployee(null);
    e.preventDefault();
    try {
      let params;
      if (client === "idfc") {
        params = encodeURIComponent(JSON.stringify({ email, batchId }));
      } else {
        params = encodeURIComponent(JSON.stringify({ employeeId, batchId }));
      }
      // const params = encodeURIComponent(JSON.stringify({ employeeId, batchId }));
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_URL}/api/nominees/getNomineeById?filter=${params}&access_token=${userData?.accessToken}`
      );
      const data = await response.json();
      if (Object.keys(data?.data).length) {
        console.log(data, "fetchEmployeeDetails");
        setEmployee({
          email: data?.data?.email,
          name: data?.data?.firstName + " " + data?.data?.lastName,
        });
        setNominee(data?.data);
      } else {
        throw Error("Employee not found");
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const searchAttendence = async () => {
    if (date !== "") {
      try {
        const filter = {
          // pageLimit,
          // pageNo,
          // search,
          limit,
          start,
          search,
        };
        const params = encodeURIComponent(JSON.stringify(filter));

        const response = await fetch(
          `${import.meta.env.VITE_PUBLIC_URL}/api/batchAttendences/daysWiseAttendenceofLiveTrackingLinks/${batchId}?date=${date}&filter=${params}&access_token=${userData?.accessToken}`
        );
        const data = await response.json();
        if (data?.status === "success") {
          setAttendence(data?.data?.result);
          console.log(
            "data-----------------fetchBatchPeopleList ---------is " +
              data?.data?.result
          );
        }

        //setPeopleList(data.data.nominees);
        //setPgindex(data.data.lastPage);
      } catch (error) {
        console.log(error);
      }
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (batchData) {
      //getOneBatch();
      getDays();
    }
  }, [batchData]);

  useEffect(() => {
    if (id) {
      if (client === "kotak") {
        fetchAssessmnetPeopleList();
      } else {
        fetchBatchPeopleList();
      }
    }
  }, [id, limit, start, search]);

  const body = {
    programId: id,
  };

  const fetchAttendence = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_URL}/api/batchAttendences/liveTrackingAttendence?access_token=${userData?.accessToken}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(body),
        }
      );
      // check for error response
      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        console.log("error", response.statusText);
        return Promise.reject(error);
      }
      const data = await response.json();
      console.log("data++++++++++++++++", data);
      if (data.status === "failure") {
        toast.error(data?.msg);
        return;
      }
      toast.success(data?.msg);

      var allExportAttendenceData = data.data;
      console.log(
        "allExportAttendenceData++++++++++++++++",
        allExportAttendenceData
      );
      handleAllExport(allExportAttendenceData);
    } catch (error) {
      console.error("There was an error!", error);
      if (error === "Token Expired" || error === "Malformed User") {
        signOut();
      }
    }
  };

  const handleAllExport = (allExportAttendenceData) => {
    let employees = [
      [
        "Sr.No",
        "Emp. Id",
        "Full Name",
        "Function",
        "Zone",
        "Supervisor Name",
        "Supervisor Email",
        "Job Family",
        "Batch Id",
        "Day1",
        "Day2",
        "Day3",
        "Day4",
        "Day5",
        "Total Days",
        "Total Present Days",
        "Complete/Not complete",
        "Total Learning Hours",
        "Learning hours",
        "Feedback on 5 point scale",
        "Assessment Score (Only Day 5)",
      ],
    ];

    allExportAttendenceData.forEach((data, index) => {
      let rowData = [
        index + 1,
        data.employeeId || "",
        // data.email || "",
        data.firstName ? `${data.firstName} ${data.lastName || ""}` : "",
        data.function || "",
        data.zone || "",
        data.managerName || "",
        data.managerEmail || "",
        data.product || "",
        data.batchId || "",
        data.day1 || "A",
        data.day2 || "A",
        data.day3 || "A",
        data.day4 || "A",
        data.day5 || "A",
        data.totalDays || "",
        data.totalPresentDays || "",
        "-",
        data.totalLearningHours || "",
        "Learning hours",
        "Feedback on 5 point scale",
        "Assessment Score (Only Day 5)",
      ];

      employees.push(rowData);
    });

    console.log(employees);
    // Assuming Utils.exportAoaToXlsx is correctly implemented
    Utils.exportAoaToXlsx(employees, `Attendance-Report-${Date.now()}`);
  };

  return (
    <>
      {client === "kotak" ? (
        <>
          <div className="flex flex-col w-full mt-5 px-6 h-[10rem]">
            {assessmentPop ? (
              <div className="fixed z-30  w-full h-screen top-0 left-0 items-center bg-gray-800/40">
                <div className="flex w-full items-start justify-center px-6  h-screen mt-20">
                  <div className="relative mx-10  flex flex-col  w-full items-center justify-center bg-white rounded-lg shadow-md px-8 py-2">
                    <div
                      id="journal-scroll"
                      className="w-full h-[30rem] overflow-y-auto"
                    >
                      <div className="flex justify-between items-center mt-5 mb-4">
                        <h5 className="text-xl font-semibold  leading-none text-gray-700 ">
                          Add Assessment
                        </h5>
                        <div className="flex">
                          {/* <select
                              onChange={(e) => {
                                setDate(e?.target?.value);
                              }}
                              className="px-4 py-2 mr-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                            >
                              <option value="">Select Date</option>

                              {dateOptions.map((date, index) => (
                                <option key={index} value={date}>
                                  {moment(date).format("YYYY-MM-DD")}
                                </option>
                              ))}
                            </select> */}
                          <button
                            className="px-1 py-1 mr-1 text-white text-sm font-medium bg-green-500 items-center rounded-md w-80"
                            onClick={() => setShowAddNominee(true)}
                          >
                            Add Assessment
                          </button>
                          <div
                            className="cursor-pointer mt-2"
                            onClick={onRefresh}
                          >
                            <BiRefresh size={30} />
                          </div>
                          <IoClose
                            onClick={() => {
                              setLimit(5);
                              setstart(0);
                              onRefresh();
                              setAssessmentPop(false);
                              setAttendancePop(false);
                            }}
                            className="cursor-pointer text-xl font-semibold text-black ml-10"
                            size={50}
                          />
                        </div>
                      </div>
                      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
                        <table className="w-full text-sm text-left text-gray-500">
                          <thead className="text-md m-4 bg-sky-600 text-white">
                            <tr>
                              <th scope="col" className="px-3 py-2">
                                Name
                              </th>
                              <th scope="col" className="px-3 py-2">
                                Employee Id
                              </th>
                              <th scope="col" className="px-3 py-2">
                                Status
                              </th>
                              <th scope="col" className="px-3 py-2">
                                Marks
                              </th>
                              <th scope="col" className="px-3 py-2">
                                Assessment
                              </th>
                              <th scope="col" className="px-3 py-2">
                                Assessment Date
                              </th>
                              {/* <th scope="col" className="px-3 py-2">
                          Timestamp
                        </th> */}
                            </tr>
                          </thead>
                          {assessment?.map((item, i) => {
                            console.log(
                              "attendence=====================",
                              assessment
                            );
                            return (
                              <tbody key={i + 1}>
                                <tr className="bg-white border-b  ">
                                  <td className="px-3 py-2 text-gray-900">
                                    {item?.firstName
                                      ? item?.firstName
                                      : item?.fullName}
                                  </td>
                                  <td className="px-3 py-2 text-gray-900">
                                    {item?.nomineeAttendance
                                      ? item?.nomineeAttendance?.employeeId
                                      : item?.employeeId}
                                  </td>
                                  {/* <td className="px-3 py-2 text-gray-900">
                                      {item?.batchNominees === "Outside" ? (
                                        <span className="bg-gray-300 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-600">
                                          Outside
                                        </span>
                                      ) : (
                                        <span className="bg-cyan-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-600">
                                          Inside
                                        </span>
                                      )}
                                    </td> */}
                                  <td className="px-1 py-2">
                                    {item?.assessmentStatus === "submitted" ? (
                                      <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-600">
                                        Submitted
                                      </span>
                                    ) : (
                                      <span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-600">
                                        Not Submitted
                                      </span>
                                    )}
                                  </td>

                                  <td className="px-3 py-2 text-gray-900">
                                    {item?.obtainMarks
                                      ? item?.obtainMarks
                                      : "-"}
                                  </td>

                                  <td className="flex items-center px-1 py-2">
                                    <input
                                      type="text"
                                      className="px-2 py-2 border w-3 focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                      // value={selectValue}
                                      //value={data?.attendenceStatus}
                                      //onChange={(eF) => setSelectValue(e.target.value)}
                                      onChange={(e) =>
                                        setSelectValue(e?.target?.value)
                                      }
                                    />

                                    <span
                                      className="bg-blue-500 text-xs font-medium ml-2 mr-2 px-2 py-2 rounded text-white"
                                      onClick={(e) =>
                                        updateAssessment(
                                          item,
                                          item?.userBatchAnswerId
                                            ? "Update"
                                            : "Add"
                                        )
                                      }
                                    >
                                      {item?.userBatchAnswerId
                                        ? "Update"
                                        : "Add"}
                                    </span>
                                  </td>
                                  <td className="px-3 py-4 text-gray-900">
                                    {item?.createdDate
                                      ? moment(item?.createdDate).format(
                                          "YYYY-MM-DD"
                                        )
                                      : "-"}
                                  </td>
                                  {/* <td className="px-3 py-4 text-gray-900">
                              {item?.createdAt}
                            </td> */}
                                </tr>
                              </tbody>
                            );
                          })}
                        </table>
                      </div>
                      <div className="flex flex-row justify-around mt-5 items-center  ">
                        <span className="text-sm flex text-gray-700 "></span>
                        <div className="flex">
                          <div className="dropdown flex items-center relative">
                            <p>Show</p>
                            <span className="bg-gray-100 text-gray-700 mx-2  font-normal tracking-wide rounded inline-flex items-center">
                              <select
                                className="bg-transparent px-3 py-2  outline-none "
                                onChange={(e) => {
                                  //setPageLimit(e.target.value);
                                  //setPageNo(1);
                                  setLimit(e.target.value);
                                  setstart(0);
                                }}
                              >
                                <option className="mr-1">5</option>
                                <option className="mr-1">10</option>
                                <option className="mr-1">20</option>
                                <option className="mr-1">30</option>
                                <option className="mr-1">40</option>
                                <option className="mr-1">50</option>
                                <option className="mr-1">100</option>
                                <option className="mr-1">250</option>
                                <option className="mr-1">500</option>
                              </select>
                            </span>
                            <p>Entries</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {attendancePop ? (
              <div className="fixed z-30  w-full h-screen top-0 left-0 items-center bg-gray-800/40">
                <div className="flex w-full items-start justify-center px-6  h-screen mt-20">
                  <div className="relative mx-10  flex flex-col  w-full items-center justify-center bg-white rounded-lg shadow-md px-8 py-2">
                    <div
                      id="journal-scroll"
                      className="w-full h-[30rem] overflow-y-auto"
                    >
                      <div className="flex justify-between items-center mt-5 mb-4">
                        <h5 className="text-xl font-semibold  leading-none text-gray-700 ">
                          Attendence List
                        </h5>
                        <div className="flex">
                          <select
                            onChange={(e) => {
                              setDate(e?.target?.value);
                            }}
                            className="px-4 py-2 mr-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          >
                            <option value="">Select Date</option>

                            {/* {dateOptions.map((date, index) => (
                                <option key={index} value={date}>
                                  {moment(date).format("YYYY-MM-DD")}
                                </option>
                              ))} */}
                            {dateOptions.map((date, index) => (
                              <option
                                key={index}
                                value={date}
                                disabled={moment(date).isAfter(currentDate)}
                              >
                                {moment(date).format("YYYY-MM-DD")}
                              </option>
                            ))}
                          </select>
                          <button
                            className="px-1 py-1 mr-1 text-white text-sm font-medium bg-green-500 items-center rounded-md w-80"
                            onClick={() => setShowAddEmployee(true)}
                          >
                            Add Attendence
                          </button>
                          <div
                            className="cursor-pointer mt-2"
                            onClick={onRefresh}
                          >
                            <BiRefresh size={30} />
                          </div>
                          <IoClose
                            onClick={() => {
                              setLimit(5);
                              setstart(0);
                              onRefresh();
                              setAttendancePop(false);
                            }}
                            className="cursor-pointer text-xl font-semibold text-black ml-10"
                            size={50}
                          />
                        </div>
                      </div>
                      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
                        <table className="w-full text-sm text-left text-gray-500">
                          <thead className="text-md m-4 bg-sky-600 text-white">
                            <tr>
                              <th scope="col" className="px-3 py-2">
                                Name
                              </th>
                              {/* <th scope="col" className="px-3 py-2">
                                  Email
                                </th> */}
                              <th scope="col" className="px-3 py-2">
                                Employee Id
                              </th>
                              <th scope="col" className="px-3 py-2">
                                BatchStatus
                              </th>
                              <th scope="col" className="px-3 py-2">
                                Status
                              </th>
                              <th scope="col" className="px-3 py-2">
                                Attendance
                              </th>
                              <th scope="col" className="px-3 py-2">
                                Attendance Date
                              </th>
                              {/* <th scope="col" className="px-3 py-2">
                            Timestamp
                          </th> */}
                            </tr>
                          </thead>
                          {attendence?.map((item, i) => {
                            console.log(
                              "attendence=====================",
                              attendence
                            );
                            return (
                              <tbody key={i + 1}>
                                <tr className="bg-white border-b  ">
                                  <td className="px-3 py-2 text-gray-900">
                                    {/* {item?.nominee?.firstName} */}
                                    {item?.nomineeAttendance
                                      ? item?.nomineeAttendance?.firstName
                                      : item?.firstName}
                                  </td>

                                  {/* <td className="px-3 py-2 text-gray-900">
                                      {item?.nomineeAttendance
                                        ? item?.nomineeAttendance?.email
                                        : item?.email}
                                    </td> */}
                                  <td className="px-3 py-2 text-gray-900">
                                    {item?.nomineeAttendance
                                      ? item?.nomineeAttendance?.employeeId
                                      : item?.employeeId}
                                  </td>
                                  <td className="px-3 py-2 text-gray-900">
                                    {item?.batchNominees === "Outside" ? (
                                      <span className="bg-gray-300 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-600">
                                        Outside
                                      </span>
                                    ) : (
                                      <span className="bg-cyan-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-600">
                                        Inside
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-1 py-2">
                                    {item?.attendenceStatus === "Present" ? (
                                      <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-600">
                                        Present
                                      </span>
                                    ) : (
                                      <span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-600">
                                        Absent
                                      </span>
                                    )}
                                  </td>
                                  <td className="flex items-center px-1 py-2">
                                    <select
                                      className="px-2 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                      // value={selectValue}
                                      //value={data?.attendenceStatus}
                                      //onChange={(eF) => setSelectValue(e.target.value)}
                                      onChange={(e) =>
                                        setSelectValue(e?.target?.value)
                                      }
                                    >
                                      <option value="Present">Present</option>
                                      <option value="Absent">Absent</option>
                                    </select>
                                    <span
                                      className="bg-blue-500 text-xs font-medium ml-2 mr-2 px-2 py-2 rounded text-white"
                                      onClick={(e) =>
                                        updateAttendance(
                                          item,
                                          item?.attendenceId ? "Update" : "Add"
                                        )
                                      }
                                    >
                                      {item?.attendenceId ? "Update" : "Add"}
                                    </span>
                                  </td>
                                  <td className="px-3 py-4 text-gray-900">
                                    {item?.attendenceDate
                                      ? moment(item?.attendenceDate).format(
                                          "YYYY-MM-DD"
                                        )
                                      : "-"}
                                  </td>
                                  {/* <td className="px-3 py-4 text-gray-900">
                                {item?.createdAt}
                              </td> */}
                                </tr>
                              </tbody>
                            );
                          })}
                        </table>
                      </div>
                      <div className="flex flex-row justify-around mt-5 items-center  ">
                        <span className="text-sm flex text-gray-700 "></span>
                        <div className="flex">
                          <div className="dropdown flex items-center relative">
                            <p>Show</p>
                            <span className="bg-gray-100 text-gray-700 mx-2  font-normal tracking-wide rounded inline-flex items-center">
                              <select
                                className="bg-transparent px-3 py-2  outline-none "
                                onChange={(e) => {
                                  //setPageLimit(e.target.value);
                                  //setPageNo(1);
                                  setLimit(e.target.value);
                                  setstart(0);
                                }}
                              >
                                <option className="mr-1">5</option>
                                <option className="mr-1">10</option>
                                <option className="mr-1">20</option>
                                <option className="mr-1">30</option>
                                <option className="mr-1">40</option>
                                <option className="mr-1">50</option>
                                <option className="mr-1">100</option>
                                <option className="mr-1">250</option>
                                <option className="mr-1">500</option>
                              </select>
                            </span>
                            <p>Entries</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {batchPop ? (
              <div className="fixed z-30  w-full h-screen top-0 left-0 items-center bg-gray-800/40">
                <div className="flex w-full items-start mt-4 justify-center px-6  h-screen">
                  <div className="relative mx-10  flex flex-col  w-full items-center justify-center bg-white rounded-lg shadow-md px-8 py-2">
                    <div className="absolute z-30 bg-white flex w-full justify-end items-end top-0  p-4 ">
                      <IoClose
                        onClick={() => setBatchPop(false)}
                        className="cursor-pointer text-xl font-semibold text-black "
                      />
                    </div>
                    <div className="w-full h-[34rem]">
                      {/* <ChartList chartData={chartData} excelData={excelData} /> */}
                      <LiveSubmissionList
                        excelData={excelData}
                        setUpdater={setUpdater}
                        setSyncId={setSyncId}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            <LiveReportList
              assessmentsList={ab}
              next={next}
              previous={previous}
              pgindex={pgindex}
              setExcelData={setExcelData}
              client={client}
              page={page}
              totalCount={totalCount}
              setLimit={setLimit}
              setPage={setPage}
              setSearch={setSearch}
              id={id}
              setBatchPop={setBatchPop}
              setChartData={setChartData}
              updater={updater}
              setUpdater={setUpdater}
              syncId={syncId}
              setSyncId={setSyncId}
              setAssessmentPop={setAssessmentPop}
              batchAttendences={batchAttendences}
              setAttendancePop={setAttendancePop}
              attendancePop={attendancePop}
            />
            {showAddNominee && (
              <div className="fixed z-30  w-full h-screen top-0 left-0 items-center bg-gray-800/40">
                <div className="flex w-full items-center mt-20 justify-center ">
                  <div className="relative mx-10 flex flex-col items-center justify-center bg-white rounded-lg shadow-md px-8 py-2">
                    <div className="absolute z-30 bg-white flex w-full justify-end items-end top-0  p-2 ">
                      <IoClose
                        onClick={() => {
                          setAttendanceDate(null);
                          setEmployeeId("");
                          setEmployee("");
                          setNominee("");
                          setShowAddNominee(false);
                        }}
                        className="cursor-pointer text-2xl font-semibold text-black "
                      />
                    </div>
                    <div className="flex justify-center">
                      <div className="flex items-center justify-center p-4">
                        <div className="rounded overflow-hidden shadow-lg p-5 bg-[white] ">
                          <h1 className="text-xl text-700">
                            Add Assessment Form
                          </h1>
                          <br />
                          <form onSubmit={fetchEmployeeDetails}>
                            <div className="w-100 flex flex-wrap">
                              <div className="px-2">
                                <label className="leading-loose">
                                  Employee Id
                                </label>
                                <input
                                  type="text"
                                  name="email"
                                  className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                  placeholder="Provide Employee Id"
                                  required
                                  value={employeeId}
                                  onChange={(e) =>
                                    setEmployeeId(e.target.value)
                                  }
                                />
                              </div>
                              <div className="py-1 mt-7 space-x-4">
                                <button
                                  type="submit"
                                  className="bg-[#003366] flex-inline justify-center items-center text-white px-4 py-1 rounded-md focus:outline-none"
                                >
                                  Find
                                </button>
                              </div>
                            </div>
                          </form>
                          <form onSubmit={addAssessmentForm}>
                            <div className="px-2">
                              <label className="leading-loose">Full name</label>
                              <input
                                name="fullName"
                                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                placeholder="Provide full name"
                                required
                                disabled
                                // readOnly
                                defaultValue={nominee?.firstName}
                              />
                            </div>
                            <div className="px-2">
                              <label className="leading-loose">
                                Assessment Data
                              </label>
                              <input
                                name="assessmentValue"
                                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                placeholder="Provide data"
                                required
                                onChange={(e) =>
                                  setSelectValue(e?.target?.value)
                                }
                              />
                            </div>
                            {/* <div className="w-1/2 px-2">
              <label className="leading-loose">Branch Name</label>
              <input
                name="branchName"
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                placeholder="Provide employee id"
                required
                readOnly
                defaultValue={employee.branchName}
              />
            </div> */}
                            <div className="py-4  space-x-4 px-2">
                              <button
                                className="bg-[#003366] flex-inline justify-center items-center text-white px-4 py-2 rounded-md focus:outline-none"
                                disabled={loading}
                                type="submit"
                              >
                                Submit
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showAddEmployee && (
              <div className="fixed z-30  w-full h-screen top-0 left-0 items-center bg-gray-800/40">
                <div className="flex w-full items-center mt-20 justify-center ">
                  <div className="relative mx-10 flex flex-col items-center justify-center bg-white rounded-lg shadow-md px-8 py-2">
                    <div className="absolute z-30 bg-white flex w-full justify-end items-end top-0  p-2 ">
                      <IoClose
                        onClick={() => {
                          setAttendanceDate(null);
                          setEmployeeId("");
                          setEmployee("");
                          setShowAddEmployee(false);
                        }}
                        className="cursor-pointer text-2xl font-semibold text-black "
                      />
                    </div>
                    <div className="flex justify-center">
                      <div className="flex items-center justify-center p-4">
                        <div className="rounded overflow-hidden shadow-lg p-5 bg-[white] ">
                          <h1 className="text-xl text-700">Attendence Form</h1>
                          <br />
                          <form onSubmit={fetchEmployeeDetails}>
                            <div className="w-100 flex flex-wrap">
                              <div className="px-2">
                                <label className="leading-loose">
                                  Employee Id
                                </label>
                                <input
                                  type="text"
                                  name="email"
                                  className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                  placeholder="Provide Employee Id"
                                  required
                                  value={employeeId}
                                  onChange={(e) =>
                                    setEmployeeId(e.target.value)
                                  }
                                />
                              </div>
                              <div className="py-1 mt-7 space-x-4">
                                <button
                                  type="submit"
                                  className="bg-[#003366]  flex-inline justify-center items-center text-white px-4 py-1 rounded-md focus:outline-none"
                                >
                                  Find
                                </button>
                              </div>
                            </div>
                          </form>
                          <form onSubmit={addAttendenceForm}>
                            <div className="px-2">
                              <label className="leading-loose">Full name</label>
                              <input
                                name="fullName"
                                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                placeholder="Provide full name"
                                required
                                disabled
                                // readOnly
                                defaultValue={employee?.name}
                              />
                            </div>
                            {/* <div className="px-2">
                                <label className="leading-loose">Email</label>
                                <input
                                  name="email"
                                  className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                  placeholder="Provide email"
                                  required
                                  disabled
                                  defaultValue={employee?.email}
                                />
                              </div> */}
                            <div className="px-2">
                              <label className="leading-loose">Date</label>
                              <select
                                required
                                onChange={(e) => {
                                  setAttendanceDate(e?.target?.value);
                                }}
                                className="px-4 py-2 mr-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              >
                                <option value="">Select Date</option>
                                {/* {dateOptions.map((date, index) => (
                                  <option key={index} value={date}>
                                    {moment(date).format("YYYY-MM-DD")}
                                  </option>
                                ))} */}
                                {dateOptions.map((date, index) => (
                                  <option
                                    key={index}
                                    value={date}
                                    disabled={moment(date).isAfter(currentDate)}
                                  >
                                    {moment(date).format("YYYY-MM-DD")}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {/* <div className="w-1/2 px-2">
                <label className="leading-loose">Branch Name</label>
                <input
                  name="branchName"
                  className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                  placeholder="Provide employee id"
                  required
                  readOnly
                  defaultValue={employee.branchName}
                />
              </div> */}
                            <div className="py-4  space-x-4 px-2">
                              <button
                                type="submit"
                                className="bg-[#003366]  flex-inline justify-center items-center text-white px-4 py-2 rounded-md focus:outline-none"
                                disabled={loading}
                              >
                                Submit
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col w-full mt-5 px-6 h-[10rem]">
            {attendancePop ? (
              <div className="fixed z-30  w-full h-screen top-0 left-0 items-center bg-gray-800/40">
                <div className="flex w-full items-start justify-center px-6  h-screen mt-20">
                  <div className="relative mx-10  flex flex-col  w-full items-center justify-center bg-white rounded-lg shadow-md px-8 py-2">
                    <div
                      id="journal-scroll"
                      className="w-full h-[30rem] overflow-y-auto"
                    >
                      <div className="flex justify-between items-center mt-5 mb-4">
                        <h5 className="text-xl font-semibold  leading-none text-gray-700 ">
                          Attendence List
                        </h5>
                        <div className="flex">
                          <select
                            onChange={(e) => {
                              setDate(e?.target?.value);
                            }}
                            className="px-4 py-2 mr-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          >
                            <option value="">Select Date</option>

                            {/* {dateOptions.map((date, index) => (
                              <option key={index} value={date}>
                                {moment(date).format("YYYY-MM-DD")}
                              </option>
                            ))} */}
                            {dateOptions.map((date, index) => (
                              <option
                                key={index}
                                value={date}
                                disabled={moment(date).isAfter(currentDate)}
                              >
                                {moment(date).format("YYYY-MM-DD")}
                              </option>
                            ))}
                          </select>
                          <button
                            className="px-1 py-1 mr-1 text-white text-sm font-medium bg-green-500 items-center rounded-md w-80"
                            onClick={() => setShowAddNominee(true)}
                          >
                            Add Attendence
                          </button>
                          <div
                            className="cursor-pointer mt-2"
                            onClick={onRefresh}
                          >
                            <BiRefresh size={30} />
                          </div>
                          <IoClose
                            onClick={() => {
                              setLimit(5);
                              setstart(0);
                              onRefresh();
                              setAttendancePop(false);
                            }}
                            className="cursor-pointer text-xl font-semibold text-black ml-10"
                            size={50}
                          />
                        </div>
                      </div>
                      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
                        <table className="w-full text-sm text-left text-gray-500">
                          <thead className="text-md m-4 bg-sky-600 text-white">
                            <tr>
                              <th scope="col" className="px-3 py-2">
                                Name
                              </th>
                              {client === "axis" ? (
                                <th scope="col" className="px-3 py-2">
                                  Employee Id
                                </th>
                              ) : null}

                              <th scope="col" className="px-3 py-2">
                                Email
                              </th>
                              <th scope="col" className="px-3 py-2">
                                BatchStatus
                              </th>
                              <th scope="col" className="px-3 py-2">
                                Status
                              </th>
                              <th scope="col" className="px-3 py-2">
                                Attendance
                              </th>
                              <th scope="col" className="px-3 py-2">
                                Attendance Date
                              </th>
                              {/* <th scope="col" className="px-3 py-2">
                            Timestamp
                          </th> */}
                            </tr>
                          </thead>
                          {attendence?.map((item, i) => {
                            console.log(
                              "attendence=====================",
                              attendence
                            );
                            return (
                              <tbody key={i + 1}>
                                <tr className="bg-white border-b  ">
                                  <td className="px-3 py-2 text-gray-900">
                                    {/* {item?.nominee?.firstName} */}
                                    {item?.nomineeAttendance
                                      ? item?.nomineeAttendance?.firstName
                                      : item?.firstName}
                                  </td>

                                  {client === "axis" ? (
                                    <td className="px-3 py-2 text-gray-900">
                                      {item?.nomineeAttendance
                                        ? item?.nomineeAttendance?.employeeId
                                        : item?.employeeId}
                                    </td>
                                  ) : null}
                                  <td className="px-3 py-2 text-gray-900">
                                    {item?.nomineeAttendance
                                      ? item?.nomineeAttendance?.email
                                      : item?.email}
                                  </td>
                                  <td className="px-3 py-2 text-gray-900">
                                    {item?.batchNominees === "Outside" ? (
                                      <span className="bg-gray-300 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-600">
                                        Outside
                                      </span>
                                    ) : (
                                      <span className="bg-cyan-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-600">
                                        Inside
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-1 py-2">
                                    {item?.attendenceStatus === "Present" ? (
                                      <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-600">
                                        Present
                                      </span>
                                    ) : (
                                      <span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-600">
                                        Absent
                                      </span>
                                    )}
                                  </td>
                                  <td className="flex items-center px-1 py-2">
                                    <select
                                      className="px-2 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                      // value={selectValue}
                                      //value={data?.attendenceStatus}
                                      //onChange={(eF) => setSelectValue(e.target.value)}
                                      onChange={(e) =>
                                        setSelectValue(e?.target?.value)
                                      }
                                    >
                                      <option value="Present">Present</option>
                                      <option value="Absent">Absent</option>
                                    </select>
                                    <span
                                      className="bg-blue-500 text-xs font-medium ml-2 mr-2 px-2 py-2 rounded text-white"
                                      onClick={(e) =>
                                        updateAttendance(
                                          item,
                                          item?.attendenceId ? "Update" : "Add"
                                        )
                                      }
                                    >
                                      {item?.attendenceId ? "Update" : "Add"}
                                    </span>
                                  </td>
                                  <td className="px-3 py-4 text-gray-900">
                                    {item?.attendenceDate
                                      ? moment(item?.attendenceDate).format(
                                          "YYYY-MM-DD"
                                        )
                                      : "-"}
                                  </td>
                                  {/* <td className="px-3 py-4 text-gray-900">
                                {item?.createdAt}
                              </td> */}
                                </tr>
                              </tbody>
                            );
                          })}
                        </table>
                      </div>
                      <div className="flex flex-row justify-around mt-5 items-center  ">
                        <span className="text-sm flex text-gray-700 "></span>
                        <div className="flex">
                          <div className="dropdown flex items-center relative">
                            <p>Show</p>
                            <span className="bg-gray-100 text-gray-700 mx-2  font-normal tracking-wide rounded inline-flex items-center">
                              <select
                                className="bg-transparent px-3 py-2  outline-none "
                                onChange={(e) => {
                                  //setPageLimit(e.target.value);
                                  //setPageNo(1);
                                  setLimit(e.target.value);
                                  setstart(0);
                                }}
                              >
                                <option className="mr-1">5</option>
                                <option className="mr-1">10</option>
                                <option className="mr-1">20</option>
                                <option className="mr-1">30</option>
                                <option className="mr-1">40</option>
                                <option className="mr-1">50</option>
                                <option className="mr-1">100</option>
                                <option className="mr-1">250</option>
                                <option className="mr-1">500</option>
                              </select>
                            </span>
                            <p>Entries</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {batchPop ? (
              <div className="fixed z-30  w-full h-screen top-0 left-0 items-center bg-gray-800/40">
                <div className="flex w-full items-start mt-4 justify-center px-6  h-screen">
                  <div className="relative mx-10  flex flex-col  w-full items-center justify-center bg-white rounded-lg shadow-md px-8 py-2">
                    <div className="absolute z-30 bg-white flex w-full justify-end items-end top-0  p-4 ">
                      <IoClose
                        onClick={() => setBatchPop(false)}
                        className="cursor-pointer text-xl font-semibold text-black "
                      />
                    </div>
                    <div className="w-full h-[34rem]">
                      {/* <ChartList chartData={chartData} excelData={excelData} /> */}
                      <LiveSubmissionList
                        excelData={excelData}
                        setUpdater={setUpdater}
                        setSyncId={setSyncId}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            <LiveReportList
              assessmentsList={ab}
              next={next}
              client={client}
              previous={previous}
              pgindex={pgindex}
              setExcelData={setExcelData}
              page={page}
              totalCount={totalCount}
              setLimit={setLimit}
              setPage={setPage}
              setSearch={setSearch}
              id={id}
              setBatchPop={setBatchPop}
              setChartData={setChartData}
              updater={updater}
              setUpdater={setUpdater}
              syncId={syncId}
              setSyncId={setSyncId}
              batchAttendences={batchAttendences}
              setAttendancePop={setAttendancePop}
              attendancePop={attendancePop}
            />
            {showAddNominee && (
              <div className="fixed z-30  w-full h-screen top-0 left-0 items-center bg-gray-800/40">
                <div className="flex w-full items-center mt-20 justify-center ">
                  <div className="relative mx-10 flex flex-col items-center justify-center bg-white rounded-lg shadow-md px-8 py-2">
                    <div className="absolute z-30 bg-white flex w-full justify-end items-end top-0  p-2 ">
                      <IoClose
                        onClick={() => {
                          setAttendanceDate(null);
                          setEmployeeId("");
                          setEmployee("");
                          setShowAddNominee(false);
                        }}
                        className="cursor-pointer text-2xl font-semibold text-black "
                      />
                    </div>
                    <div className="flex justify-center">
                      <div className="flex items-center justify-center p-4">
                        <div className="rounded overflow-hidden shadow-lg p-5 bg-[white] ">
                          <h1 className="text-xl text-700">Attendence Form</h1>
                          <br />
                          <form onSubmit={fetchEmployeeDetails}>
                            <div className="w-100 flex flex-wrap">
                              {client === "axis" ? (
                                <div className="px-2">
                                  <label className="leading-loose">
                                    Employee Id
                                  </label>
                                  <input
                                    type="text"
                                    name="email"
                                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                    placeholder="Provide Employee Id"
                                    required
                                    value={employeeId}
                                    onChange={(e) =>
                                      setEmployeeId(e.target.value)
                                    }
                                  />
                                </div>
                              ) : (
                                <div className="px-2">
                                  <label className="leading-loose">Email</label>
                                  <input
                                    type="text"
                                    name="email"
                                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                    placeholder="Provide Email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                  />
                                </div>
                              )}
                              <div className="py-1 mt-7 space-x-4">
                                <button
                                  type="submit"
                                  className="bg-[#97144c] flex-inline justify-center items-center text-white px-4 py-1 rounded-md focus:outline-none"
                                >
                                  Find
                                </button>
                              </div>
                            </div>
                          </form>
                          <form onSubmit={addAttendenceForm}>
                            <div className="px-2">
                              <label className="leading-loose">Full name</label>
                              <input
                                name="fullName"
                                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                placeholder="Provide full name"
                                required
                                disabled
                                // readOnly
                                defaultValue={employee?.name}
                              />
                            </div>
                            <div className="px-2">
                              <label className="leading-loose">Email</label>
                              <input
                                name="email"
                                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                placeholder="Provide email"
                                required
                                disabled
                                defaultValue={employee?.email}
                              />
                            </div>
                            <div className="px-2">
                              <label className="leading-loose">Date</label>
                              <select
                                required
                                onChange={(e) => {
                                  setAttendanceDate(e?.target?.value);
                                }}
                                className="px-4 py-2 mr-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              >
                                <option value="">Select Date</option>
                                {/* {dateOptions.map((date, index) => (
                                  <option key={index} value={date}>
                                    {moment(date).format("YYYY-MM-DD")}
                                  </option>
                                ))} */}

                                {dateOptions.map((date, index) => (
                                  <option
                                    key={index}
                                    value={date}
                                    disabled={moment(date).isAfter(currentDate)}
                                  >
                                    {moment(date).format("YYYY-MM-DD")}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {/* <div className="w-1/2 px-2">
                <label className="leading-loose">Branch Name</label>
                <input
                  name="branchName"
                  className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                  placeholder="Provide employee id"
                  required
                  readOnly
                  defaultValue={employee.branchName}
                />
              </div> */}
                            <div className="py-4  space-x-4 px-2">
                              <button
                                type="submit"
                                className="bg-[#97144c] flex-inline justify-center items-center text-white px-4 py-2 rounded-md focus:outline-none"
                                disabled={loading}
                              >
                                Submit
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default BatchReports;
