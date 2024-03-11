import moment from "moment";
import { Link } from "react-router-dom";
import React from "react";
import { useAuth } from "../../../../context/auth";

const ProgramDetails = ({ programDetails }) => {
  const { userData } = useAuth();
  console.log("Program Details:" + userData.userType);
  return (
    //     <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
    //         <table className="w-full text-sm text-left text-gray-500 ">
    //   <thead  className="text-md m-4 bg-sky-600 text-white">
    //     <tr>
    //       <th className="px-4 py-2 border">Sr. No.</th>
    //       <th className="px-4 py-2 border">Client Name</th>
    //       <th className="px-4 py-2 border">Program Name</th>
    //       <th className="px-4 py-2 border">Program Date</th>
    //       <th className="px-4 py-2 border">Trainer Assigned</th>
    //       <th className="px-4 py-2 border">Seat Count</th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     <tr>
    //       <td className="px-4 py-2 border">1</td>
    //       <td className="px-4 py-2 border">IDFC</td>
    //       <td className="px-4 py-2 border">Program Name</td>
    //       <td className="px-4 py-2 border">22 Jan 2023</td>
    //       <td className="px-4 py-2 border">John Doe</td>
    //       <td className="px-4 py-2 border">25</td>
    //     </tr>
    //     <tr>
    //     <td className="px-4 py-2 border">2</td>
    //       <td className="px-4 py-2 border">IDFC</td>
    //       <td className="px-4 py-2 border">Program Name</td>
    //       <td className="px-4 py-2 border">22 Jan 2023</td>
    //       <td className="px-4 py-2 border">John Doe</td>
    //       <td className="px-4 py-2 border">25</td>
    //     </tr>
    //     <tr>
    //     <td className="px-4 py-2 border">3</td>
    //       <td className="px-4 py-2 border">IDFC</td>
    //       <td className="px-4 py-2 border">Program Name</td>
    //       <td className="px-4 py-2 border">22 Jan 2023</td>
    //       <td className="px-4 py-2 border">John Doe</td>
    //       <td className="px-4 py-2 border">25</td>
    //     </tr>
    //   </tbody>
    // </table>

    //     </div>

    <div>
      <div className="flex justify-end">
        {userData.userType === 1 && (
          <Link
            to={{
              pathname: `/program/UpdateProgram/${programDetails.id}`,
            }}
          >
            {/* <Link href={`program/UpdateProgram/${programDetails.id}`}> */}

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Edit
            </button>
          </Link>
        )}
      </div>
      <div
        style={{ color: "#4b5563" }}
        className="flex flex-col text-base font-medium"
      >
        {/* <a
          target="_blank"
          href={`http://localhost:3000/nominee/nominee-form?programId=${programDetails.teamId}`}
        >{`http://localhost:3000/nominee/nominee-form?programId=${programDetails.teamId}`}</a> */}
        <div className="flex mb-2">
          <div className="w-1/3 pr-2 ">Client Name</div>
          <div className="w-2/3 "> {programDetails.clientName}</div>
        </div>
        <div className="flex mb-2">
          <div className="w-1/3 pr-2">Program Name</div>
          <div className="w-2/3"> {programDetails.programName}</div>
        </div>
        <div className="flex mb-2">
          <div className="w-1/3 pr-2">Program Start Date/Time</div>
          <div className="w-2/3">
            {moment(
              `${moment(programDetails.programStartDate).format(
                "YYYY-MM-DD"
              )} ${programDetails.programStartTime}`
            ).format("Do MMMM YYYY hh:mm a")}
          </div>
        </div>
        <div className="flex mb-2">
          <div className="w-1/3 pr-2">Program End Date/Time</div>
          <div className="w-2/3">
            {moment(
              `${moment(programDetails.programEndDate).format("YYYY-MM-DD")} ${
                programDetails.programEndTime
              }`
            ).format("Do MMMM YYYY hh:mm a")}
          </div>
        </div>
        <div className="flex mb-2">
          <div className="w-1/3 pr-2">Program Type</div>
          {programDetails.programType == 1 ? "Open" : null}
          {programDetails.programType == 0 ? "Close" : null}
        </div>
        {programDetails.programType == "1" ? (
          <div className="flex mb-2">
            <div className="w-1/3 pr-2">Nomination End Date/Time</div>
            <div className="w-2/3">
              {/* {moment(programDetails.programDateTime).format(
              "Do MMMM YYYY hh:mm a"
            )} */}
              {moment(
                `${moment(programDetails.nominationDate).format(
                  "YYYY-MM-DD"
                )} ${programDetails.nominationTime}`
              ).format("Do MMMM YYYY hh:mm a")}
            </div>
          </div>
        ) : null}
        <div className="flex mb-2">
          <div className="w-1/3 pr-2">Training Mode</div>
          {programDetails.trainingType === 1 ? "Class room training" : null}
          {programDetails.trainingType === 2 ? "Virtual training" : null}
        </div>
        {programDetails.trainingType === 1 ? (
          <div className="flex mb-2">
            <div className="w-1/3 pr-2">Location</div>
            {programDetails.location}
          </div>
        ) : null}

        {/* {programDetails.trainingType === 2 ? (
          <div className="flex mb-2">
            <div className="w-1/3 pr-2">Classroom session link</div>
            {programDetails.meetingLink}
          </div>
        ) : null} */}

        {/* <div className="flex mb-2">
          <div className="w-1/3 pr-2">Interval Days</div>
          <div className="w-2/3">{programDetails.intervalDays}</div>
        </div> */}
      </div>

      {userData.userType === 1 ? (
        <>
          {programDetails.programType == "1" ? (
            <div style={{ color: "#4b5563" }} className="flex">
              <div className="w-1/3 pr-2 font-medium">Registration Link</div>
              <div className="w-1/3">
                <a
                  // href={`/nominee-form/${selectedProgram.id}`}
                  href={`/nominee-form/${programDetails.id}?client=${userData?.client}&key=${userData?.tenantKey}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {`${import.meta.env.VITE_PUBLIC_URL}/nominee-form/${
                    programDetails.id
                  }`}
                </a>
                {/* <a
                  href={`/nominee-form/${programDetails.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {`${import.meta.env.VITE_PUBLIC_URL}/nominee-form/${programDetails.id}`}
                </a> */}
              </div>
              {/* <div className="flex mb-2">
            <div className="w-1/3 pr-2">Venue</div>
            <div className="w-2/3">
            {programDetails.venue ? programDetails.venue : "-"}
            </div>
          </div> */}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default ProgramDetails;
