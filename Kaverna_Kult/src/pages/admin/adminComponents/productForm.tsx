import React, { useState } from "react";
import { db } from "@/database/firebase_config";
import { collection, addDoc } from "firebase/firestore";

const PRODUCT_TYPES = {
  camiseta: {
    name: "Camiseta",
    fields: [
      "name",
      "price",
      "description",
      "sizes",
      "colors",
      "pattern",
      "collection",
      "image",
      "gallery",
      "shippingDetails",
      "gender",
    ],
  },
  acessorio: {
    name: "Acessório",
    fields: [
      "name",
      "price",
      "description",
      "material",
      "image",
      "gallery",
      "shippingDetails",
      "gender",
    ],
  },
  ecoBag: {
    name: "Eco Bag",
    fields: [
      "name",
      "price",
      "description",
      "dimensions",
      "material",
      "image",
      "gallery",
      "shippingDetails",
      "gender",
    ],
  },
};

const ProductForm = ({ onProductAdded }) => {
  const [productType, setProductType] = useState("camiseta");
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddProduct = async () => {
    try {
      setIsLoading(true);
      const newProduct = {
        type: productType,
        ...formData,
        price: parseFloat(formData.price) || 0,
        visible: true,
        popular: false,
        sizes: formData.sizes?.split(",").map((item) => item.trim()) || [],
        colors: formData.colors?.split(",").map((item) => item.trim()) || [],
        gallery: formData.gallery?.split(",").map((item) => item.trim()) || [],
        gender: formData.gender || "",
      };
      await addDoc(collection(db, "products"), newProduct);
      alert("Produto adicionado com sucesso!");
      setFormData({});
      if (onProductAdded) onProductAdded();
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      alert("Erro ao adicionar produto.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentFields = PRODUCT_TYPES[productType]?.fields || [];

  return (
    <div className="mb-8 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Adicionar Produto</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Tipo de Produto</label>
        <select
          className="border border-gray-300 p-2 rounded w-full"
          value={productType}
          onChange={(e) => {
            setProductType(e.target.value);
            setFormData({});
          }}
        >
          {Object.keys(PRODUCT_TYPES).map((type) => (
            <option key={type} value={type}>
              {PRODUCT_TYPES[type].name}
            </option>
          ))}
        </select>
      </div>
      {currentFields.map((field) => (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {field[0].toUpperCase() + field.slice(1)}:
          </label>
          <input
            type={field === "price" ? "number" : "text"}
            className="border border-gray-300 p-2 rounded w-full"
            placeholder={field}
            value={formData[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        </div>
      ))}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={handleAddProduct}
        disabled={isLoading}
      >
        {isLoading ? "Adicionando..." : "Adicionar Produto"}
      </button>
    </div>
  );
};

export default ProductForm;
