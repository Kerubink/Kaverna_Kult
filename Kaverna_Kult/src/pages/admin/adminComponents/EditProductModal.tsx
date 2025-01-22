import React, { useState } from "react";

const EditProductModal = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState({ ...product });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Verifica se o campo é uma lista (sizes, colors, gallery) e converte para array
    let newValue = value;
    if (name === "sizes" || name === "colors" || name === "gallery") {
      newValue = value.split(",").map((item) => item.trim());
    }

    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(newValue) ? newValue : parseFloat(newValue), // Converte strings numéricas para números
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-h-96 overflow-auto max-w-lg">
        <h2 className="text-xl font-bold mb-4">Editar Produto</h2>
        <form onSubmit={handleSubmit} className="overflow-auto">
          {/* Geração dinâmica dos campos */}
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="mb-4">
              <label className="block text-gray-700 mb-1 capitalize">
                {key.replace(/_/g, " ")}
              </label>

              {/* Renderização de inputs dinâmicos */}
              {typeof value === "string" || typeof value === "number" ? (
                <input
                  type={typeof value === "number" ? "number" : "text"}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  step={typeof value === "number" ? "0.01" : undefined}
                />
              ) : (
                <input
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  rows={3}
                ></input>
              )}
            </div>
          ))}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
