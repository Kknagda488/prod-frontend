import { data } from "autoprefixer";
import React, { useEffect, useState } from "react";

function FeedbackOptions({
  index,
  i,
  questionManager,
  bucket,
  quiz,
  quizes,
  description,
}) {
  const [add, setAdd] = useState(null);

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
  return (
    <li className="space-y-1 mt-2 flex flex-col items-center justify-center h-16">
      <label
        className="-mx-8 flex items-center justify-center flex-col"
        onClick={() =>
          questionManager(
            quiz.questions[i],
            // 5 - index,
            description.data.length <= 5
              ? description.data.length - index
              : description.data.length - 1 - index,
            description.data.length <= 5
              ? description.data[description.data.length - (index + 1)]
              : description.data[description.data.length - 1 - index]
            //quizes.answers[5 - index]
          )
        }
      >
        <div
          className={`flex justify-center items-center py-2 w-12 rounded-full border  cursor-pointer  ${
            add ==
            `${
              description.data.length <= 5
                ? description.data.length - index
                : description.data.length - 1 - index
            }`
              ? " border-emerald-300 text-white bg-emerald-500 "
              : "bg-gray-200 hover:text-gray-800 hover:bg-gray-300 text-gray-700 "
          }  `}
        >
          <div className="w-full text-center text-lg font-semibold">
            {description.data.length <= 5 ? (
              <>{description.data.length - index}</>
            ) : (
              <>{description.data.length - 1 - index}</>
            )}
          </div>

          {/* <div className="w-full">Explaination</div> */}
        </div>
        <p className=" text-md font-medium  text-blue-500 ">
          {/* {quizes.answers[5 - index]} */}
          {description.data.length <= 5 ? (
            <>{description.data[description.data.length - (index + 1)]}</>
          ) : (
            <>{description.data[description.data.length - 1 - index]}</>
          )}
        </p>
      </label>
    </li>
  );
}

export default FeedbackOptions;

{
  /* <>
                  <ul className="grid gap-3 grid-cols-5 w-full  ">
                    {Array(5)
                      .fill()
                      .map((_, index) => {
                        return (
                          <li>
                            <input
                              id={`button${i}`}
                              type="radio"
                              name={`button${index}`}
                              className="hidden peer"
                              value={`${index + 1}`}
                              required
                            />
                            <label
                              htmlFor={`button${i}`}
                              className="flex justify-center py-2.5 items-center  w-full text-gray-500 rounded-full bg-white  border border-gray-200 cursor-pointer  peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 "
                            >
                              <div className="block ">
                                <div className="w-full text-lg font-semibold">
                                  {index + 1}
                                </div>
                              </div>
                            </label>
                          </li>
                        );
                      })}
                  </ul>
                  <div className="flex  w-full justify-between">
                    <p className="mb-5 text-lg font-medium text-blue-500 ">
                      Poor
                    </p>
                    <p className="mb-5 text-lg font-medium text-blue-500 ">
                      Average
                    </p>
                    <p className="mb-5 text-lg font-medium text-blue-500 ">
                      Great
                    </p>
                  </div>
                </> */
}
