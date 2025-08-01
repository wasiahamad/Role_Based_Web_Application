import { useState, useContext } from 'react';
import axios from 'axios';
import { MyContext } from '../../App'; // For userData if needed
import {useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const context = useContext(MyContext);
  const Navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        '/api/v1/user/admin/create',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // optional if you are using cookies
        }
      );

      if (res.data.success) {
        Navigate('/admin');
        context.alertBox('success', res.data.message || 'User created successfully');
        setForm({ name: '', email: '', password: '', role: '' });
      } else {
        context.alertBox('error', res.data.message || 'Failed to create user');
      }
    } catch (err) {
      context.alertBox('error', err.response?.data?.message || 'Server error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Create User</h2>

      <input
        className="w-full border p-2 mb-3 rounded"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        className="w-full border p-2 mb-3 rounded"
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        className="w-full border p-2 mb-3 rounded"
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <select
        className="w-full border p-2 mb-3 rounded"
        name="role"
        value={form.role}
        onChange={handleChange}
      >
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        Create
      </button>
    </form>
  );
};

export default CreateUser;

