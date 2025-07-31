import { useEffect, useState } from 'react';
import axios from 'axios';
import { showError, showSuccess } from '../Toast';

const UserList = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch {
      showError('Failed to fetch users');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/users/${id}`);
      showSuccess('User deleted');
      fetchUsers();
    } catch {
      showError('Delete failed');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user._id} className="flex justify-between items-center border p-3 rounded">
            <div>
              <p className="font-semibold">{user.username} ({user.role})</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <button onClick={() => handleDelete(user._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;