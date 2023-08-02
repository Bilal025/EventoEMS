// import React from 'react'
import axios from "axios";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths } from "date-fns";
import { useEffect, useState } from "react";
import { BsCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";


export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events from the server
    axios.get("/events").then((response) => {
      setEvents(response.data);
    }).catch((error) => {
      console.error("Error fetching events:", error);
    });
  }, []);

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });


  return (
    <div className="p-4 md:mx-16">
      <div className="border rounded p-2">
        <div className="flex items-center  mb-4 justify-center gap-6 ">
          <button className="primary" onClick={() => setCurrentMonth((prevMonth) => addMonths(prevMonth, -1))}>
            <BsCaretLeftFill className="w-auto h-5" />
          </button>
          <span className="text-xl font-semibold">{format(currentMonth, "MMMM yyyy")}</span>
          <button className="primary" onClick={() => setCurrentMonth((prevMonth) => addMonths(prevMonth, 1))}>
            <BsFillCaretRightFill className="w-auto h-5"/>
          </button>
        </div>
        <div className="grid grid-cols-7 gap- text-center  ">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 font-semibold bg-white ring-4 ring-background">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {daysInMonth.map((date) => (
            <div key={date.toISOString()} className="p-2 relative top-0 pb-10 sm:pb-24 ring-4 bg-white ring-background flex flex-col items-start justify-start">
              <div className="font-bold">{format(date, "dd")}</div>
              <div className="absolute top-8">
                {events
                  .filter((event) => format(new Date(event.eventDate), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
                  .map((event) => (
                    <div key={event._id} className="mt-2 flex">
                      <span className="text-white bg-primary rounded p-2 font-bold">{event.title.toUpperCase()}</span>
                      
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
