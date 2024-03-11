import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../../context/auth";
function Notifications({ batchId }) {
  const { userData, signOut } = useAuth();
  const handleMailSend = async (e) => {
    e.preventDefault();

    try {
      var formData = {};

      // return console.log(selectedNominessData);
      Array.from(e.currentTarget.elements).forEach((field) => {
        if (!field.name) return;
        formData[field.name] = field.value;
      });
      console.log(formData);
      const form = new URLSearchParams(Object.entries(formData)).toString();
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/batches/sendMail/${batchId}?access_token=${
          userData?.accessToken
        }`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "POST",
          body: form,
        }
      );

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        toast.error(data?.error?.message);
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      } else if (data.code === 404 || data.code === 409) {
        toast.error(data.msg);
      } else {
        toast.success(data.msg);
      }
      e.target.reset();
    } catch (error) {
      console.log(error);
      console.error("There was an error!", error);
      if (error === "Token Expired") {
        signOut();
      }
    }
  };

  return (
    <form onSubmit={handleMailSend}>
      <div className="flex flex-col">
        <h5 className="text-xl font-semibold mt-2 mb-4 leading-none text-gray-700 ">
          Notification
        </h5>
        {/* <label className="leading-loose">Venue</label>
        <textarea
          name="venue"
          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
          placeholder="Venue"
          required
        ></textarea> */}
        <div className="flex flex-wrap">
          <div className="w-1/3 px-2">
            <select
              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
              required
              name="type"
            >
              <option value="">Select Template</option>
              <option value="cancellation">Cancellation</option>
              <option value="reminder">Reminder</option>
              <option value="invitation">Invitation</option>
              <option value="venueChange">Venue Change</option>
            </select>
          </div>
          <div className="px-2">
            <button
              type="submit"
              className="bg-sky-500  truncate flex justify-center items-center w-full text-white px-5 py-2 rounded-md focus:outline-none"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Notifications;
