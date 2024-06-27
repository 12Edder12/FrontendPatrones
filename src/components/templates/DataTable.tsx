// components/templates/DataTable.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTemplates } from "../../pages/api/hooks/useTemplate";
import TemplateModal from "./TemplateModal";
import AddFieldModal from "./AddFieldModal";
import GeneratePdfModal from "./GeneratePdfModal";
import { ITemplate, ITemplateDetail } from "../../pages/api/types/ITemplate";
import Cookies from "js-cookie";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DataTable = () => {
  const {
    templates,
    loading,
    fetchTemplates,
    createTemplate,
    deleteTemplate,
    updateTemplate,
    addFieldToTemplate,
    deleteTemplateDetails,
  } = useTemplates();
  const router = useRouter();
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [isGeneratePdfModalOpen, setIsGeneratePdfModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );

  const handleEdit = (template: ITemplate) => {
    setSelectedTemplate(template);
    setModalMode("edit");
    setIsTemplateModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este template?")) {
      await deleteTemplate(id);
      fetchTemplates(); // Refresh the templates list
    }
  };

  const handleSave = async (template: Partial<ITemplate>) => {
    if (modalMode === "create") {
      await createTemplate(template);
    } else {
      await updateTemplate(template);
    }
    fetchTemplates(); // Refresh the templates list
  };

  const handleSaveDetail = async (details: Partial<ITemplateDetail>[]) => {
    const token = Cookies.get("token");
    const url = `http://localhost:3000/template-detail`;

    await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ templateDetails: details }),
    });
  };

  const handleAddField = (template: ITemplate) => {
    setSelectedTemplate(template);
    setIsAddFieldModalOpen(true);
  };

  const handleSaveField = async (details: Partial<ITemplateDetail>[]) => {
    if (selectedTemplate) {
      await addFieldToTemplate(selectedTemplate.id_template!, details);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
      fetchTemplates(); // Refresh the templates list
    }
  };

  const handleHola = (id: number) => {
    setSelectedTemplateId(id);
    setIsGeneratePdfModalOpen(true);
  };

  const handleGeneratePdf = async (idTemplate: number, typeTemplate: string) => {
    const response = await fetch("http://localhost:3000/generateTemplates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_template: idTemplate, type_template: typeTemplate }),
    });

    const result = await response.json();
    generatePdf(result, typeTemplate);
    setIsGeneratePdfModalOpen(false);
  };

  const generatePdf = (data: any, typeTemplate: string) => {
    const doc = new jsPDF();

    if (typeTemplate === "financial") {
      const tableColumn = data.data.length > 0 ? Object.keys(data.data[0]) : [];
      const tableRows = data.data.map((item: any) =>
        tableColumn.map((key: any) => item[key as keyof typeof item])
      );

      doc.text("Reporte", 100, 10);
      doc.setFontSize(11);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 20);

      (doc as any).autoTable(tableColumn, tableRows, { startY: 30 });

      if (data.totals) {
        const totalKeys = Object.keys(data.totals);
        totalKeys.forEach((key, index) => {
          let formattedValue = data.totals[key];
          if (typeof formattedValue === "number") {
            formattedValue = formattedValue.toFixed(2); // Formato de dos decimales
          }
          doc.setFontSize(11);
          doc.text(`${key}: ${formattedValue}`, 11, (doc as any).lastAutoTable.finalY + 10 * (index + 1));
        });
      }
    } else if (typeTemplate === "list") {
      const tableColumn = data.length > 0 ? Object.keys(data[0]) : [];
      const tableRows = data.map((item: any) =>
        tableColumn.map((key: any) => item[key as keyof typeof item])
      );

      doc.text("Reporte", 100, 10);
      doc.setFontSize(11);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 20);

      (doc as any).autoTable(tableColumn, tableRows, { startY: 30 });
    }

    doc.save(`template_report_${typeTemplate}.pdf`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center max-h-3/4 bg-white p-6 min-w-full overflow-y-auto">
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded">
          Campo añadido correctamente
        </div>
      )}
      <div className="w-full max-w-7xl mb-4">
        <button
          onClick={() => router.push("/admin")}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Back to Admin
        </button>
        <button
          onClick={() => {
            setSelectedTemplate(null);
            setModalMode("create");
            setIsTemplateModalOpen(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Crear Template
        </button>
        <div className="max-h-3/4 overflow-y-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
              <tr>
                <th className="w-1/5 py-2">Query</th>
                <th className="w-1/5 py-2">Nombre de Query</th>
                <th className="w-1/5 py-2">Nombre de Template</th>
                <th className="w-1/5 py-2">Campo de Detalles</th>
                <th className="w-1/5 py-2">Operación</th>
                <th className="w-1/5 py-2">Tipo de Campo</th>
                <th className="w-1/5 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr
                  key={template.id_template}
                  className="text-center text-black border-b border-gray-200"
                >
                  <td className="py-1">{template.query.name}</td>
                  <td className="py-1">{template.query.type_bd}</td>
                  <td className="py-1">{template.name}</td>
                  <td className="py-1">
                    {template.templateDetails.map((detail) => (
                      <div key={detail.id_detail}>{detail.field}</div>
                    ))}
                  </td>
                  <td className="py-1">
                    {template.templateDetails.map((detail) => (
                      <div key={detail.id_detail}>{detail.operation}</div>
                    ))}
                  </td>
                  <td className="py-1">
                    {template.templateDetails.map((detail) => (
                      <div key={detail.id_detail}>{detail.typeField}</div>
                    ))}
                  </td>
                  <td className="py-1 flex flex-col justify-center">
                    <button
                      onClick={() => handleEdit(template)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(template.id_template!)}
                      className="bg-red-500 text-white px-4 py-2 rounded mb-2"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => handleAddField(template)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                      Añadir Campo
                    </button>
                    <button
                      onClick={() => handleHola(template.id_template!)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                      HOLA
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSave={handleSave}
        onSaveDetail={handleSaveDetail}
        onDeleteDetail={deleteTemplateDetails}
        template={selectedTemplate}
        mode={modalMode}
      />
      <AddFieldModal
        isOpen={isAddFieldModalOpen}
        onClose={() => setIsAddFieldModalOpen(false)}
        onSave={handleSaveField}
        templateName={selectedTemplate?.name || ""}
      />
      <GeneratePdfModal
        isOpen={isGeneratePdfModalOpen}
        onClose={() => setIsGeneratePdfModalOpen(false)}
        idTemplate={selectedTemplateId!}
        onGeneratePdf={handleGeneratePdf}
      />
    </div>
  );
};

export default DataTable;
