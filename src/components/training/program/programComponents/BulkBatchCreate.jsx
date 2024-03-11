import React, { useState } from "react";
import BulkUploader from "../../../parts/BulkUploader";
import { toast } from "react-toastify";
import moment from "moment";
import { useAuth } from "../../../../context/auth";
const BulkBatchCreate = ({ programId, programDetails }) => {
  // const router = useRouter();
  const [csv, setCsv] = useState([]);
  const [dataCsv, setDataCsv] = useState([]);

  const { userData, signOut } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    var formData = {};
    Array.from(e.currentTarget.elements).forEach((field) => {
      if (!field.name) return;
      formData[field.name] = field.value;
    });
    if (programId) {
      formData["programId"] = programId;
    }
    if (csv) {
      formData["file"] = JSON.stringify(csv);
    }
    console.log(csv);
    let form = new URLSearchParams(Object.entries(formData)).toString();
    const response = await fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/batches/bulkBathCreate?access_token=${userData?.accessToken}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        method: "POST",
        body: form,
      }
    );
    const data = await response.json();
    toast.success("Batch created successfully!");

    e.target.reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col mt-3 justify-center">
          <div className="flex flex-wrap">
            <div className="w-1/2 px-2">
              <label className="leading-loose">Batch Length</label>
              <input
                type="text"
                name="length"
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                placeholder="Batch Length"
                required
              />
            </div>

            {/* <div className="w-1/2 px-2">
                            <label className="leading-loose">Batch Data File</label>
                            <BulkUploader setCsv={setDataCsv} />
                        </div> */}
          </div>
          {/* <div className="w-full px-2">
                        <label className="leading-loose">Batch Data File</label>
                        <BulkUploader setCsv={setCsv} />
                    </div> */}

          <div className="w-full px-2">
            <label className="leading-loose">User File*</label>
            <BulkUploader setCsv={setCsv} />
          </div>

          <button
            className="flex w-fit mt-5 px-6 py-3 text-white text-sm font-medium
                    bg-green-500 items-center rounded-md"
            type="submit"
          >
            Create Batch
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulkBatchCreate;
