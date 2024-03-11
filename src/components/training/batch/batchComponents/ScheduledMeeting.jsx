import React, { useState } from "react";
import { MdContentCopy } from "react-icons/md";

function ScheduledMeeting({ zoom, zoomList, zoomBucket, zoomManager }) {
  const [copied, setCopied] = useState(false);
  function copy(link) {
    const el = document.createElement("input");
    el.value = link;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
  }

  function timeslot(time) {
    try {
      return JSON.parse(time);
    } catch (err) {
      return [];
    }
  }

  return (
    <li className="space-y-2">
      <div className="flex flex-col items-center px-2 py-1   rounded  ">
        <div className="flex w-full justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-lg font-medium w-[25rem]">
              {zoom.topicName}

              <button
                onClick={() => {
                  zoomManager({
                    zoomId: zoom.zoomLinksId,
                    name: zoom.topicName,
                    start: `${zoom?.start
                      ?.replace(/T/, " ")
                      .replace(/\..+/, "")
                      .substring(0, 10)} ${zoom?.startTimeZoom}`,
                    end: `${zoom?.end
                      ?.replace(/T/, " ")
                      .replace(/\..+/, "")
                      .substring(0, 10)} ${zoom?.endTimeZoom}`,
                    meetId: zoom.meetingID,
                    passcode: zoom.zoomLinkpassword,
                    url: zoom.zoomlink,
                    time_slots:
                      zoom.time_slots == null ? [] : timeslot(zoom.time_slots),
                  });
                }}
                id={`button${zoom.zoomLinksId}`}
                className={`text-sm ${zoomList.includes(zoom.zoomLinksId)
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-yellow-400 hover:bg-yellow-500"
                  } ml-2  items-center px-2 text-white rounded-md py-1`}
              >
                {zoomList.includes(zoom.zoomLinksId)
                  ? "Remove"
                  : "Add to Meet List"}
              </button>
            </h1>
            <span className="flex flex-col w-full items-start">
              <h1 className="text-md  text-gray-600 ">{zoom?.start}</h1>
              <h1 className="text-md text-gray-600 ">
                zoom Id: {zoom?.zoomId}
              </h1>
              <h1 className="text-md text-gray-600 ">Type: {zoom?.zoomType}</h1>

              <h1 className="text-md text-gray-600 max-w-md">
                {/* {!copied ? null : `Link: ${url}`} */}
              </h1>
            </span>
          </div>
          <button
            onClick={() => copy(zoom?.zoomlink)}
            className="flex w-fit mt-2 px-6 py-2 text-white font-medium
          bg-green-500 items-center rounded-md"
          >
            <MdContentCopy className="mr-1 mt-0.5" />
            {!copied ? "Copy Url" : "Copied!"}
          </button>
        </div>
        <span className="flex flex-col w-full items-start">
          <h1 className="text-md  text-gray-600 ">
            Scheduled Date:{" "}
            {zoom?.start
              ?.replace(/T/, " ")
              .replace(/\..+/, "")
              .substring(0, 10)}
            -{zoom?.end?.replace(/T/, " ").replace(/\..+/, "").substring(0, 10)}
          </h1>
          <h1 className="text-md  text-gray-600 ">
            Scheduled Time: {zoom?.startTimeZoom} - {zoom?.endTimeZoom}
          </h1>
          <h1 className="text-md text-gray-600 ">
            Meeting Id: {zoom?.zoomLinksId}
          </h1>

          <h1 className="text-md text-gray-600 ">
            {!copied ? null : `Link: ${zoom?.zoomlink}`}
          </h1>
        </span>
      </div>
    </li>
  );
}

export default ScheduledMeeting;
