import React, { useState } from "react";
// import { useExcelDownloder } from "react-xls";
import readXlsxFile from "read-excel-file";
import { useAuth } from "../../context/auth";
function BulkUploader({ setCsv, setButtonR }) {
    // const { ExcelDownloder, Type } = useExcelDownloder();
    const { userData } = useAuth()
    const [name, setName] = useState("Select a file...");

    const handleChange = (e) => {
        if (e.target.files.length === 0) {
            // No files selected
            return;
        }

        const file = e.target.files[0];
        setName(file.name);

        readXlsxFile(file)
            .then((rows) => {
                rows.shift(); // Remove header row

                let tutorials = [];

                rows.forEach((row) => {
                    let tutorial;

                    switch (userData?.client) {
                        case "axis":
                            tutorial = {
                                firstName: row[0],
                                lastName: row[1],
                                email: row[2],
                                employeeId: row[3],
                                mobileNo: row[4],
                                city: row[5],
                                managerName: row[6],
                                managerEmail: row[7],
                                function: row[8],
                                role: row[9],
                                zone: row[10],
                                product: row[11]
                                // password: "abc123",
                                // mobile: "9999999999",
                            };
                            break;
                        case "idfc":
                            tutorial = {
                                firstName: row[0],
                                lastName: row[1],
                                email: row[2],
                                city: row[3],
                                managerName: row[4],
                                managerEmail: row[5],
                                // password: "abc123",
                                // mobile: "9999999999",
                            };
                            break;
                        case "kotak":
                            tutorial = {
                                fullName: row[0],
                                employeeId: row[1],
                                referenceCode: row[2],
                                branchName: row[3],
                            };
                            break;
                        default:
                            // Handle unknown client type
                            console.error("Unknown client:", userData?.client);
                            return;
                    }

                    tutorials.push(tutorial);
                });

                console.log("tutorials", JSON.stringify(tutorials));
                setCsv(tutorials);
            })
            .catch((error) => {
                // Handle readXlsxFile errors
                console.error("Error reading file:", error);
                // You might want to add some error handling or feedback to the user here
            });
    };

    // const handleChange = (e) => {
    //     if (e.target.files.length) {
    //         // console.log(e.target.files[0], "l");
    //         setName(e.target.files[0].name);
    //         readXlsxFile(e.target.files[0]).then((rows) => {
    //             rows.shift();
    //             let tutorials = [];

    //             rows.forEach((row, i) => {
    //                 let tutorial;
    //                 if (userData?.client === "axis") {
    //                     tutorial = {
    //                         firstName: row[0],
    //                         lastName: row[1],
    //                         email: row[2],
    //                         employeeId: row[3],
    //                         mobileNo: row[4],
    //                         city: row[5],
    //                         managerName: row[6],
    //                         managerEmail: row[7],
    //                         function: row[8],
    //                         role: row[9],
    //                         zone: row[10],
    //                         product: row[11]
    //                         // password: "abc123",
    //                         // mobile: "9999999999",
    //                     };
    //                 }

    //                 if (userData?.client === "idfc") {
    //                     tutorial = {
    //                         firstName: row[0],
    //                         lastName: row[1],
    //                         email: row[2],
    //                         city: row[3],
    //                         managerName: row[4],
    //                         managerEmail: row[5],
    //                         // password: "abc123",
    //                         // mobile: "9999999999",
    //                     };
    //                 }

    //                 if (userData?.client === "kotak") {
    //                     tutorial = {
    //                         fullName: row[0],
    //                         employeeId: row[1],
    //                         referenceCode: row[2],
    //                         branchName: row[3],
    //                     };
    //                 }
    //                 tutorials.push(tutorial);
    //             });

    //             console.log("tutorials", JSON.stringify(tutorials));
    //             setCsv(tutorials);
    //         });
    //     }
    // };
    return (
        <div className="flex flex-col space-y-3">
            <span
                htmlFor="files"
                className="relative flex w-full items-center bg-gray-200 rounded-md cursor-pointer "
            >
                <input
                    id="files"
                    name="files"
                    className="absolute w-full opacity-0"
                    type="file"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={handleChange}
                />
                <span className="flex rounded-l-lg py-3 text-sm px-5 h-full bg-sky-500 text-white w-fit">
                    Choose Your File
                </span>
                <p className="text-sm font-medium  px-6 text-gray-700">{name}</p>
            </span>
        </div>
    );
}

export default BulkUploader;
















// import React, { useState } from "react";
// import readXlsxFile from "read-excel-file";

// function BulkUploader({ setCsv }) {
//     const [name, setName] = useState("Select a file...");

//     const handleChange = (e) => {
//         if (e.target.files.length) {
//             setName(e.target.files[0].name);
//             readXlsxFile(e.target.files[0]).then((rows) => {
//                 if (rows.length < 2) {
//                     console.error("Excel file must have at least one row of data.");
//                     return;
//                 }

//                 const columnNames = rows[0]; // Extract column names from the first row
//                 rows.shift(); // Remove the first row (column names)

//                 let tutorials = rows.map(row => {
//                     let tutorial = {};
//                     columnNames.forEach((columnName, index) => {
//                         tutorial[columnName] = row[index];
//                     });
//                     return tutorial;
//                 });

//                 console.log("tutorials", JSON.stringify(tutorials));
//                 setCsv(tutorials);
//             }).catch((error) => {
//                 console.error("Error reading Excel file:", error);
//             });
//         }
//     };

//     return (
//         <div className="flex flex-col space-y-3">
//             <span
//                 htmlFor="files"
//                 className="relative flex w-full items-center bg-gray-200 rounded-md cursor-pointer"
//             >
//                 <input
//                     id="files"
//                     name="files"
//                     className="absolute w-full opacity-0"
//                     type="file"
//                     accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
//                     onChange={handleChange}
//                 />
//                 <span className="flex rounded-l-lg py-3 text-sm px-5 h-full bg-sky-500 text-white w-fit">
//                     Choose Your File
//                 </span>
//                 <p className="text-sm font-medium  px-6 text-gray-700">{name}</p>
//             </span>
//         </div>
//     );
// }

// export default BulkUploader;
