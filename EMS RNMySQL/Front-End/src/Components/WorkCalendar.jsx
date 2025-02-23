import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./WorkCalendar.css"; // Ensure this file exists and is styled properly

const WorkCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("workday");
  const [userRole, setUserRole] = useState("admin"); // Ensure this is 'admin' for testing
  const [editingEvent, setEditingEvent] = useState(null); // For editing an event

  // Fetch existing events from backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/calendar")
      .then((response) => {
        setEvents(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);
  

  // Add a new event
  const handleAddEvent = () => {
    if (!selectedDate || !eventName) {
      alert("Please provide a valid date and event name.");
      return;
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];
    const newEvent = {
      event_name: eventName,
      event_date: formattedDate,
      event_type: eventType,
      created_by: 2,  // Test with a valid user ID
    };
    


    axios
      .post("http://localhost:3000/calendar", newEvent)
      .then((response) => {
        setEvents((prevEvents) => [...prevEvents, response.data]);
        alert("Event added successfully!");
        resetForm();
      })
      .catch((error) => {
        console.error("Error adding event:", error);
      });
  };

  // Edit an event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventName(event.event_name);
    setEventType(event.event_type);
    setSelectedDate(new Date(event.event_date)); // Pre-fill the selected date
  };

  // Save edited event
  const handleSaveEvent = async () => {
    if (!editingEvent) return;

    const updatedEvent = {
      event_name: eventName,
      event_date: selectedDate.toISOString().split("T")[0],
      event_type: eventType,
      created_by: 2,
    };

    try {
      await axios.put(`http://localhost:3000/calendar/${editingEvent.id}`, updatedEvent);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === editingEvent.id ? { ...event, ...updatedEvent } : event
        )
      );
      alert("Event updated successfully!");
      resetForm();
    } catch (error) {
      console.error("Error updating event:", error.response ? error.response.data : error.message);
    }
  };

  // Delete an event
  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      axios
        .delete(`http://localhost:3000/calendar/${eventId}`)
        .then(() => {
          setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
          alert("Event deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting event:", error.response ? error.response.data : error.message);
        });
    }
  };

  // Reset form after adding or editing event
  const resetForm = () => {
    setEditingEvent(null);
    setEventName("");
    setEventType("workday");
    setSelectedDate(null);
  };

  return (
    <div className="calendar-container">
      <h2>📅 Work Calendar</h2>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        minDate={new Date()}
        className="custom-calendar"
      />
      
      <div className="event-form">
        <input
          type="text"
          placeholder="Enter Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="input-field"
        />
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="select-field"
        >
          <option value="workday">Workday</option>
          <option value="holiday">Holiday</option>
          <option value="event">Event</option>
        </select>
        
        {userRole === "admin" && (
          <Button className="add-button" onClick={editingEvent ? handleSaveEvent : handleAddEvent}>
            {editingEvent ? "Save Changes" : "➕ Add Event"}
          </Button>
        )}
      </div>

      <h3>📌 Scheduled Events</h3>
      <ul className="event-list">
        {Array.isArray(events) && events.length > 0 ? (
          events.map((event) => (
            <li key={event.id} className="event-item">
              <strong>{event.event_date}</strong> - {event.event_name} ({event.event_type})
              {userRole === "admin" && (
                <div className="event-actions">
                  <button onClick={() => handleEditEvent(event)} className="action-button">Edit</button>
                  <button onClick={() => handleDeleteEvent(event.id)} className="action-button">Delete</button>
                </div>
              )}
            </li>
          ))
        ) : (
          <li>No events available</li>
        )}
      </ul>
    </div>
  );
};

export default WorkCalendar;
