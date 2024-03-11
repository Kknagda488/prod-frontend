import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useAuth } from "../../../../context/auth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Attendance",
    },
  },
};

function LineChart() {
  const { userData, signOut } = useAuth();
  const [chartData, setChartData] = useState([{ User: {}, Teams: {} }]);
  var listName =
    userData.userType == 1 ||
    userData.userType == 6 ||
    userData.userType == 7 ||
    userData.userType == 8
      ? "getAllUserAndTeamAdminDashboardChartApi"
      : "getAllUserAndTeamInstructorDashboardChartApi";
  //${listName}

  const getChartDetails = () => {
    fetch(
      `${import.meta.env.VITE_PUBLIC_URL}/api/Users/${listName}?access_token=${
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

        setChartData(data.data);
      })
      .catch((error) => {
        setChartData([]);
        console.error("There was an error!", error);
      });
  };
  useEffect(() => {
    getChartDetails();
  }, []);
  const labels = ["May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

  const datas = {
    labels,
    datasets: [
      {
        label: "Enrolled Nominees",
        // data: Object.values(chartData[0]?.User || []).splice(4, 12),
        data: [60, 40, 50, 80, 90, 50, 60, 70],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Present Nominees",
        //data: Object.values(chartData[0]?.Teams || []).splice(4, 12),
        data: [58, 37, 45, 70, 88, 48, 55, 65],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  return (
    <div className="flex w-full bg-white rounded-md shadow-sm px-4 items-center justify-center justify-items-center">
      <Line options={options} data={datas} />
    </div>
  );
}

export default LineChart;
