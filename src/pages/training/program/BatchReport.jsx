import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import ChartList from "../../../components/training/batch/batchComponents/ChartList";
import BatchReportList from "../../../components/training/batch/batchComponents/BatchReportList";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/auth";
import BatchReport from "../../../components/training/batch/batchComponents/BatchReport";

function BatchReports() {
  const [assessmentsList, setAssessmentsList] = useState([]);
  // const {batchId} = useParams()
  const [batchPop, setBatchPop] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(100);
  const [reportPop, setReportPop] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState();
  const [chartData, setChartData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [batchData, setBatchData] = useState([]);
  const { batchId } = useParams();
  const { userData } = useAuth();

  useEffect(() => {
    getAssessmentsData();
  }, [search, limit, page]);
  const getAssessmentsData = async () => {
    var response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/userBatchAnswers/listOfReport/${batchId}?access_token=${
        userData?.accessToken
      }`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        method: "GET",
      }
    );

    const data = await response.json();
    console.log(data, "ssss");
    if (!response.ok) {
      const error = (data && data.message) || response.statusText;

      return Promise.reject(error);
    } else {
      console.log(data);
      if (data.code === 404) {
        console.log(data.message);
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

  var ab = [];
  if (batchId !== undefined) {
    const filteredassessment = assessmentsList?.map((a) => {
      if (a.batchId == batchId) {
        ab = [...ab, a];
      }
      return a;
    });
  }

  return (
    <div className="flex flex-col w-full mt-12">
      {batchPop ? (
        <div className="fixed z-30  w-full h-screen top-0 left-0 items-center   bg-gray-800/40">
          <div className="flex w-full items-start mt-20 justify-center   h-screen">
            <div className="relative mx-10 flex flex-col  w-full items-center justify-center bg-white rounded-lg shadow-md px-8 py-2">
              <div className="absolute z-30 bg-white flex w-full justify-end items-end top-0  p-4 ">
                <IoClose
                  onClick={() => setBatchPop(false)}
                  className="cursor-pointer text-xl font-semibold text-black "
                />
              </div>
              <div
                id="journal-scroll"
                className="w-full h-[30rem] overflow-y-auto"
              >
                <ChartList
                  chartData={chartData}
                  excelData={excelData}
                  batchData={batchData}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {reportPop ? (
        <>
          <h1>test</h1>
          <BatchReport
            chartData={chartData}
            excelData={excelData}
            batchData={batchData}
          />
        </>
      ) : (
        <BatchReportList
          assessmentsList={assessmentsList}
          next={next}
          previous={previous}
          pgindex={pgindex}
          setExcelData={setExcelData}
          page={page}
          totalCount={totalCount}
          setLimit={setLimit}
          setPage={setPage}
          setSearch={setSearch}
          id={batchId}
          batchData={batchData}
          setReportPop={setReportPop}
          setBatchData={setBatchData}
          setBatchPop={setBatchPop}
          setChartData={setChartData}
        />
      )}
    </div>
  );
}

export default BatchReports;
