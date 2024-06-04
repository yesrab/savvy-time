import { useEffect, useState } from "react";
import TimeSlider from "./components/TimeSlider";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import timezones from "./libs/zonesList";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
import { DndContext, closestCorners } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
function App() {
  // let timezones = Intl.supportedValuesOf("timeZone");
  const [currentTime, setCurrentTime] = useState(dayjs().tz("UTC"));
  const [zones, setZones] = useState([
    {
      id: 588,
      value: "UTC",
      label: "UTC",
    },
  ]);

  function setGlobalTime(timeString) {
    let inputTime = timeString.replace(/\s/g, "");
    const timeObj = dayjs(inputTime, "hh:mmA").tz("UTC");
    setCurrentTime(timeObj);
  }

  const getZonePos = (id) => {
    return zones.findIndex((zone) => zone.id === id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over.id) {
      return;
    }
    setZones((zones) => {
      const orignalPos = getZonePos(active.id);
      const newpos = getZonePos(over.id);
      return arrayMove(zones, orignalPos, newpos);
    });
  };
  return (
    <div className='p-2'>
      <h1 className='text-5xl'>Time Slider</h1>
      <div className='flex w-full justify-between my-2'>
        <Select
          isMulti={true}
          value={zones}
          onChange={(o) => {
            setZones(o);
          }}
          isClearable={true}
          options={timezones}
          className='min-w-[30%]'
        />
        <h2 className='text-2xl'>Current time : {dayjs().format("hh:mm A")}</h2>
        {/* <h2>UTC time sync : {currentTime.format("hh:mm A")}</h2> */}
      </div>
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <div className='min-h-dvh'>
          <SortableContext strategy={verticalListSortingStrategy} items={zones}>
            {zones?.map((item) => {
              return (
                <TimeSlider
                  timeIndex={currentTime}
                  setTimeIndex={setGlobalTime}
                  tzName={item.label}
                  tzABV={item.value}
                  key={item.id}
                  id={item.id}
                />
              );
            })}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
}

export default App;

