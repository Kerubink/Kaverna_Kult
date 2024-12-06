import React from "react";
import { useProductModal } from "@/contexts/productModalContext/ProductModalContext";

const products = Array.from({ length: 8 }).map((_, index) => ({
  id: index + 1,
  name: `Produto ${index + 1}`,
  description: `Descrição detalhada do Produto ${index + 1}.`,
  price: (index + 1) * 10,
  image: `https://via.placeholder.com/150?text=Produto+${index + 1}`, 
  colors: ["Preto", "Branco", "Azul", "Vermelho"], 
  sizes: ["P", "M", "G", "GG"],
  stock: 20, 
  rating: Math.floor(Math.random() * 5) + 1,
  shippingDetails: "Entrega em até 7 dias úteis.",
  gallery: [
    `https://via.placeholder.com/150?text=Produto+${index + 1}+1`,
    `https://via.placeholder.com/150?text=Produto+${index + 1}+2`,
    `https://via.placeholder.com/150?text=Produto+${index + 1}+3`,
  ], 
}));
const ProductsSection: React.FC = () => {
  const { openModal } = useProductModal();
  

  return (
    <section className="w-full min-h-screen bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6 text-center">Produtos</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-zinc-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="h-48 bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400">Imagem</span>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-400 text-sm">
                  Descrição breve do produto.
                </p>
                <p className="text-xl font-bold mt-2">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(product.price)}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <button
                    className="p-2 bg-gray-700 rounded-md hover:bg-gray-600"
                    onClick={() => openModal(product)}
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
