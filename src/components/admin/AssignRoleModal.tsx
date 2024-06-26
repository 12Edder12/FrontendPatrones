// components/AssignRoleModal.tsx
import React, { useState } from 'react';
import Cookies from 'js-cookie';

const AssignRoleModal = ({ isOpen, onClose, userId, fetchUsers }: { isOpen: boolean, onClose: () => void, userId: number, fetchUsers: () => void }) => {
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedRoles(prev => 
      checked ? [...prev, Number(value)] : prev.filter(roleId => roleId !== Number(value))
    );
  };

  const handleSubmit = async () => {
    const token = Cookies.get('token');
    try {
      await fetch(`http://localhost:3000/admin/users/assign-roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, roleIds: selectedRoles }),
      });
      fetchUsers();
      onClose();
    } catch (error) {
      console.error('Failed to assign roles', error);
    }
  };

  const handleRemoveAllRoles = async () => {
    const token = Cookies.get('token');
    try {
      await fetch(`http://localhost:3000/admin/users/remove-roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId , roleIds: selectedRoles}),
      });
      fetchUsers();
      onClose();
    } catch (error) {
      console.error('Failed to remove roles', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 text-black">
        <h2 className="text-xl mb-4">Assign Roles</h2>
        <div className="mb-4">
          <label className="block mb-2">
            <input type="checkbox" value="1" onChange={handleRoleChange} />
            Admin
          </label>
          <label className="block mb-2">
            <input type="checkbox" value="2" onChange={handleRoleChange} />
            User
          </label>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={handleSubmit}
          >
            Assign
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleRemoveAllRoles}
          >
            Remove Selected Roles
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRoleModal;
