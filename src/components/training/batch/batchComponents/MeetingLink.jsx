import React, { useState } from 'react'
// import copy from "copy-to-clipboard";

function MeetingLink({ batchData }) {

    return (
        <div>
            <Link link={batchData?.hostMeetingLink} title={"Meeting Host Link"} />
            <Link link={batchData?.meetingLink} title={"Meeting Participant Link"} />
        </div>
    )
}

const Link = ({ link, title }) => {
    const [isCopied, setIsCopied] = useState(false);

    // This is the function we wrote earlier

    // onClick handler function for the copy button
    const handleCopyClick = (text) => {
        // Asynchronously call copyTextToClipboard
        //   copy(text);
        setIsCopied(true);
    };
    return (
        <div className="px-2 py-3 mx-2 border mb-3  border-2 rounded-md">
            <h2 className=" font-semibold text-gray-400">
                {title}
            </h2>
            <div className="block md:flex justify-between">
                <div className="flex items-center flex-wrap">
                    <div style={{ width: "100%" }}>
                        <a
                            href={link}
                            style={{
                                display: "inline-block",
                                maxWidth: "1000px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {link}
                        </a>
                    </div>
                </div>
                <button
                    onClick={() => handleCopyClick(link)}
                    className="border  bg-green-500 border-green-400 hover:bg-green-500 text-white rounded-md px-2  py-1 transition duration-75 ease select-none  focus:outline-none focus:shadow-outline"
                >
                    {isCopied ? "copied" : "copy"}
                </button>
            </div>
        </div>
    )
}

export default MeetingLink
