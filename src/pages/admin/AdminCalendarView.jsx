import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default calendar styles
import Navbar from '../../components/layout/Navbar';
import axios from '../../services/api';
import { FaRegCalendarAlt, FaCalendarCheck, FaUserGraduate, FaChalkboardTeacher, FaUserTie, FaTrashAlt } from 'react-icons/fa'; // Importing icons

const AdminCalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRole, setSelectedRole] = useState('hod');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const fetchSlots = async () => {
    setLoading(true);
    setError('');
    const day = getDayName(selectedDate);

    try {
      const res = await axios.get(`/timetable/day/${day}`, {
        params: {
          role: selectedRole,
          date: selectedDate.toISOString().split('T')[0],
        },
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      let timetableData = [];

      if (Array.isArray(res.data)) {
        timetableData = res.data.flatMap(entry =>
          entry.timetableSlots ? entry.timetableSlots.map(slot => ({
            ...slot,
            _id: entry._id, // Keep _id of the daily entry for deletion
          })) : []
        );
      } else if (res.data.timetableSlots) {
        timetableData = res.data.timetableSlots.map(slot => ({
          ...slot,
          _id: res.data._id, // Attach _id of the single document
        }));
      } else {
        timetableData = res.data;
      }

      setSlots(timetableData);
    } catch (err) {
      console.error("Timetable fetch error:", err);
      setError('Failed to fetch timetable data');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedDate, selectedRole]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this timetable entry? This will delete the entire daily timetable for the selected role on this date if no other slots exist for that day.")) {
      try {
        await axios.delete(`/timetable/${id}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        // Filter out deleted timetable by ID (entire DailyTimetable document)
        setSlots(prev => prev.filter(slot => slot._id !== id));
        alert("Timetable entry deleted successfully.");
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete timetable.");
      }
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'hod': return <FaUserTie className="text-purple-400" />;
      case 'faculty': return <FaChalkboardTeacher className="text-green-400" />;
      case 'student': return <FaUserGraduate className="text-blue-400" />;
      default: return <FaRegCalendarAlt />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-8 sm:p-10 border border-gray-700">
          <h2 className="text-4xl font-extrabold text-white mb-8 text-center flex items-center justify-center gap-3 animate-fade-in-down">
            <FaCalendarCheck className="text-indigo-400 text-3xl" />
            Admin Timetable Overview
          </h2>

          {/* Role Selection & Info Bar */}
          <div className="bg-gray-700 p-5 rounded-lg shadow-inner mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 animate-slide-in-left">
            <div className="flex items-center gap-3">
              <label htmlFor="role-select" className="text-lg font-semibold text-gray-300">Viewing For:</label>
              <div className="relative">
                <select
                  id="role-select"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="appearance-none bg-gray-600 border border-gray-500 text-white py-2.5 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 cursor-pointer text-base"
                >
                  <option value="hod">HOD</option>
                  <option value="faculty">Faculty</option>
                  <option value="student">Student</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            <div className="text-gray-300 text-md flex items-center gap-2 font-medium">
              Current Selection:
              {getRoleIcon(selectedRole)}
              <span className="text-indigo-400 font-bold">{selectedRole.toUpperCase()}</span> Role
            </div>
          </div>

          {/* Calendar and Timetable Display Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Calendar Section */}
            <div className="bg-gray-700 p-6 rounded-lg shadow-xl border border-gray-600 animate-fade-in-right flex flex-col items-center">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FaRegCalendarAlt className="text-indigo-400" />
                Select a Date
              </h3>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="react-calendar-custom bg-gray-600 text-white rounded-lg shadow-md border-none p-4"
              />
            </div>

            {/* Timetable Slots Display */}
            <div className="bg-gray-700 p-6 rounded-lg shadow-xl border border-gray-600 animate-fade-in-left">
              <h3 className="text-2xl font-semibold text-white mb-5 text-center">
                Timetable for {getDayName(selectedDate)}
                <span className="font-normal text-indigo-300 text-xl"> ({selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})</span>
              </h3>

              {loading ? (
                <div className="text-center py-10 flex flex-col items-center">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-indigo-500 mb-3"></div>
                  <p className="mt-2 text-indigo-300 text-lg">Fetching timetable data...</p>
                </div>
              ) : error ? (
                <div className="bg-red-900 text-red-300 p-5 rounded-lg border border-red-700 text-center text-lg font-medium animate-pulse">
                  {error}
                </div>
              ) : slots.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                  {slots.map((slot, index) => (
                    <div key={index} className="bg-gray-900 border border-gray-700 rounded-lg p-5 shadow-lg flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 transition-transform duration-200 hover:scale-[1.01] hover:shadow-xl">
                      <div className="flex-grow text-left">
                        <p className="font-bold text-indigo-400 text-lg mb-1">{slot.time}</p>
                        <div className="text-gray-300 text-sm space-y-0.5">
                          <p><span className="text-gray-400">Course:</span> <span className="font-medium text-white">{slot.courseCode}</span> - {slot.courseName}</p>
                          {slot.facultyName && <p><span className="text-gray-400">Faculty:</span> {slot.facultyName}</p>}
                          {slot.roomNo && <p><span className="text-gray-400">Room:</span> {slot.roomNo}</p>}
                          {slot.section && <p><span className="text-gray-400">Section:</span> {slot.section}</p>}
                          {slot.roundingsTime && <p><span className="text-gray-400">Roundings:</span> {slot.roundingsTime}</p>}
                        </div>
                      </div>
                      {slot._id && (
                        <button
                          onClick={() => handleDelete(slot._id)}
                          className="mt-3 lg:mt-0 flex items-center gap-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium px-4 py-2 rounded-md shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                          <FaTrashAlt className="text-sm" />
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-900 text-gray-400 p-8 rounded-lg border border-gray-700 text-center text-lg shadow-inner">
                  <FaRegCalendarAlt className="text-5xl text-gray-500 mx-auto mb-4" />
                  <p className="font-semibold">No timetable entries found for this role on this date.</p>
                  <p className="mt-2 text-sm text-gray-500">Please select a different date or role to view timetable data.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for react-calendar and animations */}
      <style jsx>{`
        /* Custom calendar styling */
        .react-calendar-custom {
          width: 100%;
          max-width: 350px; /* Adjust max width as needed */
          background-color: #374151; /* gray-700 */
          color: #f3f4f6; /* gray-100 */
          border-radius: 0.75rem; /* rounded-lg */
          font-family: 'Inter', sans-serif; /* Example font */
        }
        .react-calendar-custom .react-calendar__navigation button {
          color: #6366f1; /* indigo-500 */
          font-weight: bold;
          font-size: 1.125rem; /* text-lg */
        }
        .react-calendar-custom .react-calendar__navigation button:hover,
        .react-calendar-custom .react-calendar__navigation button:focus {
          background-color: #4b5563; /* gray-600 */
          border-radius: 0.5rem;
        }
        .react-calendar-custom .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
          font-weight: 600; /* semibold */
          color: #9ca3af; /* gray-400 */
        }
        .react-calendar-custom .react-calendar__tile {
          padding: 0.6rem 0.5rem;
          color: #e5e7eb; /* gray-200 */
          border-radius: 0.5rem;
          transition: background-color 0.2s, color 0.2s;
        }
        .react-calendar-custom .react-calendar__tile:hover {
          background-color: #4b5563; /* gray-600 */
        }
        .react-calendar-custom .react-calendar__tile--now {
          background-color: #4f46e5; /* indigo-600 */
          color: white;
          border-radius: 0.5rem;
          font-weight: bold;
        }
        .react-calendar-custom .react-calendar__tile--active {
          background-color: #6366f1; /* indigo-500 */
          color: white;
          border-radius: 0.5rem;
          font-weight: bold;
        }
        .react-calendar-custom .react-calendar__tile--range,
        .react-calendar-custom .react-calendar__tile--rangeStart,
        .react-calendar-custom .react-calendar__tile--rangeEnd {
          background-color: #4f46e5 !important;
          color: white !important;
        }

        /* Custom scrollbar for slot list */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151; /* gray-700 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563; /* gray-600 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280; /* gray-500 */
        }

        /* Keyframe Animations */
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }

        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-left { animation: slide-in-left 0.8s ease-out forwards; animation-delay: 0.2s; }

        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-right { animation: fade-in-right 0.8s ease-out forwards; animation-delay: 0.4s; }

        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-left { animation: fade-in-left 0.8s ease-out forwards; animation-delay: 0.6s; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse { animation: pulse 1.5s infinite; }
      `}</style>
    </>
  );
};

export default AdminCalendarView;