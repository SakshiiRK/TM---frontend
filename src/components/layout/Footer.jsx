import React from 'react';
import { FaCalendarCheck } from 'react-icons/fa'; // Importing a relevant icon

const Footer = () => (
  <footer className="w-full bg-gradient-to-r from-gray-950 to-gray-800 text-gray-400 py-6 mt-12 border-t border-gray-700 shadow-lg flex flex-col items-center justify-center text-sm sm:text-base">
    <div className="flex items-center space-x-3 mb-2">
      {/* Icon for a professional touch */}
      <FaCalendarCheck className="text-indigo-400 text-xl" />
      <span className="font-semibold text-gray-300">College Timetable System</span>
    </div>
    <p className="font-light text-gray-400">
      © {new Date().getFullYear()} All rights reserved.
    </p>
    {/* Optional: Add a subtle separator or more links here */}
    {/* <div className="mt-4 text-xs text-gray-500">
      <a href="/privacy" className="hover:text-indigo-400 px-2">Privacy Policy</a>
      <span className="mx-1">|</span>
      <a href="/terms" className="hover:text-indigo-400 px-2">Terms of Service</a>
    </div> */}
  </footer>
);

export default Footer;