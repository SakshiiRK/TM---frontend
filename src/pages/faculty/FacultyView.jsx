import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import API from '../../services/api';
import Calendar from 'react-calendar';
import '../../styles/calendar.css';

const FacultyView = () => {
  const [date, setDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const dept = user.department || '';
  const facultyId = user.faculty_id || '';

  const getDayName = (date) => date.toLocaleDateString('en-US', { weekday: 'long' });

  const fetchTimetable = async (selectedDate) => {
    setLoading(true);
    setError('');
    setSlots([]);

    const day = getDayName(selectedDate);
    const formattedDate = selectedDate.toISOString().split('T')[0];

    try {
      const res = await API.get(`/timetable/day/${day}`, {
        params: {
          role: 'faculty',
          date: formattedDate,
          department: dept,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      let timetableData = [];

      if (Array.isArray(res.data)) {
        const filtered = res.data.filter(item => item.facultyId === facultyId);
        timetableData = filtered.flatMap(item => item.timetableSlots || []);
      } else if (res.data.timetableSlots) {
        if (res.data.facultyId === facultyId) {
          timetableData = res.data.timetableSlots;
        }
      }

      setSlots(timetableData);
    } catch (err) {
      console.error('Error fetching timetable:', err);
      setError('Failed to fetch timetable data');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable(date);
  }, [date]);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Faculty Timetable Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="px-4 py-2 text-black text-lg font-semibold mb-4">Select Date</h3>
            <Calendar
              onChange={handleDateChange}
              value={date}
              className="border rounded-lg p-2 w-full"
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="px-4 py-2 text-black text-lg font-semibold mb-4">
              Timetable for {date.toLocaleDateString()}
            </h3>

            {loading ? (
              <div className="text-center py-6">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                <p className="mt-2">Loading timetable...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-700 p-4 rounded border border-red-200">
                {error}
              </div>
            ) : slots.length > 0 ? (
              slots.map((slot, idx) => (
                <div key={idx} className="px-4 py-2 text-black space-y-2 border-b pb-2 mb-2">
                  <p><strong className="px-4 py-2 text-black">Course:</strong> {slot.courseName}</p>
                  <p><strong className="px-4 py-2 text-black">Course Code:</strong> {slot.courseCode}</p>
                  <p><strong className="px-4 py-2 text-black">Room:</strong> {slot.roomNo}</p>
                  <p><strong className="px-4 py-2 text-black">Time:</strong> {slot.time}</p>
                  {slot.roundingsTime && (
                    <p><strong className="px-4 py-2 text-black">Rounding:</strong> {slot.roundingsTime}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="px-4 py-2 text-black">No classes scheduled for this day.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FacultyView;
