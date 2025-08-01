import { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { postData } from '../../utils/api';
import { MyContext } from '../../App';

const Register = () => {
  const navigate = useNavigate();
  const context = useContext(MyContext);
  // from backend data state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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

  // passwors visibility function
    const isStrongPassword = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    };

// const context = useContext(AuthContext);
  //  function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // setLoading(true);

    // check validation here
    const password = formData.password;
    if (password.length < 8) {
      return context.alertBox("error", "Password must be at least 8 characters long");

    }

    // Password strength check
    if (!isStrongPassword(password)) {
      return context.alertBox("error", "Password must include uppercase, lowercase, and number");
    }

    // API call
    postData("/api/v1/user/register", formData)
      .then((res) => {
        console.log("response", res);
        if (res?.error !== true) {
          (res?.message);
          localStorage.setItem("userEmail", formData.email);
          setFormData({
            name: "",
            email: "",
            password: "",
          });
          navigate("/login");
        } else {
          context.alertBox("error", res?.message);
        }
      });
  };

  console.log("formData...", formData);


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <input
          className="w-full border p-2 rounded"
          placeholder="Name"
          value={formData.name}
          type="text"
          name='name'
          onChange={onChangeInput}
          required />

        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          type="email"
          name='email'
          value={formData.email}
          onChange={onChangeInput}
          required />

        <input
          className="w-full border p-2 rounded"
          type="password"
          name='password'
          placeholder="Password"
          value={formData.password}
          onChange={onChangeInput}
          required />
        <button
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600" type="submit">Register</button>
        <p
          className="text-sm text-center">Already registered? <Link className="text-blue-600" to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;