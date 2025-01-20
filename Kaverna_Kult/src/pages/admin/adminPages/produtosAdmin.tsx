// src/pages/Admin/Produtos.tsx
import React, { useState, useEffect } from "react";
import { db } from "@/database/firebase_config"; // Configuração do Firebase
import { collection, addDoc, getDocs } from "firebase/firestore";

const ProdutosPage = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");

  const handleAddProduct = async () => {
    try {
      await addDoc(collection(db, "products"), {
        name: productName,
        price: parseFloat(productPrice),
      });
      alert("Produto adicionado com sucesso!");
      setProductName("");
      setProductPrice("");
      loadProducts();
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      alert("Erro ao adicionar produto");
    }
  };

  const loadProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsList = querySnapshot.docs.map(doc => doc.data());
    setProducts(productsList);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
      <h1>Produtos</h1>
      <input
        type="text"
        placeholder="Nome do Produto"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Preço"
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
      />
      <button onClick={handleAddProduct}>Adicionar Produto</button>

      <h2>Produtos Cadastrados</h2>
      <ul>
        {products.map((product, index) => (
          <li key={index}>{product.name} - R${product.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProdutosPage;
