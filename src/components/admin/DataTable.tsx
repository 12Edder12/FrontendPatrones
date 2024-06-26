// components/DataTable.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import UserModal from './UserModal';
import AssignRoleModal from './AssignRoleModal';
import Cookies from 'js-cookie';

const DataTable = ({ users, loading, page, setPage, fetchUsers }: { users: any[], loading: boolean, page: number, setPage: (page: number) => void, fetchUsers: () => void }) => {
  const router = useRouter();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsUserModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const token = Cookies.get('token');
    try {
      await fetch(`http://localhost:3000/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  const handleSave = async (user: any) => {
    const token = Cookies.get('token');
    const method = modalMode === 'create' ? 'POST' : 'PUT';
    const url = modalMode === 'create' ? 'http://localhost:3000/admin/users' : `http://localhost:3000/admin/users/${user.id}`;
    const data = modalMode === 'create'
      ? { username: user.username, password: user.password, email: user.email }
      : { username: user.username, email: user.email, roleId: user.role };

    try {
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      fetchUsers();
    } catch (error) {
      console.error(`Failed to ${modalMode === 'create' ? 'create' : 'edit'} user`, error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 min-w-full">
      <div className="w-full max-w-7xl mb-4">
        <button
          onClick={() => router.push('/admin')}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Back to Admin
        </button>
        <button
          onClick={() => {
            setSelectedUser(null);
            setModalMode('create');
            setIsUserModalOpen(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Create User
        </button>
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
            <tr>
              <th className="w-1/5 py-2">Username</th>
              <th className="w-1/5 py-2">Email</th>
              <th className="w-1/5 py-2">Role</th>
              <th className="w-1/5 py-2">Status</th>
              <th className="w-1/5 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center text-black border-b border-gray-200">
                <td className="py-1">{user.username}</td>
                <td className="py-1">{user.email}</td>
                <td className="py-1">{user.role.join(', ')}</td>
                <td className="py-1">{user.statusActive ? 'Active' : 'Inactive'}</td>
                <td className="py-1 flex justify-center">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setIsRoleModalOpen(true);
                    }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Manage Roles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSave}
        user={selectedUser}
        mode={modalMode}
      />
      <AssignRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        userId={selectedUser?.id}
        fetchUsers={fetchUsers}
      />
    </div>
  );
};

export default DataTable;
