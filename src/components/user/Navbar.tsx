import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const Modal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [userData, setUserData] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    if (isOpen) {
      const token = Cookies.get('token'); // Obtén el token de la cookie
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el payload del token
        const username = payload.username; // Asume que el username está en el payload del token

        fetch(`http://localhost:3000/user/username/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Asegúrate de que el backend espera el token en este formato
          },
        })
        .then(response => response.json())
        .then(data => {
          setUserData({ ...userData, username: data.username, email: data.email });
        })
        .catch(error => console.error('Error fetching user data:', error));
      }
    }
  }, [isOpen]);

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const token = Cookies.get('token');
    const updateData = {
      username: userData.username, // Siempre incluye el username
     email: userData.email , // Incluye email si se ha proporcionado
      ...(userData.password && { password: userData.password }) // Incluye password si se ha proporcionado
    };
  
    fetch('http://localhost:3000/user/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(text => {
      try {
        const data = JSON.parse(text);
        console.log('Success:', data);
      } catch (err) {
        console.log('No JSON response received:', text);
      }
      onClose(); // Cierra el modal si la actualización es exitosa
    })
  };
  

  return (
    isOpen ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-blue-400 text-lg font-bold mb-4">Edit User</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-white mb-2">Username:</label>
              <input id="username" name="username" type="text" value={userData.username} className="w-full p-2 rounded border-gray-700 bg-gray-900 text-white" readOnly />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-white mb-2">Email:</label>
              <input id="email" name="email" type="email" value={userData.email} onChange={handleInputChange} className="w-full p-2 rounded border-gray-700 bg-gray-900 text-white" />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-white mb-2">Password:</label>
              <input id="password" name="password" type="password" value={userData.password} onChange={handleInputChange} className="w-full p-2 rounded border-gray-700 bg-gray-900 text-white" />
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
              Edit
            </button>
            <button type="button" onClick={onClose} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Close
            </button>
          </form>
        </div>
      </div>
    ) : null
  );
};

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <nav className="bg-gray-900 text-white p-3 flex justify-between">
    <div></div> {/* Esto es para empujar el botón hacia la derecha */}
    <button onClick={toggleModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Edit User
    </button>
    <Modal isOpen={isModalOpen} onClose={toggleModal} />
  </nav>
  
  );
};

export default Navbar;
