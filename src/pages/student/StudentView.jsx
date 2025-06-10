import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import API from '../../services/api';
import Calendar from 'react-calendar';
import '../../styles/calendar.css';

const StudentView = () => {
  const [date, setDate] = useState(new Date());
  const [timetableSlots, setTimetableSlots] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchStudentTimetable = async (selectedDate) => {
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    try {
      const res = await API.get(`/timetable/day/${dayName}`, {
        params: { role: 'student' },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Filter timetable entries for the current student's section and semester
      const studentTimetable = res.data.find(entry => 
        entry.department === user.department &&
        entry.section === user.section &&
        entry.semester === user.semester
      );

      // Set the timetable slots if found, otherwise empty array
      setTimetableSlots(studentTimetable?.timetableSlots || []);
    } catch (err) {
      console.error('Error fetching student timetable:', err);
      setTimetableSlots([]);
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    fetchStudentTimetable(newDate);
  };

  useEffect(() => {
    fetchStudentTimetable(date);
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Student Timetable</h2>
        <p className="mb-4 text-gray-600">
          Viewing timetable for:
          <strong> {user.department} - Semester {user.semester}, Section {user.section}</strong><br />
          Date: {date.toLocaleDateString()}
        </p>

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
            <h3 className="px-4 py-2 text-black font-semibold mb-4">
              Your Schedule for {date.toLocaleDateString()}
            </h3>

            {timetableSlots.length > 0 ? (
              <div className="space-y-4">
                {timetableSlots.map((slot, i) => (
                  <div key={i} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="px-4 py-2 text-black">{slot.courseName}</h4>
                        <p className="px-4 py-2 text-black">Code: {slot.courseCode}</p>
                        <p className="px-4 py-2 text-black">Faculty: {slot.facultyName}</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        Room: {slot.roomNo}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium">Time:</span> {slot.time}
                    </div>
                    {slot.roundingsTime && (
                      <div className="mt-1 text-sm text-gray-500">
                        <span className="font-medium">Roundings:</span> {slot.roundingsTime}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-4 py-2 text-black">No classes scheduled for this day.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentView;