import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

const TextEditor = ({ setContent, value }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      ["bold", "italic", "underline"],
      ["link"],
      [{ align: [] }],
      [{ color: [] }],
      [{ background: [] }],
      [{ font: [] }],
      [{ size: ["small", "medium", "large", "huge"] }], // Add font size options
    ],
  };

  const formats = [
    "header",
    "font",
    "size", // Include font size
    "list",
    "bold",
    "italic",
    "underline",
    "link",
    "align",
    "color",
    "background",
  ];

  return (
    <div className="w-full  mx-auto rounded-lg">
      <ReactQuill
        value={value}
        onChange={setContent}
        modules={modules}
        formats={formats}
        className="h-96"
      />
    </div>
  );
};

export default TextEditor;
