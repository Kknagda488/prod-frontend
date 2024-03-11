import React, { useRef } from "react";

import { Bar } from "react-chartjs-2";

import ChartDataLabels from "chartjs-plugin-datalabels";
import downloadjs from "downloadjs";
import html2canvas from "html2canvas";

function AverageChart({ bars, headLabel, averages }) {
  console.log(bars, headLabel, averages, "bars, headLabel, averages");
  const aref = useRef(null);
  const ddata = {
    labels: headLabel,
    datasets: bars,
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
        text: "Parameter Trending in (%)",
      },
      datalabels: {
        formatter: function (value, context) {
          if (value == 0) {
            return ``;
          } else {
            return `${value}`;
          }
          //return `${value}%`;
        },

        color: "black",
        font: {
          size: 8.9,
        },
        anchor: "end",
        align: "top",
      },
    },

    scales: {
      x: {
        ticks: {
          maxRotation: 80,
          minRotation: 80,
          font: {
            size: 13,
          },
          display: true,
          autoSkip: false,
          // callback: function (val, index) {
          //   // Hide every 2nd tick label
          //   console.log(this.getLabelForValue(val), "iuytrttyy");
          //   return index % 2 === 0 ? this.getLabelForValue(val) : "";
          // },
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
      y: {
        suggestedMin: 0,
        suggestedMax: 105,
        fontSize: 70,
      },
    },
    layout: {
      padding: 2,
    },
  };

  const imageDownloader = async (i) => {
    const pricingTableElmt = document.querySelector(`#overview`);
    if (!pricingTableElmt) return;

    const canvas = await html2canvas(pricingTableElmt);
    const dataURL = canvas.toDataURL("image/png");
    const fname = document.querySelector(`#title01`).innerHTML;

    downloadjs(dataURL, `Overview_${fname}.png`, "image/png");
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <div
        className="flex flex-col justify-center items-center"
        style={{ width: 1100 }}
      >
        <button
          className="text-md font-normal text-white px-3 w-fit py-1 rounded-md my-3 bg-sky-500"
          onClick={() => imageDownloader()}
        >
          Download Overview Chart
        </button>
        <Bar
          ref={aref}
          id="overview"
          data={ddata}
          width={40}
          height={25}
          options={options}
          plugins={[ChartDataLabels]}
        />
      </div>
    </div>
  );
}

export default AverageChart;
