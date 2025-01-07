import React, { useState, useEffect } from "react";
import { useProductModal } from "@/contexts/productModalContext/ProductModalContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/database/firebase_config"; // Certifique-se de que o caminho está correto

const ProductsSection: React.FC = () => {
  const { openModal } = useProductModal();
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<string>("Todos"); // Filtro por tipo de estampa
  const productsPerPage = 6;

  // Tipos de estampa para o filtro
  const estampas = ["Todos", "Floral", "Geométrica", "Abstrata", "Listrada"];

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

  const filteredProducts =
    filter === "Todos"
      ? products
      : products.filter((product) => product.pattern === filter);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleFilterChange = (selectedFilter: string) => {
    setFilter(selectedFilter);
    setCurrentPage(1); // Volta para a primeira página ao mudar o filtro
  };

  return (
    <section className="w-full flex flex-col min-h-screen bg-black text-white">
      <div className="m-2">
        <h1 className="text-lg font-extralight text-l">Produtos</h1>
        <hr className="w-[50px] h-[3.5px] mt-1 bg-primary-dark"/>
      </div>
      {/* Filtro por Tipo de Estampa */}
      <div className="flex overflow-auto gap-2 p-2">
        {estampas.map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-3xl  ${
              filter === type
                ? "bg-white text-black font-semibold"
                : "bg-transparent  border-slate-500 border-[0.2px] hover:bg-gray-600 text-gray-200"
            }`}
            onClick={() => handleFilterChange(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex flex-col flex-1 justify-between my-4 ">
        <div className="w-3/2 fel gap-2 flex justify-between mx-auto px-4">
          <div className="grid grid-cols-2 flex-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => openModal(product)}
              >
                <div className="h-48 flex items-center rounded-md justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-400">Sem Imagem</span>
                  )}
                </div>
                <div className="">
                  <div className="flex items-center justify-between mt-1">
                    <h2 className="text-sm font-semibold">{product.name}</h2>
                    <p className="text-sm font-bold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(product.price)}
                    </p>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {product.pattern || "sem classificação"}
                  </p>
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
      </div>
    </section>
  );
};

export default ProductsSection;
