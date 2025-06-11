import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default calendar styles
import Navbar from '../../components/layout/Navbar';
import axios from '../../services/api'; // Ensure this points to your configured axios instance
import { FaRegCalendarAlt, FaCalendarCheck, FaUserGraduate, FaChalkboardTeacher, FaUserTie, FaTrashAlt, FaEdit } from 'react-icons/fa'; // Importing FaEdit icon

const AdminCalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRole, setSelectedRole] = useState('hod'); // Default to HOD
  const [selectedDepartment, setSelectedDepartment] = useState(''); // State for department filter
  const [selectedSection, setSelectedSection] = useState(''); // State for section filter (student role)
  const [selectedSemester, setSelectedSemester] = useState(''); // State for semester filter (student role)
  const [selectedFacultyId, setSelectedFacultyId] = useState(''); // State for faculty ID filter (faculty/HOD role)

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State for editing a slot
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSlotData, setEditingSlotData] = useState({
    dailyTimetableId: '', // Parent document ID
    slotId: '',           // Subdocument ID
    time: '',
    courseCode: '',
    courseName: '',
    facultyName: '',
    roomNo: '',
    // Note: section and semester are typically properties of the parent DailyTimetable,
    // but if your slot schema includes them for display convenience, you can keep them.
    // However, they won't be sent in the updated slot data payload if the backend expects
    // them at the parent level. Adjust as per your schema.
    section: '',
    semester: '',
    roundingsTime: ''
  });

  // Dummy data for dropdowns (replace with actual data fetched from backend if available)
  const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE']; // Example departments
  const sections = ['A', 'B', 'C', 'D']; // Example sections
  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8']; // Example semesters
  const facultyIds = ['F001', 'F002', 'F003', 'F004', 'F005']; // Example faculty IDs

  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const fetchSlots = async () => {
    setLoading(true);
    setError('');
    const day = getDayName(selectedDate);

    // Build query parameters based on selected role and other filters
    let queryParams = {
      role: selectedRole,
      department: selectedDepartment,
      // The `date` parameter is not used by your backend `/day/:day` route,
      // but it's okay to keep if you plan to extend the backend.
      // date: selectedDate.toISOString().split('T')[0], 
    };

    if (selectedRole === 'student') {
        if (!selectedSection || !selectedSemester) {
            setError('Please select Section and Semester for Student role.');
            setSlots([]);
            setLoading(false);
            return;
        }
        queryParams.section = selectedSection;
        queryParams.semester = selectedSemester;
    } else if (selectedRole === 'faculty' || selectedRole === 'hod') {
        if (!selectedFacultyId) {
            // For HOD viewing general department, facultyId might be optional.
            // For faculty viewing personal, it's required.
            // Adjust this condition based on your exact requirement for HOD viewing.
            if (selectedRole === 'faculty') { // Only strict for faculty's own timetable
                setError('Please select Faculty ID for Faculty role.');
                setSlots([]);
                setLoading(false);
                return;
            }
        }
        queryParams.facultyId = selectedFacultyId;
    }

    // Ensure department is selected for any role, as it's a common filter
    if (!selectedDepartment) {
        setError('Please select a Department.');
        setSlots([]);
        setLoading(false);
        return;
    }

    try {
      const res = await axios.get(`/timetable/day/${day}`, {
        params: queryParams,
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      let timetableData = [];

      // Your backend can return an array of DailyTimetable documents (or a single one).
      // We need to flatten them into a single list of slots,
      // but each slot needs to know its own _id AND its parent's _id.
      if (Array.isArray(res.data)) {
        timetableData = res.data.flatMap(entry =>
          entry.timetableSlots ? entry.timetableSlots.map(slot => ({
            ...slot,
            dailyTimetableId: entry._id, // Store the parent DailyTimetable's _id
            slotId: slot._id             // Store the individual slot's _id explicitly
          })) : []
        );
      } else if (res.data && res.data.timetableSlots) {
        // If it's a single object with timetableSlots (e.g., from findOne)
        timetableData = res.data.timetableSlots.map(slot => ({
          ...slot,
          dailyTimetableId: res.data._id, // Store the parent DailyTimetable's _id
          slotId: slot._id               // Store the individual slot's _id explicitly
        }));
      } else {
        // Handle cases where res.data might be an empty array or just an object without timetableSlots
        timetableData = [];
      }

      setSlots(timetableData);
    } catch (err) {
      console.error("Timetable fetch error:", err);
      // More user-friendly message based on error response
      setError(err.response?.data?.message || 'Failed to fetch timetable data');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if required filters are selected
    if (selectedDepartment && 
       ((selectedRole === 'student' && selectedSection && selectedSemester) ||
        (selectedRole === 'faculty' && selectedFacultyId) ||
        (selectedRole === 'hod')) // HOD might or might not need facultyId
    ) {
      fetchSlots();
    } else if (selectedDepartment && selectedRole === 'hod' && !selectedFacultyId) {
        // Allow HOD to view general department timetable without facultyId
        fetchSlots();
    } else {
      setSlots([]); // Clear slots if not enough filters are selected
      setError('Please select all required filters (Department, Role, and specific criteria like Section/Semester or Faculty ID).');
    }
  }, [selectedDate, selectedRole, selectedDepartment, selectedSection, selectedSemester, selectedFacultyId]);


  // --- DELETE FUNCTIONALITY ---
  const handleDelete = async (dailyTimetableId, slotId) => {
    if (window.confirm("Are you sure you want to delete this specific timetable slot?")) {
      try {
        console.log("Attempting to delete slot with:", { dailyTimetableId, slotId });

        const res = await axios.delete(`/timetable/${dailyTimetableId}/slot/${slotId}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });

        // Update frontend state immediately
        if (res.data.msg && res.data.msg.includes('daily entry removed')) {
          // If the last slot was deleted, the entire parent DailyTimetable was removed
          setSlots(prevSlots => prevSlots.filter(slot => slot.dailyTimetableId !== dailyTimetableId));
        } else {
          // Otherwise, just remove the specific slot that was deleted
          setSlots(prevSlots => prevSlots.filter(slot => slot.slotId !== slotId));
        }

        alert(res.data.msg || "Timetable slot deleted successfully.");
      } catch (error) {
        console.error("Delete error details:", error);
        if (error.response) {
          alert(`Failed to delete slot: ${error.response.data.message || error.response.statusText || 'Server error'}`);
        } else if (error.request) {
          alert("Failed to delete slot: No response from server. Check your backend server status.");
        } else {
          alert(`Failed to delete slot: ${error.message}`);
        }
      }
    }
  };

  // --- EDIT FUNCTIONALITY ---

  // Function to open the edit modal and pre-fill form
  const handleEdit = async (slot) => {
    // We don't need to fetch the full parent timetable anymore with the new PUT /slot route
    setEditingSlotData({
        dailyTimetableId: slot.dailyTimetableId,
        slotId: slot.slotId,
        time: slot.time,
        courseCode: slot.courseCode,
        courseName: slot.courseName,
        facultyName: slot.facultyName || '', // Handle potentially undefined fields
        roomNo: slot.roomNo || '',
        section: slot.section || '',
        semester: slot.semester || '',
        roundingsTime: slot.roundingsTime || ''
    });
    setIsEditModalOpen(true);
  };

  // Handle changes in the edit form inputs
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingSlotData(prevData => ({ ...prevData, [name]: value }));
  };

  // Handle submission of the edited slot
  const handleSubmitEditedSlot = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!editingSlotData.dailyTimetableId || !editingSlotData.slotId) {
        alert("Error: Cannot update slot. Missing timetable or slot ID.");
        return;
    }

    try {
        setLoading(true);

        // Destructure to get relevant data for the update payload
        // Exclude dailyTimetableId and slotId from the actual payload sent to the backend,
        // as they are in the URL.
        const { dailyTimetableId, slotId, ...updatedPayload } = editingSlotData;

        // Call the new backend PUT endpoint for updating a single slot
        const res = await axios.put(`/timetable/${dailyTimetableId}/slot/${slotId}`, updatedPayload, {
            headers: { 'x-auth-token': localStorage.getItem('token') },
        });

        alert(res.data.message);
        setIsEditModalOpen(false); // Close the modal
        setEditingSlotData({ // Reset form data
            dailyTimetableId: '', slotId: '', time: '', courseCode: '', courseName: '',
            facultyName: '', roomNo: '', section: '', semester: '', roundingsTime: ''
        });
        fetchSlots(); // Re-fetch to update the calendar view with latest data

    } catch (error) {
        console.error("Error submitting edited slot:", error);
        alert(`Failed to update slot: ${error.response?.data?.message || error.message}`);
    } finally {
        setLoading(false);
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

          {/* Filters Section */}
          <div className="bg-gray-700 p-5 rounded-lg shadow-inner mb-8 flex flex-wrap items-center justify-center gap-4 transition-all duration-300 animate-slide-in-left">
            {/* Role Selection */}
            <div className="flex items-center gap-3">
              <label htmlFor="role-select" className="text-lg font-semibold text-gray-300">Role:</label>
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

            {/* Department Selection */}
            <div className="flex items-center gap-3">
              <label htmlFor="dept-select" className="text-lg font-semibold text-gray-300">Department:</label>
              <div className="relative">
                <select
                  id="dept-select"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="appearance-none bg-gray-600 border border-gray-500 text-white py-2.5 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 cursor-pointer text-base"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Conditional Filters for Student Role */}
            {selectedRole === 'student' && (
              <>
                <div className="flex items-center gap-3">
                  <label htmlFor="section-select" className="text-lg font-semibold text-gray-300">Section:</label>
                  <div className="relative">
                    <select
                      id="section-select"
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                      className="appearance-none bg-gray-600 border border-gray-500 text-white py-2.5 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 cursor-pointer text-base"
                    >
                      <option value="">Select Section</option>
                      {sections.map(sec => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label htmlFor="semester-select" className="text-lg font-semibold text-gray-300">Semester:</label>
                  <div className="relative">
                    <select
                      id="semester-select"
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="appearance-none bg-gray-600 border border-gray-500 text-white py-2.5 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 cursor-pointer text-base"
                    >
                      <option value="">Select Semester</option>
                      {semesters.map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Conditional Filters for Faculty/HOD Role */}
            {(selectedRole === 'faculty' || selectedRole === 'hod') && (
              <div className="flex items-center gap-3">
                <label htmlFor="faculty-select" className="text-lg font-semibold text-gray-300">Faculty ID:</label>
                <div className="relative">
                  <select
                    id="faculty-select"
                    value={selectedFacultyId}
                    onChange={(e) => setSelectedFacultyId(e.target.value)}
                    className="appearance-none bg-gray-600 border border-gray-500 text-white py-2.5 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 cursor-pointer text-base"
                  >
                    <option value="">Select Faculty</option>
                    {facultyIds.map(fId => (
                      <option key={fId} value={fId}>{fId}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
            )}
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
                  {slots.map((slot) => (
                    <div key={slot.slotId} className="bg-gray-900 border border-gray-700 rounded-lg p-5 shadow-lg flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 transition-transform duration-200 hover:scale-[1.01] hover:shadow-xl">
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
                      <div className="flex gap-2 mt-3 lg:mt-0">
                        {/* Edit Button */}
                        {slot.dailyTimetableId && slot.slotId && (
                            <button
                            onClick={() => handleEdit(slot)}
                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium px-4 py-2 rounded-md shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                            >
                            <FaEdit className="text-sm" />
                            Edit
                            </button>
                        )}
                        {/* Delete Button */}
                        {slot.dailyTimetableId && slot.slotId && (
                            <button
                            onClick={() => handleDelete(slot.dailyTimetableId, slot.slotId)}
                            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium px-4 py-2 rounded-md shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                            >
                            <FaTrashAlt className="text-sm" />
                            Delete
                            </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-900 text-gray-400 p-8 rounded-lg border border-gray-700 text-center text-lg shadow-inner">
                  <FaRegCalendarAlt className="text-5xl text-gray-500 mx-auto mb-4" />
                  <p className="font-semibold">No timetable entries found for this selection.</p>
                  <p className="mt-2 text-sm text-gray-500">Please select a different date, role, or filter options to view timetable data.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Slot Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700 relative">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Edit Timetable Slot</h3>
            
            <form onSubmit={handleSubmitEditedSlot} className="space-y-4">
              <div>
                <label htmlFor="time" className="block text-gray-300 text-sm font-bold mb-2">Time:</label>
                <input
                  type="text"
                  id="time"
                  name="time"
                  value={editingSlotData.time || ''}
                  onChange={handleEditFormChange}
                  placeholder="e.g., 09:00 AM"
                  required
                  className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="courseCode" className="block text-gray-300 text-sm font-bold mb-2">Course Code:</label>
                <input
                  type="text"
                  id="courseCode"
                  name="courseCode"
                  value={editingSlotData.courseCode || ''}
                  onChange={handleEditFormChange}
                  placeholder="e.g., CS101"
                  required
                  className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="courseName" className="block text-gray-300 text-sm font-bold mb-2">Course Name:</label>
                <input
                  type="text"
                  id="courseName"
                  name="courseName"
                  value={editingSlotData.courseName || ''}
                  onChange={handleEditFormChange}
                  placeholder="e.g., Introduction to CS"
                  required
                  className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="facultyName" className="block text-gray-300 text-sm font-bold mb-2">Faculty Name:</label>
                <input
                  type="text"
                  id="facultyName"
                  name="facultyName"
                  value={editingSlotData.facultyName || ''}
                  onChange={handleEditFormChange}
                  placeholder="e.g., Dr. Jane Doe"
                  className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="roomNo" className="block text-gray-300 text-sm font-bold mb-2">Room No:</label>
                <input
                  type="text"
                  id="roomNo"
                  name="roomNo"
                  value={editingSlotData.roomNo || ''}
                  onChange={handleEditFormChange}
                  placeholder="e.g., L-101"
                  required
                  className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {/* Add other fields as needed, like section, semester, roundingsTime */}
               <div>
                <label htmlFor="roundingsTime" className="block text-gray-300 text-sm font-bold mb-2">Roundings Time (Optional):</label>
                <input
                  type="text"
                  id="roundingsTime"
                  name="roundingsTime"
                  value={editingSlotData.roundingsTime || ''}
                  onChange={handleEditFormChange}
                  placeholder="e.g., 15 mins"
                  className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>


              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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