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
    <section className="p-2">
      <div className="text-white">
        <h1 className="text-lg font-extralight">Populares</h1>
        <hr className="w-[50px] h-[3.5px] mt-1 bg-primary-dark" />
      </div>

      {isLoading ? (
        <p className="text-white text-sm mt-4">Carregando produtos...</p>
      ) : produtosPopulares.length > 0 ? (
        <div className="w-full overflow-x-scroll scrollbar-hide flex gap-4 p-2">
          {produtosPopulares.map((produto) => (
            <div
              key={produto.id}
              className="flex-shrink-0 w-40 rounded-lg shadow-md bg-white p-2"
              onClick={() => openModal(produto)}
            >
              <img
                src={produto.image}
                alt={produto.name}
                className="w-full h-32 object-cover rounded-md"
              />
              <div className="mt-2 text-center">
                <h3 className="text-sm font-semibold">{produto.name}</h3>
                <p className="text-gray-500 text-sm">
                  {produto.price
                    ? `R$ ${Number(produto.price).toFixed(2)}`
                    : "Preço indisponível"}
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
