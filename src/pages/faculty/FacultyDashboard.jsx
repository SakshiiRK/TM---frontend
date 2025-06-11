import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import { FaUserCircle, FaBuilding, FaGraduationCap, FaLightbulb } from 'react-icons/fa'; // Streamlined icons

// A collection of inspiring thoughts/quotes for the dashboard
const dailyInsights = [
  "The only way to do great work is to love what you do.",
  "Education is the most powerful weapon which you can use to change the world.",
  "The beautiful thing about learning is that no one can take it away from you.",
  "Strive not to be a success, but rather to be of value.",
  "The mind is not a vessel to be filled, but a fire to be kindled.",
  "Teaching is the highest form of understanding.",
  "Every student can learn, just not on the same day or in the same way."
];

const FacultyDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [currentInsight, setCurrentInsight] = useState('');

  // Select a random insight on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * dailyInsights.length);
    setCurrentInsight(dailyInsights[randomIndex]);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        
        {/* Main Dashboard Card */}
        <div className="bg-gray-800/90 rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-700 backdrop-blur-sm max-w-2xl mx-auto text-center transform transition-all duration-700 opacity-0 animate-fade-in-scale-up">
          
          <div className="mb-8 flex flex-col items-center justify-center">
            {/* User Profile Icon */}
            <FaUserCircle className="text-indigo-400 text-6xl mb-4 animate-pop-in" /> 
            
            {/* Professional Welcome Heading */}
            {/* Reduced name size slightly by making the span text-4xl from text-5xl, keeping parent heading scale */}
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-2 animate-fade-in-down">
              Welcome, <span className="text-teal-300 font-extrabold">{user?.name || 'Faculty'}</span>!
            </h2>
            
            {/* Subtitle */}
            <p className="text-gray-400 text-lg sm:text-xl font-light animate-fade-in-up">
              Your Professional Hub for Academic Management
            </p>
          </div>

          {/* User Details Section - More compact and creative */}
          {/* Using a grid for better layout on larger screens, and flex for smaller */}
          <div className="border-t border-gray-700 pt-8 mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="dashboard-info-item animate-stagger-fade-in" style={{ animationDelay: '0.6s' }}>
              <FaGraduationCap className="text-blue-300 text-xl" /> {/* Icon size reduced */}
              <p className="text-left">
                <span className="text-gray-300 text-base font-medium">Role: </span>
                <strong className="text-white text-lg font-semibold tracking-wide">{user?.role?.toUpperCase()}</strong> {/* Text size reduced */}
              </p>
            </div>
            
            {user?.department && (
              <div className="dashboard-info-item animate-stagger-fade-in" style={{ animationDelay: '0.8s' }}>
                <FaBuilding className="text-green-300 text-xl" /> {/* Icon size reduced */}
                <p className="text-left">
                  <span className="text-gray-300 text-base font-medium">Department: </span>
                  <strong className="text-white text-lg font-semibold tracking-wide">{user.department}</strong> {/* Text size reduced */}
                </p>
              </div>
            )}
            
          </div>
        </div>

        {/* --- Daily Insight Card --- */}
        <div className="mt-12 bg-gray-800/90 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-700 backdrop-blur-sm max-w-xl mx-auto text-center transform transition-all duration-700 opacity-0 animate-fade-in-scale-up animation-delay-1000">
          <h3 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center justify-center gap-3">
            <FaLightbulb className="text-3xl animate-pulse-light" /> Daily Insight
          </h3>
          <p className="text-gray-300 italic text-lg leading-relaxed">
            "{currentInsight}"
          </p>
        </div>

      </div>

      {/* Custom CSS for refined animations and specific styles */}
      <style jsx>{`
        /* --- General Card & Text Animations --- */
        @keyframes fade-in-scale-up {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale-up { animation: fade-in-scale-up 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards; }

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

        /* --- Utility for Staggered Animations --- */
        .animation-delay-1000 { animation-delay: 1s !important; }

        /* --- Dashboard Info Item Styling --- */
        .dashboard-info-item {
          display: flex;
          align-items: center; /* Vertically center items */
          gap: 0.75rem; /* Reduced gap for more compactness */
          padding: 0.75rem 1rem; /* Reduced padding */
          background: rgba(46, 52, 64, 0.4); /* Darker, slightly translucent background */
          border-radius: 10px;
          border: 1px solid rgba(71, 85, 105, 0.6); /* Refined border */
          transition: all 0.25s ease-in-out;
          box-shadow: inset 0 1px 4px rgba(0,0,0,0.2);
          
          /* Ensuring content aligns left within the item */
          justify-content: flex-start; /* Align content to the left inside the item */
          text-align: left; /* Ensure text inside <p> is left-aligned */
        }
        .dashboard-info-item p {
            line-height: 1.3; /* Adjust line height for compactness */
        }

        .dashboard-info-item:hover {
          background: rgba(55, 65, 81, 0.6); /* Slightly darker on hover */
          transform: translateY(-2px); /* Gentle lift */
          box-shadow: 0 4px 12px rgba(0,0,0,0.3); /* Enhanced shadow */
        }
      `}</style>
    </>
  );
};

export default FacultyDashboard;