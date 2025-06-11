import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';

import { FaUserShield, FaBuilding, FaUserCog, FaLightbulb, FaChartBar, FaUsers, FaGraduationCap, FaClipboardList } from 'react-icons/fa'; // Relevant icons for HOD

// A collection of inspiring thoughts/quotes for the dashboard (can be tailored for leadership)
const dailyInsights = [
  "Leadership is not about being in charge. It is about taking care of those in your charge.",
  "The true sign of intelligence is not knowledge but imagination.",
  "Strive not to be a success, but rather to be of value.",
  "Great leaders don't set out to be a leader. They set out to make a difference.",
  "The only way to do great work is to love what you do.",
  "Management is doing things right; leadership is doing the right things.",
  "A leader is one who knows the way, goes the way, and shows the way."
];

const HODDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [currentInsight, setCurrentInsight] = useState('');

  // Select a random insight on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * dailyInsights.length);
    setCurrentInsight(dailyInsights[randomIndex]);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Main Dashboard Card */}
        <div className="bg-gray-800/90 rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-700 backdrop-blur-sm max-w-2xl mx-auto text-center transform transition-all duration-700 opacity-0 animate-fade-in-scale-up">
          
          <div className="mb-8 flex flex-col items-center justify-center">
            {/* HOD Profile Icon */}
            <FaUserShield className="text-cyan-400 text-6xl mb-4 animate-pop-in" /> 
            
            {/* Professional Welcome Heading */}
            {/* Adjusted font sizing for balance and professionalism */}
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-2 animate-fade-in-down">
              Welcome, <span className="text-teal-300 font-extrabold">{user?.name || 'HOD'}</span>!
            </h2>
            
            {/* Subtitle */}
            <p className="text-gray-400 text-lg sm:text-xl font-light animate-fade-in-up">
              Departmental Oversight and Strategic Management Hub
            </p>
          </div>

          {/* User Details Section - Compact and well-structured */}
          <div className="border-t border-gray-700 pt-8 mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="dashboard-info-item animate-stagger-fade-in" style={{ animationDelay: '0.6s' }}>
              <FaUserCog className="text-blue-300 text-xl" />
              <p className="text-left">
                <span className="text-gray-300 text-base font-medium">Role: </span>
                <strong className="text-white text-lg font-semibold">{user?.role?.toUpperCase()}</strong>
              </p>
            </div>
            
            {user?.department && (
              <div className="dashboard-info-item animate-stagger-fade-in" style={{ animationDelay: '0.8s' }}>
                <FaBuilding className="text-green-300 text-xl" />
                <p className="text-left">
                  <span className="text-gray-300 text-base font-medium">Department: </span>
                  <strong className="text-white text-lg font-semibold">{user.department}</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- Creative Info Cards Section for HOD --- */}
        <div className="mt-16 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Daily Insight Card */}
          <div className="info-card bg-gradient-to-br from-gray-700 to-gray-800 animate-fade-in-scale-up" style={{ animationDelay: '1.0s' }}>
            <h3 className="card-title text-yellow-300">
              <FaLightbulb className="text-3xl animate-pulse-light" /> Daily Insight
            </h3>
            <p className="card-content italic">
              "{currentInsight}"
            </p>
          </div>

          {/* Department Overview Card */}
          <div className="info-card bg-gradient-to-br from-blue-700 to-blue-800 animate-fade-in-scale-up" style={{ animationDelay: '1.2s' }}>
            <h3 className="card-title text-blue-200">
              <FaChartBar className="text-3xl text-blue-300" /> Department Overview
            </h3>
            <p className="card-content">
              **Total Faculty: 25**
              <br/>
              **Active Students: 450**
              <br/>
              **Courses Offered: 30**
              <br/>
              View key statistics and performance.
            </p>
            <p className="card-cta text-blue-400">View Analytics &rarr;</p>
          </div>

          {/* Faculty Management Card */}
          <div className="info-card bg-gradient-to-br from-purple-700 to-purple-800 animate-fade-in-scale-up" style={{ animationDelay: '1.4s' }}>
            <h3 className="card-title text-purple-200">
              <FaUsers className="text-3xl text-purple-300" /> Faculty Management
            </h3>
            <p className="card-content">
              Manage faculty profiles, assign courses, and oversee workloads.
              <br/>
              **Pending Approvals: 3**
            </p>
            <p className="card-cta text-purple-400">Manage Faculty &rarr;</p>
          </div>

          {/* Student Performance Insights Card */}
          <div className="info-card bg-gradient-to-br from-orange-700 to-orange-800 animate-fade-in-scale-up" style={{ animationDelay: '1.6s' }}>
            <h3 className="card-title text-orange-200">
              <FaGraduationCap className="text-3xl text-orange-300" /> Student Insights
            </h3>
            <p className="card-content">
              Monitor student academic performance and identify areas for support.
              <br/>
              **At-Risk Students: 12**
            </p>
            <p className="card-cta text-orange-400">View Student Reports &rarr;</p>
          </div>

          {/* Academic Planning & Timetable Card */}
          <div className="info-card bg-gradient-to-br from-emerald-700 to-emerald-800 animate-fade-in-scale-up" style={{ animationDelay: '1.8s' }}>
            <h3 className="card-title text-emerald-200">
              <FaClipboardList className="text-3xl text-emerald-300" /> Academic Planning
            </h3>
            <p className="card-content">
              Oversee course scheduling, resource allocation, and curriculum development.
              <br/>
              **Upcoming Reviews: 2**
            </p>
            <p className="card-cta text-emerald-400">Manage Planning &rarr;</p>
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
        
        /* Specific animation delays for staggered appearance */
        .animation-delay-1000 { animation-delay: 1.0s !important; }
        .animation-delay-1200 { animation-delay: 1.2s !important; }
        .animation-delay-1400 { animation-delay: 1.4s !important; }
        .animation-delay-1600 { animation-delay: 1.6s !important; }
        .animation-delay-1800 { animation-delay: 1.8s !important; }


        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.7s ease-out forwards; animation-delay: 0.3s; }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.7s ease-out forwards; animation-delay: 0.5s; }

        /* --- Icon Pop-in Animation --- */
        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-pop-in { animation: pop-in 0.9s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; animation-delay: 0.1s; }

        /* --- Staggered Info Item Animation --- */
        @keyframes stagger-fade-in {
          from { opacity: 0; transform: translateX(-15px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-stagger-fade-in { animation: stagger-fade-in 0.6s ease-out forwards; }

        /* --- Daily Insight Bulb Pulse --- */
        @keyframes pulse-light {
          0% { transform: scale(1); text-shadow: 0 0 5px rgba(252,211,77,0.4); }
          50% { transform: scale(1.05); text-shadow: 0 0 15px rgba(252,211,77,0.8); }
          100% { transform: scale(1); text-shadow: 0 0 5px rgba(252,211,77,0.4); }
        }
        .animate-pulse-light { animation: pulse-light 2s ease-in-out infinite; }

        /* --- Dashboard Info Item Styling (User Details) --- */
        .dashboard-info-item {
          display: flex;
          align-items: center; 
          gap: 0.75rem; 
          padding: 0.75rem 1rem; 
          background: rgba(46, 52, 64, 0.4); 
          border-radius: 10px;
          border: 1px solid rgba(71, 85, 105, 0.6); 
          transition: all 0.25s ease-in-out;
          box-shadow: inset 0 1px 4px rgba(0,0,0,0.2);
          justify-content: flex-start; 
          text-align: left; 
        }
        .dashboard-info-item p {
            line-height: 1.3; 
        }
        .dashboard-info-item:hover {
          background: rgba(55, 65, 81, 0.6); 
          transform: translateY(-2px); 
          box-shadow: 0 4px 12px rgba(0,0,0,0.3); 
        }

        /* --- Creative Info Card Styling --- */
        .info-card {
          border-radius: 16px; /* Softer rounded corners */
          padding: 2rem; /* More generous padding */
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4); /* Stronger shadow */
          border: 1px solid rgba(113, 128, 150, 0.5); /* Subtle border */
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.3s ease-in-out;
          cursor: pointer;
        }

        .info-card:hover {
            transform: translateY(-5px) scale(1.02); /* Lift and slight scale */
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6); /* Deeper shadow on hover */
            border-color: rgba(129, 140, 248, 0.7); /* Subtle hover border color */
        }

        .card-title {
          font-size: 1.75rem; /* text-3xl */
          font-weight: 700; /* font-bold */
          margin-bottom: 1rem; /* mb-4 */
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem; /* gap-3 */
        }

        .card-content {
          font-size: 1.125rem; /* text-lg */
          line-height: 1.6; /* leading-relaxed */
          color: #CBD5E0; /* gray-300 */
          margin-bottom: 1.5rem; /* mb-6 */
        }

        .card-cta {
          font-size: 1rem; /* text-base */
          font-weight: 600; /* font-semibold */
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          opacity: 0.9;
          transition: opacity 0.2s ease-in-out;
        }

        .card-cta:hover {
          opacity: 1;
          text-decoration: underline;
        }
      `}</style>
    </>
  );
};

export default HODDashboard;