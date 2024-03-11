import React, { useEffect, useState } from "react";
import RichTextEditor from "../../RichTextEditor";
import { toast } from "react-toastify";
import Select from "react-select";
import AddTemplate from "./AddTemplate";
import { useAuth } from "../../../../context/auth";
import { BiRefresh } from "react-icons/bi";
import EditTemplate from "./EditTemplate";

const EmailLog = ({ batchId, batchData }) => {
  const [content, setContent] = useState("");
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [showEditTemplate, setShowEditTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [selectedVenue, setSelectedVenue] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [venueId, setVenueId] = useState(null);
  const [templateId, setTemplateId] = useState(null);
  const { userData } = useAuth();
  const [editPopUp, setEditPopUp] = useState(false);
  const [templateData, setTemplateData] = useState([]);
  console.log("batchId", batchId);

  const venueOptions = templateData?.map((template) => {
    return {
      data: template?.templateId,
      label: `${template?.name}`,
    };
  });

  const templateOtions = templateData?.map((template) => {
    return {
      data: template?.templateId,
      label: `${template?.name}`,
    };
  });

  const handleVenue = (option) => {
    setSelectedVenue(option);
    setEditPopUp(true);
    setTemplateId(option.data);
    setVenueId(option.data);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_URL}/api/emailtemplate/all/${
          batchData?.programId
        }?access_token=${userData?.accessToken}`
      );
      const data = await response.json();
      setTemplateData(data.templates);
      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
      console.log(data.data);
      console.log("fetchVenues", templateData);
    } catch (error) {
      console.error("There was an error!", error);
      if (error === "Token Expired") {
        // signOut();
      }
    }
  };

  const sendMail = async (e) => {
    var formData = {
      batchId: batchId,
    };
    // console.log("sendMail", e);
    // Array.from(e.currentTarget.elements).forEach((field) => {
    //     if (!field.name) return;
    //     formData[field?.name] = field?.value;
    // });
    console.log("formData======", templateId);
    let form = new URLSearchParams(Object.entries(formData)).toString();
    const response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/emailtemplate/sendmail/${templateId}?access_token=${
        userData?.accessToken
      }`,
      {
        body: form,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          // 'Content-Type': 'application/json'
        },
        method: "POST",
      }
    );
    const data = await response.json();
    // if (!response.ok) {
    //     // get error message from body or default to response statusText
    //   const error = (data && data.message) || response.statusText;
    //   toast.error(data.message)
    //   return Promise.reject(error);
    // }

    if (data.success) {
      toast.success(data?.message);
    } else {
      toast.error(data?.message);
    }
  };

  useEffect(() => {
    if (batchData?.programId) {
      fetchTemplates();
    }
  }, []);

  return (
    <>
      <div>EmailLog</div>
      <div className="flex justify-end">
        <span className="text-sm">
          <BiRefresh
            className="cursor-pointer"
            onClick={() => fetchTemplates()}
            size={20}
          />
        </span>
      </div>

      <div className="flex flex-wrap">
        <div className="w-1/3">
          <div className="relative focus-within:text-gray-600 text-gray-400">
            <Select
              options={venueOptions}
              onChange={handleVenue}
              value={selectedVenue}
              placeholder="Select Email Template"
              getOptionValue={(option) => option.data}
            />
          </div>
          <input
            type="text"
            name="clientName"
            className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
            placeholder="Client Name"
            required
          />
          <input
            type="text"
            name="clientId"
            className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
            placeholder="Client Name"
            required
          />
        </div>

        <div className="w-0.5/3 px-2">
          <button
            className="mb-3 flex w-fit px-6 py-2 text-white text-sm font-medium bg-green-500 items-center rounded-md"
            onClick={sendMail}
          >
            Send Mail
          </button>
        </div>

        <div className="w-0.5/3 px-2 mt-0">
          <button
            className="mb-3 flex w-fit px-6 py-2 text-white text-sm font-medium bg-blue-500 items-center rounded-md"
            onClick={() => setShowAddTemplate(true)}
          >
            Add Template
          </button>
        </div>

        {editPopUp && (
          <div className="w-0.5/3 px-2 mt-0">
            <button
              className="mb-3 flex w-fit px-6 py-2 text-white text-sm font-medium bg-blue-500 items-center rounded-md"
              onClick={() => setShowEditTemplate(true)}
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {showAddTemplate && (
        <AddTemplate
          showAddTemplate={showAddTemplate}
          setShowAddTemplate={setShowAddTemplate}
          content={content}
          batchId={batchId}
          setContent={setContent}
        />
      )}

      {showEditTemplate && (
        <EditTemplate
          templateData={templateData}
          templateId={templateId}
          setShowEditTemplate={setShowEditTemplate}
        />
      )}
    </>
  );
};
export default EmailLog;
