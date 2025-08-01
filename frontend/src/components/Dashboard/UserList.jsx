import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { MyContext } from '../../App';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const context = useContext(MyContext);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:3000/api/v1/user/all", {
        headers: {
          Authorization: `Bearer ${token}`,  // 🛡️ Token as Bearer
        },
        withCredentials: true  // Optional: If using cookies
      });

      setUsers(response?.data?.data);
      context.alertBox("success", response?.data?.message);
      console.log(response?.data);
    } catch (err) {
      console.error("Axios Error:", err);
      context.alertBox("error", "Error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`http://localhost:3000/api/v1/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // 🛡️ Token as Bearer
        },
        withCredentials: true  // Optional: If using cookies
      });
      console.log(response?.data);
      context.alertBox("success", response?.data?.message);
      fetchUsers();
    } catch (err) {
      console.error("Axios Error:", err);
      context.alertBox("error", "Error deleting user");
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <ul className="space-y-4" >
        {users.map(user => (
          <li key={user._id} className="bg-gray-100 p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">Name: {user.username}</p>
              <p className="text-gray-600">Email: {user.email}</p>
              <p className="text-gray-600">Role: {user.role}</p>
            </div>
            <div>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleDelete(user._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default UserList;