import React from 'react';
import Navbar from '../../components/layout/Navbar';


const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h2 className="dashboard-heading">Welcome, {user?.name || 'Student'}</h2>
          <p className="dashboard-subtext">
            You are logged in as <strong>{user?.role?.toUpperCase()}</strong>
            <br />
            Department: <strong>{user?.department}</strong>
            <br />
            Section: <strong>{user?.section}</strong>
          </p>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
