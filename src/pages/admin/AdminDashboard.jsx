// src/pages/AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-gray-100 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Gradients/Shapes (for creative flair) */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-2xl w-full bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-lg border border-gray-700 rounded-2xl shadow-3xl p-8 sm:p-10 text-center transform transition-all duration-500 ease-out scale-95 hover:scale-100">
          <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
            Admin Hub
          </h2>
          <p className="mb-10 text-gray-300 text-xl font-light">
            Your central station for precise timetable management.
          </p>

          <div className="flex justify-center">
            {/* Manual Entry Card - now the sole focus */}
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-10 rounded-xl shadow-2xl border border-gray-600 hover:border-indigo-500 transform hover:scale-[1.03] transition-all duration-300 ease-in-out flex flex-col items-center justify-center w-full max-w-sm cursor-pointer group">
              <span className="text-7xl mb-6 transform group-hover:rotate-6 transition-transform duration-300 ease-out" role="img" aria-label="manual-entry">✏️</span>
              <h3 className="text-2xl font-bold text-indigo-300 mb-4 group-hover:text-indigo-200 transition-colors duration-300">
                Create New Entry
              </h3>
              <p className="text-gray-300 text-md mb-8 leading-relaxed">
                Seamlessly add individual timetable records for faculty, students, or HODs with precision.
              </p>
              <button
                onClick={() => navigate('/manual-entry')}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-extrabold py-4 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-75 focus:ring-offset-2 focus:ring-offset-gray-800 text-xl"
              >
                Start Manual Entry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind CSS for Blob Animation (add this to your main CSS file if not already globally defined) */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); /* A stronger, deeper shadow */
        }
      `}</style>
    </>
  );
};

export default AdminDashboard;