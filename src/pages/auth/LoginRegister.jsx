// src/components/LoginRegister.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/api.js';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          {isLogin ? 'Login' : 'Register'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value.toLowerCase());
                  resetForm();
                }}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                required
              >
                <option value="hod">HOD</option>
                <option value="faculty">Faculty</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>

              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                required
              />

              {(role === 'faculty' || role === 'hod' || role === 'student') && (
                <input
                  type="text"
                  placeholder="Department"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="input"
                  required
                />
              )}

              {role === 'student' && (
                <>
                  <input
                    type="text"
                    placeholder="Section"
                    value={form.section}
                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                    className="input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Semester"
                    value={form.semester}
                    onChange={(e) => setForm({ ...form, semester: e.target.value })}
                    className="input"
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
                  className="input"
                  required
                />
              )}
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input"
            required
          />

          {isLogin && role === 'faculty' && (
            <input
              type="text"
              placeholder="Faculty ID"
              value={form.faculty_id}
              onChange={(e) => setForm({ ...form, faculty_id: e.target.value })}
              className="input"
              required
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input"
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            className="text-indigo-600 hover:underline dark:text-indigo-400"
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

