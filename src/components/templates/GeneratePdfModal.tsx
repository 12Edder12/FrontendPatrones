// components/templates/GeneratePdfModal.tsx
import React, { useState } from "react";

interface GeneratePdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  idTemplate: number;
  onGeneratePdf: (idTemplate: number, typeTemplate: string) => void;
}

const GeneratePdfModal: React.FC<GeneratePdfModalProps> = ({
  isOpen,
  onClose,
  idTemplate,
  onGeneratePdf,
}) => {
  const [typeTemplate, setTypeTemplate] = useState("list");

  const handleGeneratePdf = () => {
    onGeneratePdf(idTemplate, typeTemplate);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-black p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Generar PDF</h2>
        <div className="mb-4">
          <label className="block mb-2">ID Template</label>
          <input
            type="text"
            value={idTemplate}
            readOnly
            className="w-full p-2 border rounded bg-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 ">Tipo de Template</label>
          <select
            value={typeTemplate}
            onChange={(e) => setTypeTemplate(e.target.value)}
            className="w-full p-2 border rounded bg-black"
          >
            <option value="list">List</option>
            <option value="financial">Financial</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancelar
          </button>
          <button
            onClick={handleGeneratePdf}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Generar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratePdfModal;
