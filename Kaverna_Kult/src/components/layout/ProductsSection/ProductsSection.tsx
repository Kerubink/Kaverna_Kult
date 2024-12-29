import React, { useState, useEffect } from "react";
import { useProductModal } from "@/contexts/productModalContext/ProductModalContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/database/firebase_config"; // Certifique-se de que o caminho está correto

const ProductsSection: React.FC = () => {
  const { openModal } = useProductModal();
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Erro ao buscar produtos do Firestore:", error);
      }
    };

    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <section className="w-full min-h-screen bg-black text-white py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Produtos</h1>

      <div className="w-3/2 gap-2 flex justify-between mx-auto px-4">
        <div className="grid grid-cols-1 flex-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-zinc-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="h-48 bg-gray-700 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">Sem Imagem</span>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-400 text-sm">
                  {product.description || "Descrição breve do produto."}
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

      {/* Navegação de Páginas */}
      <div className="flex justify-center items-center mt-6">
        <button
          className="px-4 py-2 mx-2 bg-gray-700 rounded-md hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="text-gray-400">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="px-4 py-2 mx-2 bg-gray-700 rounded-md hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Próxima
        </button>
      </div>
    </section>
  );
};

export default ProductsSection;
