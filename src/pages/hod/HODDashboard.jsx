import React from 'react';
import Navbar from '../../components/layout/Navbar';


const HODDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h2 className="dashboard-heading">Welcome, {user?.name || 'HOD'}</h2>
          <p className="dashboard-subtext">
            You are logged in as <strong>{user?.role?.toUpperCase()}</strong>
            <br />
            Department: <strong>{user?.department}</strong>
          </p>
        </div>
      </div>
    </>
  );
};

export default HODDashboard;
