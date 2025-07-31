import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { showError, showSuccess } from '../Toast';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', { email, username, password });
      showSuccess('Registration successful');
      navigate('/login');
    } catch {
      showError('Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full border p-2 rounded" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600" type="submit">Register</button>
        <p className="text-sm text-center">Already registered? <Link className="text-blue-600" to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;