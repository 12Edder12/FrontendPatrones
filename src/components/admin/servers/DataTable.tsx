// src/components/admin/servers/DataTable.tsx

import React, { useState } from "react";
import { useRouter } from "next/router";
import ServerModal from "./ServerModal";
import { useServers } from "../../../pages/api/hooks/useServer";

const DataTable = ({
  servers,
  loading,
  page,
  setPage,
}: {
  servers: any[];
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
}) => {
  const router = useRouter();
  const { createServer, deleteServer, updateServer, fetchServers } = useServers();
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [message, setMessage] = useState<string | null>(null);

  if (!Array.isArray(servers)) {
    console.error("Expected servers to be an array but got:", typeof servers);
    return <p>Error: Data is not an array!</p>;
  }

  const handleEdit = (server: any) => {
    setSelectedServer(server);
    setModalMode("edit");
    setIsServerModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este servidor?")) {
      await deleteServer(id);
      fetchServers(page); // Refresh the servers list
      setMessage("Servidor eliminado correctamente.");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSave = async (server: any) => {
    if (modalMode === "create") {
      await createServer(server);
      setMessage("Servidor creado correctamente.");
    } else {
      await updateServer(server);
      setMessage("Servidor actualizado correctamente.");
    }
    fetchServers(page); // Refresh the servers list
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center max-h-3/4 bg-white p-6 min-w-full overflow-y-auto">
      <div className="w-full max-w-7xl mb-4">
        {message && <p className="bg-green-200 text-green-700 p-2 rounded mb-4">{message}</p>}
        <button
          onClick={() => router.push("/admin")}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Back to Admin
        </button>
        <button
          onClick={() => {
            setSelectedServer(null);
            setModalMode("create");
            setIsServerModalOpen(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Create Server
        </button>
        <button
            onClick={() => setPage(page + 1)}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
           Refresh
          </button>
          
        <div className="max-h-3/4 overflow-y-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
              <tr>
                <th className="w-1/5 py-2">Name</th>
                <th className="w-1/5 py-2">Base de datos</th>
                <th className="w-1/5 py-2">Direccion URL</th>
                <th className="w-1/5 py-2">Database Type</th>
                <th className="w-1/5 py-2">Status</th>
                <th className="w-1/5 py-2">Port</th>
                <th className="w-1/5 py-2">SSL</th>
                <th className="w-1/5 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {servers.map((server) => (
                <tr
                  key={server.id}
                  className="text-center text-black border-b border-gray-200"
                >
                  <td className="py-1">{server.name}</td>
                  <td className="py-1">{server.database}</td>
                  <td className="py-1">{server.string_url}</td>
                  <td className="py-1">{server.type_bd}</td>
                  <td className="py-1">
                    {server.statusActive ? "Active" : "Inactive"}
                  </td>
                  <td className="py-1">{server.port}</td>
                  <td className="py-1">{server.ssl}</td>
                  <td className="py-1 flex justify-center">
                    <button
                      onClick={() => handleEdit(server)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(server.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
         
         
        </div>
      </div>
      <ServerModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
        onSave={handleSave}
        server={selectedServer}
        mode={modalMode}
      />
    </div>
  );
};

export default DataTable;