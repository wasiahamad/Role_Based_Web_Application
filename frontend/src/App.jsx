import { createContext, useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { getData } from "./utils/api";
import Home from "./pages/Home";
import Welcome from "./components/Dashboard/Welcome";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ChangePassword from "./components/Auth/ChangePassword";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import CreateUser from "./components/Dashboard/CreateUser";
import UserList from "./components/Dashboard/UserList";

// react toast alert function
const alertBox = (status, msg) => {
  if (status === "success") {
    toast.success(msg);
  } else {
    toast.error(msg);
  }
};

const MyContext = createContext();
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
   
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }else {
      setIsLoggedIn(false);
    }
  }, []);

  const value = {
    alertBox,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData
  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={value}>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} /> {/* 🆕 Public Homepage */}
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/create-user" element={<CreateUser />} />
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
        </MyContext.Provider>
      </BrowserRouter>

      <Toaster />
    </>
  );
}

export default App;
export { MyContext };