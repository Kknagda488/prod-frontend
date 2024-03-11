import React, { useState } from "react";
import { toast } from "react-toastify";
function Venue({ session, batchData, getOneBatch }) {
  console.log(batchData);
  const [isEditable, setIsEditable] = useState(false);
  const [inputValue, setInputValue] = useState("Example Text");

  function handleEditClick() {
    setIsEditable(true);
  }

  function handleInputChange(e) {
    setInputValue(e.target.value);
  }

  function handleInputBlur() {
    setIsEditable(false);
  }

  async function handleVenueUpdate(e) {
    e.preventDefault();
    var formData = {};
    Array.from(e.currentTarget.elements).forEach((field) => {
      if (!field.name) return;
      formData[field.name] = field.value;
    });
    let form = new URLSearchParams(Object.entries(formData)).toString();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/Teams/venueUpdate/${batchData.teamId}?access_token=${session?.user?.accessToken}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        method: "PUT",
        body: form,
      }
    );
    const data = await response.json();
    if (!response.ok) {
      toast.error(data?.error?.message);
    } else {
      toast.success("Venue updated Succesfully!");
      getOneBatch();
    }
  }

  return (
    <form onSubmit={handleVenueUpdate}>
      <div className="flex flex-col">
        <h5 className="text-xl font-semibold mt-2 mb-4 leading-none text-gray-700 ">
          Update Venue
        </h5>
        <label className="leading-loose">Venue</label>
        <textarea
          name="venue"
          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
          placeholder="Venue"
          defaultValue={batchData.venue}
          required
        ></textarea>
      </div>
      <button
        type="submit"
        //onClick={() => save()}
        className="bg-sky-500 mt-4 truncate flex justify-center items-center w-full text-white px-5 py-2 rounded-md focus:outline-none"
      >
        Update
      </button>
    </form>
  );
}

export default Venue;
