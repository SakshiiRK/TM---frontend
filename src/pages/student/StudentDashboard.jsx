import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import { FaUserGraduate, FaBuilding, FaUserCog, FaLightbulb, FaCalendarDay, FaChartLine, FaLink } from 'react-icons/fa'; // Streamlined and relevant icons

// A collection of inspiring thoughts/quotes for the dashboard
const dailyInsights = [
  "The future belongs to those who believe in the beauty of their dreams.",
  "Learn as if you will live forever, live as if you will die today.",
  "Your education is a dress rehearsal for a life that is yours to lead.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "The best way to predict the future is to create it.",
  "Study hard what interests you the most in the most undisciplined, irreverent and original manner.",
  "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle."
];

const StudentDashboard = () => {
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
            {/* User Profile Icon */}
            <FaUserGraduate className="text-pink-400 text-6xl mb-4 animate-pop-in" /> 
            
            {/* Professional Welcome Heading */}
            {/* Adjusted font sizing for balance and professionalism */}
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-2 animate-fade-in-down">
              Welcome, <span className="text-purple-300 font-extrabold">{user?.name || 'Student'}</span>!
            </h2>
            
            {/* Subtitle */}
            <p className="text-gray-400 text-lg sm:text-xl font-light animate-fade-in-up">
              Your Personalized Academic Companion
            </p>
          </div>

          {/* User Details Section - Compact and well-structured */}
          <div className="border-t border-gray-700 pt-8 mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
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

            {user?.section && (
              <div className="dashboard-info-item animate-stagger-fade-in" style={{ animationDelay: '1.0s' }}>
                <FaUserGraduate className="text-yellow-300 text-xl" />
                <p className="text-left">
                  <span className="text-gray-300 text-base font-medium">Section: </span>
                  <strong className="text-white text-lg font-semibold">{user.section}</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- Creative Info Cards Section --- */}
        <div className="mt-16 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Daily Insight Card */}
          <div className="info-card bg-gradient-to-br from-gray-700 to-gray-800 animate-fade-in-scale-up" style={{ animationDelay: '1.2s' }}>
            <h3 className="card-title text-yellow-300">
              <FaLightbulb className="text-3xl animate-pulse-light" /> Daily Insight
            </h3>
            <p className="card-content italic">
              "{currentInsight}"
            </p>
          </div>

          {/* Upcoming Classes Card */}
          <div className="info-card bg-gradient-to-br from-indigo-700 to-indigo-800 animate-fade-in-scale-up" style={{ animationDelay: '1.4s' }}>
            <h3 className="card-title text-indigo-200">
              <FaCalendarDay className="text-3xl text-indigo-300" /> Your Next Class
            </h3>
            <p className="card-content">
              **Tomorrow, 10:00 AM**
              <br/>
              **CS301 - Advanced Algorithms**
              <br/>
              Room: **C205** with Prof. Miller
            </p>
            <p className="card-cta text-indigo-400">View Full Schedule &rarr;</p>
          </div>

          {/* Academic Progress Snapshot Card */}
          <div className="info-card bg-gradient-to-br from-green-700 to-green-800 animate-fade-in-scale-up" style={{ animationDelay: '1.6s' }}>
            <h3 className="card-title text-green-200">
              <FaChartLine className="text-3xl text-green-300" /> Academic Progress
            </h3>
            <p className="card-content">
              **GPA: 3.85** (Current Semester)
              <br/>
              **Credits Completed: 90/120**
              <br/>
              You're on track for an excellent semester!
            </p>
            <p className="card-cta text-green-400">See Detailed Report &rarr;</p>
          </div>

          {/* Quick Resources Card */}
          <div className="info-card bg-gradient-to-br from-blue-700 to-blue-800 animate-fade-in-scale-up" style={{ animationDelay: '1.8s' }}>
            <h3 className="card-title text-blue-200">
              <FaLink className="text-3xl text-blue-300" /> Quick Links
            </h3>
            <ul className="card-content space-y-2 text-left">
              <li><a href="#" className="text-blue-300 hover:underline">Library Portal</a></li>
              <li><a href="#" className="text-blue-300 hover:underline">Exam Schedule</a></li>
              <li><a href="#" className="text-blue-300 hover:underline">Course Catalogs</a></li>
              <li><a href="#" className="text-blue-300 hover:underline">Support Services</a></li>
            </ul>
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
        .animation-delay-1000 { animation-delay: 1s !important; }
        /* Add specific delays for other cards */
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

export default StudentDashboard;