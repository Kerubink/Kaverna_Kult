import React, { useState, useEffect } from "react";
import { useProductModal } from "@/contexts/productModalContext/ProductModalContext";
import { db } from "@/database/firebase_config"; // Configuração do Firebase
import { collection, query, where, getDocs } from "firebase/firestore";

function ProdutosPopulares() {
  const { openModal } = useProductModal();
  const [produtosPopulares, setProdutosPopulares] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar produtos populares
  const fetchProdutosPopulares = async () => {
    setIsLoading(true);
    try {
      const produtosRef = collection(db, "products");
      const popularQuery = query(produtosRef, where("popular", "==", true));
      const querySnapshot = await getDocs(popularQuery);

      const produtos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdutosPopulares(produtos);
    } catch (error) {
      console.error("Erro ao buscar produtos populares:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar produtos ao carregar o componente
  useEffect(() => {
    fetchProdutosPopulares();
  }, []);

  return (
    <section className="">
      <div className="text-white m-2">
        <h1 className="text-lg font-extralight">Populares</h1>
        <hr className="w-[50px] h-[3.5px] mt-1 bg-primary-dark" />
      </div>

      {isLoading ? (
        <p className="text-white text-sm m-2 mt-4">Carregando produtos...</p>
      ) : produtosPopulares.length > 0 ? (
        <div className="w-full p-2 overflow-x-scroll scrollbar-hide flex gap-4">
          {produtosPopulares.map((produto) => (
            <div
            key={produto.id}
            className="rounded-md w-[152px] overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => openModal(produto)}
          >
            <div className="h-48 flex items-center rounded-md justify-center">
              {produto.image ? (
                <img
                  src={produto.image}
                  alt={produto.name}
                  className="h-full w-full object-cover rounded-md"
                />
              ) : (
                <span className="text-gray-400">Sem Imagem</span>
              )}
            </div>
            <div className="">
              <div className="flex items-center text-white justify-between mt-1">
                <h2 className="text-sm font-semibold">{produto.name}</h2>
                <p className="text-sm font-bold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(produto.price)}
                </p>
              </div>
              <p className="text-gray-400 text-sm">
                {produto.pattern || "sem classificação"}
              </p>
            </div>
          </div>
          ))}
        </div>
      ) : (
        <p className="text-white text-sm mt-4">
          Nenhum produto popular disponível.
        </p>
      )}
    </section>
  );
}

export default ProdutosPopulares;
