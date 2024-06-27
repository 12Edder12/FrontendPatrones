// components/templates/AddFieldModal.tsx
import React, { useState } from 'react';
import { ITemplateDetail } from '../../pages/api/types/ITemplate';

interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (detail: Partial<ITemplateDetail>[]) => void;
  templateName: string;
}

const AddFieldModal: React.FC<AddFieldModalProps> = ({ isOpen, onClose, onSave, templateName }) => {
  const [field, setField] = useState('');
  const [typeField, setTypeField] = useState('');
  const [operation, setOperation] = useState('');

  const handleSave = () => {
    const newDetail: Partial<ITemplateDetail> = {
      field,
      typeField,
      operation,
      statusActive: true
    };
    onSave([{ ...newDetail }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 text-black">
        <h2 className="text-xl mb-4">Añadir Campo a {templateName}</h2>
        <input
          type="text"
          placeholder="Nombre del Campo"
          className="w-full p-2 mb-2 border rounded"
          value={field}
          onChange={(e) => setField(e.target.value)}
        />
        <select
          className="w-full p-2 mb-2 border rounded"
          value={typeField}
          onChange={(e) => setTypeField(e.target.value)}
        >
          <option value="">Tipo de Campo</option>
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
          <option value="boolean">Boolean</option>
          <option value="time">Time</option>
        </select>
        <select
          className="w-full p-2 mb-2 border rounded"
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        >
          <option value="">Operación</option>
          <option value="sum">Sum</option>
          <option value="avg">Avg</option>
          <option value="none">None</option>
        </select>
        <div className="flex justify-end">
          <button className="bg-gray-300 text-black px-4 py-2 rounded mr-2" onClick={onClose}>Cancelar</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default AddFieldModal;