import React, { useState, useEffect } from "react";
import axios from "axios";

// Helper function to get the number of days in a month
const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate(); // month is 1-indexed here
};

// Helper function to get the first day of the month
const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month - 1, 1).getDay(); // month is 0-indexed here
};

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-indexed month
  const [days, setDays] = useState([]);

  // Fetch tasks for the selected month and year
  const fetchTasks = async (year, month) => {
    try {
      console.log(`Fetching tasks for year: ${year}, month: ${month}`);
      const response = await axios.get(
        `http://127.0.0.1:8000/api/tasks/calendar/?year=${year}&month=${month}`
      );
      setEvents(response.data);
      console.log("Fetched Tasks:", response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setEvents([]);
    }
  };

  // Generate the days grid for the calendar
  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);

    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null); // Empty cells for days before the first day of the month
    }
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i); // Actual days of the month
    }
    setDays(calendarDays);
  };

  // Handle year and month dropdown changes
  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    setSelectedYear(newYear);
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    setSelectedMonth(newMonth);
  };

  // Handle navigation for previous and next months
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((prevYear) => prevYear - 1);
    } else {
      setSelectedMonth((prevMonth) => prevMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((prevYear) => prevYear + 1);
    } else {
      setSelectedMonth((prevMonth) => prevMonth + 1);
    }
  };

  useEffect(() => {
    fetchTasks(selectedYear, selectedMonth);
    generateCalendar();
  }, [selectedYear, selectedMonth]);

  return (
    <div className="p-4">
      <h1 className="text-center text-2xl font-bold mb-4">
        Task Calendar - {new Date(0, selectedMonth - 1).toLocaleString("default", {
          month: "long",
        })}{" "}
        {selectedYear}
      </h1>

      {/* Year and Month Dropdowns */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handlePrevMonth}
        >
          Previous
        </button>
        <select
          className="border rounded px-3 py-2"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {Array.from({ length: 11 }, (_, i) => selectedYear - 5 + i).map(
            (year) => (
              <option key={year} value={year}>
                {year}
              </option>
            )
          )}
        </select>

        <select
          className="border rounded px-3 py-2"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {new Date(0, month - 1).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleNextMonth}
        >
          Next
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {/* Day Names */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-bold">
            {day}
          </div>
        ))}

        {/* Days */}
        {days.map((day, index) => (
          <div
            key={index}
            className={`p-2 border rounded ${
              day
                ? "bg-gray-100" // Highlight valid days
                : "bg-gray-50"
            }`}
          >
            {day && (
              <div>
                <span className="block">{day}</span>
                {/* Show events for the day */}
                {events
                  .filter((event) => new Date(event.due_date).getDate() === day)
                  .map((event, idx) => (
                    <div
                      key={idx}
                      className="mt-1 text-xs bg-blue-100 text-blue-700 rounded p-1"
                    >
                      {event.title}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
