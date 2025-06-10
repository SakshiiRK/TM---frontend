// import React, { useEffect, useState } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import Navbar from '../../components/layout/Navbar';
// import axios from '../../services/api';

// const AdminCalendarView = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedRole, setSelectedRole] = useState('hod');
//   const [slots, setSlots] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const getDayName = (date) => {
//     return date.toLocaleDateString('en-US', { weekday: 'long' });
//   };

//   useEffect(() => {
//     const fetchSlots = async () => {
//       setLoading(true);
//       setError('');
//       const day = getDayName(selectedDate);
      
//       try {
//         const res = await axios.get(`/timetable/day/${day}`, {
//           params: { 
//             role: selectedRole,
//             date: selectedDate.toISOString().split('T')[0] // Add date parameter
//           },
//           headers: { 
//             'x-auth-token': localStorage.getItem('token') 
//           }
//         });
        
//         // Handle different response structures
//         let timetableData = [];
        
//         if (Array.isArray(res.data)) {
//           // If response is an array of timetable documents with timetableSlots
//           timetableData = res.data.flatMap(entry => 
//             entry.timetableSlots ? entry.timetableSlots : []
//           );
//         } 
//         // If response is a single document with timetableSlots array
//         else if (res.data.timetableSlots) {
//           timetableData = res.data.timetableSlots;
//         }
//         // Otherwise assume it's a flat array of slots
//         else {
//           timetableData = res.data;
//         }
        
//         setSlots(timetableData);
//       } catch (err) {
//         console.error("Timetable fetch error:", err);
//         setError('Failed to fetch timetable data');
//         setSlots([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSlots();
//   }, [selectedDate, selectedRole]);

//   return (
//     <>
//       <Navbar />
//       <div className="max-w-4xl mx-auto p-6">
//         <h2 className="text-2xl font-bold mb-4">Admin Calendar View</h2>

//         <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
//           <div>
//             <label className="mr-2 font-semibold">Select Role:</label>
//             <select
//               value={selectedRole}
//               onChange={(e) => setSelectedRole(e.target.value)}
//               className="border p-2 rounded"
//             >
//               <option className=' text-black' value="hod">HOD</option>
//               <option className=' text-black' value="faculty">Faculty</option>
//               <option className=' text-black' value="student">Student</option>
//             </select>
//           </div>
          
//           <div className="text-sm text-gray-600">
//             Showing timetable for: {selectedRole.toUpperCase()} role
//           </div>
//         </div>

//         <Calendar
//           onChange={setSelectedDate}
//           value={selectedDate}
//           className="mb-6 mx-auto"
//         />

//         <div className="mt-6">
//           <h3 className="text-xl font-semibold mb-4">
//             {selectedRole.toUpperCase()} Timetable for {getDayName(selectedDate)} 
//             <span className="font-normal"> ({selectedDate.toDateString()})</span>
//           </h3>

//           {loading ? (
//             <div className="text-center py-8">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
//               <p className="mt-2">Loading timetable...</p>
//             </div>
//           ) : error ? (
//             <div className="bg-red-50 text-red-700 p-4 rounded border border-red-200">
//               {error}
//             </div>
//           ) : slots.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {slots.map((slot, index) => (
//                 <div key={index} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
//                   <p className="font-medium text-indigo-700">{slot.time}</p>
//                   <div className="mt-2 space-y-1">
//                     <p className=' text-black'><span className="text-gray-600">Course:</span> {slot.courseCode} - {slot.courseName}</p>
//                     {slot.facultyName && <p className=' text-black'><span className="text-gray-600">Faculty:</span> {slot.facultyName}</p>}
//                     {slot.roomNo && <p className=' text-black'><span className="text-gray-600">Room:</span> {slot.roomNo}</p>}
//                     {slot.section && <p><span className="text-gray-600">Section:</span> {slot.section}</p>}
//                     {slot.roundingsTime && <p className=' text-black'><span className="text-gray-600">Roundings:</span> {slot.roundingsTime}</p>}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="bg-gray-50 text-gray-600 p-6 rounded-lg border border-gray-200 text-center">
//               <p>No timetable entries found for this role on {getDayName(selectedDate)}</p>
//               <p className="mt-2 text-sm">Try selecting a different date or role</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default AdminCalendarView;
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Navbar from '../../components/layout/Navbar';
import axios from '../../services/api';

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
    if (window.confirm("Are you sure you want to delete this timetable entry?")) {
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

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Calendar View</h2>

        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div>
            <label className="mr-2 font-semibold">Select Role:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border p-2 rounded"
            >
              <option className="text-black" value="hod">HOD</option>
              <option className="text-black" value="faculty">Faculty</option>
              <option className="text-black" value="student">Student</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Showing timetable for: {selectedRole.toUpperCase()} role
          </div>
        </div>

        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="mb-6 mx-auto"
        />

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">
            {selectedRole.toUpperCase()} Timetable for {getDayName(selectedDate)} 
            <span className="font-normal"> ({selectedDate.toDateString()})</span>
          </h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              <p className="mt-2">Loading timetable...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded border border-red-200">
              {error}
            </div>
          ) : slots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slots.map((slot, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <p className="font-medium text-indigo-700">{slot.time}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-black"><span className="text-gray-600">Course:</span> {slot.courseCode} - {slot.courseName}</p>
                    {slot.facultyName && <p className="text-black"><span className="text-gray-600">Faculty:</span> {slot.facultyName}</p>}
                    {slot.roomNo && <p className="text-black"><span className="text-gray-600">Room:</span> {slot.roomNo}</p>}
                    {slot.section && <p><span className="text-gray-600">Section:</span> {slot.section}</p>}
                    {slot.roundingsTime && <p className="text-black"><span className="text-gray-600">Roundings:</span> {slot.roundingsTime}</p>}
                    {slot._id && (
                      <button
                        onClick={() => handleDelete(slot._id)}
                        className="mt-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 text-gray-600 p-6 rounded-lg border border-gray-200 text-center">
              <p>No timetable entries found for this role on {getDayName(selectedDate)}</p>
              <p className="mt-2 text-sm">Try selecting a different date or role</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminCalendarView;
