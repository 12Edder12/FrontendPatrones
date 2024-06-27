import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DataTable from '../../components/admin/servers/DataTable';
import { useServers } from '../../pages/api/hooks/useServer';

const ServersPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { servers, loading, fetchServers } = useServers();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ name: '', type_bd: '', statusActive: '' });

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/');
    } else {
      fetchServers(page, filters);
    }
  }, [user, page, filters]);

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
        <h1 className="text-4xl font-bold text-purple-700 mb-10 text-center">Servers Management</h1>
        <div className="mb-4 text-black flex justify-center">
          <input
            type="text"
            name="name"
            className="p-2 border rounded mr-2"
            placeholder="Filter by name"
            value={filters.name}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="type_bd"
            placeholder="Filter by database type"
            value={filters.type_bd}
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
        <div className="max-h-3/4 overflow-y-auto w-full">
          <DataTable servers={servers} loading={loading} page={page} setPage={setPage} />
        </div>
      </div>
    </div>
  );
};

export default ServersPage;