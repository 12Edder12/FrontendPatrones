// pages/index.js
import React from 'react';

const Home = () => {
  const handleSqlSubmit = () => {
    // Lógica para enviar la sentencia SQL
    alert("Sentencia SQL enviada");
  };

  const handleDownloadPdf = () => {
    // Lógica para descargar el PDF
    alert("Descargando PDF");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Ejecutar Sentencia SQL</h1>
        <textarea
          className="w-full h-48 p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Escribe tu sentencia SQL aquí..."
        />
        <button
          onClick={handleSqlSubmit}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-4"
        >
          Enviar SQL
        </button>
        <button
          onClick={handleDownloadPdf}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Descargar PDF
        </button>
      </div>
    </div>
  );
};

export default Home;
