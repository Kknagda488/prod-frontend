import React from "react";
import { AiOutlineCloudSync } from "react-icons/ai";
import { v4 as uuid_v4 } from "uuid";
function LiveSubmissionList({ excelData, setUpdater, setSyncId }) {
  return (
    <div className="mt-10 relative">
      <div className="flex w-full justify-between items-center">
        <div className="flex flex-col w-fit my-3  bg-white  px-2">
          <h2 className="text-xl font-bold text-gray-800 capitalize ">
            Program Name: {excelData[0]?.program}
          </h2>
          <p className="font-medium text-md text-gray-700">
            Trainer: {excelData[0]?.facilitator}
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 capitalize mb-1">
            Total responses: {excelData?.length || 0}
          </h2>
          <button
            onClick={() => {
              setSyncId({
                batch: excelData[0]?.batchId,
                assessment: excelData[0]?.assessmentId,
              });
              setUpdater({ status: "refresh", id: uuid_v4() });
            }}
            className="flex w-fit items-center justify-center text-md mb-2 text-white bg-sky-500 rounded-md px-2 pb-1"
          >
            Sync Data
            <AiOutlineCloudSync className=" ml-2 text-2xl mt-1" />
          </button>
        </div>
      </div>
      <div
        id="journal-scroll"
        className="flex w-full overflow-y-auto  max-h-[25rem] pt-1"
      >
        <table className="w-full text-sm font-medium text-left text-gray-700">
          <thead className="text-xs text-gray-700 uppercase  bg-gray-50 ">
            <tr>
              <th scope="col" className="py-3 px-6">
                Time Stamp
              </th>
              <th scope="col" className="py-3 px-6">
                Employee Name
              </th>
              <th scope="col" className="py-3 px-6">
                Employee Id
              </th>
              <th scope="col" className="py-3 px-6">
                Region
              </th>
              <th scope="col" className="py-3 px-6">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {excelData.map((data) => {
              return (
                <tr key={uuid_v4()} className="bg-white  border-b ">
                  <th
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-600 whitespace-nowrap "
                  >
                    {data?.timestamp?.replace("T", " ")?.substring(0, 19)}
                  </th>
                  <td className="py-4 px-6">{data?.participantName}</td>
                  <td className="py-4 px-6">{data?.employeeCode}</td>
                  <td className="py-4 px-6">{data?.region}</td>
                  <td className="py-4 px-6 text-green-500 font-semibold">
                    Submitted
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LiveSubmissionList;
