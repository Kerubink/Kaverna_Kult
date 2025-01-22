import React, { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/database/firebase_config";
import EditModal from "./EditProductModal";

const ProductList = ({ products, onProductUpdated }) => {
  const [editingProduct, setEditingProduct] = useState(null);

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleDelete = async (productId) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      await deleteDoc(doc(db, "products", productId));
      onProductUpdated();
    }
  };

  const handleSave = async (updatedProduct) => {
    const productRef = doc(db, "products", updatedProduct.id);
    await updateDoc(productRef, updatedProduct);
    setEditingProduct(null);
    onProductUpdated();
  };

  const groupedProducts = products.reduce((acc, product) => {
    const { type } = product;
    if (!acc[type]) acc[type] = [];
    acc[type].push(product);
    return acc;
  }, {});

  return (
    <div className="mt-6">
      {Object.keys(groupedProducts).map((type) => (
        <div key={type} className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{type}</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Nome
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Preço
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Coleção
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupedProducts[type].map((product) => (
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">
                      {product.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {typeof product.price === "number"
                        ? `R$ ${product.price.toFixed(2)}`
                        : "Preço indisponível"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {product.collection || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {editingProduct && (
        <EditModal
          product={editingProduct}
          onSave={handleSave}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductList;
