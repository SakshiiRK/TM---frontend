import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import axios from '../../services/api';
import { FaPlus, FaTrashAlt, FaSave, FaUserGraduate, FaChalkboardTeacher, FaUserTie, FaCalendarDay, FaClock, FaBook, FaBuilding, FaThLarge, FaSortNumericUpAlt, FaSun, FaMoon, FaCalendarAlt, FaPenFancy, FaIdCard } from 'react-icons/fa'; // Added more relevant icons

const weekdays = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const timeSlotOptions = [
  "09:00 AM", "09:55 AM", "11:05 AM", "12:00 PM",
  "1:45 PM", "2:40 PM", "3:35 PM", "4:30 PM"
];

const ManualTimetable = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const [role, setRole] = useState('');
  const [term, setTerm] = useState('');
  const [oddEven, setOddEven] = useState('');
  const [formData, setFormData] = useState({});
  const [slots, setSlots] = useState([]);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setFormData({}); // Clear form data when role changes
    setSlots([]); // Clear slots when role changes
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSlotChange = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const addSlot = () => {
    const baseSlot = {
      time: '',
      courseCode: '',
      courseName: '',
      facultyName: '',
      roomNo: ''
    };
    if (role === 'hod') baseSlot.roundingsTime = '';
    setSlots([...slots, baseSlot]);
  };

  const removeSlot = (index) => {
    const updated = [...slots];
    updated.splice(index, 1);
    setSlots(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      role,
      oddEvenTerm: oddEven,
      duration: term,
      day: formData.day, // Day is picked once for the entire daily timetable
      department: formData.department,
      timetableSlots: slots,
    };

    // Role-specific fields
    if (role === 'student') {
      payload.section = formData.section;
      payload.semester = formData.semester;
    } else if (role === 'faculty' || role === 'hod') {
      payload.facultyId = formData.facultyId;
      // Section and Semester for faculty/HOD are usually tied to the course,
      // but if the backend expects them at the daily timetable level, keep them here.
      // If they belong per slot, they should be moved into the slot object.
      // For now, adhering to existing logic:
      payload.section = formData.section;
      payload.semester = formData.semester;
    }

    try {
      console.log("Submitting timetable:", payload);
      await axios.post('/timetable/daily', payload, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      alert('Timetable submitted successfully!');
      // Optionally reset form after submission
      setRole('');
      setTerm('');
      setOddEven('');
      setFormData({});
      setSlots([]);
    } catch (err) {
      console.error('Submission error:', err);
      alert(`Submission failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const getRoleIcon = (currentRole) => {
    switch (currentRole) {
      case 'student': return <FaUserGraduate className="text-blue-400" />;
      case 'faculty': return <FaChalkboardTeacher className="text-green-400" />;
      case 'hod': return <FaUserTie className="text-purple-400" />;
      default: return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-8 sm:p-10 border border-gray-700">
          <h2 className="text-4xl font-extrabold text-white mb-8 text-center flex items-center justify-center gap-3 animate-fade-in-down">
            <FaPenFancy className="text-indigo-400 text-3xl" />
            Manual Timetable Entry
          </h2>

          <p className="text-gray-400 text-center mb-10 text-lg">
            Create and manage daily timetable entries for various roles.
          </p>

          {/* Common Selections Card */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-inner mb-8 transition-all duration-300 animate-slide-in-left">
            <h3 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
              <FaCalendarAlt className="text-yellow-400" /> General Timetable Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="role-select" className="block text-gray-300 text-sm font-medium mb-2">Select Role:</label>
                <div className="relative">
                  <select
                    id="role-select"
                    value={role}
                    onChange={handleRoleChange}
                    className="block appearance-none w-full bg-gray-600 border border-gray-500 text-white py-3 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 cursor-pointer text-base"
                    required
                  >
                    <option value="" className="text-gray-400">-- Select Role --</option>
                    <option value="student" className="text-white">Student</option>
                    <option value="faculty" className="text-white">Faculty</option>
                    <option value="hod" className="text-white">HOD</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    {getRoleIcon(role) || <FaUserGraduate />} {/* Default icon */}
                  </div>
                </div>
                {role && (
                  <p className="text-gray-400 text-sm mt-2 flex items-center gap-1">
                    Currently setting timetable for: <span className="font-bold text-indigo-300">{role.toUpperCase()}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="term-input" className="block text-gray-300 text-sm font-medium mb-2">Term (e.g., Jan - May 2025):</label>
                <input
                  id="term-input"
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="e.g. Jan - May 2025"
                  className="bg-gray-600 border border-gray-500 text-white py-3 px-4 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="odd-even-select" className="block text-gray-300 text-sm font-medium mb-2">Semester Type:</label>
                <div className="relative">
                  <select
                    id="odd-even-select"
                    value={oddEven}
                    onChange={(e) => setOddEven(e.target.value)}
                    className="block appearance-none w-full bg-gray-600 border border-gray-500 text-white py-3 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 cursor-pointer text-base"
                    required
                  >
                    <option value="" className="text-gray-400">-- Odd or Even Semester --</option>
                    <option value="odd" className="text-white">Odd</option>
                    <option value="even" className="text-white">Even</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    {oddEven === 'odd' ? <FaSun /> : oddEven === 'even' ? <FaMoon /> : <FaCalendarAlt />}
                  </div>
                </div>
              </div>

              {/* Day selection for the entire timetable */}
              <div>
                <label htmlFor="day-select" className="block text-gray-300 text-sm font-medium mb-2">Select Day for Timetable:</label>
                <div className="relative">
                  <select
                    id="day-select"
                    className="block appearance-none w-full bg-gray-600 border border-gray-500 text-white py-3 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 cursor-pointer text-base"
                    onChange={(e) => handleFieldChange('day', e.target.value)}
                    required
                  >
                    <option value="" className="text-gray-400">-- Select Day --</option>
                    {weekdays.map(d => <option className="text-white" key={d} value={d}>{d}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <FaCalendarDay />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {role && (
            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up">

              {/* Role-Specific Fields Card */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-inner">
                <h3 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
                  <FaUserTie className="text-orange-400" /> {role.toUpperCase()} Specific Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {role === 'student' && (
                    <>
                      <div>
                        <label htmlFor="student-semester" className="block text-gray-300 text-sm font-medium mb-2">Semester:</label>
                        <input type="text" id="student-semester" placeholder="e.g., 5th" className="bg-gray-600 border border-gray-500 text-white py-3 px-4 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200" onChange={(e) => handleFieldChange('semester', e.target.value)} required />
                      </div>
                      <div>
                        <label htmlFor="student-section" className="block text-gray-300 text-sm font-medium mb-2">Section:</label>
                        <input type="text" id="student-section" placeholder="e.g., A" className="bg-gray-600 border border-gray-500 text-white py-3 px-4 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200" onChange={(e) => handleFieldChange('section', e.target.value)} required />
                      </div>
                      <div>
                        <label htmlFor="student-department" className="block text-gray-300 text-sm font-medium mb-2">Department:</label>
                        <input type="text" id="student-department" placeholder="e.g., Computer Science" className="bg-gray-600 border border-gray-500 text-white py-3 px-4 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200" onChange={(e) => handleFieldChange('department', e.target.value)} required />
                      </div>
                    </>
                  )}

                  {(role === 'faculty' || role === 'hod') && (
                    <>
                      <div>
                        <label htmlFor="faculty-id" className="block text-gray-300 text-sm font-medium mb-2">Faculty ID:</label>
                        <input type="text" id="faculty-id" placeholder="e.g., VCD" className="bg-gray-600 border border-gray-500 text-white py-3 px-4 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200" onChange={(e) => handleFieldChange('facultyId', e.target.value)} required />
                      </div>
                      <div>
                        <label htmlFor="faculty-department" className="block text-gray-300 text-sm font-medium mb-2">Department:</label>
                        <input type="text" id="faculty-department" placeholder="e.g., Electrical Engineering" className="bg-gray-600 border border-gray-500 text-white py-3 px-4 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200" onChange={(e) => handleFieldChange('department', e.target.value)} required />
                      </div>
                      {/* Section and Semester for faculty/HOD, if needed at this level */}
                      <div>
                        <label htmlFor="faculty-semester" className="block text-gray-300 text-sm font-medium mb-2">Semester (if applicable):</label>
                        <input type="text" id="faculty-semester" placeholder="e.g., 3rd (Optional)" className="bg-gray-600 border border-gray-500 text-white py-3 px-4 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200" onChange={(e) => handleFieldChange('semester', e.target.value)} />
                      </div>
                      <div>
                        <label htmlFor="faculty-section" className="block text-gray-300 text-sm font-medium mb-2">Section (if applicable):</label>
                        <input type="text" id="faculty-section" placeholder="e.g., B (Optional)" className="bg-gray-600 border border-gray-500 text-white py-3 px-4 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200" onChange={(e) => handleFieldChange('section', e.target.value)} />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Time Slot Entries Card */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-inner">
                <h3 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
                  <FaClock className="text-teal-400" /> Timetable Slots
                </h3>
                <div className="space-y-6">
                  {slots.map((slot, index) => (
                    <div key={index} className="bg-gray-900 p-6 rounded-lg shadow-lg relative border border-gray-600 transition-all duration-200 hover:shadow-xl hover:border-indigo-500">
                      <div className="absolute top-4 right-4">
                        <button type="button" onClick={() => removeSlot(index)} className="text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-full p-2">
                          <FaTrashAlt className="text-lg" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Time Slot */}
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">Time Slot:</label>
                          <div className="relative">
                            <select className="block appearance-none w-full bg-gray-800 border border-gray-700 text-white py-3 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200 cursor-pointer text-base" value={slot.time} onChange={(e) => handleSlotChange(index, 'time', e.target.value)} required>
                              <option value="" className="text-gray-400">-- Select Time Slot --</option>
                              {timeSlotOptions.map(t => <option className="text-white" key={t} value={t}>{t}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                              <FaClock />
                            </div>
                          </div>
                        </div>

                        {/* Course Code */}
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">Course Code:</label>
                          <input type="text" placeholder="e.g., CS101" className="bg-gray-800 border border-gray-700 text-white py-3 px-4 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200" value={slot.courseCode} onChange={(e) => handleSlotChange(index, 'courseCode', e.target.value)} required />
                        </div>

                        {/* Course Name */}
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">Course Name:</label>
                          <input type="text" placeholder="e.g., Data Structures" className="bg-gray-800 border border-gray-700 text-white py-3 px-4 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200" value={slot.courseName} onChange={(e) => handleSlotChange(index, 'courseName', e.target.value)} required />
                        </div>

                        {/* Fields specific to role */}
                        {role === 'student' && (
                          <>
                            <div>
                              <label className="block text-gray-300 text-sm font-medium mb-2">Faculty Name:</label>
                              <input type="text" placeholder="e.g., Dr. Jane Doe" className="bg-gray-800 border border-gray-700 text-white py-3 px-4 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200" value={slot.facultyName} onChange={(e) => handleSlotChange(index, 'facultyName', e.target.value)} required />
                            </div>
                            <div>
                              <label className="block text-gray-300 text-sm font-medium mb-2">Room No:</label>
                              <input type="text" placeholder="e.g., A201" className="bg-gray-800 border border-gray-700 text-white py-3 px-4 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200" value={slot.roomNo} onChange={(e) => handleSlotChange(index, 'roomNo', e.target.value)} required />
                            </div>
                          </>
                        )}

                        {(role === 'faculty' || role === 'hod') && (
                          <>
                            <div>
                              <label className="block text-gray-300 text-sm font-medium mb-2">Room No:</label>
                              <input type="text" placeholder="e.g., Lab 3" className="bg-gray-800 border border-gray-700 text-white py-3 px-4 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200" value={slot.roomNo} onChange={(e) => handleSlotChange(index, 'roomNo', e.target.value)} required />
                            </div>
                            {/* Assuming section and semester for faculty/HOD are at the top level, as per current logic.
                                If they should be per slot, move relevant inputs here.
                            */}
                          </>
                        )}

                        {role === 'hod' && (
                          <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Roundings Time:</label>
                            <input type="text" placeholder="e.g., 10:00 AM - 10:30 AM" className="bg-gray-800 border border-gray-700 text-white py-3 px-4 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200" value={slot.roundingsTime || ''} onChange={(e) => handleSlotChange(index, 'roundingsTime', e.target.value)} required />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addSlot} className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                    <FaPlus className="text-lg" /> Add Time Slot
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto gap-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                  <FaSave className="text-xl" /> Save Timetable Entry
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      {/* Custom CSS for animations */}
      <style jsx>{`
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

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; animation-delay: 0.4s; }
      `}</style>
    </>
  );
};

export default ManualTimetable;