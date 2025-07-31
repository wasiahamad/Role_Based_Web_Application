import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="p-10 space-y-4">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <div className="space-x-4">
        <Link to="/admin/create-user" className="bg-blue-500 px-4 py-2 text-white rounded">Create User</Link>
        <Link to="/admin/users" className="bg-green-500 px-4 py-2 text-white rounded">View All Users</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
