import React from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

const RichTextEditor = ({ value, onChange }) => {
  return <ReactQuill value={value} onChange={onChange} />;
};

export default RichTextEditor;
