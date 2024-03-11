import React, { useState } from "react";
import { EMAIL_SUFFIX } from "../const";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";
import Select from "react-select";

function AddNomineeForm({
  programId,
  batchId,
  fetchBatchPeopleList,
  setShowAddNominee,
}) {
  const { userData } = useAuth();
  const emailSuffixArray = [
    "@wagonslearning.com",
    "@axisbank.com",
    "@idfcfirstbank.com",
  ];
  const [emailSuffix, setEmailSuffix] = useState({
    value: "@wagonslearning.com",
    label: "@wagonslearning.com",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let form = {};
      Array.from(e.currentTarget.elements).forEach((field) => {
        form[field.name] = field.value.trim();
      });

      form["email"] = form["email"] + emailSuffix.value;
      form["managerEmail"] = form["managerEmail"] + emailSuffix.value;

      let formFields = new URLSearchParams(Object.entries(form)).toString();
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/batches/addUserToBatch?access_token=${userData?.accessToken}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "POST",
          body: formFields,
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        toast.success(data.msg);
        fetchBatchPeopleList();
        setShowAddNominee(false);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to add batch!");
    }
  };

  const styles = {
    container: (base) => ({
      ...base,
      flex: 1,
    }),
    control: (base) => ({
      ...base,
      border: "1px solid rgb(209 213 219)",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid rgb(17 24 39)",
      },
    }),
    input: (base) => ({
      ...base,
      color: "rgb(75 85 99)",
      paddingLeft: "6px",
      paddingBottom: "3px",
      fontSize: "1rem",
      lineHeight: "1.25rem",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#a1a9bb",
      paddingLeft: "6px",
      fontSize: "0.870rem",
      lineHeight: "1.25rem",
    }),
  };

  const handleEmailChange = (option) => {
    setEmailSuffix(option);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-1">
        <input name="programId" type="hidden" defaultValue={programId} />
        <input name="batchId" type="hidden" defaultValue={batchId} />
        <div className="w-full px-2">
          <label className="leading-loose">First name*</label>
          <input
            name="firstName"
            className="px-4 bg-white py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
            placeholder="Provide first name"
            required
          />
        </div>
        <div className="w-full px-2">
          <label className="leading-loose">Last name</label>
          <input
            name="lastName"
            className="px-4 bg-white py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
            placeholder="Provide last name"
          />
        </div>
        <div className="w-full md:col-span-2  px-2">
          <label className="leading-loose">Email*</label>
          <div className="flex flex-wrap items-stretch w-full relative">
            <input
              type="text"
              name="email"
              className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded outline-none rounded-r-none px-3 relative"
              placeholder="Email"
              required
            />
            <div className="flex -mr-px">
              <Select
                options={emailSuffixArray.map((suffix) => ({
                  value: suffix,
                  label: suffix,
                }))}
                onChange={handleEmailChange}
                placeholder="Email Suffix"
                styles={styles}
                value={emailSuffix}
              />
            </div>
          </div>
        </div>
        <div className="w-full px-2">
          <label className="leading-loose">City*</label>
          <input
            name="city"
            className="px-4 bg-white py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
            placeholder="Provide city"
            required
          />
        </div>
        <div className="w-full px-2">
          <label className="leading-loose">Pincode*</label>
          <input
            type="number"
            name="pincode"
            className="px-4 bg-white py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
            placeholder="Provide pincode"
            required
          />
        </div>
        <div className="w-full   px-2">
          <label className="leading-loose">Manager name*</label>
          <input
            name="managerName"
            className="px-4 bg-white py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
            placeholder="Provide manager name"
            required
          />
        </div>
        <div className="w-full   px-2">
          <label className="leading-loose">Manager email*</label>
          <div className="flex flex-wrap items-stretch w-full mb-4 relative">
            <input
              type="text"
              name="managerEmail"
              className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded outline-none rounded-r-none px-3 relative"
              placeholder="Manager email"
              required
            />
            <div className="flex -mr-px">
              <span className="flex items-center leading-normal bg-grey-lighter rounded rounded-l-none border border-l-0 border-grey-light px-3 whitespace-no-wrap text-grey-dark text-sm">
                {emailSuffix && emailSuffix.value}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-40 flex items-center  justify-center space-x-4">
        <button
          type="submit"
          className="bg-sky-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
        >
          Add
        </button>
      </div>
    </form>
  );
}

export default AddNomineeForm;
