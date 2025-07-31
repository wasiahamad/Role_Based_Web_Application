// src/pages/Home.jsx
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to RBAuth Platform</h1>
      <p className="text-gray-600 mb-6">Manage users with role-based access using MERN stack.</p>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600">
          Login
        </Link>
        <Link to="/register" className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;