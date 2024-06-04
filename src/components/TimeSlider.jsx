import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
const TimeSlider = ({ tzName, tzABV, timeIndex, setTimeIndex, id }) => {
  const [value, setValue] = useState(initTimeState(timeIndex));
  const [timeBox, setTimeBox] = useState(initBoxState(timeIndex));

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  function initTimeState(timeObj) {
    const zonedTime = dayjs(timeObj).tz(tzABV);
    const timeString = zonedTime.format("hh:mmA");
    if (timeString == "Invalid Date") {
      return 0;
    }
    const timeInMinutes = convertToMinutes(timeString);
    return timeInMinutes;
  }

  function initBoxState(timeObj) {
    const zonedTime = dayjs(timeObj).tz(tzABV);
    const timeString = zonedTime.format("hh:mmA");
    if (timeString == "Invalid Date") {
      return "12:00AM";
    }
    return timeString;
  }

  useEffect(() => {
    setValue(initTimeState(timeIndex));
    setTimeBox(initBoxState(timeIndex));
  }, [timeIndex]);

  const handleChange = (event) => {
    const eventTimeValue = parseInt(event.target.value, 10);
    const eventTimeString = formatTime(eventTimeValue);
    setTimeIndex(eventTimeString);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    const displayMinutes = mins < 10 ? `0${mins}` : mins;
    return `${displayHours}:${displayMinutes}${ampm}`;
  };

  function convertToMinutes(time) {
    const [timePart, ampm] = time.split(/(AM|PM)/i);
    let [hours, minutes] = timePart.split(":").map(Number);
    if (ampm.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    } else if (ampm.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }
    return hours * 60 + minutes;
  }

  const snapTime = (time) => {
    console.log("snapper value:", time);
    console.log("snapper time", formatTime(time));
    setValue(time);
    setTimeBox(formatTime(time));
  };
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div
      style={style}
      className='m-3 flex gap-4 items-center relative p-3 border-2 rounded-md bg-white'>
      {/* <span className='text-red-400 hover:bg-red-400 duration-200 hover:text-white border p-1 rounded-full cursor-pointer aspect-square absolute top-1 right-3 bg-white'>
        X
      </span> */}
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className='w-2 text-gray-500'>
        <svg className='fill-slate-400 cursor-grab' viewBox='0 0 16 128'>
          <rect x='4' y='4' width='4' height='4'></rect>
          <rect x='4' y='12' width='4' height='4'></rect>
          <rect x='4' y='20' width='4' height='4'></rect>
          <rect x='4' y='28' width='4' height='4'></rect>
          <rect x='4' y='36' width='4' height='4'></rect>
          <rect x='4' y='44' width='4' height='4'></rect>
          <rect x='4' y='52' width='4' height='4'></rect>
          <rect x='4' y='60' width='4' height='4'></rect>
          <rect x='4' y='68' width='4' height='4'></rect>
          <rect x='4' y='76' width='4' height='4'></rect>
          <rect x='4' y='84' width='4' height='4'></rect>
          <rect x='4' y='92' width='4' height='4'></rect>
          <rect x='4' y='100' width='4' height='4'></rect>
          <rect x='4' y='108' width='4' height='4'></rect>
          <rect x='4' y='116' width='4' height='4'></rect>
          <rect x='4' y='124' width='4' height='4'></rect>
          <rect x='12' y='4' width='4' height='4'></rect>
          <rect x='12' y='12' width='4' height='4'></rect>
          <rect x='12' y='20' width='4' height='4'></rect>
          <rect x='12' y='28' width='4' height='4'></rect>
          <rect x='12' y='36' width='4' height='4'></rect>
          <rect x='12' y='44' width='4' height='4'></rect>
          <rect x='12' y='52' width='4' height='4'></rect>
          <rect x='12' y='60' width='4' height='4'></rect>
          <rect x='12' y='68' width='4' height='4'></rect>
          <rect x='12' y='76' width='4' height='4'></rect>
          <rect x='12' y='84' width='4' height='4'></rect>
          <rect x='12' y='92' width='4' height='4'></rect>
          <rect x='12' y='100' width='4' height='4'></rect>
          <rect x='12' y='108' width='4' height='4'></rect>
          <rect x='12' y='116' width='4' height='4'></rect>
          <rect x='12' y='124' width='4' height='4'></rect>
        </svg>
      </div>
      <div className='p-3 flex flex-col gap-1 flex-grow'>
        <div className='flex justify-between items-center'>
          <span>
            <h2 className='text-3xl text-slate-500 font-bold'>{tzName}</h2>
            <p className='text-sm text-slate-400'>{tzABV}</p>
          </span>
          <input
            value={timeBox}
            className='border flex-shrink shadow-sm'
            onChange={(e) => {
              setTimeBox(e.target.value);
            }}
            type='text'
            placeholder='00:00 AM/PM'
          />
        </div>
        <input
          type='range'
          min='0'
          max='1439'
          step='1'
          value={value}
          onChange={handleChange}
          className='w-full appearance-none bg-slate-200 rounded-md '
        />
        <div className='flex w-full  justify-between'>
          <span onClick={() => setValue(convertToMinutes("12:00AM"))}>
            12 AM
          </span>
          <span onClick={() => snapTime(convertToMinutes("3:00AM"))}>3 AM</span>
          <span onClick={() => snapTime(convertToMinutes("6:00AM"))}>6 AM</span>
          <span onClick={() => snapTime(convertToMinutes("9:00AM"))}>9 AM</span>
          <span onClick={() => snapTime(convertToMinutes("12:00PM"))}>
            12 PM
          </span>
          <span onClick={() => snapTime(convertToMinutes("3:00PM"))}>3 PM</span>
          <span onClick={() => snapTime(convertToMinutes("6:00PM"))}>6 PM</span>
          <span onClick={() => snapTime(convertToMinutes("9:00PM"))}>9 PM</span>
          <span onClick={() => snapTime(convertToMinutes("11:00PM"))}>
            11 PM
          </span>
        </div>
      </div>
      {/* <div style={{ textAlign: "center", marginTop: "20px" }}>
        Selected Time: {formatTime(value)}
        value:{value}
      </div> */}
    </div>
  );
};

export default TimeSlider;
