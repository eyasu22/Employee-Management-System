import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./EmployeeCalendar.css"; // Ensure this file exists and is properly styled

const EmployeeCalendar = () => {
  const [events, setEvents] = useState([]); // All events fetched from the database
  const [selectedDate, setSelectedDate] = useState(new Date()); // Date selected by the user
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error handling

  // Fetch events from the database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/events");
        console.log("API Response:", response); // Check the response data
        
        if (response.status === 200 && Array.isArray(response.data)) {
          setEvents(response.data); // Set events if the response is valid
          console.log("Events State:", response.data); // Log the events to check the structure
        } else {
          console.error("Unexpected response format:", response.data);
          setEvents([]); // Clear events if response format is unexpected
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later."); // Set error message
      } finally {
        setLoading(false); // Set loading to false after the API call
      }
    };

    fetchEvents(); // Call the fetch function
  }, []); // Empty dependency array means this runs once when the component mounts

  // Filter events for the selected date
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.event_date); // Convert event date string to Date object
    const selectedDateString = selectedDate.toLocaleDateString(); // Convert selected date to string

    console.log(`Event Date: ${eventDate.toLocaleDateString()}, Selected Date: ${selectedDateString}`); // Log to compare the dates

    return eventDate.toLocaleDateString() === selectedDateString; // Compare only the date part
  });

  return (
    <div className="calendar-container">
      <h2>📅 Employee Work Calendar</h2>
      <Calendar
        onChange={setSelectedDate} // Update selected date on calendar change
        value={selectedDate} // Set the selected date
        minDate={new Date()} // Prevent selecting past dates
        className="custom-calendar" // Add custom styling class
      />

      <h3>📌 Scheduled Events</h3>
      {loading ? (
        <p>Loading events...</p> // Show loading message while fetching events
      ) : error ? (
        <p className="error-message">{error}</p> // Show error message if something went wrong
      ) : (
        <ul className="event-list">
          {/* Always display all events, regardless of selected date */}
          {events.length > 0 ? (
            events.map((event) => (
              <li key={event.id} className="event-item">
                <strong>{new Date(event.event_date).toLocaleDateString()}</strong> - {event.event_name} ({event.event_type})
              </li>
            ))
          ) : (
            <li>No events found.</li> // Show this if there are no events
          )}
        </ul>
      )}

      {/* Display filtered events only for the selected date */}
      {filteredEvents.length > 0 ? (
        <>
          <h4>📅 Events for {selectedDate.toLocaleDateString()}</h4>
          <ul className="event-list">
            {filteredEvents.map((event) => (
              <li key={event.id} className="event-item">
                <strong>{new Date(event.event_date).toLocaleDateString()}</strong> - {event.event_name} ({event.event_type})
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No events for this selected date.</p>
      )}
    </div>
  );
};

export default EmployeeCalendar;
