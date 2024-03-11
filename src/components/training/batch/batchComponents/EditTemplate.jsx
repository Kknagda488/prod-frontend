import React, { useState, useEffect } from "react";
import TextEditor from "./TextEditor";
import { AiOutlinePlusCircle } from "react-icons/ai";
import InputField from "./InputField";
import { toast } from "react-toastify";
import { ImCancelCircle } from "react-icons/im";
import Loader from "./Loader";
import { useAuth } from "../../../../context/auth";

const EditTemplate = ({ templateId, setShowEditTemplate }) => {
  const [name, setName] = useState("");
  const [params, setParams] = useState([]);
  const { userData } = useAuth();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [format, setFormat] = useState("");
  console.log("params", templateId);
  useEffect(() => {
    fetchTemplateById(templateId);
  }, []);

  const fetchTemplateById = async (id) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/emailtemplate/getTemplateById/${id}?access_token=${
          userData?.accessToken
        }`
      );
      const data = await response.json();

      if (response.ok) {
        // const { name, content, params } = data;
        setName(data.data?.name);
        setContent(data.data?.content);
        setParams(JSON.parse(data.data?.params));
      } else {
        toast.error("Failed to fetch template details");
      }
    } catch (error) {
      console.error("Error fetching template:", error);
      toast.error("Failed to fetch template details");
    }
  };

  const handleUpdateTemplate = async () => {
    try {
      setIsLoading(true);
      const updatedTemplate = {
        name,
        content,
        params,
      };

      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/emailtemplate/update/${templateId}?access_token=${
          userData?.accessToken
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTemplate),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data?.message);
        setShowEditTemplate(false);
      } else {
        toast.error(data?.message || "Failed to update template");
      }
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error("Failed to update template");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowEditTemplate(false);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setFormat(value);
  };

  const handleChangeParamInput = (value, index) => {
    const updatedParams = [...params];
    updatedParams[index].value = value;
    setParams(updatedParams);
  };

  const handleDeleteParam = (index) => {
    const updatedParams = [...params];
    updatedParams.splice(index, 1);
    setParams(updatedParams);
  };

  const handleAddParam = () => {
    setParams([
      ...params,
      {
        format,
        value: "",
      },
    ]);
  };

  return (
    <div className="grid grid-cols-4 place-items-start h-full px-10 mt-5 relative">
      <div className="col-span-2 w-full h-full px-2 my-2 shadow-md">
        <div className="w-full">
          <label>Enter Template Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Template Name"
            className="w-full my-2 bg-white rounded border border-gray-300 focus:border-[#176B87] focus:ring-1 focus:ring-[#176B87] text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>

        <div className="grid grid-cols-3 place-items-center space-x-4">
          <h2 className="col-span-3 font-bold">Add Params</h2>
          <select
            type="text"
            placeholder="Enter format"
            name="format"
            onChange={handleChange}
            className="w-full my-2 bg-white rounded border border-gray-300 focus:border-[#176B87] focus:ring-1 focus:ring-[#176B87] text-base outline-none text-gray-700 py-2 mr-2 leading-8 transition-colors duration-200 ease-in-out col-span-1"
          >
            <option value="Select Param Type">Select Param Type</option>
            <option value="date">Date</option>
            <option value="text">Text</option>
            <option value="number">Number</option>
          </select>
          <div className="col-span-2 w-4/5 flex justify-end items-end">
            <button
              onClick={handleAddParam}
              className="rounded-md bg-[#176B87] py-2 px-4 text-xs flex justify-center items-center w-auto h-10"
            >
              <AiOutlinePlusCircle size={20} className="text-white" />
              <span className="mx-1 text-white">Add Params</span>
            </button>
          </div>
        </div>

        <div className="col-span-2">
          {params.map((param, index) => (
            <InputField
              key={index}
              param={param}
              id={index}
              handleChangeInput={handleChangeParamInput}
              handleDeleteParams={handleDeleteParam}
            />
          ))}
        </div>

        <div className="shadow-xl rounded-lg py-3 mx-2 flex justify-end items-center">
          <button
            onClick={handleUpdateTemplate}
            className="rounded-md bg-green-600 py-2 px-4 flex justify-around items-center w-auto mr-5"
          >
            <span className="mx-1 text-white">
              {isLoading ? <Loader /> : "Update"}
            </span>
          </button>
          <button
            onClick={handleCancel}
            className="rounded-md bg-red-600 py-2 px-4 flex justify-around items-center w-auto mr-5"
          >
            <span className="mx-1 text-white">Cancel</span>
          </button>
        </div>
      </div>

      <div className="col-span-2 w-full h-full my-2 shadow-md">
        <TextEditor value={content} setContent={setContent} />
      </div>

      <ImCancelCircle
        size={25}
        className="absolute top-0 right-0"
        onClick={handleCancel}
      />
    </div>
  );
};

export default EditTemplate;
