// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoHome, IoCalendar, IoLogOut, IoGrid } from 'react-icons/io5'; // Using react-icons for modern look

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';
  const isFaculty = user?.role === 'faculty';
  const isHOD = user?.role === 'hod';

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user session
    navigate('/'); // Redirect to login/home
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand/Logo */}
        <div className="flex items-center gap-2">
          <svg className="w-8 h-8 text-indigo-400 transform rotate-45" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10l10 5l10-5V7L12 2zm0 2.316l7.469 3.735L12 11.785l-7.469-3.735L12 4.316zM4 9.932l7 3.5v7.136l-7-3.5V9.932zm8 10.735l-7-3.5v-7.136l7 3.5v7.136zm8-10.735l-7 3.5v7.136l7-3.5V9.932z"/>
          </svg>
          <span className="text-2xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 transition-all duration-300 hover:scale-105">
            Timetable Management
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {/* Home Link with Icon */}
          <NavLink to={isAdmin ? "/dashboard" : `/${user?.role}`} icon={IoHome} label="Home" />

          {/* Dashboard Links with Icon */}
          {isAdmin && <NavLink to="/admin-dashboard" icon={IoGrid} label="Dashboard" />}
          {isStudent && <NavLink to="/student-view" icon={IoGrid} label="Dashboard" />}
          {isFaculty && <NavLink to="/faculty-view" icon={IoGrid} label="Dashboard" />}
          {isHOD && <NavLink to="/hod-view" icon={IoGrid} label="Dashboard" />}

          {/* Calendar Link with Icon */}
          {isAdmin && <NavLink to="/admin-calendar" icon={IoCalendar} label="Calendar" />}
          {/* {(isStudent || isFaculty || isHOD) && (
            <NavLink to="/calendar-view" icon={IoCalendar} label="Calendar" />
          )} */}

          {/* Logout Button with Icon */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 group"
          >
            <IoLogOut className="text-xl group-hover:animate-shake" /> {/* Icon with subtle animation */}
            <span className="hidden sm:inline">Logout</span> {/* Hide text on small screens */}
          </button>
        </div>
      </div>
    </nav>
  );
};

// Helper component for consistent NavLink styling
const NavLink = ({ to, icon: Icon, label }) => (
  <Link
    to={to}
    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 group relative overflow-hidden"
  >
    <span className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none"></span> {/* Subtle hover overlay */}
    {Icon && <Icon className="text-xl text-indigo-400 group-hover:text-indigo-300 transition-colors duration-200 z-10" />}
    <span className="font-medium z-10">{label}</span>
  </Link>
);

export default Navbar;