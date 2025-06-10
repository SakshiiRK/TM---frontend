import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from '../../services/api';

export default function CalendarTimetable() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const day = getDayName(selectedDate);
        const res = await axios.get(`/timetable/day/${day}?role=${user.role}`);
        setSlots(res.data || []);
      } catch (error) {
        console.error('Error fetching timetable:', error);
      }
    };

    fetchTimetable();
  }, [selectedDate]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">View Timetable by Date</h2>
      <Calendar onChange={setSelectedDate} value={selectedDate} className="mb-6" />

      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">
          Slots for {getDayName(selectedDate)} ({selectedDate.toDateString()}):
        </h3>

        {slots.length > 0 ? (
          <div className="space-y-3">
            {slots.map((slot, index) => (
              <div key={index} className="border rounded p-3 bg-white shadow">
                <p><strong>Time:</strong> {slot.time}</p>
                <p><strong>Course:</strong> {slot.courseCode} - {slot.courseName}</p>
                {user.role === 'student' && (
                  <>
                    <p><strong>Faculty:</strong> {slot.facultyName}</p>
                    <p><strong>Room:</strong> {slot.roomNo}</p>
                  </>
                )}
                {(user.role === 'faculty' || user.role === 'hod') && (
                  <>
                    <p><strong>Room:</strong> {slot.roomNo}</p>
                    {user.role === 'hod' && <p><strong>Roundings Time:</strong> {slot.roundingsTime}</p>}
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No timetable entries for this day.</p>
        )}
      </div>
    </div>
  );
}
