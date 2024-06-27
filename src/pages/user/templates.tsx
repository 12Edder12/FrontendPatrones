// pages/admin/template.tsx
import React from 'react';
import DataTable from '../../components/templates/DataTable';

const TemplatePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-6">Gestión de Templates</h1>
      <DataTable />
    </div>
  );
};

export default TemplatePage;