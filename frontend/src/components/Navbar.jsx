import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { MyContext } from '../App';
import { postData } from '../utils/api';

const Navbar = () => {
  const { isLoggedIn, userData, setIsLoggedIn, alertBox } = useContext(MyContext);
  const [formData, setFormData] = useState({
      email: "",
      password: "",
      role: "",
    });

    localStorage.setItem("userRole", formData.role);
    console.log( " userRole", formData.role);

  const logout = () => {
    postData("/api/v1/user/logout", { withCredentials: true }).then((res) => {
      if (res?.error !== true) {
        alertBox("success", res?.message);
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        setIsLoggedIn(false);
        window.location.href = "/";
      }
    });
  };



  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">RBAuth</Link>

      <div className="space-x-4 text-sm md:text-base flex items-center">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-green-500">Register</Link>
          </>
        ) : (
          <>
            {/* ✅ Admin-only links */}
            {localStorage.getItem("userRole") !== "student" && (
              <>
                {/* <Link to="/change-password" className="text-gray-700 hover:text-yellow-500">Change Password</Link> */}
                <Link to="/admin" className="text-gray-700 hover:text-blue-500">Dashboard</Link>
              </>
            )}

            {/* ✅ For non-admin users: Show only Change Password */}
            {userData?.role !== "admin" && (
              <Link to="/change-password" className="text-gray-700 hover:text-yellow-500">Change Password</Link>
            )}

            {/* ✅ Show user name/email */}
            <span className="text-gray-600">{userData?.name || userData?.email}</span>

            <button
              onClick={logout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

