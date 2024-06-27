import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useServers } from '../../pages/api/hooks/useServer';

interface QueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sentence: { sentence: string; id_server: number }) => void;
}

const QueryModal: React.FC<QueryModalProps> = ({ isOpen, onClose, onSave }) => {
  const [sentence, setSentence] = useState('');
  const [id_server, setId_server] = useState<number | null>(null);
  const { servers, fetchServers } = useServers();

  useEffect(() => {
    if (isOpen) {
      fetchServers();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (id_server !== null && sentence.trim() !== '') {
      onSave({ sentence, id_server });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 text-black">
        <h2 className="text-xl mb-4">Crear Query</h2>
        <select
          name="id_server"
          className="w-full p-2 mb-2 border rounded"
          value={id_server ?? ''}
          onChange={(e) => setId_server(parseInt(e.target.value))}
        >
          <option value="">Selecciona un servidor</option>
          {servers.map((server) => (
            <option key={server.id} value={server.id}>{server.name}</option>
          ))}
        </select>
        <textarea
          name="sentence"
          className="w-full p-2 mb-2 border rounded"
          placeholder="Escribe tu sentence aquí"
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
        />
        <div className="flex justify-end">
          <button className="bg-gray-300 text-black px-4 py-2 rounded mr-2" onClick={onClose}>Cancelar</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default QueryModal;