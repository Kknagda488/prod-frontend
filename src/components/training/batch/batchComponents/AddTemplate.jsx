import React, { useState } from "react";
import TextEditor from "./TextEditor";
// import Loader from "../../common/Loader";
import { AiOutlinePlusCircle } from "react-icons/ai";
import InputField from "./InputField";
import { toast } from "react-toastify";
import { ImCancelCircle } from "react-icons/im";
import Loader from "./Loader";
import { useAuth } from "../../../../context/auth";
const AddTemplate = ({ setIsAdd, batchId, setShowAddTemplate }) => {
  const [name, setName] = useState("");
  const [params, setparams] = useState([]);
  const { userData } = useAuth();
  const options = ["Select Param Type", "date", "text", "number"];
  const [content, setContent] = useState("");
  const [format, setFormat] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleCancel = () => {
    setShowAddTemplate(false);
  };

  const onAddParams = () => {
    setparams([
      ...params,
      {
        format,
        value: "",
      },
    ]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "format":
        setFormat(value);
        break;

      default:
        break;
    }
  };

  const handleDeleteParams = (index) => {
    var arr = params;
    arr.splice(index, 1);
    setparams([...arr]);
  };

  const handleChangeInput = (value, index) => {
    const updatedFormat = [...params];

    updatedFormat[index].value = value;
    setparams(updatedFormat);
  };
  const handleAddTemplate = async () => {
    try {
      let obj = {
        name,
        content,
        params,
        batchId,
      };

      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/emailtemplate/add?access_token=${userData?.accessToken}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        }
      );

      const data = await response.json();

      if (data?.status == 200) {
        // handleGetAllTemplates();
        // setIsAdd(false);
        toast.success(data?.message);
        setIsLoading(false);
        setShowAddTemplate(false);
        setparams([]);
        setName("");
        setFormat("");
        setContent("");
      } else if (data?.status === 409) {
        toast.error(data?.message);
      }
    } catch (error) {
      console.error("error=============", error);
      // setIsLoading(false);
      // toast.error("An error occurred while adding the template.");
      if (error?.status === 409) {
        toast.error(error?.message);
      } else {
        toast.error("An error occurred while adding the template.");
      }
    }
  };

  // const handleAddTemplate = async () => {
  //     try {
  //         let obj = {
  //             name,
  //             content,
  //             params,
  //         };

  //         const { data } = await axios.post(
  //             `http://localhost:9000/api/v1/emailtemplate/add`,
  //             obj
  //         );

  //         if (data?.status === 200) {
  //             handleGetAllTemplates();
  //             setIsAdd(false);
  //             toast.success(data?.message);
  //             setIsLoading(false);
  //             setparams([]);
  //             setName("");
  //             setFormat("");
  //             setContent("");
  //         }
  //     } catch (error) {
  //         if (error?.response?.data?.status === 409) {
  //             toast.error(error?.response?.data?.message);
  //         } else {
  //             toast.error(error?.response?.data?.message);
  //         }
  //     }
  // };
  return (
    <div className=" grid grid-cols-4 place-items-start h-full px-10 mt-5  relative">
      <div className="col-span-2  w-full h-full px-2 my-2 shadow-md">
        <div className="w-full ">
          <label>Enter Template Name</label>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Template Name"
            className="w-full my-2 bg-white rounded border border-gray-300 focus:border-[#176B87]  focus:ring-1 focus:ring-[#176B87]  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div
          className="
        grid grid-cols-3 place-items-center space-x-4"
        >
          <h2 className="col-span-3 font-bold">Add Params</h2>
          <select
            type="text"
            placeholder="Enter format "
            name="format"
            onChange={handleChange}
            className="w-full my-2 bg-white rounded border border-gray-300 focus:border-[#176B87]  focus:ring-1 focus:ring-[#176B87]  text-base outline-none text-gray-700 py-2 mr-2  leading-8 transition-colors duration-200 ease-in-out  col-span-1"
          >
            {options.map((opt, index) => {
              return (
                <option value={opt} key={index}>
                  {opt}
                </option>
              );
            })}
          </select>
          <div className="col-span-2 w-4/5 flex justify-end items-end ">
            <button
              onClick={onAddParams}
              className="rounded-md bg-[#176B87] py-2 px-4 text-xs flex justify-center items-center w-auto h-10 "
            >
              <span className="  mx-1">
                <AiOutlinePlusCircle size={20} className="text-white" />
              </span>
              <span className="mx-1 text-white">Add Params</span>
            </button>
          </div>
        </div>
        <div className="col-span-2">
          {params?.map((param, index) => {
            return (
              <InputField
                param={param}
                id={index}
                handleChangeInput={handleChangeInput}
                handleDeleteParams={handleDeleteParams}
              />
            );
          })}
        </div>

        <div className=" shadow-xl rounded-lg py-3 mx-2 flex justify-end items-center">
          <button
            onClick={handleAddTemplate}
            className="rounded-md bg-green-600 py-2 px-4  flex justify-around items-center w-auto mr-5 "
          >
            <span className="mx-1 text-white">
              {isLoading ? <Loader /> : "Add"}{" "}
            </span>
          </button>
          <button
            className="rounded-md bg-red-600 py-2 px-4  flex justify-around items-center w-auto mr-5"
            onClick={handleCancel}
          >
            <span className="mx-1 text-white"> cancel</span>
          </button>
        </div>
      </div>

      <div className="col-span-2  w-full h-full my-2 shadow-md">
        <TextEditor setContent={setContent} />
      </div>
      <ImCancelCircle
        size={25}
        className="absolute top-0 right-0"
        onClick={() => handleCancel()}
      />
    </div>
  );
};

export default AddTemplate;
