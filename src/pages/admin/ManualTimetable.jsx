import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';

import axios from '../../services/api';

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
    setFormData({});
    setSlots([]);
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
    day: formData.day,
    department: formData.department,
   // ✅ From form, not currentUser
  
    timetableSlots: slots,
  };

  // Role-specific fields
  if (role === 'student') {
    payload.section = formData.section;
    payload.semester = formData.semester;
  } else if (role === 'faculty' || role === 'hod') {
    payload.facultyId = formData.facultyId;
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
  } catch (err) {
    console.error('Submission error:', err);
    alert(`Submission failed: ${err.response?.data?.message || err.message}`);
  }
};

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Manual Timetable Entry</h2>

        {/* Common Selection */}
        <div className="mb-4 space-y-4">
          <select value={role} onChange={handleRoleChange} className="border p-2 w-full" required>
            <option value="" className="p-6 max-w-4xl mx-auto text-black">-- Select Role --</option>
            <option value="student"  className="p-6 max-w-4xl mx-auto text-black">Student</option>
            <option value="faculty"  className="p-6 max-w-4xl mx-auto text-black">Faculty</option>
            <option value="hod"  className="p-6 max-w-4xl mx-auto text-black">HOD</option>
          </select>

          <input type="text" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Term (e.g. Jan - May 2025)" className="border p-2 w-full" required />

          <select value={oddEven} onChange={(e) => setOddEven(e.target.value)} className="border p-2 w-full" required>
            <option value=""  className="p-6 max-w-4xl mx-auto text-black">-- Odd or Even Semester --</option>
            <option value="odd"  className="p-6 max-w-4xl mx-auto text-black">Odd</option>
            <option value="even"  className="p-6 max-w-4xl mx-auto text-black">Even</option>
          </select>
        </div>

        {role && (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* STUDENT FORM */}
            {role === 'student' && (
              <>
                <input type="text" placeholder="Semester" className="border p-2 w-full" onChange={(e) => handleFieldChange('semester', e.target.value)} required />
                <input type="text" placeholder="Section" className="border p-2 w-full" onChange={(e) => handleFieldChange('section', e.target.value)} required />
                <input type="text" placeholder="Department" className="border p-2 w-full" onChange={(e) => handleFieldChange('department', e.target.value)} required />

  
              </>
            )}

            {/* FACULTY & HOD SHARED FIELDS */}
            {(role === 'faculty' || role === 'hod') && (
              <>
                <input type="text" placeholder="Faculty ID" className="border p-2 w-full"  onChange={(e) => handleFieldChange('facultyId', e.target.value)} required />
                <input type="text" placeholder="Department" className="border p-2 w-full" onChange={(e) => handleFieldChange('department', e.target.value)} required />
              </>
            )}

            {/* Time Slot Entries */}
            <div className="space-y-4">
              {slots.map((slot, index) => (
                <div key={index} className="border p-4 rounded shadow relative">
                  <div className="absolute top-2 right-2">
                    <button type="button" onClick={() => removeSlot(index)} className="text-red-600 font-bold">✖</button>
                  </div>

                  <select className="border p-2 w-full mb-2" value={slot.time} onChange={(e) => handleSlotChange(index, 'time', e.target.value)} required>
                    <option value=""  className="p-6 max-w-4xl mx-auto text-black">-- Select Time Slot --</option>
                    {timeSlotOptions.map(t => <option   className="p-6 max-w-4xl mx-auto text-black" key={t} value={t}>{t}</option>)}
                  </select>
                <select className="border p-2 w-full" onChange={(e) => handleFieldChange('day', e.target.value)} required>
                  <option value=""  className="p-6 max-w-4xl mx-auto text-black">-- Select Day --</option>
                  {weekdays.map(d => <option   className="p-6 max-w-4xl mx-auto text-black" key={d} value={d}>{d}</option>)}
                </select>
                  
                  <input type="text" placeholder="Course Code" className="border p-2 w-full mb-2" value={slot.courseCode} onChange={(e) => handleSlotChange(index, 'courseCode', e.target.value)} required />
                  <input type="text" placeholder="Course Name" className="border p-2 w-full mb-2" value={slot.courseName} onChange={(e) => handleSlotChange(index, 'courseName', e.target.value)} required />

                  {/* Only for student */}
                  {role === 'student' && (
                    <>
                      <input type="text" placeholder="Faculty Name" className="border p-2 w-full mb-2" value={slot.facultyName} onChange={(e) => handleSlotChange(index, 'facultyName', e.target.value)} required />
                      <input type="text" placeholder="Room No" className="border p-2 w-full mb-2" value={slot.roomNo} onChange={(e) => handleSlotChange(index, 'roomNo', e.target.value)} required />
                    </>
                  )}

                  {/* Only for faculty/hod */}
                  {(role === 'faculty' || role === 'hod') && (
                    <>
                    <input type="text" placeholder="Section" className="border p-2 w-full" onChange={(e) => handleFieldChange('section', e.target.value)} required />
                <input type="text" placeholder="Semester" className="border p-2 w-full" onChange={(e) => handleFieldChange('semester', e.target.value)} required />
                      <input type="text" placeholder="Room No" className="border p-2 w-full mb-2" value={slot.roomNo} onChange={(e) => handleSlotChange(index, 'roomNo', e.target.value)} required />
                    </>
                  )}

                  {/* Only for HOD */}
                  {role === 'hod' && (
                    <input type="text" placeholder="Roundings Time" className="border p-2 w-full mb-2" value={slot.roundingsTime || ''} onChange={(e) => handleSlotChange(index, 'roundingsTime', e.target.value)} required />
                  )}
                </div>
              ))}
              <button type="button" onClick={addSlot} className="bg-green-600 text-white px-3 py-2 rounded">
                ➕ Add Time Slot
              </button>
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Timetable</button>
          </form>
        )}
      </div>
    </>
  );
};

export default ManualTimetable;
