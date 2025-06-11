// src/components/LoginRegister.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/api.js';
// import { useEffect } from 'react';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('hod');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    section: '',
    semester: '',
    faculty_id: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const loginPayload = {
          email: form.email,
          password: form.password,
        };

        if (role === 'faculty') {
          loginPayload.faculty_id = form.faculty_id;
        }

        const response = await axios.post('/auth/login', loginPayload);
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        alert('Login successful!');

        // Fixed navigation logic
        if (user.role === 'admin') navigate('/dashboard');
        else if (user.role === 'faculty') navigate('/faculty');
        else if (user.role === 'student') navigate('/student');
        else if (user.role === 'hod') navigate('/hod');

      } else {
        const registerPayload = {
          name: form.name,
          email: form.email,
          password: form.password,
          role: role.toLowerCase(),
        };

        if (role === 'student') {
          registerPayload.department = form.department;
          registerPayload.section = form.section;
          registerPayload.semester = form.semester;
        } else if (role === 'faculty') {
          registerPayload.department = form.department;
          registerPayload.faculty_id = form.faculty_id;
        } else if (role === 'hod') {
          registerPayload.department = form.department;
        }

        await axios.post('/auth/register', registerPayload);
        alert('Registration successful! You can now log in.');
        setIsLogin(true);
        resetForm();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };
//   useEffect(() => {
//   // Remove `dark` class from root HTML element
//   document.documentElement.classList.remove('dark');
// }, []);

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      department: '',
      section: '',
      semester: '',
      faculty_id: '',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-800 transition-colors duration-500">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-md transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-900 dark:text-white tracking-tight">
          {isLogin ? 'Welcome Back!' : 'Join Us Today!'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value.toLowerCase());
                    resetForm();
                  }}
                  className="w-full p-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-colors duration-200"
                  required
                >
                  <option value="hod">HOD</option>
                  <option value="faculty">Faculty</option>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>


              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 text-gray-800 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                required
              />

              {(role === 'faculty' || role === 'hod' || role === 'student') && (
                <input
                  type="text"
                  placeholder="Department (e.g., CSE, ECE)"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 text-gray-800 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  required
                />
              )}

              {role === 'student' && (
                <>
                  <input
                    type="text"
                    placeholder="Section (e.g., A, B)"
                    value={form.section}
                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 text-gray-800 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Semester (e.g., 1, 2, 3)"
                    value={form.semester}
                    onChange={(e) => setForm({ ...form, semester: e.target.value })}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 text-gray-800 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    required
                  />
                </>
              )}

              {role === 'faculty' && (
                <input
                  type="text"
                  placeholder="Faculty ID"
                  value={form.faculty_id}
                  onChange={(e) => setForm({ ...form, faculty_id: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 text-gray-800 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  required
                />
              )}
            </>
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 text-gray-800 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            required
          />

          {isLogin && role === 'faculty' && (
            <input
              type="text"
              placeholder="Faculty ID"
              value={form.faculty_id}
              onChange={(e) => setForm({ ...form, faculty_id: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 text-gray-800 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              required
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 text-gray-800 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium hover:underline transition-colors duration-200"
            onClick={() => {
              setIsLogin(!isLogin);
              resetForm();
            }}
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginRegister;