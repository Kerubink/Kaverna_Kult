import React, { useState, useEffect } from "react";
import { db } from "@/database/firebase_config";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import ProductForm from "../adminComponents/productForm";
import ProductList from "../adminComponents/productTable";

const ProdutosPage = () => {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productsList);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Produtos</h1>

      <ProductForm onProductAdded={loadProducts} />
      <ProductList products={products} onProductUpdated={loadProducts} />
    </div>
  );
};

export default ProdutosPage;
