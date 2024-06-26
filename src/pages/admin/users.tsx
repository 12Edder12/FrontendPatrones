// pages/admin/users.tsx
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DataTable from '../../components/admin/DataTable';
import Cookies from 'js-cookie';

const UsersPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ username: '', role: '', statusActive: '' });

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/');
    } else {
      fetchUsers();
    }
  }, [user, page, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    const token = Cookies.get('token');
    try {
      const response = await fetch(`http://localhost:3000/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
    setLoading(false);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <div className="w-full max-w-4xl mb-4">
        <h1 className="text-4xl font-bold text-purple-700 mb-10 text-center">Users Management</h1>
        <div className="mb-4 text-black flex justify-center">
          <input
            type="text"
            name="username"
            className="p-2 border rounded mr-2"
            placeholder="Filter by username"
            value={filters.username}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="role"
            placeholder="Filter by role"
            value={filters.role}
            onChange={handleFilterChange}
            className="p-2 border rounded mr-2"
          />
          <select
            name="statusActive"
            value={filters.statusActive}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <DataTable users={users} loading={loading} page={page} setPage={setPage} fetchUsers={fetchUsers} />
      </div>
    </div>
  );
};

export default UsersPage;
