import { useContext, useState } from 'react';
import axios from 'axios';
import { MyContext } from '../../App';
import { Navigate } from 'react-router-dom';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const context = useContext(MyContext);

  const handleChange = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:3000/api/v1/user/change-password', { oldPassword, newPassword }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      Navigate('/welcome');
      console.log(response.data);
      context.alertBox('success', response.data.message);
    } catch (err) {
      console.error(err);
      context.alertBox('error', 'Error changing password');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleChange} className="bg-white p-8 rounded shadow w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Change Password</h2>
        <input className="w-full border p-2 rounded" type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
          required />
        <input className="w-full border p-2 rounded" type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        <button className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600" type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;