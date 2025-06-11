import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import API from '../../services/api'; // Assuming your API service is correctly configured
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default react-calendar styles (crucial for base styling)
import '../../styles/calendar.css'; // Your custom calendar styling overrides

import {
  FaCalendarAlt,
  FaBuilding,
  FaInfoCircle,
  FaUserTie, // Icon for faculty
  FaCalendarDay // Icon for overall timetable
} from 'react-icons/fa';

const HODView = () => {
  const [date, setDate] = useState(new Date());
  const [slots, setSlots] = useState([]); // All slots fetched for the department and day
  const [facultyList, setFacultyList] = useState([]); // List of unique faculties in the department
  const [selectedFaculty, setSelectedFaculty] = useState(''); // Stores the ID of the selected faculty for filtering
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Retrieve user information from local storage
  const user = JSON.parse(localStorage.getItem('user')) || {};

  /**
   * Fetches the timetable data for the HOD's department for a given date.
   * Aggregates all faculty timetables within that department.
   * @param {Date} selectedDate The date for which to fetch the timetable.
   */
  const fetchDepartmentTimetable = async (selectedDate) => {
    setLoading(true);
    setError('');
    setSlots([]); // Clear previous slots before fetching new ones
    setFacultyList([]); // Clear previous faculty list
    setSelectedFaculty(''); // Reset faculty selection when date changes

    // Ensure the user's department is available
    if (!user.department) {
      setError("Department information not found. Please ensure you are logged in correctly.");
      setLoading(false);
      return;
    }

    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

    try {
      // API call to fetch timetable data for the HOD's department and selected day
      const res = await API.get(`/timetable/day/${dayName}`, {
        params: { role: 'hod', department: user.department },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      let allSlots = [];
      if (Array.isArray(res.data)) {
        allSlots = res.data.flatMap(entry => {
          if (entry.department === user.department && Array.isArray(entry.timetableSlots)) {
            return entry.timetableSlots.map(slot => ({
              ...slot,
              // Prioritize slot's facultyName/Id, then entry's facultyName/Id, then fallback
             
              facultyId: slot.facultyId || entry.facultyId || 'CAN', // Ensure facultyId for filtering
              section: slot.section || 'N/A', // Ensure section has a fallback
              semester: slot.semester || 'N/A', // Ensure semester has a fallback
            }));
          }
          return [];
        });
      }

      // Extract unique faculty members from the fetched slots to populate the filter dropdown
      // Filter out 'N/A' faculty IDs from the list, unless 'N/A' is a valid filterable option
      const uniqueFaculty = [
        ...new Map(
          allSlots
            .filter(slot => slot.facultyId !== 'N/A') // Only add valid faculty to filter list
            .map(slot => [
              slot.facultyId,
              { id: slot.facultyId, name: slot.facultyName },
            ])
        ).values(),
      ].sort((a,b) => a.name.localeCompare(b.name));

      // Sort all fetched slots by time for chronological display
      allSlots.sort((a, b) => {
        // Handle potentially missing time values gracefully
        if (!a.time || !b.time) return 0;
        try {
          // Create dummy Date objects for reliable time comparison
          const timeA = new Date(`2000/01/01 ${a.time}`);
          const timeB = new Date(`2000/01/01 ${b.time}`);
          return timeA - timeB;
        } catch (e) {
          console.warn("Error parsing time for sorting:", a.time, b.time, e);
          return 0; // Return 0 if parsing fails to avoid breaking sort
        }
      });

      setFacultyList(uniqueFaculty);
      setSlots(allSlots);
      console.log(allSlots);
    } catch (err) {
      console.error('Failed to fetch timetable:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to load timetable. Please try again.');
      setSlots([]); // Clear slots on error
      setFacultyList([]); // Clear faculty list on error
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles changes in the selected date from the calendar.
   * @param {Date} newDate The newly selected date.
   */
  const handleDateChange = (newDate) => {
    setDate(newDate);
    fetchDepartmentTimetable(newDate);
    // console.log(allSlots);
  };

  /**
   * Filters the 'slots' array based on the 'selectedFaculty' state.
   * If no faculty is selected, returns all slots.
   */
  const filteredSlots = selectedFaculty
    ? slots.filter(slot => slot.facultyId === selectedFaculty)
    : slots;

  // Effect hook to fetch timetable data on component mount or when date/user.department changes
  useEffect(() => {
    if (user.department) {
      fetchDepartmentTimetable(date);
    } else {
      setError("Department information not found. Cannot load department timetable.");
    }
  }, [date, user.department]); // Dependencies for the effect
  console.log(filteredSlots);
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

        {/* Main Heading */}
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-10 text-center animate-fade-in-down">
          <FaCalendarDay className="inline-block mr-4 text-cyan-400 text-4xl sm:text-5xl animate-pop-in" />
          Department Timetable
        </h2>

        {/* User Info Bar */}
        <div className="bg-gray-800/70 rounded-xl shadow-md p-6 mb-8 text-gray-200 text-center border border-gray-700 animate-fade-in-up animation-delay-300 w-full max-w-2xl">
          <FaInfoCircle className="inline-block text-blue-300 text-2xl mr-3" />
          <span className="font-semibold text-lg">Viewing schedule for Department: </span>
          <span className="text-white font-bold">{user.department || 'N/A'}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
          {/* Calendar Selector Card */}
          <div className="bg-gray-800/90 rounded-2xl shadow-xl p-6 border border-gray-700 backdrop-blur-sm transform transition-all duration-700 opacity-0 animate-fade-in-scale-up">
            <h3 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
              <FaCalendarAlt className="text-teal-400 text-2xl" /> Select Date
            </h3>
            <Calendar
              onChange={handleDateChange}
              value={date}
              className="react-calendar-custom" // Apply custom styling
            />

            {/* Faculty Selector Dropdown */}
            <div className="mt-8">
              <label htmlFor="faculty-select" className="block text-gray-300 text-lg font-medium mb-2 flex items-center">
                <FaUserTie className="mr-2 text-purple-300 text-xl" /> Filter by Faculty
              </label>
              <div className="relative">
                <select
                  id="faculty-select"
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 cursor-pointer"
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                >
                  <option value="">All Faculty</option>
                  {facultyList.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Timetable Display Card */}
          <div className="bg-gray-800/90 rounded-2xl shadow-xl p-6 border border-gray-700 backdrop-blur-sm transform transition-all duration-700 opacity-0 animate-fade-in-scale-up animation-delay-200">
            <h3 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
              <FaBuilding className="text-purple-400 text-2xl" />
              Schedule for {date.toLocaleDateString()}
            </h3>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-300 text-lg">Loading schedule...</p>
              </div>
            ) : error ? (
              <div className="bg-red-900/40 text-red-300 p-6 rounded-lg border border-red-700 text-center">
                <p className="font-semibold text-xl mb-2">Error!</p>
                <p>{error}</p>
              </div>
            ) : filteredSlots.length > 0 ? (
              <div className="overflow-x-auto max-h-96 custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-700 text-left">
                  <thead className="bg-gray-700 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">Time</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">Course</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">FacultyID</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">Room</th>
                     
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredSlots.map((t, i) => (
                      <tr key={t._id || i} className={`transform transition-all duration-300 ${i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700/50'} hover:bg-gray-700 animate-stagger-fade-in`} style={{ animationDelay: `${0.3 + i * 0.05}s` }}>
                        
                        <td className="px-4 py-3 whitespace-nowrap text-gray-100 font-medium">{t.time}</td>
                        <td className="px-4 py-3 text-gray-200">{t.courseName} <span className="text-gray-400 text-sm">({t.courseCode})</span></td>
                        <td className="px-4 py-3 text-gray-200">{t.facultyId }</td> {/* Now ensures 'N/A' if missing */}
                        <td className="px-4 py-3 text-gray-200">{t.roomNo || 'N/A'}</td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                <p className="text-gray-400 italic text-xl">No classes scheduled for this date in your department, or no faculty selected.</p>
                <p className="mt-2 text-gray-500 text-sm">Select another date or ensure department data is available.</p>
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
        .animation-delay-300 { animation-delay: 0.3s !important; }

        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.9s ease-out forwards; animation-delay: 0.1s; }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.7s ease-out forwards; animation-delay: 0.5s; }

        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-pop-in { animation: pop-in 0.9s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; animation-delay: 0s; }

        /* --- Staggered Timetable Slot Animation (for table rows) --- */
        @keyframes stagger-fade-in {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-stagger-fade-in { animation: stagger-fade-in 0.4s ease-out forwards; }


        /* --- Custom Scrollbar for Timetable Table --- */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5); /* Darker track */
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #818CF8; /* Light purple/indigo thumb */
          border-radius: 10px;
          border: 2px solid rgba(30, 41, 59, 0.7);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #6366F1; /* Darker purple on hover */
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

export default HODView;
