import React, { useState, useEffect } from 'react';
import { ITemplate, ITemplateDetail } from '../../pages/api/types/ITemplate';
import TemplateDetail from './TemplateDetail';
import QueryModal from '../queries/QueryModal';
import Cookies from 'js-cookie';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Partial<ITemplate>) => void;
  onSaveDetail: (details: Partial<ITemplateDetail>[]) => Promise<void>;
  onDeleteDetail: (detailIds: number[]) => Promise<void>;
  template?: ITemplate | null;
  mode: 'create' | 'edit';
}

const TemplateModal: React.FC<TemplateModalProps> = ({ isOpen, onClose, onSave, onSaveDetail, onDeleteDetail, template, mode }) => {
  const [formData, setFormData] = useState<Partial<ITemplate>>({
    name: '',
    queryId: 0,
    statusActive: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [templateDetails, setTemplateDetails] = useState<ITemplateDetail[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [selectedQueryId, setSelectedQueryId] = useState<number | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<number[]>([]);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);

  useEffect(() => {
    fetchQueries();
    if (template && mode === 'edit') {
      setFormData({
        name: template.name,
        queryId: template.queryId,
        statusActive: template.statusActive,
      });
      setTemplateDetails(template.templateDetails);
      setSelectedQueryId(template.queryId);  // Ajustar para usar queryId
    } else {
      setFormData({
        name: '',
        queryId: 0,
        statusActive: true,
      });
      setTemplateDetails([]);
      setSelectedQueryId(null);
    }
  }, [template, mode]);

  const fetchQueries = async () => {
    const token = Cookies.get('token');
    try {
      const response = await fetch(`http://localhost:3000/queries`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        setQueries(jsonResponse);
      }
    } catch (error) {
      console.error('Failed to fetch queries', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setSelectedQueryId(value);
    setFormData(prev => ({
      ...prev,
      queryId: value
    }));
  };

  const handleDetailChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    const newDetails = [...templateDetails];
    newDetails[index] = { ...newDetails[index], [name]: value };
    setTemplateDetails(newDetails);
  };

  const handleSelectDetail = (index: number, isSelected: boolean) => {
    const detailId = templateDetails[index].id_detail;
    if (isSelected) {
      setSelectedDetails([...selectedDetails, detailId]);
    } else {
      setSelectedDetails(selectedDetails.filter(id => id !== detailId));
    }
  };

  const addDetail = () => {
    setTemplateDetails([...templateDetails, { field: '', typeField: '', operation: '', statusActive: true }]);
  };

  const deleteDetails = async () => {
    if (selectedDetails.length > 0) {
      await onDeleteDetail(selectedDetails);
      setTemplateDetails(templateDetails.filter(detail => !selectedDetails.includes(detail.id_detail!)));
      setSelectedDetails([]);
      onClose(); // Close the modal after deletion
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = 'Se requiere el nombre del template';
    if (!selectedQueryId) newErrors.queryId = 'Se requiere seleccionar un query';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      const payload: Partial<ITemplate> = {
        ...formData,
        queryId: selectedQueryId !== null ? selectedQueryId : 0, // Ensure queryId is a number
        statusActive: true,
        templateDetails: templateDetails.map(detail => ({
          ...detail,
          statusActive: true,
        })),
      };
      if (mode === 'edit' && template?.id_template) {
        payload.id_template = template.id_template;
      }
      onSave(payload);
      onClose();
    }
  };

  const handleSaveQuery = async (newQuery: { sentence: string; id_server: number }) => {
    const token = Cookies.get('token');
    try {
      const response = await fetch(`http://localhost:3000/queries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${token}`
        },
        body: JSON.stringify(newQuery),
      });
      if (response.ok) {
        fetchQueries(); // Refresh the queries list
      }
    } catch (error) {
      console.error('Failed to create query', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 text-black">
        <h2 className="text-xl mb-4">{mode === 'edit' ? 'Editar Template' : 'Crear Template'}</h2>
        <select
          name="queryId"
          className="w-full p-2 mb-2 border rounded"
          value={selectedQueryId ?? ''}
          onChange={handleQueryChange}
        >
          <option value="">Selecciona un query</option>
          {queries.map((query) => (
            <option key={query.id_querie} value={query.id_querie}>{query.sentence}</option>
          ))}
        </select>
        {errors.queryId && <p className="text-red-500 text-sm">{errors.queryId}</p>}
        <input
          type="text"
          name="name"
          className="w-full p-2 mb-2 border rounded"
          placeholder="Nombre del Template"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        <button onClick={() => setIsQueryModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded mb-4">Crear Query</button>
        <div className="mb-4">
          {templateDetails.map((detail, index) => (
            <TemplateDetail
              key={index}
              index={index}
              detail={detail}
              handleDetailChange={handleDetailChange}
              handleSelectDetail={handleSelectDetail}
            />
          ))}
          {mode === 'create' && (
            <button onClick={addDetail} className="bg-blue-500 text-white px-4 py-2 rounded">Añadir Campo</button>
          )}
          {mode === 'edit' && (
            <button onClick={deleteDetails} className="bg-red-500 text-white px-4 py-2 rounded ml-2">Eliminar Campos Seleccionados</button>
          )}
        </div>
        <div className="flex justify-end">
          <button className="bg-gray-300 text-black px-4 py-2 rounded mr-2" onClick={onClose}>Cancelar</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Guardar</button>
        </div>
      </div>
      <QueryModal
        isOpen={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
        onSave={handleSaveQuery}
      />
    </div>
  );
};

export default TemplateModal;