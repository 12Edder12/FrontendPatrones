import { useState, useEffect } from 'react';
import { IServer } from '../types/IServer';
import Cookies from 'js-cookie';

export function useServers() {
  const [servers, setServers] = useState<IServer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async (page = 1, filters = {}) => {
    setLoading(true);
    const token = Cookies.get('token');
    try {
      const response = await fetch(`http://localhost:3000/servers`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        setServers(jsonResponse as IServer[]);
      }
    } catch (error) {
      console.error('Failed to fetch servers', error);
    }
    setLoading(false);
  };

  const createServer = async (server: Partial<IServer>) => {
    const token = Cookies.get('token');
    const { statusActive, ...serverData } = server; // Exclude statusActive
    serverData.port = Number(serverData.port); // Ensure port is a number

    try {
      await fetch(`http://localhost:3000/servers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':` Bearer ${token}`
        },
        body: JSON.stringify(serverData),
      });
      fetchServers(); // Refresh the servers list
    } catch (error) {
      console.error('Failed to create server', error);
    }
  };

  const deleteServer = async (id: number) => {
    const token = Cookies.get('token');
    try {
      await fetch(`http://localhost:3000/servers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      fetchServers(); // Refresh the servers list
    } catch (error) {
      console.error('Failed to delete server', error);
    }
  };

  const updateServer = async (server: Partial<IServer>) => {
    const token = Cookies.get('token');
    const { statusActive, ...serverData } = server;
    serverData.port = Number(serverData.port);

    try {
      await fetch(`http://localhost:3000/servers/${server.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serverData),
      });
      fetchServers();
    } catch (error) {
      console.error('Failed to update server', error);
    }
  };

  return {
    servers,
    loading,
    fetchServers,
    createServer,
    deleteServer,
    updateServer,
  };
}