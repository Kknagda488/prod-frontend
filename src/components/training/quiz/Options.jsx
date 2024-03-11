import React, { useEffect, useState } from "react";

function Options({ options, index, i, questionManager, bucket, quiz }) {
  const [add, setAdd] = useState(0);

  useEffect(() => {
    const colorchanger = bucket.map((item) => {
      if (item.id == quiz.questions[i].id) {
        //setCss("bg-green-500 border-green-400 hover:bg-green-500");
        setAdd(item.selectedOption);
        //console.log("true");
      }
      return item;
    });
  }, [bucket]);

  // const colorchanger = bucket.map((item) => {
  //   if (item.id == quiz.questions[i].id) {
  //     //setCss("bg-green-500 border-green-400 hover:bg-green-500");

  //     var a;
  //     item.selectedOption.find((id) => {
  //       if (id === index + 1) {
  //         return (a = true);
  //       } else {
  //         return (a = false);
  //       }
  //     });

  //     return a;
  //   }
  // });
  return (
    <li className="space-y-1">
      <label
        className={`inline-flex justify-between items-center p-5 w-full rounded-lg border  cursor-pointer  ${
          add == index + 1
            ? " border-emerald-300 text-white bg-emerald-500 "
            : "bg-gray-200 hover:text-gray-800 hover:bg-gray-300 text-gray-700 "
        }  `}
        onClick={() => questionManager(quiz.questions[i], index + 1, options)}
      >
        <div className="block w-full">
          <div className="w-full text-md font-semibold">{options}</div>
          {/* <div className="w-full">Explaination</div> */}
        </div>
      </label>
    </li>
  );
}

export default Options;
