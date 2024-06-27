// components/templates/TemplateDetail.tsx
import React from 'react';
import { ITemplateDetail } from '../../pages/api/types/ITemplate';

interface TemplateDetailProps {
  index: number;
  detail: ITemplateDetail;
  handleDetailChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSelectDetail: (index: number, isSelected: boolean) => void;
}

const TemplateDetail: React.FC<TemplateDetailProps> = ({ index, detail, handleDetailChange, handleSelectDetail }) => {
  return (
    <div className="flex flex-row items-center mb-2 space-x-4">
      <input
        type="checkbox"
        className="w-1/12"
        onChange={(e) => handleSelectDetail(index, e.target.checked)}
      />
      <input
        type="text"
        name="field"
        placeholder="Campo"
        value={detail.field}
        onChange={(e) => handleDetailChange(index, e)}
        className="w-1/4 p-2 border rounded"
      />
      <select
        name="typeField"
        value={detail.typeField}
        onChange={(e) => handleDetailChange(index, e)}
        className="w-1/4 p-2 border rounded"
      >
        <option value="">Tipo de Campo</option>
        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="date">Date</option>
        <option value="boolean">Boolean</option>
        <option value="time">Time</option>
      </select>
      <select
        name="operation"
        value={detail.operation}
        onChange={(e) => handleDetailChange(index, e)}
        className="w-1/4 p-2 border rounded"
      >
        <option value="">Operación</option>
        <option value="sum">Sum</option>
        <option value="avg">Avg</option>
        <option value="none">None</option>
      </select>
    </div>
  );
};

export default TemplateDetail;