"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"

function Calendar() {
  const { currentUser } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [eventForm, setEventForm] = useState({
    visible: false,
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    type: "assignment",
  })

  // Mock events data
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "CS101 Assignment Due",
      description: "Submit Programming Basics assignment",
      date: new Date(2023, 4, 15), // May 15, 2023
      startTime: "23:59",
      endTime: "23:59",
      type: "assignment",
    },
    {
      id: 2,
      title: "CS201 Midterm Exam",
      description: "Covers chapters 1-5",
      date: new Date(2023, 4, 20), // May 20, 2023
      startTime: "14:00",
      endTime: "16:00",
      type: "exam",
    },
    {
      id: 3,
      title: "Study Group Meeting",
      description: "Prepare for CS101 final exam",
      date: new Date(2023, 4, 18), // May 18, 2023
      startTime: "15:00",
      endTime: "17:00",
      type: "meeting",
    },
  ])

  // Remove add event functionality for students
  const isStudent = currentUser?.role === "STUDENT"

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, isCurrentMonth: false })
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isToday = isSameDay(date, new Date())
      const isSelected = isSameDay(date, selectedDate)
      const dayEvents = events.filter((event) => isSameDay(event.date, date))

      days.push({
        day,
        date,
        isCurrentMonth: true,
        isToday,
        isSelected,
        events: dayEvents,
      })
    }

    return days
  }

  // Check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Handle date selection
  const handleDateSelect = (day) => {
    if (day.isCurrentMonth) {
      setSelectedDate(day.date)
    }
  }

  // Handle event form input change
  const handleEventFormChange = (e) => {
    const { name, value } = e.target
    setEventForm({
      ...eventForm,
      [name]: value,
    })
  }

  // Toggle event form visibility
  const toggleEventForm = () => {
    setEventForm({
      ...eventForm,
      visible: !eventForm.visible,
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      type: "assignment",
    })
  }

  // Add new event
  const handleAddEvent = (e) => {
    e.preventDefault()

    const newEvent = {
      id: Date.now(),
      title: eventForm.title,
      description: eventForm.description,
      date: selectedDate,
      startTime: eventForm.startTime,
      endTime: eventForm.endTime,
      type: eventForm.type,
    }

    setEvents([...events, newEvent])
    toggleEventForm()
  }

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get events for selected date
  const selectedDateEvents = events.filter((event) => isSameDay(event.date, selectedDate))

  // Get month and year for display
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  // Days of the week
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Calendar days
  const calendarDays = generateCalendarDays()

  const calendarContent = (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Academic Calendar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{monthYear}</h2>
            <div className="flex space-x-2">
              <button onClick={goToPreviousMonth} className="p-2 rounded-md hover:bg-gray-100">
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={goToNextMonth} className="p-2 rounded-md hover:bg-gray-100">
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Weekday headers */}
            {weekdays.map((day, index) => (
              <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-[80px] p-1 border border-gray-200 ${
                  day.isCurrentMonth ? "bg-white" : "bg-gray-50"
                } ${day.isToday ? "border-red-500" : ""} ${day.isSelected ? "ring-2 ring-red-500" : ""}`}
                onClick={() => day.day && handleDateSelect(day)}
              >
                {day.day && (
                  <>
                    <div
                      className={`text-right text-sm font-medium ${day.isToday ? "text-red-600" : "text-gray-700"}`}
                    >
                      {day.day}
                    </div>
                    <div className="mt-1 space-y-1">
                      {day.events &&
                        day.events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs truncate px-1 py-0.5 rounded ${
                              event.type === "assignment"
                                ? "bg-primary-100 text-primary-800"
                                : event.type === "exam"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {event.title}
                          </div>
                        ))}
                      {day.events && day.events.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">+{day.events.length - 2} more</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Date Events */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{formatDate(selectedDate)}</h2>
            {!isStudent && (
              <button
                onClick={toggleEventForm}
                className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-dark"
              >
                {eventForm.visible ? "Cancel" : "Add Event"}
              </button>
            )}
          </div>

          {!isStudent && eventForm.visible && (
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={eventForm.title}
                  onChange={handleEventFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={eventForm.description}
                  onChange={handleEventFormChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={eventForm.startTime}
                    onChange={handleEventFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={eventForm.endTime}
                    onChange={handleEventFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={eventForm.type}
                  onChange={handleEventFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="assignment">Assignment</option>
                  <option value="exam">Exam</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Add Event
              </button>
            </form>
          )}

          {!isStudent && (
            <>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-gray-800">{event.title}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            event.type === "assignment"
                              ? "bg-primary-100 text-primary-800"
                              : event.type === "exam"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {event.startTime} - {event.endTime}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No events scheduled for this day</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )

  if (!currentUser) return null
  return calendarContent
}

export default Calendar
