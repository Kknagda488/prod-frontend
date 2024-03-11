import React, { useEffect, useState } from "react";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";
function CreateZoomForm({ id, setSchedulePop }) {
  var minsOptions = [
    { data: "01:00:00", label: "1 Hours" },
    { data: "02:00:00", label: "2 Hours" },
    { data: "03:00:00", label: "3 Hours" },
    { data: "04:00:00", label: "4 Hours" },
    { data: "05:00:00", label: "5 Hours" },
    { data: "06:00:00", label: "6 Hours" },
    { data: "07:00:00", label: "7 Hours" },
    { data: "08:00:00", label: "8 Hours" },
    { data: "09:00:00", label: "9 Hours" },
  ];
  const { userData, sigOut } = useAuth();
  const [selectedHour, setSelectedHour] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedMins, setSelectedMins] = useState(minsOptions[0]);
  const [selectedZoom, setSelectedZoom] = useState(null);
  const [loader, setLoader] = useState("Create Zoom Meet");
  const [available, setAvailable] = useState("");
  const [showAvailable, setShowAvailable] = useState(false);
  const [buttonReplacer, setButtonReplacer] = useState(false);

  const checkZoomAvailablity = async (e) => {
    var formData = {
      batchId: id,
      type: 2,
      activeStatus: 1,
      start: selectedDate,
      zoomType: selectedZoom?.data,
      time: selectedTime,
    };

    var response;
    let form = new URLSearchParams(Object.entries(formData)).toString();
    console.log(form);
    response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/ZoomLinks/validationOfZoomLinkApi?access_token=${
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
    console.log(data, "ihu");

    if (!response.ok) {
      //console.log("er");
      toast.error(data?.error?.message);
    } else {
      // console.log(data);
      if (data.code === 404) {
        toast.error(data.msg);
      } else {
        if (data.message == "Create link Please") {
          setButtonReplacer(true);
          setShowAvailable(false);
        } else {
          setAvailable(data.message);
          setButtonReplacer(false);
          setShowAvailable(true);
        }
      }
    }
  };

  const createZoomLink = async (e) => {
    e.preventDefault();
    setLoader("Please Wait...");
    setButtonReplacer(false);
    var formData = { batchId: id };
    Array.from(e.currentTarget.elements).forEach((field) => {
      if (!field.name) return;
      formData[field.name] = field.value;
    });
    var response;
    let form = new URLSearchParams(Object.entries(formData)).toString();
    console.log(form);
    response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/ZoomLinks/createZoomLink?access_token=${userData?.accessToken}`,
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
      //console.log("er");
      toast.error(data?.error?.message);
      setLoader("Try Again");
      setButtonReplacer(true);
    } else {
      // console.log(data);
      if (data.code === 404) {
        setLoader("Try Again");
        toast.error(data.msg);
        setButtonReplacer(true);
      } else {
        // document.getElementById("adduser").reset();
        toast.success("Zoom Link Created!!");
        // router.push("/all_teams");
        setLoader("Zoom Link Created");
        setSchedulePop(false);
      }
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

      // opacity: "0 !important",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#a1a9bb",
      paddingLeft: "6px",

      fontSize: "0.870rem",
      lineHeight: "1.25rem",
    }),
  };
  const handleChangeHours = (option) => {
    setSelectedHour(option);
  };
  const handleChangeMins = (option) => {
    setSelectedMins(option);
  };
  const handleChangeZoom = (option) => {
    setSelectedZoom(option);
  };
  var hourOptions = [];

  var zoomOptions = [
    { data: 1, label: "Contact@wagonslearning.com" },
    { data: 2, label: "accounts@wagonslearning.com" },
    { data: 3, label: "pooja@wagonslearning.com" },
    { data: 4, label: "hr@wagonslearning.com" },
  ];

  for (var i = 0; i <= 3; i++) {
    hourOptions.push({ data: 1, label: `${i} Hours` });
  }
  useEffect(() => {
    if (selectedDate && selectedZoom && selectedTime !== null) {
      checkZoomAvailablity();
    }
  }, [selectedDate, selectedZoom, selectedTime]);

  return (
    <div className="flex flex-col  justify-between w-full ">
      <div className="relative  w-full ">
        <div className="relative flex flex-col items-start justify-start pt-2 bg-white  rounded-xl">
          <h4 className="w-full text-lg font-medium leading-snug">
            Schedule Zoom Meet for Id:{id}
          </h4>
          <form
            onSubmit={createZoomLink}
            className="relative w-full mt-2 space-y-4"
          >
            <div className="relative flex w-full items-center space-x-2 mt-2">
              <label className="w-24  font-medium text-gray-600 bg-white">
                Topic
              </label>
              <input
                className="w-full h-8 mt-1 px-2 text-sm text-gray-700 placeholder-gray-600 border rounded-lg outline-none"
                type="text"
                placeholder="Topic"
                name="topicName"
              />
            </div>
            <div className="relative flex w-full items-center space-x-2 mt-2">
              <label className="w-24 font-medium text-gray-600 bg-white">
                Duration
              </label>
              <div className="flex space-x-2 w-full">
                {/* <Select
                  //isMulti={true}
                  options={hourOptions}
                  onChange={handleChangeHours}
                  styles={styles}
                  defaultValue={hourOptions[0]}
                  placeholder="Hours"
                  getOptionValue={(option) => option.data}
                /> */}

                <Select
                  //isMulti={true}
                  options={minsOptions}
                  onChange={handleChangeMins}
                  styles={styles}
                  placeholder="Mins"
                  defaultValue={minsOptions[0]}
                  getOptionValue={(option) => option.data}
                />
                <input
                  type="text"
                  name="duration"
                  defaultValue={selectedMins?.data}
                  className="hidden w-full px-4 py-2 mt-2 text-base placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-black"
                  placeholder=""
                  required
                />
              </div>
            </div>
            <div className="relative flex w-full items-center space-x-2 mt-2">
              <label className="w-24 font-medium text-gray-600 bg-white">
                Start
              </label>
              <div className="flex space-x-2 w-full">
                <input
                  className="w-1/2 h-8 mt-1 px-2 text-sm text-gray-700 placeholder-gray-600 border rounded-lg outline-none"
                  type="date"
                  onChange={(e) => setSelectedDate(e.target.value)}
                  name="start"
                />
                <input
                  className="w-1/2 h-8 mt-1 px-2 text-sm text-gray-700 placeholder-gray-600 border rounded-lg outline-none"
                  type="time"
                  onChange={(e) => setSelectedTime(e.target.value)}
                  name="time"
                />

                <input
                  type="text"
                  name="type"
                  defaultValue="2"
                  className="hidden w-full px-4 py-2 mt-2 text-base placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-black"
                  placeholder=""
                  required
                />
                <input
                  type="text"
                  name="activeStatus"
                  defaultValue="1"
                  className="hidden w-full px-4 py-2 mt-2 text-base placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-black"
                  placeholder=""
                  required
                />
              </div>
            </div>
            <div className="relative flex w-full items-center space-x-2 mt-2">
              <label className="w-24 font-medium text-gray-600 bg-white">
                End
              </label>
              <div className="flex space-x-2 w-full">
                <input
                  className="w-1/2 h-8 mt-1 px-2 text-sm text-gray-700 placeholder-gray-600 border rounded-lg outline-none"
                  type="date"
                  //onChange={(e) => setSelectedDate(e.target.value)}
                  name="end"
                />
                <input
                  className="w-1/2 h-8 mt-1 px-2 text-sm text-gray-700 placeholder-gray-600 border rounded-lg outline-none"
                  type="time"
                  //onChange={(e) => setSelectedTime(e.target.value)}
                  name="endTime"
                />
              </div>
            </div>

            <div className="relative flex w-full items-center space-x-2 mt-2">
              <label className="w-24  font-medium text-gray-600 bg-white">
                Agenda
              </label>
              <input
                className="w-full h-8 mt-1 px-2 text-sm text-gray-700 placeholder-gray-600 border rounded-lg outline-none"
                type="text"
                placeholder="Agenda"
                name="agenda"
              />
            </div>
            <div className="relative flex w-full items-center  mt-2">
              <label className="w-24 font-medium text-gray-600  bg-white">
                Select Id
              </label>
              <Select
                //isMulti={true}
                options={zoomOptions}
                onChange={handleChangeZoom}
                styles={styles}
                getOptionValue={(option) => option.data}
                placeholder="Select Zoom Account"
              />
              <input
                type="text"
                name="zoomType"
                defaultValue={selectedZoom?.data}
                className="hidden w-full px-4 py-2 mt-2 text-base placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-black"
                placeholder=""
                required
              />
            </div>
            {buttonReplacer ? (
              <div className="flex justify-center  relative">
                <button className="inline-block  mt-4 px-5 py-2 text-md w-fit font-medium text-center text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-500 ease">
                  {loader}
                </button>
              </div>
            ) : (
              <div className="flex justify-center  relative">
                <button className="inline-block  mt-4 px-5 py-2 text-md w-fit font-medium text-center text-white transition duration-200 bg-gray-500 rounded-lg cursor-not-allowed ease">
                  {loader}
                </button>
              </div>
            )}
          </form>
          {showAvailable ? (
            <div className="flex flex-col w-full">
              <p className="text-md font-semibold">
                This account is scheduled for today {available}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default CreateZoomForm;

{
  /* <div className="flex flex-col  justify-between w-full ">
      <div className="relative  w-full ">
        <div className="relative flex flex-col items-start justify-start p-10 bg-white  rounded-xl">
          <h4 className="w-full text-2xl font-medium leading-snug">
            Schedule Zoom Meet for Id:{id}
          </h4>
          <form
            onSubmit={createZoomLink}
            className="relative w-full mt-4 space-y-5"
          >
            <div className="relative">
              <label className="absolute px-2 ml-2 -mt-3 font-medium text-gray-600 bg-white">
                Topic
              </label>
              <input
                name="topicName"
                type="text"
                className="block w-full px-4 py-2 mt-2 text-base placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-black"
                placeholder="Topic"
                required
              />
            </div>
            <div className="relative ">
              <label className="absolute px-2 ml-2 -mt-3 font-medium text-gray-600 bg-white">
                Agenda
              </label>
              <input
                type="text"
                name="agenda"
                className="block w-full px-4 py-2 mt-2 text-base placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-black"
                placeholder="Agenda"
                required
              />
            </div>
            <div className="relative -mt-3 flex flex-row justify-between w-full space-x-3">
              <label className="absolute px-2 ml-2 -mt-2 font-medium text-gray-600 bg-white">
                Duration
              </label> */
}
{
  /* <div className="relative mt-4 flex w-full">
                <Select
                  //isMulti={true}
                  options={hourOptions}
                  onChange={handleChangeHours}
                  styles={styles}
                  defaultValue={hourOptions[0]}
                  placeholder="Hours"
                />
              </div> */
}
//           <div className="relative mt-4  flex w-full">
//             <Select
//               //isMulti={true}
//               options={minsOptions}
//               onChange={handleChangeMins}
//               styles={styles}
//               placeholder="Mins"
//             />
//             <input
//               type="text"
//               name="duration"
//               defaultValue={selectedMins?.data}
//               className="hidden w-full px-4 py-2 mt-2 text-base placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-black"
//               placeholder=""
//               required
//             />
//             <input
//               type="text"
//               name="type"
//               defaultValue="2"
//               className="hidden w-full px-4 py-2 mt-2 text-base placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-black"
//               placeholder=""
//               required
//             />
//             <input
//               type="text"
//               name="activeStatus"
//               defaultValue="1"
//               className="hidden w-full px-4 py-2 mt-2 text-base placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-black"
//               placeholder=""
//               required
//             />
//           </div>
//         </div>
//         <div className="relative -mt-3 flex flex-row justify-between w-full space-x-3">
//           <label className="absolute px-2 ml-2 -mt-2 font-medium text-gray-600 bg-white">
//             Select Zoom Account
//           </label>

//           <div className="relative mt-4  flex w-full">
//             <Select
//               //isMulti={true}
//               options={zoomOptions}
//               onChange={handleChangeZoom}
//               styles={styles}
//               placeholder="Select Zoom Account"
//             />
//             <input
//               type="text"
//               name="zoomType"
//               defaultValue={selectedZoom?.data}
//               className="hidden w-full px-4 py-2 mt-2 text-base placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-black"
//               placeholder=""
//               required
//             />
//           </div>
//         </div>
//         <div className="relative -mt-3 flex flex-row justify-between w-full space-x-3">
//           <label className="absolute px-2 ml-2 -mt-2 font-medium text-gray-600 bg-white">
//             Start
//           </label>
//           <div className="relative mt-4 flex w-full">
//             <input
//               name="startTime"
//               type="time"
//               className="block w-full px-4 py-2 mt-2 text-base placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-black"
//               placeholder=""
//             />
//           </div>

//           <div className="relative mt-4 flex w-full">
//             <input
//               type="date"
//               name="start"
//               className="block w-full px-4 py-2 mt-2 text-base placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-black"
//               placeholder=""
//               required
//             />
//           </div>
//         </div>

//         <div className="relative">
//           <button className="inline-block w-full px-5 py-2 text-xl font-medium text-center text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-500 ease">
//             {loader}
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// </div>
