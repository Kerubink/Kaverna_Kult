import React, { useState } from "react";
import {db} from '../../database/firebase_config'
import { addDoc, collection } from "firebase/firestore";

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    colors: "",
    sizes: "",
    image: "",
    gallery: "",
    shippingDetails: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Parse colors and sizes into arrays
      const productData = {
        ...product,
        price: parseFloat(product.price),
        colors: product.colors.split(",").map((color) => color.trim()),
        sizes: product.sizes.split(",").map((size) => size.trim()),
        gallery: product.gallery.split(",").map((url) => url.trim()),
      };

      await addDoc(collection(db, "products"), productData);
      alert("Produto adicionado com sucesso!");
      setProduct({
        name: "",
        description: "",
        price: "",
        colors: "",
        sizes: "",
        image: "",
        gallery: "",
        shippingDetails: "",
      });
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        name="name"
        value={product.name}
        onChange={handleChange}
        placeholder="Nome do produto"
        className="p-2 border rounded"
      />
      <textarea
        name="description"
        value={product.description}
        onChange={handleChange}
        placeholder="Descrição"
        className="p-2 border rounded"
      />
      <input
        name="price"
        value={product.price}
        onChange={handleChange}
        placeholder="Preço"
        type="number"
        className="p-2 border rounded"
      />
      <input
        name="colors"
        value={product.colors}
        onChange={handleChange}
        placeholder="Cores (separadas por vírgula, ex: #FF0000,#00FF00)"
        className="p-2 border rounded"
      />
      <input
        name="sizes"
        value={product.sizes}
        onChange={handleChange}
        placeholder="Tamanhos (separados por vírgula, ex: P,M,G)"
        className="p-2 border rounded"
      />
      <input
        name="image"
        value={product.image}
        onChange={handleChange}
        placeholder="URL da imagem principal"
        className="p-2 border rounded"
      />
      <input
        name="gallery"
        value={product.gallery}
        onChange={handleChange}
        placeholder="Galeria (URLs separadas por vírgula)"
        className="p-2 border rounded"
      />
      <textarea
        name="shippingDetails"
        value={product.shippingDetails}
        onChange={handleChange}
        placeholder="Detalhes do envio"
        className="p-2 border rounded"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Adicionar Produto
      </button>
    </form>
  );
};

export default ProductForm;
