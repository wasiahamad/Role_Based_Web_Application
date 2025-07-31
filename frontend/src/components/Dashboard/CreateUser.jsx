import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateUser = () => {
  const [form, setForm] = useState({ username: '', password: '', role: 'student' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', form);
      toast.success('User created');
    } catch {
      toast.error('Error creating user');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create User</h2>
      <input className="w-full border p-2 mb-3 rounded" name="username" placeholder="Username" onChange={handleChange} />
      <input className="w-full border p-2 mb-3 rounded" name="password" type="password" placeholder="Password" onChange={handleChange} />
      <select className="w-full border p-2 mb-3 rounded" name="role" onChange={handleChange}>
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>
      <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Create</button>
    </form>
  );
};

export default CreateUser;
