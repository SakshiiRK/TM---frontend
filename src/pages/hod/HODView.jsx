import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import API from '../../services/api';
import Calendar from 'react-calendar';
import '../../styles/calendar.css';

const HODView = () => {
  const [date, setDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchDepartmentTimetable = async (selectedDate) => {
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

    try {
      const res = await API.get(`/timetable/day/${dayName}`, {
        params: { role: 'hod' },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Flatten all timetableSlots from all faculty entries
      const allSlots = res.data.flatMap(entry =>
        entry.timetableSlots.map(slot => ({
          ...slot,
          facultyId: entry.facultyId,
          section: slot.section,
          semester: slot.semester,
        }))
      );

      setSlots(allSlots);
    } catch (err) {
      console.error('Failed to fetch department timetable:', err);
      setSlots([]);
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    fetchDepartmentTimetable(newDate);
  };

  useEffect(() => {
    fetchDepartmentTimetable(date);
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Department Timetable (HOD View)</h2>
        <p className="mb-4 text-gray-600">
          Viewing timetable for: <strong>{user.department}</strong><br />
          Date: {date.toLocaleDateString()}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-black">Select Date</h3>
            <Calendar
              onChange={handleDateChange}
              value={date}
              className="border rounded-lg p-2 w-full"
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-black">
              Department Schedule for {date.toLocaleDateString()}
            </h3>

            {slots.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                      {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {slots.map((t, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 whitespace-nowrap text-black">{t.time}</td>
                        <td className="px-4 py-2 text-black">{t.courseName}</td>
                        <td className="px-4 py-2 text-black">{t.facultyId}</td>
                        <td className="px-4 py-2 text-black">{t.roomNo}</td>
                        {/* <td className="px-4 py-2 text-black">{t.section}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="px-4 py-2 text-black">No classes scheduled for this date</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HODView;

// import React, { useState, useEffect } from 'react';
// import Navbar from '../../components/layout/Navbar';
// import API from '../../services/api';
// import Calendar from 'react-calendar';
// import '../../styles/calendar.css';

// const HODView = () => {
//   const [date, setDate] = useState(new Date());
//   const [facultySlots, setFacultySlots] = useState([]);
//   const [hodSlots, setHodSlots] = useState([]);
//   const user = JSON.parse(localStorage.getItem('user'));

//   const fetchTimetables = async (selectedDate) => {
//     const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

//     try {
//       // Fetch all department faculty timetables
//       const resFaculty = await API.get(`/timetable/day/${dayName}`, {
//         params: { role: 'faculty', department: user.department },
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       const facultyData = resFaculty.data.flatMap(entry =>
//         entry.timetableSlots.map(slot => ({
//           ...slot,
//           facultyId: entry.faculty_id || 'N/A',
//           section: slot.section,
//           semester: slot.semester
//         }))
//       );
//       setFacultySlots(facultyData);

//       // Fetch HOD's own timetable
//       const resHod = await API.get(`/timetable/day/${dayName}`, {
//         params: {
//           role: 'hod',
//           department: user.department,
//           faculty_id: user.faculty_id
//         },
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       const hodData = resHod.data.flatMap(entry =>
//         entry.timetableSlots.map(slot => ({
//           ...slot,
//           section: slot.section,
//           semester: slot.semester
//         }))
//       );
//       setHodSlots(hodData);

//     } catch (err) {
//       console.error('Error fetching timetables:', err);
//       setFacultySlots([]);
//       setHodSlots([]);
//     }
//   };

//   const handleDateChange = (newDate) => {
//     setDate(newDate);
//     fetchTimetables(newDate);
//   };

//   useEffect(() => {
//     fetchTimetables(date);
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <div className="p-6 max-w-7xl mx-auto">
//         <h2 className="text-2xl font-bold mb-6">HOD Dashboard - Department: {user.department}</h2>
//         <p className="mb-4 text-gray-600">Date: {date.toLocaleDateString()}</p>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Calendar */}
//           <div className="bg-white p-4 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold mb-4 text-black">Select Date</h3>
//             <Calendar
//               onChange={handleDateChange}
//               value={date}
//               className="border rounded-lg p-2 w-full"
//             />
//           </div>

//           {/* HOD's Own Timetable */}
//           <div className="col-span-1 md:col-span-1 bg-white p-4 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold mb-4 text-black">
//               Your Timetable (HOD)
//             </h3>
//             {hodSlots.length > 0 ? (
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Time</th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Course</th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Room</th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Section</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {hodSlots.map((slot, index) => (
//                     <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                       <td className="px-4 py-2 text-black">{slot.time}</td>
//                       <td className="px-4 py-2 text-black">{slot.courseName}</td>
//                       <td className="px-4 py-2 text-black">{slot.roomNo}</td>
//                       <td className="px-4 py-2 text-black">{slot.section}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p className="text-black">No classes scheduled for you</p>
//             )}
//           </div>

//           {/* Faculty Timetables */}
//           <div className="col-span-1 md:col-span-1 bg-white p-4 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold mb-4 text-black">
//               Department Faculty Timetables
//             </h3>
//             {facultySlots.length > 0 ? (
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Time</th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Course</th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Faculty</th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Room</th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Section</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {facultySlots.map((slot, index) => (
//                     <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                       <td className="px-4 py-2 text-black">{slot.time}</td>
//                       <td className="px-4 py-2 text-black">{slot.courseName}</td>
//                       <td className="px-4 py-2 text-black">{slot.facultyId || "N/A"}</td>
//                       <td className="px-4 py-2 text-black">{slot.roomNo}</td>
//                       <td className="px-4 py-2 text-black">{slot.section || "N/A"}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p className="text-black">No faculty classes scheduled</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default HODView;
