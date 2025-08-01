import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaUserGraduate } from 'react-icons/fa';
import { MyContext } from '../../App';

const Welcome = () => {
  const userEmail = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  const { user, isAdmin } = useContext(MyContext);

  const handleRedirect = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-100 to-blue-50">
      <div className="bg-white shadow-lg rounded-xl p-10 w-[90%] max-w-xl text-center space-y-6">
        <div className="flex justify-center">
          {isAdmin ? (
            <FaUserShield className="text-blue-600 text-6xl" />
          ) : (
            <FaUserGraduate className="text-green-500 text-6xl" />
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.username}!
        </h1>
        <p className="text-lg text-gray-600">
          You are logged in as {userEmail || 'Guest'}.
          <span className={`font-semibold ${isAdmin ? 'text-blue-600' : 'text-green-600'}`}>
            {user?.role}
          </span>
        </p>

        <p className="text-sm text-gray-500">
          {isAdmin
            ? 'You can manage users, assign roles, and perform administrative tasks.'
            : 'Explore the platform as a student. Contact admin for additional access.'}
        </p>

        <button
          onClick={handleRedirect}
          className={`mt-4 px-6 py-2 rounded-lg text-white font-medium ${
            isAdmin ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isAdmin ? 'Go to Dashboard' : 'Go to Home'}
        </button>
      </div>
    </div>
  );
};

export default Welcome;
