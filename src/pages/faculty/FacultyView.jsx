import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import API from '../../services/api'; // Assuming your API service is correctly configured
import Calendar from 'react-calendar';
// We'll import a base calendar.css, but most styling will be in <style jsx>
import '../../styles/calendar.css'; // This is typically react-calendar's default minimal CSS

import { FaCalendarDay, FaCalendarAlt, FaListAlt, FaClock, FaBook, FaCode, FaMapMarkerAlt } from 'react-icons/fa'; // Icons for professional look

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
      setError('Failed to fetch timetable data. Please try again.');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable(date);
  }, [date, facultyId, dept]); // Added facultyId and dept to dependencies for completeness

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Main Heading */}
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-10 text-center animate-fade-in-down">
          <FaCalendarDay className="inline-block mr-4 text-indigo-400 text-4xl sm:text-5xl animate-pop-in" />
          My Academic Schedule
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
          {/* Calendar Card */}
          <div className="bg-gray-800/90 rounded-2xl shadow-xl p-6 border border-gray-700 backdrop-blur-sm transform transition-all duration-700 opacity-0 animate-fade-in-scale-up">
            <h3 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
              <FaCalendarAlt className="text-teal-400 text-2xl" /> Select Date
            </h3>
            <Calendar
              onChange={handleDateChange}
              value={date}
              className="react-calendar-custom" // Apply our custom styling class
            />
          </div>

          {/* Timetable Display Card */}
          <div className="bg-gray-800/90 rounded-2xl shadow-xl p-6 border border-gray-700 backdrop-blur-sm transform transition-all duration-700 opacity-0 animate-fade-in-scale-up animation-delay-200">
            <h3 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
              <FaListAlt className="text-purple-400 text-2xl" /> Timetable for {date.toLocaleDateString()}
            </h3>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-300 text-lg">Loading your schedule...</p>
              </div>
            ) : error ? (
              <div className="bg-red-900/40 text-red-300 p-6 rounded-lg border border-red-700 text-center">
                <p className="font-semibold text-xl mb-2">Error!</p>
                <p>{error}</p>
                <p className="mt-2 text-sm text-red-400">Please check your network or try again later.</p>
              </div>
            ) : slots.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar"> {/* Added scrollbar and max-height */}
                {slots.map((slot, idx) => (
                  <div key={idx} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 transition-all duration-200 hover:bg-gray-700/70 transform hover:scale-[1.01] animate-stagger-fade-in" style={{ animationDelay: `${0.3 + idx * 0.1}s` }}>
                    <p className="flex items-center text-gray-200 text-lg mb-1">
                      <FaBook className="text-teal-300 text-xl mr-3" />
                      <strong className="font-semibold text-teal-300 mr-2">Course:</strong> {slot.courseName}
                    </p>
                    <p className="flex items-center text-gray-300 text-base mb-1">
                      <FaCode className="text-blue-300 text-lg mr-3" />
                      <strong className="font-medium text-blue-300 mr-2">Code:</strong> {slot.courseCode}
                    </p>
                    <p className="flex items-center text-gray-300 text-base mb-1">
                      <FaMapMarkerAlt className="text-green-300 text-lg mr-3" />
                      <strong className="font-medium text-green-300 mr-2">Room:</strong> {slot.roomNo}
                    </p>
                    <p className="flex items-center text-gray-300 text-base">
                      <FaClock className="text-yellow-300 text-lg mr-3" />
                      <strong className="font-medium text-yellow-300 mr-2">Time:</strong> {slot.time}
                      {slot.roundingsTime && <span className="ml-2 text-gray-400">(Rounding: {slot.roundingsTime})</span>}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                <p className="text-gray-400 italic text-xl">No classes scheduled for this day.</p>
                <p className="mt-2 text-gray-500 text-sm">Select another date to view its timetable.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for refined animations and specific styles */}
      <style jsx>{`
        /* --- General Card & Text Animations --- */
        @keyframes fade-in-scale-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale-up { animation: fade-in-scale-up 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .animation-delay-200 { animation-delay: 0.2s !important; }

        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.9s ease-out forwards; animation-delay: 0.1s; }

        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-pop-in { animation: pop-in 0.9s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; animation-delay: 0s; }

        /* --- Staggered Timetable Slot Animation --- */
        @keyframes stagger-fade-in {
          from { opacity: 0; transform: translateX(-15px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-stagger-fade-in { animation: stagger-fade-in 0.6s ease-out forwards; }


        /* --- Custom Scrollbar for Timetable Slots --- */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5); /* Darker track */
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #60A5FA; /* Blue/Indigo thumb */
          border-radius: 10px;
          border: 2px solid rgba(30, 41, 59, 0.7);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #3B82F6; /* Darker blue on hover */
        }


        /* --- React Calendar Custom Styling (Crucial for dark theme) --- */
        .react-calendar-custom {
          width: 100%;
          border: none; /* Remove default border */
          border-radius: 12px;
          background-color: rgba(30, 41, 59, 0.7); /* Darker background for calendar itself */
          font-family: inherit; /* Use global font */
        }

        .react-calendar-custom,
        .react-calendar-custom button,
        .react-calendar-custom button:enabled:hover,
        .react-calendar-custom button:enabled:focus {
          color: #E2E8F0; /* Light gray text for all elements */
        }

        .react-calendar-custom__navigation {
          height: 44px;
          margin-bottom: 1em;
          background-color: rgba(46, 52, 64, 0.7); /* Slightly lighter dark for navigation */
          border-radius: 8px;
        }

        .react-calendar-custom__navigation button {
          min-width: 44px;
          background: none;
          font-weight: bold;
        }

        .react-calendar-custom__navigation button:enabled:hover,
        .react-calendar-custom__navigation button:enabled:focus {
          background-color: rgba(71, 85, 105, 0.5); /* Darker gray on hover/focus for navigation */
          border-radius: 8px;
        }

        .react-calendar-custom__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.75em;
          color: #9CA3AF; /* Muted gray for weekdays */
        }

        .react-calendar-custom__month-view__weekdays__weekday {
          padding: 0.5em;
        }

        .react-calendar-custom__month-view__days__day {
          padding: 0.6em 0.5em; /* Padding for days */
          border-radius: 8px;
        }

        .react-calendar-custom__tile {
          max-width: 100%;
          text-align: center;
          padding: 0.7em 0.5em;
          background: none;
          border-radius: 8px; /* Rounded tiles */
          transition: background-color 0.2s, color 0.2s;
        }

        .react-calendar-custom__tile:enabled:hover,
        .react-calendar-custom__tile:enabled:focus {
          background-color: rgba(71, 85, 105, 0.5); /* Darker gray on hover/focus */
          color: #E2E8F0;
        }

        .react-calendar-custom__tile--now {
          background: rgba(100, 116, 139, 0.4); /* Muted blue for today */
          border: 1px solid #60A5FA; /* Subtle border for today */
        }

        .react-calendar-custom__tile--active {
          background-color: #4F46E5; /* Indigo for selected date */
          color: white;
          border-radius: 8px;
        }
        .react-calendar-custom__tile--active:enabled:hover,
        .react-calendar-custom__tile--active:enabled:focus {
          background-color: #6366F1; /* Lighter indigo on hover */
        }

        .react-calendar-custom--selectRange .react-calendar__tile--hover {
          background-color: rgba(129, 140, 248, 0.3);
        }

        .react-calendar-custom__tile--range {
          background: rgba(129, 140, 248, 0.2);
          color: #E2E8F0;
        }

        /* View-specific styles for month, year, decade, century */
        .react-calendar-custom__year-view .react-calendar__tile,
        .react-calendar-custom__decade-view .react-calendar__tile,
        .react-calendar-custom__century-view .react-calendar__tile {
          padding: 2em 0.5em;
        }
      `}</style>
    </>
  );
};

export default FacultyView;