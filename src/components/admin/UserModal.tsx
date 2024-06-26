// components/UserModal.tsx
import React, { useState, useEffect } from 'react';

const UserModal = ({ isOpen, onClose, onSave, user, mode }: { isOpen: boolean, onClose: () => void, onSave: (user: any) => void, user?: any, mode: 'create' | 'edit' }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: '', statusActive: true });

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData(user);
    } else {
      setFormData({ username: '', email: '', password: '', role: '', statusActive: true });
    }
  }, [user, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 text-black">
        <h2 className="text-xl mb-4">{mode === 'edit' ? 'Edit User' : 'Create User'}</h2>
        <input
          type="text"
          name="username"
          className="w-full p-2 mb-2 border rounded"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          className="w-full p-2 mb-2 border rounded"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {mode === 'create' && (
          <input
            type="password"
            name="password"
            className="w-full p-2 mb-2 border rounded"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        )}
        {mode === 'edit' && (
          <>
            <input
              type="text"
              name="role"
              className="w-full p-2 mb-2 border rounded"
              placeholder="Role"
              value={formData.role}
              onChange={handleChange}
            />
          </>
        )}
        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
