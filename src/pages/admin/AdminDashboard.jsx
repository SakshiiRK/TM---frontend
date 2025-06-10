// src/pages/AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';


const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
        <p className="mb-4 text-gray-700">Select a task below:</p>
        <div className="admin-buttons">
          {/* <button className="btn btn-blue" onClick={() => navigate('/admin-upload')}>
            ⬆ Upload New Timetable
          </button> */}
          {/* <button className="btn btn-purple" onClick={() => navigate('/admin-view/hod')}>
            View HOD Timetables
          </button>
          <button className="btn btn-green" onClick={() => navigate('/admin-view/faculty')}>
             View Faculty Timetables
          </button>
          <button className="btn btn-blue" onClick={() => navigate('/admin-view/student')}>
             View Student Timetables
          </button> */}
          <button onClick={() => navigate('/manual-entry')} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">
   Add Timetable Manually
</button>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
