// // src/components/Navbar.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   const user = JSON.parse(localStorage.getItem('user'));

//   const isAdmin = user?.role === 'admin';
//   const isStudent = user?.role === 'student';
//   const isFaculty = user?.role === 'faculty';
//   const isHOD = user?.role === 'hod';

//   return (
//     <nav className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4 flex justify-between items-center">
//       <div className="flex items-center gap-4">
//         <span className="text-xl font-bold">Timetable Manager</span>
//       </div>

//       <div className="space-x-4 flex items-center">
//         {isAdmin && <Link to="/dashboard">Home</Link>}
//         {isStudent && <Link to="/student">Home</Link>}
//         {isFaculty && <Link to="/faculty">Home</Link>}
//         {isHOD && <Link to="/hod">Home</Link>}

//         {isAdmin && <Link to="/admin-dashboard">Dashboard</Link>}
//         {isStudent && <Link to="/student-view">Dashboard</Link>}
//         {isFaculty && <Link to="/faculty-view">Dashboard</Link>}
//         {isHOD && <Link to="/hod-view">Dashboard</Link>}
//         {isAdmin && <Link to="/admin-calendar">Calendar View</Link>}

//         {(isStudent || isFaculty || isHOD) && (
//           <Link to="/calendar-view">Calendar</Link>
//         )}

//         <Link to="/">Logout</Link>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';
  const isFaculty = user?.role === 'faculty';
  const isHOD = user?.role === 'hod';

  const handleLogout = () => {
    localStorage.removeItem('user'); //  Clear user session
    navigate('/'); //  Redirect to login/home
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold">Timetable Manager</span>
      </div>

      <div className="space-x-4 flex items-center">
        {/* Unified Home link */}
        <Link to={isAdmin ? "/dashboard" : `/${user?.role}`}>Home</Link>

        {/* Dashboard links */}
        {isAdmin && <Link to="/admin-dashboard">Dashboard</Link>}
        {isStudent && <Link to="/student-view">Dashboard</Link>}
        {isFaculty && <Link to="/faculty-view">Dashboard</Link>}
        {isHOD && <Link to="/hod-view">Dashboard</Link>}

        {/* Calendar links */}
        {isAdmin && <Link to="/admin-calendar">Calendar</Link>}
        {/* {(isStudent || isFaculty || isHOD) && (
          <Link to="/calendar-view">Calendar</Link>
        )} */}

        {/* Logout as button */}
        <button onClick={handleLogout} className="text-white underline">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
