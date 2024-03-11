import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import moment from "moment";
import { useAuth } from "../../../../context/auth";

function Venue({ batchId, getOneBatch, batchData }) {
  console.log("Batch Data", batchData);

  const [isEditable, setIsEditable] = useState(false);
  const [inputValue, setInputValue] = useState("Example Text");
  const [showAddVenue, setShowAddVenue] = useState(false);
  const [venueData, setVenueData] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [venueId, setVenueId] = useState(null);
  const { userData, signOut } = useAuth();
  // function refreshPage() {
  //   window.location.reload(false);
  // }

  const handleChange = (option) => {
    setSelectedOption(option);
  };

  function handleEditClick() {
    setIsEditable(true);
  }

  function handleInputChange(e) {
    setInputValue(e.target.value);
  }

  function handleInputBlur() {
    setIsEditable(false);
  }

  const handleVenue = (option) => {
    setSelectedVenue(option);
    setVenueId(option.data);
  };

  console.log("selected Venue", selectedVenue);

  async function handleVenueUpdate(e) {
    e.preventDefault();
    var formData = {};
    Array.from(e.currentTarget.elements).forEach((field) => {
      if (!field.name) return;
      formData[field.name] = field.value;
    });
    let form = new URLSearchParams(Object.entries()).toString();
    const response = await fetch(
      `${import.meta.env.VITE_PUBLIC_URL}/api/Teams/venueUpdate/${
        batchData.teamId
      }?access_token=${userData?.accessToken}`,
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

  const fetchVenues = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/batchVenues/list?&access_token=${userData?.accessToken}`
      );
      const data = await response.json();

      setVenueData(data.data);

      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
      console.log(data.data);
      console.log("fetchVenues", venueData);
    } catch (error) {
      console.error("There was an error!", error);
      if (error === "Token Expired") {
        signOut();
      }
    }
  };

  const updateVenue = async (e) => {
    // e.preventDefault();
    // alert("Venue id"+venueId)
    // var formData = {};
    // Array.from(e.currentTarget.elements).forEach((field) => {
    //   if (!field.name) return;
    //   formData[field.name] = field.value;
    // });
    let form = new URLSearchParams(
      Object.entries({ venueId: venueId })
    ).toString();
    const response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/batches/updateVenue/${batchId}?access_token=${
        userData?.accessToken
      }`,
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
      //  fetchVenues();
    }
  };

  const venueOptions = venueData?.map((venue) => {
    return {
      data: venue?.venueId,
      label: `${venue?.state} -  ${venue?.address1}`,
    };
  });

  const handleAddAndUpdateVenue = async (e) => {
    try {
      e.preventDefault();
      var formData = {};
      Array.from(e.currentTarget.elements).forEach((field) => {
        if (!field.name) return;
        formData[field.name] = field.value;
      });
      let form = new URLSearchParams(Object.entries(formData)).toString();
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/batches/addAndUpdateVenue/${batchId}?access_token=${
          userData?.accessToken
        }`,
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
        return Promise.reject(data?.error);
      } else {
        toast.success("Venue updated Succesfully!");
        getOneBatch();
        fetchVenues();
        e.target.reset();
        setShowAddVenue(false);
      }
    } catch (error) {
      console.error("There was an error!", error);
      if (error === "Token Expired" || error === "Malformed User") {
        signOut();
      }
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  return (
    <div>
      <div className="flex justify-end">
        <>
          {moment(
            moment(batchData.batchDateTime)
              .subtract(5, "days")
              .format("YYYY-MM-DD")
          ).isSameOrAfter(moment()) ? (
            <>
              {moment(
                moment(batchData.batchDateTime)
                  .subtract(5, "days")
                  .format("YYYY-MM-DD")
              ).diff(moment(), "days")}{" "}
              days left to decide venue.
            </>
          ) : null}
        </>
      </div>
      {showAddVenue ? (
        <form onSubmit={handleAddAndUpdateVenue}>
          <div className="flex flex-col">
            <h5 className="text-xl font-semibold mt-2 mb-4 leading-none text-gray-700 ">
              Add Venue Details
            </h5>
            {/* <label className="leading-loose">Venue</label>
            <textarea
              name="venue"
              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
              placeholder="Venue"
              required
            ></textarea> */}
            <div className="flex flex-wrap">
              <div className="w-1/2 px-2">
                <label className="leading-loose">Address 1*</label>
                <input
                  type="text"
                  name="address1"
                  className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                  placeholder="Address 1"
                  required
                />
              </div>
              <div className="w-1/2 px-2">
                <label className="leading-loose">Address 2 (Optional)</label>
                <input
                  type="text"
                  name="address2"
                  className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                  placeholder="Address 2"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-1/2 px-2">
              <label className="leading-loose">Contact Name*</label>
              <input
                type="text"
                name="contactName"
                className="px-4 py-2  border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                placeholder="Contact Name"
                required
              />
            </div>
            <div className="w-1/2 px-2">
              <label className="leading-loose">Contact No.*</label>
              <input
                maxLength={11}
                type="text"
                name="contactNumber"
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                placeholder="Contact No."
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-1/2 px-2">
              <label className="leading-loose">State*</label>
              <input
                type="text"
                name="state"
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                placeholder="State"
                required
              />
            </div>
            <div className="w-1/2 px-2">
              <label className="leading-loose">Pincode*</label>
              <input
                type="number"
                name="pincode"
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                placeholder="Pincode"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full px-2">
              <label className="leading-loose">
                Google Map Link (Embedded)*
              </label>
              <input
                type="url"
                name="mapLink"
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                placeholder="Google Map Link (Embedded)"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full px-2">
              <label className="leading-loose">Google Map Link*</label>
              <input
                type="url"
                name="googleMapLink"
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                placeholder="Google Map Link"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            //onClick={() => save()}
            className="bg-sky-500 mt-4 truncate flex justify-center items-center w-full text-white px-5 py-2 rounded-md focus:outline-none"
          >
            Add
          </button>
        </form>
      ) : (
        <>
          <div>
            {/* <div className="flex">
                <Select />
              </div> */}

            <div className="flex flex-wrap">
              <div className="w-1/3">
                {/* <label className="leading-loose">Select Venue</label> */}
                <div className="relative focus-within:text-gray-600 text-gray-400">
                  <Select
                    options={venueOptions}
                    onChange={handleVenue}
                    value={selectedVenue}
                    //styles={styles}
                    placeholder="Select Venue"
                    getOptionValue={(option) => option.data}
                  />
                </div>
                <input
                  type="text"
                  name="clientName"
                  className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                  placeholder="Client Name"
                  required
                  //defaultValue={selectedClient?.label}
                />
                <input
                  type="text"
                  name="clientId"
                  className="hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                  placeholder="Client Name"
                  required
                  //defaultValue={selectedClient?.data}
                />
                <div></div>
              </div>

              <div className="w-0.5/3 px-2">
                <button
                  className="mb-3 flex w-fit px-6 py-2 text-white text-sm font-medium bg-green-500 items-center rounded-md"
                  onClick={updateVenue}
                >
                  Update
                </button>
              </div>
              <div className="w-0.5/3 px-2 mt-0">
                <button
                  className="mb-3 flex w-fit px-6 py-2 text-white text-sm font-medium
                                      bg-blue-500 items-center rounded-md"
                  onClick={() => setShowAddVenue(true)}
                >
                  Add Venue
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-bold mb-3">Venue details:</p>
          </div>
          {batchData?.batchVenue ? (
            <div className="grid grid-cols-2">
              <div>
                <div className="flex mb-2">
                  <div className="w-1/3 pr-2">Address1</div>
                  <div className="w-2/3">
                    {" "}
                    {batchData?.batchVenue?.address1}
                  </div>
                </div>
                <div className="flex mb-2">
                  <div className="w-1/3 pr-2">Address2</div>
                  <div className="w-2/3">
                    {" "}
                    {batchData?.batchVenue?.address2
                      ? batchData?.batchVenue?.address2
                      : "-"}
                  </div>
                </div>
                <div className="flex mb-2">
                  <div className="w-1/3 pr-2">Contact Name</div>
                  <div className="w-2/3">
                    {" "}
                    {batchData?.batchVenue?.contactName}
                  </div>
                </div>
                <div className="flex mb-2">
                  <div className="w-1/3 pr-2">Contact Name</div>
                  <div className="w-2/3">
                    {" "}
                    {batchData?.batchVenue?.contactNumber}
                  </div>
                </div>
                <div className="flex mb-2">
                  <div className="w-1/3 pr-2">State</div>
                  <div className="w-2/3"> {batchData?.batchVenue?.state}</div>
                </div>
                <div className="flex mb-2">
                  <div className="w-1/3 pr-2">Pincode</div>
                  <div className="w-2/3"> {batchData?.batchVenue?.pincode}</div>
                </div>

                <div className="flex mb-2">
                  <div className="w-1/3 pr-2">Google Map link</div>
                  <div className="w-2/3">
                    {" "}
                    {batchData?.batchVenue?.googleMapLink ? (
                      <a
                        href={batchData?.batchVenue?.googleMapLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {batchData?.batchVenue?.googleMapLink}
                      </a>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
              </div>
              <div>
                {batchData?.batchVenue?.mapLink ? (
                  <div className="google-map-code">
                    <iframe
                      src={batchData?.batchVenue?.mapLink}
                      width="600"
                      height="450"
                      frameBorder="0"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      aria-hidden="false"
                      tabIndex="0"
                    ></iframe>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div>Venue not assign</div>
          )}
        </>
      )}
    </div>
  );
}

export default Venue;
