import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import ChartDataLabels from "chartjs-plugin-datalabels";
import downloadjs from "downloadjs";
import html2canvas from "html2canvas";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

//const labels = ["January", "February", "March", "April", "May", "June", "July"];

export default function PercentChart({ headLabel, averages }) {
  const labels = headLabel;

  console.log('---------------------------------------', averages, headLabel)
  const data = {
    labels,
    datasets: [
      {
        label: "Average Score",
        data: averages,
        backgroundColor: "#383191",
      },
    ],
  };
  const options = {
    responsive: true,

    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Parameter wise Average Trending",
      },
      datalabels: {
        formatter: function (value, context) {
          if (value == 0) {
            return ``;
          } else {
            return value;
          }
          //return `${value}%`;
        },

        color: "white",
        scales: {
          y: {
            suggestedMin: 0,
            suggestedMax: 10,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 80,
          minRotation: 80,
          callback: function (label, index, labels) {
            var newlabel = this.getLabelForValue(label);
            if (/\s/.test(newlabel)) {
              var words = newlabel;
              var count = 0;

              var split = words.split(" ");
              for (var i = 0; i < split.length; i++) {
                if (split[i] != "") {
                  count += 1;
                }
              }
              var label1 = split.slice(0, count / 2 + 2);

              var sentence = label1.join(" ");
              var senCount = sentence.length;

              var stringOne = `.{1,${senCount}}`;
              var regex = new RegExp(stringOne, "g");
              console.log(regex, "ooo");
              return newlabel.match(regex);
              //return newlabel.match(/.{1,31}/g);
            } else {
              return newlabel;
            }
          },
        },
      },
    },
  };
  const imageDownloader = async (i) => {
    const pricingTableElmt = document.querySelector(`#average`);
    if (!pricingTableElmt) return;

    const canvas = await html2canvas(pricingTableElmt);
    const dataURL = canvas.toDataURL("image/png");
    const fname = document.querySelector(`#title01`).innerHTML;

    downloadjs(dataURL, `Percentage_${fname}.png`, "image/png");
    // downloadjs(dataURL, "download.png", "image/png");
  };
  return (
    <div
      className="flex flex-col justify-center items-center"
      style={{ width: 1100 }}
    >
      <button
        className="text-md font-normal text-white px-3 w-fit py-1 rounded-md my-3 bg-sky-500"
        onClick={() => imageDownloader()}
      >
        Download Average Chart
      </button>
      <Bar
        id="average"
        width={40}
        height={25}
        options={options}
        data={data}
        plugins={[ChartDataLabels]}
      />
    </div>
  );
}
