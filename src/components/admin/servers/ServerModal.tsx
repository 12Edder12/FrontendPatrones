// components/admin/servers/ServerModal.tsx

import React, { useState, useEffect } from "react";
import { IServer } from "../../../pages/api/types/IServer";

interface ServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (server: Partial<IServer>) => void;
  server?: IServer;
  mode: "create" | "edit";
}

const ServerModal: React.FC<ServerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  server,
  mode,
}) => {
  const [formData, setFormData] = useState<Partial<IServer>>({
    name: "",
    string_url: "",
    user: "",
    password: "",
    database: "",
    type_bd: "",
    port: 3306,
    ssl: false,
    description: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (server && mode === "edit") {
      setFormData(server);
    } else {
      setFormData({
        name: "",
        string_url: "",
        user: "",
        password: "",
        database: "",
        type_bd: "",
        port: 3306,
        ssl: false,
        description: "",
      });
    }
  }, [server, mode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Se requiere el nombre del servidor";
    if (!formData.database)
      newErrors.database = "Se requiere el nombre de la base de datos";
    if (!formData.string_url)
      newErrors.string_url = "Se requiere la dirección URL";
    if (!formData.user) newErrors.user = "Se requiere el nombre de usuario";
    if (!formData.type_bd)
      newErrors.type_bd = "Se requiere el tipo de base de datos";
    if (!formData.port) newErrors.port = "Se requiere el puerto";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 text-black">
        <h2 className="text-xl mb-4">
          {mode === "edit" ? "Editar Servidor" : "Crear Servidor"}
        </h2>
        <input
          type="text"
          name="name"
          className="w-full p-2 mb-2 border rounded"
          placeholder="Nombre del Servidor"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        <input
          type="text"
          name="string_url"
          className="w-full p-2 mb-2 border rounded"
          placeholder="URL"
          value={formData.string_url}
          onChange={handleChange}
        />
        {errors.string_url && (
          <p className="text-red-500 text-sm">{errors.string_url}</p>
        )}
        <input
          type="text"
          name="user"
          className="w-full p-2 mb-2 border rounded"
          placeholder="Usuario"
          value={formData.user}
          onChange={handleChange}
        />
        {errors.user && <p className="text-red-500 text-sm">{errors.user}</p>}
        <input
          type="password"
          name="password"
          className="w-full p-2 mb-2 border rounded"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="text"
          name="database"
          className="w-full p-2 mb-2 border rounded"
          placeholder="Base de datos"
          value={formData.database}
          onChange={handleChange}
        />
        {errors.database && (
          <p className="text-red-500 text-sm">{errors.database}</p>
        )}
        <select
          name="type_bd"
          className="w-full p-2 mb-2 border rounded"
          value={formData.type_bd}
          onChange={handleChange}
        >
          <option value="">Selecciona el tipo de base de datos</option>
          <option value="mysql">MySQL</option>
          <option value="pg">PostgreSQL</option>
          <option value="oracle">Oracle</option>
          <option value="sqlserver">SQL Server</option>
        </select>
        {errors.type_bd && (
          <p className="text-red-500 text-sm">{errors.type_bd}</p>
        )}
        <input
          type="number"
          name="port"
          className="w-full p-2 mb-2 border rounded"
          placeholder="Puerto"
          value={formData.port}
          onChange={handleChange}
        />
        {errors.port && <p className="text-red-500 text-sm">{errors.port}</p>}
        <label className="mb-2 flex items-center">
          <span className="mr-2">Conexión SSL</span>
          <div className="relative">
            <input
              type="checkbox"
              name="ssl"
              id="ssl-toggle"
              className="sr-only"
              checked={formData.ssl}
              onChange={handleChange}
            />
            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
            <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
          </div>
        </label>
        <style>{`
          input:checked + div {
            background-color: #4caf50;
          }
          input:checked + div .dot {
            transform: translateX(100%);
          }
        `}</style>

        <textarea
          name="description"
          className="w-full p-2 mb-2 border rounded"
          placeholder="Descripción"
          value={formData.description || ""}
          onChange={handleChange}
        />
        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerModal