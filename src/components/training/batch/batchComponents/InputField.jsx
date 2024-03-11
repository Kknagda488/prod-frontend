import React from "react";
import { MdDeleteOutline } from "react-icons/md";
const InputField = ({ param, id, handleDeleteParams, handleChangeInput }) => {
  return (
    <div className="w-full  flex justify-center items-center px-5 my-2">
      <input
        type="text"
        placeholder={`Enter ${param?.format}`}
        // value={param?.value}
        defaultValue={param?.value}
        onChange={(e) => handleChangeInput(e.target.value, id)}
        className="w-full my-2 bg-white rounded border border-gray-300 focus:border-[#176B87]  focus:ring-1 focus:ring-[#176B87]  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
      />
      <span className="">
        <MdDeleteOutline
          size={25}
          color="red"
          onClick={() => handleDeleteParams(id)}
        />
      </span>
    </div>
  );
};

export default InputField;
