import React, { useEffect, useState } from "react";

function FeedbackInput({ i, questionManager, bucket, quiz }) {
  const [add, setAdd] = useState("");

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
  const handleChange = (e) => {
    setAdd(e.target.value);
  };
  return (
    <div>
      <label
        htmlFor={`message${i}`}
        className="block mb-2 text-md font-medium text-gray-700"
      >
        Your Response
      </label>
      <textarea
        id={`message${i}`}
        rows="4"
        className="block p-2.5 w-full text-sm text-gray-700 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Your message..."
        // onChange={() => questionManager(quiz.questions[i], index + 1)}
        onChange={handleChange}
        onBlur={() => questionManager(quiz.questions[i], add, add)}
        defaultValue={add}
      ></textarea>
    </div>
  );
}

export default FeedbackInput;
