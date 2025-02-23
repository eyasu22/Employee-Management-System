import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/calendar")
      .then((response) => setEvents(response.data))
      .catch((error) => console.error("Error fetching calendar data:", error));
  }, []);

  const tileClassName = ({ date }) => {
    const foundEvent = events.find(event => new Date(event.date).toDateString() === date.toDateString());
    if (foundEvent) {
      return foundEvent.event_type === "holiday" ? "holiday" : "event";
    }
    return "";
  };

  return (
    <div>
      <h2>Organization Calendar</h2>
      <Calendar tileClassName={tileClassName} />
      <style>
        {`
          .holiday {
            background-color: red !important;
            color: white;
          }
          .event {
            background-color: blue !important;
            color: white;
          }
        `}
      </style>
    </div>
  );
};

export default CalendarComponent;
