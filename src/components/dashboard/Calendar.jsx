import { MdChevronLeft } from "react-icons/md";
import { MdChevronRight } from "react-icons/md";

import { useEffect } from "react";
import moment from "moment";

import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from "date-fns";
import { Fragment, useState } from "react";
import { useAuth } from "../../context/auth";

const programs = [
  {
    id: 1,
    name: "NPCI",
    startDatetime: "2023-05-11T13:00",
    endDatetime: "2023-05-11T14:30",
  },
  {
    id: 2,
    name: "Wagons Internal",
    startDatetime: "2023-05-20T09:00",
    endDatetime: "2023-05-20T11:30",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Calendar() {
  const { userData, signOut } = useAuth();
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  const [currentDate, setCurrentDate] = useState("");
  const [programData, setProgramData] = useState([]);

  let selectedDayMeetings = programData.filter((program) =>
    isSameDay(parseISO(program.programStartDate), selectedDay)
  );

  const getProgramByMonths = () => {
    const date = currentDate ? currentDate : moment().format("YYYY-MM-DD");
    fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/programs/getProgramByMonth?date=${date}&access_token=${
        userData?.accessToken
      }`
    )
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }
        console.log("Program by Month: ", data.data);
        setProgramData(data.data);
      })
      .catch((error) => {
        setProgramData([]);
        console.error("There was an error!", error);
        if (error === "Token Expired") {
          // signOut();
        }
      });
  };

  useEffect(() => {
    getProgramByMonths();
  }, []);

  return (
    <div className="flex flex-row h-full bg-white rounded-md shadow-md px-0 py-0 ">
      <div className="pt-6">
        <div className="max-w-md px-0 mx-auto sm:px-7 md:max-w-4xl md:px-3 ">
          <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200 ">
            <div className="md:pr-0 w-[170px]">
              <div className="flex items-center">
                <h2 className="flex-auto font-semibold text-gray-900">
                  {format(firstDayCurrentMonth, "MMMM yyyy")}
                </h2>
                <button
                  type="button"
                  onClick={previousMonth}
                  className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Previous month</span>
                  <MdChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  onClick={nextMonth}
                  type="button"
                  className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Next month</span>
                  <MdChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
                <div>S</div>
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
              </div>
              <div className="grid grid-cols-7 mt-2 text-sm">
                {days.map((day, dayIdx) => (
                  <div
                    key={day.toString()}
                    className={classNames(
                      dayIdx === 0 && colStartClasses[getDay(day)],
                      "py-1.5"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={classNames(
                        isEqual(day, selectedDay) && "text-white",
                        !isEqual(day, selectedDay) &&
                          isToday(day) &&
                          "text-red-500",
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          isSameMonth(day, firstDayCurrentMonth) &&
                          "text-gray-900",
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          !isSameMonth(day, firstDayCurrentMonth) &&
                          "text-gray-400",
                        isEqual(day, selectedDay) &&
                          isToday(day) &&
                          "bg-red-500",
                        isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          "bg-gray-900",
                        !isEqual(day, selectedDay) && "hover:bg-gray-200",
                        (isEqual(day, selectedDay) || isToday(day)) &&
                          "font-semibold",
                        "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                      )}
                    >
                      <time dateTime={format(day, "yyyy-MM-dd")}>
                        {format(day, "d")}
                      </time>
                    </button>

                    <div className="w-1 h-1 mx-auto mt-1">
                      {programData.some((program) =>
                        isSameDay(parseISO(program.programStartDate), day)
                      ) && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: `${
                              programData.find((program) =>
                                isSameDay(
                                  parseISO(program.programStartDate),
                                  day
                                )
                              )?.color
                            }`,
                          }}
                        ></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <section className="mt-12 md:mt-0 md:pl-5 bg-white">
              <h2 className="font-semibold text-gray-900">
                Schedule for{" "}
                <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
                  {format(selectedDay, "MMM dd, yyy")}
                </time>
              </h2>
              <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                {selectedDayMeetings.length > 0 ? (
                  selectedDayMeetings.map((program) => (
                    <Meeting program={program} key={program.id} />
                  ))
                ) : (
                  <p>No programs.</p>
                )}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Meeting({ program }) {
  let startDateTime = parseISO(program.startDatetime);
  // let programDate =  moment({program.programDate}).format("YYYY-MM-DD");

  return (
    <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
      {/* <img
        src={meeting.imageUrl}
        alt=""
        className="flex-none w-10 h-10 rounded-full"
      /> */}
      <div className="flex-auto">
        <p className="text-gray-900 text-sm">{program.programName}</p>
        <p className="mt-0.5">
          {moment(program.programStartDate).format("DD-MM-YYYY")}

          {/* <time dateTime={program.programDate}>
            {format(endDateTime, 'h:mm a')}
          </time>{' '} */}

          {/* <time dateTime={program.endDatetime}>
            {format(endDateTime, 'h:mm a')}
          </time> */}
        </p>
      </div>
      {/* <Menu
        as="div"
        className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
      >


        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    Edit
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    Cancel
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu> */}
    </li>
  );
}

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
