import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postData } from '../../utils/api';
import { MyContext } from '../../App';

const Login = () => {
  const navigate = useNavigate();
  const context = useContext(MyContext);

  // from backend data state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student", // default role
  });

  // function to handle input change
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData(() => {
      return {
        ...formData,
        [name]: value,
      };
    });
  };

  // function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // API call
    if (formData.role === "student") {
       const response = postData("/api/v1/user/login", formData);
       response.then((res) => {
         if (res.status === 200) {
           console.log("response", res);
           if (res?.error !== true) {
             context.alertBox("success", res?.message);
             localStorage.setItem("userEmail", formData.email);
             localStorage.setItem("userRole", res?.data?.role);
             localStorage.setItem("token", res?.token);
             localStorage.setItem("user", res?.data?.name);
             setFormData({
               email: "",
               password: "",
               role: "student", // reset role
             });
             navigate("/");
           } else {
             context.alertBox("error", res?.message);
           }
         }
       })
    } else {
      postData("/api/v1/user/login", formData)
        .then((res) => {
          console.log("response", res);
          if (res?.error !== true) {
            context.alertBox("success", res?.message);
            localStorage.setItem("userEmail", formData.email);
            localStorage.setItem("userRole", res?.data?.role);
            localStorage.setItem("token", res?.token);
            localStorage.setItem("user", res?.data?.name);
            setFormData({
              email: "",
              password: "",
              role: "", // reset role
            });
            navigate("/admin");
          } else {
            context.alertBox("error", res?.message);
          }
        });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          className="w-full border p-2 rounded"
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={onChangeInput}
          required
        />

        <input
          className="w-full border p-2 rounded"
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={onChangeInput}
          required
        />

        <select className="w-full border p-2 mb-3 rounded" value={formData.role} name="role" onChange={onChangeInput}>
          <option value="student" >Student</option>
          <option value="admin">Admin</option>
        </select>

        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600" type="submit">
          Login
        </button>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600">
          Not registered?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;